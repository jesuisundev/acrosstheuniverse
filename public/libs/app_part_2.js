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

const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 0
camera.position.y = 10
camera.position.z = 0
camera.lookAt(0, 0, 0)

const starField = []
const starTexture = new THREE.TextureLoader().load('../images/star.png')

let starsMaterial, starsGeometry, stars
let starCount = 50000
let mouseX = 0,
    mouseY = 0
let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2


function getStarsGeometry() {
    const geometry = new THREE.BufferGeometry()

    return geometry.setAttribute('position', new THREE.Float32BufferAttribute(getVerticesInRandomPosition(), 3))
}

function getVerticesInRandomPosition() {
    const vertices = []

    for (let i = 0; i < starCount; i++) {
        const x = 2000 * Math.random() - 1000;
        const y = 2000 * Math.random() - 1000;
        const z = 2000 * Math.random() - 1000;

        vertices.push(x, y, z);
    }

    return vertices
}

function getStarsMaterial() {
    return new THREE.PointsMaterial({
        size: 5,
        sizeAttenuation: true,
        map: starTexture,
        transparent: true
    })
}

starsGeometry = getStarsGeometry()
starsMaterial = getStarsMaterial()

stars = new THREE.Points(starsGeometry, starsMaterial)
console.log(stars)
scene.add(stars)


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

    camera.position.x += (mouseX - camera.position.x) * 0.05
    camera.position.y += (-mouseY - camera.position.y) * 0.05

    requestAnimationFrame(animate)
}

animate()