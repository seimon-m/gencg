import * as THREE from "https://unpkg.com/three@0.120.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js";

let scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);
let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cubes
let geometry = new THREE.BoxGeometry();

function makeCube(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color })
    let cube = new THREE.Mesh(geometry, material)
    cube.position.x = x
    scene.add(cube)
    return cube
}

const cubes = [
    makeCube(geometry, 0xFF8D7A,  0),
    makeCube(geometry, 0xDE6AB8, -2),
    makeCube(geometry, 0xC283F5,  2),
  ];

// Lights
let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-1, 2, 4);
scene.add(directionalLight);

// Camera and controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;

function animate(time) {
    time *= 0.001; // Convert time to seconds
    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
