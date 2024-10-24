'use strict';

const fs = require('fs-extra');
const path = require('path');
const paths = require('../config/paths');
const lineSlice = require('@turf/line-slice');
const buffer = require('@turf/buffer');
const union = require('@turf/union');


let nearestPointOnLine = require('@turf/nearest-point-on-line').default;

const flatten = require('@turf/flatten');
const { multiPolygon, lineString, point } = require('@turf/helpers');
const { scaleLinear } = require('d3-scale');
const load = (name) => {
  const path = filePath(name); 
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

const filePath = (name) => path.join(
  paths.appData, `/${name}.geojson`
);


const homogenizeLine = (line, index) => {
  const {
    properties: {
      code_ligne: id,
      mnemo: status,
      libelle: label,
    }
  } = line;
  return {
    ...line,
    properties: {
      ...line.properties,
      id,
      label,
      status
    }
  };
}

const fixCoords = (coords) => [ coords[1], coords[0] ];
const homogenizeSection = (section, index) => {
  const {
    vmax: max_speed = -1,
    rang: rank,
    coordonnees_geo_debut: coord_start,
    coordonnees_geo_fin: coord_end,
  } = section.properties || {};

  const fcoord_start = fixCoords(coord_start);
  const fcoord_end = fixCoords(coord_end);
  const points = [ fcoord_start, fcoord_end ]
  return {
    max_speed: parseInt(max_speed),
    points,
    rank,
    coord_start: fcoord_start,
    coord_end: fcoord_end,
    index: index + 1
  }
}

const groupByLine = (data) => {
  const lines = {}
  const features = data.features.filter((feature) => feature.geometry != null);
  for(var i in features){
    const section = features[i];
    const { properties: { ligne: id, r_lib_lig: name } } = section;
    const line = lines[id] = lines[id] ? lines[id] : {
      id: id,
      name: name,
      sections: []
    };
    line.sections.push(homogenizeSection(section));
  }
  for(let i in lines){
    const line = lines[i];
    const max_speed = line.sections.reduce((a,b) => {
      return b.max_speed > a ? b.max_speed : a;
    }, -1);
    line.max_speed = max_speed;
    lines[i] = line;
  }
  return Object.values(lines);
};

const speedScale = scaleLinear().domain([0,350]).range([0.2, 10]);

const applySectionsToLine = (line, sections) => {
  const polygons = sections.map(
    function({ coord_end, coord_start, max_speed = 0 }){
      let segment;
      const start_pt = nearestPointOnLine(line,coord_start, { units: 'degrees'});
      const end_pt   = nearestPointOnLine(line,coord_end, { units: 'degrees'});
      const thickness = speedScale(max_speed);
      try {
        segment = lineSlice(start_pt, end_pt, line);
      } catch(e) {
        console.error('an error occured with segment creation', e, line);
      }
      // console.log('start_pt', start_pt);      
      // console.log('end_pt', end_pt);      
      // console.log('segment', segment, 'thickness (metters):', thickness * 1000);
      // console.log(segment.geometry.coordinates);
      const poly = buffer(segment, thickness, { units: 'kilometers', steps: 32 });
      poly.properties = {
        ...line.properties,
        max_speed
      }
      return poly;
    }
  );
  console.log(`treated line #${line.properties.id}, created ${polygons.length} sub polygons`);
  return polygons;
}

const explodeMultiLineString = (lines) => {
  const _lines = [];
  lines.forEach((line) => {
    const geo = line.geometry;
    if(geo.type === 'LineString'){
      _lines.push(line);
    } else if(geo.type === 'MultiLineString'){
      geo.coordinates.forEach((coords) => {
        _lines.push(
          lineString(coords, line.properties)
        )
      });
    } else {
      console.error('line of unexpected type', line);
    }
  });
  return _lines;
}

const processData = (lineShapes, lineSpeed) => {
  const grouped_speed_sections = groupByLine(lineSpeed)
  lineShapes = explodeMultiLineString(lineShapes.features);
  const all_polys = lineShapes.map(homogenizeLine)
    .filter((line) => (
      line.properties.status === 'EXPLOITE'
    ))
    .map((line) => {
      const group = grouped_speed_sections.find((g) => g.id === line.properties.id);
      if(!group){
        // console.error(line, 'not found !');
        return buffer(line, speedScale(0))
      } else {
        line.properties.line_max_speed = group.max_speed;
        line.properties.name = group.name;
        return applySectionsToLine(line, group.sections); 
      }
    });

  const features = all_polys.reduce((a,b) => {
    return a.concat(b);
  }, []);
  return {
    type: 'FeatureCollection',
    features,
  }
}

const runScript = () => {
  const lineStringsGEO = load('traces-lignes');
  const lineSpeedGEO = load('vitesses-lignes');
  console.log('loaded data:',
              '\n\tline shapes', lineStringsGEO.features.length,
              '\n\tline speed sections:', lineSpeedGEO.features.length
  );
  const data = processData(lineStringsGEO, lineSpeedGEO);
  fs.open(filePath('lignes'), 'w').then((fd) => { 
    fs.write(fd, JSON.stringify(data)).then(()=>{
      console.log('written ', data.features.length,' data features');
  
    });
  })
}

runScript();
