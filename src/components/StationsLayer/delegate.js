import { CanvasTilesLayerDelegate } from '../CanvasTilesLayer'

class StationsLayerDelegate extends CanvasTilesLayerDelegate {
  _processData(data){
    data.features = data.features;
    return data;
  }
  draw({ canvas, coords, zoom }){
    const tile = this.getTileFeatures(coords);
    const context = canvas.getContext('2d');
    const ratio = canvas.height / 4096;
    const features = tile && tile.features ? tile.features : [];
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'screen'
    // context.globalAlpha = 0.3;
    const r = (zoom * 0.5) * ratio;
    features.forEach((feature) => {
      context.fillStyle = 'rgb(255, 237, 45)';
      const p = this.drawPoint(context, feature.geometry[0], r);
      // console.log('drawPoint', feature);
      context.fill(new Path2D(p));
    });
  }
}

export default StationsLayerDelegate
