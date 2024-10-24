// took from https://github.com/Skoli-Code/CEDEJ-Atlas/
import {
  DomUtil,
  GridLayer,
  LatLng,
  setOptions,
} from 'leaflet';

import PropTypes from 'prop-types';
import { MapLayer } from 'react-leaflet';

const noop = () => null;

const CanvasTiles = GridLayer.extend({
  isCanvasLayer() { return true; },

  initialize(drawDelegate, onRendered, options) {
    this._drawDelegate = drawDelegate;

    this._drawDelegate.setLayer(this);
    this._onRendered = onRendered;
    setOptions(this, options);
    return this;
  },

  drawing(drawDelegate) {
    this._drawDelegate = drawDelegate;
    return this;
  },

  params(options) {
    setOptions(this, options);
    return this;
  },

  addTo(map) {
    map.addLayer(this);
    return this;
  },

  _drawDebugInfo(tileCanvas, tilePoint, zoom) {
    const max = this.options.tileSize;
    const g = tileCanvas.getContext('2d');
    g.globalCompositeOperation = 'destination-over';
    g.strokeStyle = '#FFFFFF';
    g.fillStyle = '#FFFFFF';
    g.strokeRect(0, 0, max, max);
    g.font = '12px Arial';
    g.fillRect(0, 0, 5, 5);
    g.fillRect(0, max - 5, 5, 5);
    g.fillRect(max - 5, 0, 5, 5);
    g.fillRect(max - 5, max - 5, 5, 5);
    g.fillRect((max / 2) - 5, (max / 2) - 5, 10, 10);
    g.strokeText(`${tilePoint.x} ${tilePoint.y} ${zoom}`, (max / 2) - 30, (max / 2) - 10);
  },

  tilePoint(map, coords, tilePoint, tileSize) {
    // start coords to tile 'space'
    const s = tilePoint.multiplyBy(tileSize);

    // actual coords to tile 'space'
    const p = map.project(new LatLng(coords[0], coords[1]));

    // point to draw
    const x = Math.round(p.x - s.x);
    const y = Math.round(p.y - s.y);
    return { x, y };
  },

  /**
   * Creates a query for the quadtree from bounds
   */
  _boundsToQuery(bounds) {
    if (bounds.getSouthWest() === undefined) {
      return { x: 0, y: 0, width: 0.1, height: 0.1 };
    }

    return {
      x: bounds.getSouthWest().lng,
      y: bounds.getSouthWest().lat,
      width: bounds.getNorthEast().lng - bounds.getSouthWest().lng,
      height: bounds.getNorthEast().lat - bounds.getSouthWest().lat,
    };
  },

  getZoom() {
    return this._map.getZoom();
  },

  createTile(coords) {
    const tile = DomUtil.create('canvas', 'leaflet-tile');
    const size = this.getTileSize();
    const zoom = this.getZoom();
    tile.width = size.x;
    tile.height = size.y;
    if (this._drawDelegate) {
      this._drawDelegate.draw({
        canvas: tile,
        layer: this,
        size,
        coords,
        zoom,
      });
    }
    return tile;
  },
});

const canvasTiles = function (drawDelegate, onRendered, options) {
  return new CanvasTiles(drawDelegate, onRendered, options);
};


class CanvasTilesLayer extends MapLayer {
  static propTypes = {
    delegate: PropTypes.func.isRequired,
    zIndex: PropTypes.number,
    bbox: PropTypes.array,
    onRendered: PropTypes.func,
    data: PropTypes.object,
  };

  static defaultProps = {
    onRendered: noop,
  };

  createLeafletElement(props) {
    const { delegate, onRendered, data, ...options } = this.getOptions(props);
    const map = this.context.map;
    this.delegate = new delegate(data, map, options);
    return canvasTiles(this.delegate, onRendered, options);
  }

  updateData(data) {
    this.delegate.updateData(data);
    this.redraw();
  }

  redraw() {
    this.leafletElement.redraw();
    this.onRendered();
  }

  onRendered() {
    this.props.onRendered && this.props.onRendered();
  }
}

export default CanvasTilesLayer;
