import { Component, createElement } from "react";

export class MapContainer extends Component {
    render() {
        return <div id={this.props.mapId} class='ol-map-container'></div>;
    }
}
