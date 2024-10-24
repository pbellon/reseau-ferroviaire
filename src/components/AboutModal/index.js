import React, { Component } from "react";

import "./styles.css";
import Modal from "../Modal";
import ReactMarkdown from "react-markdown";

const md = `
# Vitesses du réseau ferroviaire Français
Cette carte représente l'ensemble du réseau ferroviaire français tel qu'il est décrit dans les données de [data.sncf.com](https://data.sncf.com), aussi ne sont tracées ici que les lignes de train actuellement exploitées. La largeure des différentes lignes tracées dépend de la vitesse de la section correspondante. Vous pouvez retrouver la vitesse correspondante en cliquant sur une section. Retrouvez le code source de cette application sur [framagit](http://framagit.org/pbellon/reseau-ferroviaire/).

## Crédits
- Conception & Développement: [Pierre Bellon](https://github.com/pbellon/)
- Tuiles cartographique: Stamen Design (labels) & OpenStreetMap Hydda.Base

## Librairies utilisées
- React
- Leaflet
- TurfJS

## Jeux de données utilisés: 
- [Vitesse maximale nominale sur ligne](https://data.sncf.com/explore/dataset/vitesse-maximale-nominale-sur-ligne/)
- [Fichier de formes des lignes du Réseau Ferré National](https://data.sncf.com/explore/dataset/formes-des-lignes-du-rfn/)

## Inspiration
- Les travaux de Charles Joseph Minard 

`;

class AboutModal extends Component {
  static defaultProps = {
    isOpen: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  closeModal(e) {
    this.setState({ isOpen: false });
  }

  openModal() {
    this.setState({ isOpen: true });
  }

  render() {
    const { isOpen } = this.state;
    const modalKlass = "modal" + (isOpen ? " modal--opened" : "");
    return (
      <div className={"button-holder"}>
        <div className={"about-button"} onClick={this.openModal.bind(this)}>
          ?
        </div>
        <Modal isOpen={isOpen}>
          <div className={modalKlass}>
            <div
              className={"modal-background"}
              onClick={this.closeModal.bind(this)}
            ></div>
            <div className={"modal-content"}>
              <div className={"modal-content-container"}>
                <div
                  className={"modal-close-button "}
                  onClick={this.closeModal.bind(this)}
                >
                  &#215;
                </div>
                <ReactMarkdown source={md} />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
export default AboutModal;
