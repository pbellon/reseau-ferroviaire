import PropTypes from 'prop-types';
import CanvasTilesLayer from '../CanvasTilesLayer'
import LinesLayerDelegate from './delegate'

class LinesLayer extends CanvasTilesLayer {
  static defaultProps = {
    delegate: LinesLayerDelegate,
    line_range: [0.5, 3],
    hide_lines: [],
    show_only: [],
    show_section_starts: false,
    show_section_ids: false,
    use_polygon_simplification: false,
  }
  static propTypes = {
    ...CanvasTilesLayer.propTypes,
    line_range: PropTypes.arrayOf(PropTypes.number),
    hide_lines: PropTypes.arrayOf(PropTypes.number),
    show_only: PropTypes.arrayOf(PropTypes.number),
    show_section_starts: PropTypes.bool,
    show_section_ids: PropTypes.bool,
    use_polygon_simplification: PropTypes.bool,
  }
}

export default LinesLayer;
