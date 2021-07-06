import 'ol/ol.css';
import {Map,View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';

let vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: '../src/assets/china.json'
})


const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        }),
        new VectorLayer({
            source: vectorSource
        })
    ],
    view: new View({
        projection: 'EPSG:4326',
        center: [104.0707,30.6485],
        zoom: 4
    })
});