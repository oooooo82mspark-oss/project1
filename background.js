import * as THREE from 'three';

let camera, scene, renderer;
let particles;

init();
animate();

function init() {
    // Canvas
    const canvas = document.querySelector('#bg');
    if (!canvas) {
        console.error('Canvas element #bg not found!');
        return; // Prevent further errors if canvas is null
    }
    console.log('Canvas element found:', canvas);

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    scene.add(camera);

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
    });
    if (!renderer) {
        console.error('Three.js Renderer failed to initialize!');
        return; // Prevent further errors
    }
    console.log('Three.js Renderer initialized:', renderer);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 500;
    const posArray = new Float32Array(particlesCnt * 3);

    for (let i = 0; i < particlesCnt * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x3498db,
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);


    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

let mouseX = 0;
let mouseY = 0;

function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}


function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = new Date().getTime() / 1000;
    particles.rotation.y = .1 * elapsedTime;
    particles.rotation.x = .1 * elapsedTime;

    const targetX = mouseX * 0.001;
    const targetY = mouseY * 0.001;

    camera.position.x += 0.05 * (targetX - camera.position.x);
    camera.position.y += 0.05 * (targetY - camera.position.y);


    renderer.render(scene, camera);
}
