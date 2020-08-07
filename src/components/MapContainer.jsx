import { Component, createElement } from "react";

export class MapContainer extends Component {
    render() {
        return <div class=''>
            <h3>Map!</h3>
            <div id={this.props.mapId} class='ol-map-container'></div>
        </div>;
    }
}
