import {AxesHelper, BufferGeometry, CameraHelper, Clock, DirectionalLight, FogExp2, GridHelper, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, PerspectiveCamera, Scene, SphereGeometry, Spherical, TextureLoader, Vector2, Vector3, WebGLRenderer } from 'three';
import {FlyControls} from 'three/examples/jsm/controls/FlyControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import './assets/common';
import GeoChina  from './assets/All';
import earth from './assets/earth_atmos_2048.jpg';
import normalMap from './assets/earth_normal_2048.jpg';
import specularMap from './assets/earth_specular_2048.jpg';
import BG from './assets/2k_stars_milky_way.jpg';
import CloudMap from './assets/earth_clouds_1024.png';

const ctx = document.getElementById('renderCtx');

const render = new WebGLRenderer();
render.setPixelRatio( window.devicePixelRatio );
render.setSize(window.innerWidth,window.innerHeight);
const scene = new Scene();
const camera = new PerspectiveCamera(75,window.innerWidth/window.innerHeight,50,1e7);
window.onresize = resize;
camera.position.set(0,100,300);
camera.lookAt(0,0,0);
const textureLoader = new TextureLoader();
const bg = textureLoader.load(BG);
scene.background = bg;
scene.fog = new FogExp2(0x000000,0.00000025);
const rotationSpeed = 0.02;
const cloudScale = 1.005;
const tilt =  0.41;

const clock = new Clock();

// const gridHelper = new GridHelper(800,40);
// scene.add(gridHelper);
let stats = Stats();
ctx?.appendChild( stats.dom );

function resize() {
    render.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
}



function initEarth() : any{
    const earthRadius = 200;
    const sphereGeometry = new SphereGeometry(earthRadius,earthRadius,earthRadius / 2);
    const sphereMat = new MeshPhongMaterial({
        map: textureLoader.load(earth),
        specular: 0x333333,
        shininess: 15,
        normalMap: textureLoader.load(normalMap),
        specularMap: textureLoader.load(specularMap),
        normalScale: new Vector2( 0.85, - 0.85 )
    });
    const sphereMesh = new Mesh(sphereGeometry,sphereMat);
    // genernatePoints(sphereMesh,earthRadius);
    scene.add(sphereMesh);


    const cloudMat = new MeshLambertMaterial({
        map: textureLoader.load(CloudMap),
        transparent: true
    });
    const cloudMesh = new Mesh(sphereGeometry,cloudMat);
    cloudMesh.scale.set(cloudScale,cloudScale,cloudScale);
    cloudMesh.rotation.z = tilt;
    scene.add(cloudMesh);

    
    return {earth: sphereMesh,cloud: cloudMesh};
}


function genernatePoints(parent : Mesh,radius: number) {
    let geos = GeoChina['features'];
    if(!geos) {
        return;
    }
    for(let feature of geos) {
    //    let featureName = feature.properties.name;
       let featureGeometry = feature.geometry;
       let geometryType = featureGeometry.type;
       let coordinates = featureGeometry.coordinates;
    //    console.log(` ${geometryType}`);
       if(geometryType === 'MultiPolygon') {
           drawMultiPolygon(coordinates,radius,parent);
       }else if(geometryType === 'Polygon') {
           drawPolygon(coordinates,radius,parent);
       }
    }
    
}

/**
 * 绘制多线段
 * @param data multipolygon
 */
function drawMultiPolygon(data : any[],radius : number,parent : Mesh |undefined) {
    const lineMat = new LineBasicMaterial({
        color: Math.random() * 0xFFFFFF,
        linejoin: 'bevel'
    });
    data.forEach((polygons)=>{
        polygons.forEach((polygon : any[]) => {
            let points: Vector3[] = [];
            polygon.forEach((point : number[]) => {
                let vec = lngLatToXYZ(radius,point[0],point[1]);
                points.push(vec);
            });
            const lineGeometry = new BufferGeometry().setFromPoints(points);
            const line = new Line(lineGeometry,lineMat);
            parent?.add(line);
        });
    });
}

/**
 * 
 * @param data 绘制线段
 */
function drawPolygon(data : any[],radius: number,parent : Mesh |undefined) {
    const lineMat = new LineBasicMaterial({color: Math.random() * 0xFFFFFF});
    data.forEach(polygons => {
        let points : Vector3[] = [];
        polygons.forEach((point : number[]) => {
            let vec = lngLatToXYZ(radius,point[0],point[1]);
            points.push(vec);
        });
        const lineGeometry = new BufferGeometry().setFromPoints(points);
        const line = new Line(lineGeometry,lineMat);
        parent?.add(line);
    });
}

/**
 * 将经纬度转换为坐标点
 * @param radius 圆半径
 * @param lng 经度
 * @param lat 纬度
 */
function lngLatToXYZ(radius : number,lng :number,lat: number) : Vector3 {
    let degreeLng = (180+lng) * (Math.PI / 180);
    let degreeLat = (90-lat) * (Math.PI / 180);
    let x : number = -radius * Math.cos(degreeLng) * Math.sin(degreeLat);
    let y : number = radius * Math.cos(degreeLat);
    let z : number = radius * Math.sin(degreeLat) * Math.sin(degreeLng);
    return new Vector3(x,y,z);
    // const theta = (90 + lng) * (Math.PI /180);
    // const phi = (90-lat) * (Math.PI/180);
    // return (new Vector3().setFromSpherical(new Spherical(radius,phi,theta)));
}


function initContrls() {
    let controls = new FlyControls(camera,render.domElement);
    
    controls.movementSpeed = 100;
    controls.domElement = render.domElement;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = false;
    return controls;
}


function initLight() { 
    const light = new DirectionalLight(0xffffff,1.0);
    light.position.set( - 1, 0, 1 ).normalize();
    scene.add(light);
}


// let controls = initContrls();

let mesh = initEarth();


function animate() {
    render.render(scene,camera);
    stats.update();
    const delta = clock.getDelta();
    // mesh.earth.rotation.y -= 0.3 * rotationSpeed * delta;
    mesh.cloud.rotation.y += rotationSpeed * delta;
    // controls.update( delta );
    requestAnimationFrame(animate);
}

ctx?.appendChild(render.domElement);
initLight();
animate();