import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';

const scene = new Scene();
const camera = new PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
const render = new WebGLRenderer();

render.setSize(window.innerWidth,window.innerHeight);

let renderCtx = document.getElementById('renderCtx');

renderCtx?.appendChild(render.domElement);


const geometry = new BoxGeometry();
const material = new MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

window.onresize = function () {
    render.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

const composer = new EffectComposer(render);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const glitchPath = new GlitchPass();
composer.addPass(glitchPath);

function animate(time : number) {
	requestAnimationFrame( animate );
    cube.rotation.x  += 0.01;
    cube.rotation.y += 0.01;
    render.render(scene, camera);
    composer.render();
}
animate(0);