import * as THREE from "https://unpkg.com/three@0.120.1/build/three.module.js";
import Stats from "https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js";
import { OrbitControls } from "https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js";

let camera, renderer, stats, sphere, controls, scene, light, object1, object2;

let mouseX = 0,
    mouseY = 0,
    move = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener("mousemove", onDocumentMouseMove, false);

init();
object1 = createObject();
object2 = createObject();
scene.add(object1);
object2.position.z = 10000;
scene.add(object2);
animate();

function init() {
    camera = new THREE.PerspectiveCamera(
        80,
        window.innerWidth / window.innerHeight,
        1,
        9000
    );
    camera.position.z = 0;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf000af);
    // scene.fog = new THREE.FogExp2(0xff0000, 0.1);
    // console.log(camera)

    // Light
    const colorLight = 0xff00ff;
    const intensity = 100;
    light = new THREE.SpotLight(colorLight, intensity);
    light.position.set(
        camera.position.x,
        camera.position.x,
        camera.position.z - 5000
    );
    var helper = new THREE.SpotLight(light, 500);
    scene.add(helper);

    // Sphere
    sphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(400, 20, 20),
        new THREE.MeshNormalMaterial()
    );
    scene.add(sphere);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;

    stats = new Stats();
    document.body.appendChild(stats.dom);

    window.addEventListener("resize", onWindowResize, false);
}

function createObject() {
    let obj = new THREE.Object3D();

    const geometry = new THREE.TetrahedronBufferGeometry(100);
    geometry.rotateX(Math.PI / 2);

    let material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.fog = true;

    for (let i = 0; i < 10000; i++) {
        let mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = getRandom(-2000, 2000);
        mesh.position.y = getRandom(-2000, 2000);
        if (
            !(
                mesh.position.x > -1000 &&
                mesh.position.x < 1000 &&
                mesh.position.y > -1000 &&
                mesh.position.y < 1000
            )
        ) {
            mesh.position.z = getRandom(-5000, 5000);
            mesh.scale.x = mesh.scale.y = mesh.scale.z = getRandom(4, 10);
            obj.add(mesh);
        }
    }
    return obj;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function animate() {
    requestAnimationFrame(animate);

    render();
    stats.update();
}

function render() {
    if (camera.position.z > object2.position.z + 4000) {
        object1.position.z = object1.position.z + 10000;
        const temp = object1;
        object1 = object2;
        object2 = temp;
    }

    let time = Date.now() * 0.0005;

    sphere.position.x = Math.sin(time * 0.7) * 2000;
    sphere.position.y = Math.cos(time * 0.5) * 2000;
    sphere.position.z = camera.position.z - 2000;

    for (let i = 1, l = object1.children.length; i < l; i++) {
        object1.children[i].lookAt(sphere.position);
    }

    for (let i = 1, l = object2.children.length; i < l; i++) {
        object2.children[i].lookAt(sphere.position);
    }

    controls.update();
    camera.lookAt(object1.position);
    camera.translateZ(move);
    move = 15 + 0.05;
    light.position.set(0, 0, camera.position.z - 5000);
    renderer.render(scene, camera);
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
