import { Component, createElement } from "react";

import 'ol/ol.css';
import {Map as olMap, View as olView} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import {Icon, Fill, Stroke, Circle, Style} from 'ol/style';
import Overlay from 'ol/Overlay';

import { MapContainer } from "./components/MapContainer.jsx";
import "./ui/OpenLayers.css";

export default class OpenLayers extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        //var props = this.props;
        
        //setTimeout(function(){
        //    createMap(props);
        //},0);
    }
    
    render() {
        var props = this.props
        setTimeout(function(){
            createMap(props);
        },0);

        return <div>
            <MapContainer 
                mapId={this.props.mapId} 
            />
             <div id="ol-popup" class="ol-popup">
                <a href="#" id="ol-popup-closer" class="ol-popup-closer"></a>
                <div id="ol-popup-content"></div>
    <a id="ol-popup-button" href='javascript:void(0);' data-index="0" onClick={(e) => this.onActionClick(e)}>{this.props.markerActionText}</a>
            </div>
        </div>;
    }

    onActionClick(event){
        var index = parseInt(event.target.getAttribute("data-index"));
        this.props.markerAction(this.props.markerData.items[index]).execute();
    }
    //{this.createMap(this.props)}
}

function createMap(props){
    console.log('create map triggered...');
    //console.log(props);
    if(props.markerData.status == "loading")
    {
        //do nothing
    }
    else if(props.markerData.status == "available")
    {
        console.log(props);
        //console.log(props.markerName(props.markerData.items[0]));
        var featureList = new Array();
        var i = 0;

        var fill = new Fill({
            color: props.markerFillColour
        });
        var stroke = new Stroke({
            color: props.markerLineColour,
            width: props.markerLineWidth
        }); 

        for(i = 0; i < props.markerData.totalCount; i++){
            
            var mPlace = [parseFloat(props.markerLongitude(props.markerData.items[i]).displayValue), parseFloat(props.markerLatitude(props.markerData.items[i]).displayValue)];
           
            var mPoint = fromLonLat(mPlace);
            
            var newFeature = new Feature({
                name: props.markerName(props.markerData.items[i]).displayValue,
                geometry: new Point(mPoint),
                summary: props.markerSummary(props.markerData.items[i]).displayValue,
                link: props.markerLink(props.markerData.items[i]).displayValue,
                index: i
            });
            
            if(props.markerIcon != null){
                newFeature.setStyle(
                    new Style({
                        image: new Icon({
                          src: props.markerIcon.value.iconUrl
                        })
                    })
                );
            }else{
                newFeature.setStyle(
                    new Style({
                        image: new Circle({
                        fill: fill,
                        stroke: stroke,
                        radius: props.markerSize
                        }),
                        fill: fill,
                        stroke: stroke
                    })
                );
            }
            /*newFeature.setStyle(
                new Style({
                    image: new Icon({
                    color: '#4271AE',
                    crossOrigin: 'anonymous',
                    src: 'data/bigdot.png',
                    scale: 0.2,
                    }),
                })
            );*/

            /*newFeature.on('click',function(evt){
                alert('f00');
                var content = document.getElementById('ol-popup-content');
                var coordinate = evt.coordinate;
            
                content.innerHTML = '<p>You clicked on:</p><code>' + props.markerName(props.markerData.items[i]).displayValue + '</code>';
                overlay.setPosition(coordinate);
            });*/

            
            featureList.push(newFeature);

            console.log("Feature " + i + " added.");
        }

        console.log(featureList);

        var vectorSource = new VectorSource({
            features: featureList
        });
        
        var vectorLayer = new VectorLayer({
            source: vectorSource
        });

        var tileLayer = new TileLayer({source: new OSM()});

        console.log(props.mapId + ': load map...');

        var place = [props.longitude, props.latitude];
        var point = fromLonLat(place);

        var map = new olMap({
            target: props.mapId,
            layers: [tileLayer , vectorLayer], 
            //overlays: [overlay],
            view: new olView({
            center: point,
            zoom: props.zoomLevel
            })
        });
        
        if(props.fitToBounds){
            var layerExtent = vectorLayer.getSource().getExtent();
            map.getView().fit(layerExtent);
            map.getView().setZoom(map.getView().getZoom() - 1);
        }

        var element = document.getElementById('ol-popup');
        var content = document.getElementById('ol-popup-content');
        var closer = document.getElementById('ol-popup-closer');
        var button = document.getElementById('ol-popup-button');       
        
        var popup = new Overlay({
            element: element,
            positioning: 'bottom-center',
            stopEvent: false,
            offset: [0, 0],
        });

        closer.onclick = function () {
            popup.setPosition(undefined);
            closer.blur();
            return false;
        };

        map.addOverlay(popup);

        map.on('click', function (evt) {
            var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            return feature;
            });

            if (feature) {
            var coordinates = feature.getGeometry().getCoordinates();
            popup.setPosition(coordinates);
            button.setAttribute("data-index", feature.get("index"));
            content.innerHTML = "<b>" + feature.get('name') + "</b><p>" + feature.get("summary") + "</p><a href='" + feature.get('link') + "'>" + props.markerLinkText + "</a>";
            /*element.popover({
                placement: 'top',
                html: true,
                content: feature.get('name'),
            });
            element.popover('show');
            } else {
            element.popover('dispose');
            }*/
            }
        });
        
    }
}
