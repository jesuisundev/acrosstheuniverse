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

let effectPass

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
const mediumStars = new THREE.Points(getStarsGeometry(20000), getStarsMaterial(starTexture, 0.6))
const paleStars = new THREE.Points(getStarsGeometry(10000), getStarsMaterial(starTexture, 0.2))

scene.add(brightStars)
scene.add(mediumStars)
scene.add(paleStars)

const bloomEffect = new POSTPROCESSING.BloomEffect({ blendFunction: POSTPROCESSING.BlendFunction.SCREEN, kernelSize: POSTPROCESSING.KernelSize.SMALL })
bloomEffect.blendMode.opacity.value = 2

const godRaysEffectOptions = {
        height: 480,
        blendFunction: POSTPROCESSING.BlendFunction.SCREEN,
        color: 0x000000,
        kernelSize: POSTPROCESSING.KernelSize.SMALL,
        density: 1,
        decay: 0.1,
        weight: 1,
        exposure: 0.1,
        samples: 60,
        clampMax: 1.0
    }
    // TODO - Add on postprocessing to make the speed zoom effect
const godRaysEffect = new POSTPROCESSING.GodRaysEffect(camera, brightStars, godRaysEffectOptions)

// using a global variable because effects will be highly animated during the experience
effectPass = new POSTPROCESSING.EffectPass(camera, bloomEffect)
effectPass.renderToScreen = true

const composer = new POSTPROCESSING.EffectComposer(renderer)
composer.addPass(new POSTPROCESSING.RenderPass(scene, camera))
composer.addPass(effectPass)

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

function animate(time) {
    if (needRender) {
        //renderer.render(scene, camera)
        composer.render()
    }
    camera.position.y -= 0.05

    let current = Math.random()

    if (current > 0.6 && current < 0.65)
        mediumStars.material.opacity = current

    rotateUniverse()

    requestAnimationFrame(animate)
}

function rotateUniverse(force = 0.0003) {
    brightStars.rotation.y += force
    mediumStars.rotation.y += force
    paleStars.rotation.y += force
}

animate()