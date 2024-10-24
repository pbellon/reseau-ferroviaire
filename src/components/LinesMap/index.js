import React, { Component } from 'react'

import { Map, TileLayer } from 'react-leaflet'
import HoveredLines from '../HoveredLines';
import AboutModal from '../AboutModal';
import LinesLayer from '../LinesLayer'
// import StationsLayer from '../StationsLayer'
import DataLoader from './data'

import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { polygon } from '@turf/helpers';
import transformScale from '@turf/transform-scale';
import raf from 'raf';

import './styles.css';

const TILE_URL = 'https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png';
const TILE_ATTR = 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

class LinesMap extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: null,
      error: null,
      isLoaded: false,
      hoveredLines: [],
      success: false,
    }
    this.line_polygons = {}
    this.line_points = []
  }
  
  
  componentDidMount(){
    DataLoader.load().then((data) => {
      this.setState({ isLoaded: true, data, success: true});
    }).catch((error) => {
      this.setState({ isLoaded: true, success: false, error });
    });
  }

  findClosestLines({lat, lng}){
    const { lines: { features: lines}} = this.state.data;
    const closest_dict = {};
    const test_pt = [lng, lat];
    const found_poly = lines.filter((feature) => {
      const coords = feature.geometry.coordinates;
      if(coords[0].length >= 4){
        return booleanPointInPolygon(
          test_pt,
          transformScale(
            polygon(coords), 1.5
          )
        );
      } else {
        return false;
      }
    });
    found_poly.forEach((feature) => {
      const { properties: { id } } = feature;
      closest_dict[id] = closest_dict[id] || feature;
    });
    return { lines: Object.values(closest_dict), point: test_pt };
  }

  handleClick({ latlng, containerPoint, layerPoint }){
    this.cb = raf(() => {
      const { lines, point } = this.findClosestLines(latlng);
      this.setState({ hoveredLines: lines, hoveredPoint: point });
    });
  }
  render(){
    // console.log('render', this.state);
    const { isLoaded, data, success, error, hoveredLines, hoveredPoint } = this.state; 
    const { lines } = data ? data : {};
    // console.log('render() # lines = ', lines, error);
    // console.log('hovered lines', hoveredLines);
    return (
      <div>
      { isLoaded ? (
          <div>
          { success ? (
            <Map
              center={[ 46.837, -1 ]}
              zoom={6}
              maxZoom={14}
              onClick={ this.handleClick.bind(this) }
            >
              <AboutModal/>
              <HoveredLines zIndex={ 500 } lines={ hoveredLines } point={ hoveredPoint }/>
              <TileLayer
                zIndex={300}
                attribution='Label tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png'} /> 
              <TileLayer
                zIndex={0}
                attribution={TILE_ATTR}
                url={TILE_URL}/>
              <LinesLayer
                zIndex={100}
                data={ lines }
              />
            </Map>
          ) : (
            <div>
              <b>An error occured:</b><br/>
              <pre><code>{ Object.values(error) }</code></pre>
            </div>
          )}
          </div>
        ) : (<span>Chargement....</span>)
      }</div>
    );
  }
}

export default LinesMap;
