import { BoxGeometry, Clock, DirectionalLight, Mesh, MeshBasicMaterial, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import './assets/common.css';

// 主摄像机
const camera = new PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.set(0,200,500);
camera.lookAt(0,0,0);
// 渲染窗口
const renderer = new WebGLRenderer();

// 一个空的场景
const scene = new Scene();

// 计时器
const clock = new Clock();


init();
// 添加方向光
const directLight = new DirectionalLight(0xffffff);
directLight.position.set( 1,1,1 );
scene.add(directLight);

// const geometry = new BoxGeometry();
// const material = new MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new Mesh( geometry, material );
// scene.add( cube );
// 添加点光源
const pointLight = new PointLight(0x00ff00);
pointLight.position.set(0,0,0);
scene.add(pointLight);

// 场景中添加灯光
// const ambientLight = new AmbientLight("rgb(234,255,234)");
// ambientLight.position.set(0,100,0);
// scene.add(ambientLight);

// 加载模型
const model = require("./assets/models/maria_j_j_ong.fbx");
const loader = new FBXLoader();
loader.load(model,(obj)=>{
    obj.scale.set(0.4,0.4,0.4);
    scene.add(obj);
});
/******************自定义逻辑***************** */
function Tick(delta:number) {
    //TODO 自定义渲染
}


animate();

function init() {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    const renderCtx = document.getElementById('renderCtx');
    renderCtx?.appendChild(renderer.domElement);
    window.onresize = resizeWindow;
}

function animate() {
    renderer.render(scene,camera);
    Tick(clock.getDelta());
    requestAnimationFrame(animate);    
}



/**
 * 窗口大小更改监听
 */
function resizeWindow() {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix(); // 更新投影矩阵
}



