import { Component, createElement } from "react";

export class preview extends Component {
    render() {
        return <div>This is where the map will go.</div>;
    }
}

export function getPreviewCss() {
    return require("./ui/OpenLayers.css");
}
