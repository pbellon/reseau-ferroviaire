import { Component } from 'react';
import { createPortal } from 'react-dom';

const modalRoot = document.getElementById('modal-root');

class Modal extends Component {
  constructor(props){
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount(){
    modalRoot.appendChild(this.el);
  }
  componentWillUnmout(){
    modalRoot.removeChild(this.el);
  }

  render(){
    const { isOpen } = this.props;
    const klass = isOpen ? 'visible' : 'hidden';
    modalRoot.className = klass;
    return createPortal(
      this.props.children,
      this.el
    );
  }
}

export default Modal;
