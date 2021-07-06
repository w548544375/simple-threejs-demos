import { AmbientLight, BoxGeometry, Color, DirectionalLight, FogExp2, HemisphereLight, Mesh, MeshPhongMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import './assets/common';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const render = new WebGLRenderer();
render.setSize(window.innerWidth, window.innerHeight);
let pageRender = document.getElementById('renderCtx');
pageRender?.appendChild(render.domElement);
window.onresize = OnResize();

camera.position.set( 400, 200, 0 );
const scene = new Scene();
// 设置背景色
scene.background = new Color(0xcccccc);
// 设置雾
scene.fog = new FogExp2(0xcccccc, 0.002);

let controls;
// 生成地图
function init() {
    const geometry = new BoxGeometry(1, 1, 1);
    geometry.translate( 0, 0.5, 0 );
    const material = new MeshPhongMaterial({ color: 0xffffff, flatShading: true });
    for (let i = 0; i < 500; i++) {
        const mesh = new Mesh(geometry, material);
        mesh.position.x = Math.random() * 1600 - 800;
        mesh.position.y = 0;
        mesh.position.z = Math.random() * 1600 - 800;

        mesh.scale.x = 20;
        mesh.scale.y = Math.random() * 80 + 10;
        mesh.scale.z = 20;

        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        scene.add(mesh);
    }

    const light = new DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    const light2 = new HemisphereLight( 0xffffbb, 0x080820, 1 );
    light2.position.set(-1, -1, -1);
    scene.add(light2);

    const ambientLight = new AmbientLight(0x404040 );
    scene.add(ambientLight);

    controls = new MapControls(camera, render.domElement);
    
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

    const gui = new GUI();
    gui.add(controls, 'screenSpacePanning');
}




function animate() {
    requestAnimationFrame(animate);
    render.render(scene, camera);
}


function OnResize() : any {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // 刷新投影矩阵
    render.setSize(window.innerWidth, window.innerHeight);
}

init();
// 开始循环
animate();