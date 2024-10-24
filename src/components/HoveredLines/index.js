import React, { Component } from 'react';


import PropTypes from 'prop-types';
import './styles.css';

const Feature = PropTypes.shape({
  geometry: PropTypes.object,
  properties: PropTypes.object,
});


class HoveredLines extends Component {
  static props = {
    lines: PropTypes.arrayOf(Feature),
    point: PropTypes.arrayOf(PropTypes.number),
  }
  
  static defaultProps = {
    lines: [],
    point: null,
    zIndex: 0,
  }

  static contextTypes = {
    map: PropTypes.object,
  }
  formatSpeed(speed){
    if(speed < 0){
      return 'inconnue';
    } else {
      return `${speed} km/h`
    }
  
  } 
  render(){
    const { lines, zIndex = 0 } = this.props;
    // const { map } = this.context;
    const isOpen = lines.length > 0;
    return (
      <div className={'hovered-lines-holder'} style={{ zIndex }}>
        <div className={'hovered-lines' + (isOpen ? ' hovered-lines--opened' : '')}>
          { lines.map(({ properties: { id, name, max_speed, line_max_speed }}) => (
          <div key={ id }>
            <h4>{ name }</h4>
            <p>
              Vitesse maximale de la section: <span className={'speed'}>
              { this.formatSpeed(max_speed) }
              </span><br/>
              Vitesse maximale de la ligne: <span className={'speed'}>
              { this.formatSpeed(line_max_speed) }
              </span>
              </p>
          </div> 
         ))}
        </div>
      </div>
    )
  }
}

export default HoveredLines;
