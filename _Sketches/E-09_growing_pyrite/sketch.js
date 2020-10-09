import * as THREE from "https://unpkg.com/three@0.120.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js";

let scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);
const fogColor = 0xff00ff;
const fogDensity = 0.008;
scene.fog = new THREE.FogExp2(fogColor, fogDensity);
let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

let i = 0,
    j = 0;
let color1 = randomColor({luminosity: 'light',count: 27});

// Renderer
let renderer = new THREE.WebGLRenderer();
renderer.alpha = true;
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cubes
let geometry = new THREE.BoxBufferGeometry(3, 3, 3);

function makeCube(geometry, color, x, scaleX, scaleY, scaleZ) {
    const material = new THREE.MeshPhongMaterial({
        color,
        transparent: true,
        opacity: 0.5,
        flatShading: true,
    });
    material.flatShading = true;
    let cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;
    cube.scale.x = scaleX;
    cube.scale.y = scaleY;
    cube.scale.z = scaleZ;
    scene.add(cube);
    return cube;
}

const cubes = [makeCube(geometry, 0xff8d7a, 0)];

// Lights
let directionalLight1 = new THREE.SpotLight(0xffffff, 0.2);
directionalLight1.position.set(10, 20, 10);
scene.add(directionalLight1);

let directionalLight2 = new THREE.SpotLight(0xffffff, 0.2);
directionalLight2.position.set(-10, 20, -10);
scene.add(directionalLight2);

let directionalLight3 = new THREE.SpotLight(0xffffff, 0.2);
directionalLight3.position.set(10, 20, -10);
scene.add(directionalLight3);

let directionalLight4 = new THREE.SpotLight(0xffffff, 0.2);
directionalLight4.position.set(-10, 20, 10);
scene.add(directionalLight4);

const light = new THREE.AmbientLight(0xFFFFFF, 0.6);
scene.add(light);

// Camera and controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(30, 20, 30);
camera.lookAt(0, 0, 0);
controls.autoRotate = true;

function animate(time) {
    time *= 0.00001;

    if (i <= 400) {
        cubes.push(
            makeCube(
                geometry,
                color1[i % 27],
                0,
                getRandom(-1, 10),
                getRandom(-1, 1),
                getRandom(-1, 1)
            )
        );
    }
    i++;

    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
        if (j % 3000 <= 1500) {
            cube.scale.x += 0.02;
        } else {
            cube.scale.x -= 0.02;
        }
    });
    j++;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
