import * as THREE from "https://unpkg.com/three@0.120.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js";

let container,
    camera,
    scene,
    renderer,
    target,
    material,
    mouseX,
    mouseY,
    controls,
    postScene,
    postCamera,
    postMaterial;

let particles,
    count = 0;

let SEPARATION = 20,
    AMOUNTX = 400,
    AMOUNTY = 400;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let params = {
    format: THREE.DepthFormat,
    type: THREE.UnsignedShortType,
};

init();
animate();

function init() {
    container = document.createElement("div");
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );
    camera.position.x = 1200;
    camera.position.y = 700;
    camera.position.z = 1200;
    scene = new THREE.Scene();
    scene.background = new THREE.Color("blue");

    let numParticles = AMOUNTX * AMOUNTY;

    let positions = new Float32Array(numParticles * 3);
    let scales = new Float32Array(numParticles);

    let i = 0,
        j = 0;

    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
            positions[i + 1] = 0; // y
            positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z

            scales[j] = 1;

            i += 3;
            j++;
        }
    }

    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    material = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color(0xa82250) },
            cameraNear: { value: camera.near },
            cameraFar: { value: camera.far },
            tDiffuse: { value: null },
            tDepth: { value: null },
        },
        vertexShader: document.getElementById("vertexshader").textContent,
        fragmentShader: document.getElementById("fragmentshader").textContent,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);

    setupRenderTarget();
    setupPost();

    document.addEventListener("mousemove", onDocumentMouseMove, false);
    window.addEventListener("resize", onWindowResize, false);
}

function setupPost() {
    // Setup post processing stage
    postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    postMaterial = new THREE.ShaderMaterial({
        vertexShader: document.getElementById("vertexshader").textContent,
        fragmentShader: document.getElementById("fragmentshader").textContent,
        uniforms: {
            cameraNear: { value: camera.near },
            cameraFar: { value: camera.far },
            tDiffuse: { value: null },
            tDepth: { value: null },
        },
    });
    var postPlane = new THREE.PlaneBufferGeometry(2, 2);
    var postQuad = new THREE.Mesh(postPlane, postMaterial);
    postScene = new THREE.Scene();
    postScene.background = new THREE.Color("black");
    postScene.add(postQuad);
}

function setupRenderTarget() {
    // Create a render target with depth texture
    if (target) target.dispose();

    var format = parseFloat(params.format);
    var type = parseFloat(params.type);

    target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    target.texture.format = THREE.RGBFormat;
    target.texture.minFilter = THREE.NearestFilter;
    target.texture.magFilter = THREE.NearestFilter;
    target.texture.generateMipmaps = false;
    target.stencilBuffer = format === THREE.DepthStencilFormat ? true : false;
    target.depthBuffer = true;
    target.depthTexture = new THREE.DepthTexture();
    target.depthTexture.format = format;
    target.depthTexture.type = type;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    var dpr = renderer.getPixelRatio();
    target.setSize(window.innerWidth * dpr, window.innerHeight * dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    var positions = particles.geometry.attributes.position.array;
    var scales = particles.geometry.attributes.scale.array;
    renderer.setRenderTarget(target);
    renderer.render(scene, camera);

    var i = 0,
        j = 0;

    for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
            positions[i + 1] =
                Math.sin((ix + count) * 0.3) * (mouseY / 2) +
                Math.sin((iy + count) * 0.5) * (mouseY / 2);

            scales[j] =
                (mouseX / (windowHalfX / 6) + 8) *
                    (Math.sin((ix + count) * 0.3) + 1) *
                    8 +
                (Math.sin((iy + count) * 0.5) + 1) * 8;

            i += 3;
            j++;
        }
    }

    // render post FX
    postMaterial.uniforms.tDiffuse.value = target.texture;
    postMaterial.uniforms.tDepth.value = target.depthTexture;
    renderer.setRenderTarget(null);
    renderer.render(postScene, postCamera);

    controls.update();

    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.scale.needsUpdate = true;

    count += 0.1;
}
