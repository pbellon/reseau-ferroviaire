import 'whatwg-fetch'

class Loader {
  loadFile(name){
    const url = `${process.env.PUBLIC_URL}/data/${name}.geojson`
    return fetch(url).then((response) => response.json())
  }

  loadLines(){
    return this.loadFile('lignes');
  } 
  
  loadStations(){
    return this.loadFile('gares');
  }

  load(){
    const data = {};
    return Promise.all([
      this.loadLines().then((lines) => data['lines'] = lines),
      // this.loadStations().then((stations) => data['stations'] = stations)
    ]).then(() => {
      return data;
    });
  }
}

const l = new Loader();
export default l;
