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

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 0
camera.position.y = 10
camera.position.z = 0
camera.lookAt(0, 0, 0)

function getStarsGeometry() {
    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(getStarsRandomVertices(), 3))

    return geometry
}

function getStarsRandomVertices(verticesNumber = 10000) {
    const vertices = []

    for (let i = 0; i < verticesNumber; i++) {
        const x = 2000 * Math.random() - 1000;
        const y = 2000 * Math.random() - 1000;
        const z = 2000 * Math.random() - 1000;

        vertices.push(x, y, z);
    }

    return vertices
}

function getStarsMaterial() {
    const starSprite = new THREE.TextureLoader().load('../images/star.png');
    const starMaterial = new THREE.PointsMaterial({ size: 5, sizeAttenuation: true, map: starSprite, alphaTest: 0.5, transparent: true });

    return starMaterial
}

function getStars() {
    const stars = new THREE.Points(getStarsGeometry(), getStarsMaterial())

    return stars
}

scene.add(getStars())

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

function animate(time) {
    if (needRender) {
        renderer.render(scene, camera);
    }

    requestAnimationFrame(animate)
}

animate()