import {Map, View} from "ol";
import {OSM} from "ol/source";
import TileLayer from "ol/layer/Tile";
import './assets/common.css';
import 'ol/ol.css';
import {BoxGeometry, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {Layer} from "ol/layer";


const camera = new PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
const scene = new Scene();
const renderer = new WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor(0xb9d3ff, 0);
const cubeGeometry = new BoxGeometry(100,100,100);
const cubeMat = new MeshBasicMaterial({color: 0x00ff00});
const cubeMesh = new Mesh(cubeGeometry,cubeMat);
// scene.background = new Color("rgba(100,10,50,0)");
scene.add(cubeMesh);

camera.position.set(0,100,400);
camera.lookAt(0,0,0);

const threeLayer = new Layer({
   render(frameState) {
     let canvas = renderer.domElement;
     let viewState = frameState.viewState;

     let visible = threeLayer.getVisible();
     canvas.style.display = visible ? 'block' : 'none';

     let opacity = threeLayer.getOpacity();
     canvas.style.opacity = String(opacity);

     let rotation = viewState.rotation;
     scene.rotation.y = rotation * 180 / Math.PI;
     return canvas;
   }
});

threeLayer
var map = new Map({
    target: 'renderCtx',
    layers: [
        new TileLayer({
            source: new OSM()
        }),
        threeLayer
    ],
    view: new View({
        projection: 'EPSG:4326',
        center: [104.0707,30.6485],
        zoom: 4
    })
});

function animate() {
    map.render();
    renderer.render(scene,camera);
    cubeMesh.rotation.x += 0.01;
    cubeMesh.rotation.z += 0.01;
    requestAnimationFrame(animate);
}

animate();