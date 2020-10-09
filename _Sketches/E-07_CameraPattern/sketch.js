import * as THREE from "https://unpkg.com/three@0.120.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js";

let camera, scene, renderer, video, mouseX, mouseY, geometry, meshes = [];
let windowX = window.innerWidth;
let windowY = window.innerHeight;

let controls;

const map = (value, in1, in2, out1, out2) =>
    ((value - in1) * (out2 - out1)) / (in2 - in1) + out1;

init();
animate();

function init() {
    document.addEventListener("mousemove", onDocumentMouseMove, false);
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.z = 25;

    scene = new THREE.Scene();

    video = document.getElementById("video");

    var texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    geometry = new THREE.PlaneBufferGeometry(16, 9);
    geometry.scale(0.5, 0.5, 0.5);
    var material = new THREE.MeshBasicMaterial({ map: texture });

    var count = 500;
    var radius = 15;

    for (var i = 1, l = count; i <= l; i++) {
        var phi = Math.acos(-1 + (2 * i) / l);
        var theta = Math.sqrt(l * Math.PI) * phi;

        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.setFromSphericalCoords(radius, phi, theta);
		mesh.lookAt(camera.position);
		meshes.push(mesh)
        scene.add(mesh);
    }

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;

    window.addEventListener("resize", onWindowResize, false);

    //

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        var constraints = {
            video: { width: 1280, height: 720, facingMode: "user" },
        };

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function (stream) {
                // apply the stream to the video element used in the texture

                video.srcObject = stream;
                video.play();
            })
            .catch(function (error) {
                console.error("Unable to access the camera/webcam.", error);
            });
    } else {
        console.error("MediaDevices interface not available.");
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    //console.log(Math.round(map(mouseX, 0, windowX, 0.1, 1) * 100) / 100);
}



function animate(time) {
	time *= 0.001; // Convert time to seconds
	meshes.forEach((obj) => {
		obj.rotation.z = time;
		obj.rotation.y = time;
		console.log(obj)
	});
	controls.update();
	requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
