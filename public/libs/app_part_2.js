let needRender = true

init()

/**
 * Handle preload of assets and show launch call to action
 */
async function init() {
    window.onload = () => {}
}

const scene = new THREE.Scene()
window.scene = scene

const renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance", antialias: false, stencil: false, depth: false })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xffffff, 0)
renderer.domElement.id = 'wormhole'

document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 10000)
camera.position.x = 0
camera.position.y = 10
camera.position.z = 0
camera.lookAt(0, 0, 0)

const starField = []
const starTexture = new THREE.TextureLoader().load('../images/star.png')
const starShineTexture = new THREE.TextureLoader().load('../images/star-shine.png')


let mouseX = 0,
    mouseY = 0
let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2

function getStarsGeometry(max = 5000) {
    const geometry = new THREE.BufferGeometry()

    return geometry.setAttribute('position', new THREE.Float32BufferAttribute(getVerticesInRandomPosition(max), 3))
}

function getVerticesInRandomPosition(max) {
    const vertices = []

    for (let i = 0; i < max; i++) {
        const x = 2000 * Math.random() - 1000;
        const y = 2000 * Math.random() - 1000;
        const z = 2000 * Math.random() - 1000;

        vertices.push(x, y, z);
    }

    return vertices
}

function getStarsMaterial(texture, opacity = 1, size = 5) {
    return new THREE.PointsMaterial({
        size: size,
        sizeAttenuation: true,
        map: texture,
        transparent: true,
        opacity: opacity
    })
}

const brightStars = new THREE.Points(getStarsGeometry(20000), getStarsMaterial(starShineTexture, 1))
const mediumStars = new THREE.Points(getStarsGeometry(10000), getStarsMaterial(starTexture, 0.6))
const paleStars = new THREE.Points(getStarsGeometry(10000), getStarsMaterial(starTexture, 0.2))

scene.add(brightStars)
scene.add(mediumStars)
scene.add(paleStars)

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

document.body.addEventListener('pointermove', onPointerMove);

function onPointerMove(event) {
    if (event.isPrimary === false) return

    mouseX = event.clientX - windowHalfX
    mouseY = event.clientY - windowHalfY
}

function animate(time) {
    if (needRender) {
        renderer.render(scene, camera)
    }
    camera.position.y -= 0.05

    rotateUniverse()

    requestAnimationFrame(animate)
}

function rotateUniverse(force = 0.0003) {
    brightStars.rotation.y += force
    mediumStars.rotation.y += force
    paleStars.rotation.y += force
}

animate()