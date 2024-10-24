import CanvasTilesLayer from '../CanvasTilesLayer'
import StationsLayerDelegate from './delegate'

class StationsLayer extends CanvasTilesLayer {
  static defaultProps = {
    delegate: StationsLayerDelegate,
  }
}

export default StationsLayer;
