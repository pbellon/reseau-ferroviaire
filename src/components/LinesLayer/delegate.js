import { CanvasTilesLayerDelegate } from '../CanvasTilesLayer'

class LinesLayerDelegate extends CanvasTilesLayerDelegate {
  draw({ canvas, coords }){
    const tile = this.getTileFeatures(coords);
    const context = canvas.getContext('2d');
    canvas.style.opacity = 0.2;
    const features = tile && tile.features ? tile.features : [];
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'color'
    // context.globalAlpha = 0.3;
    features.forEach((feature) => {
      this.drawArea({ context, area: feature, fillStyle: 'rgba(134, 24, 13, 0.5)', strokeStyle: '', strokeWidth: 0, fillRule: 'nonzero' });
    });
  }
}

export default LinesLayerDelegate
