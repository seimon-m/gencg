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

let i = 0;
let color1 = randomColor({ hue: "#726A59", count: 18 });

// Renderer
let renderer = new THREE.WebGLRenderer();
renderer.alpha = true;
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cubes
let geometry = new THREE.BoxBufferGeometry(3, 3, 3);

function makeCube(geometry, color, x, y, z, scale) {
    const material = new THREE.MeshPhongMaterial({
        color,
        transparent: true,
        opacity: 0.9,
    });
    let cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
    cube.scale.x = getRandom(scale - 0.1, scale + 0.1);
    cube.scale.y = getRandom(scale - 0.1, scale + 0.1);
    cube.scale.z = getRandom(scale - 0.1, scale + 0.1);
    scene.add(cube);
    return cube;
}

const cubes = [makeCube(geometry, 0xff8d7a, 0)];

// Lights
let directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(-1, 2, 4);
scene.add(directionalLight);

const light = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(light);

// Camera and controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 15;
camera.position.y = 7;
camera.position.x = 3;

function animate(time) {
    time *= 0.01; // Convert time to seconds
    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx;
        const rot = speed + getRandom(-0.01, 0.01);
        cube.rotation.x = rot;
        cube.rotation.y = rot;
        if (i <= 100) {
            cubes.push(
                makeCube(
                    geometry,
                    color1[i % 18],
                    getRandom(-4, 8),
                    getRandom(-2, 2),
                    getRandom(-4, 8),
                    getRandom(0.3, 1)
                )
            );
        }
        i++;
    });

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
