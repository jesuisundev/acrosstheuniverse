// default global variables needed to update scene on the fly
let somniumAudio, oceansAudio, effectPass
let needRender = true

const globalRotation = { value: 0.001 }

const darkTextureRotation = { value: 0.0006 }
const darkMoveForward = { value: 0.0006 }
const darkOpacity = { value: 0.4 }

const colorFullTextureRotation = { value: 0.0006 }
const colorFullMoveForward = { value: 0.0016 }
const colorFullOpacity = { value: 0.4 }

const waterTextureRotation = { value: 0.0040 }
const waterMoveForward = { value: 0.0001 }
const waterOpacity = { value: 0 }

const lightTextureRotation = { value: 0.0006 }
const lightMoveForward = { value: 0.0056 }
const lightOpacity = { value: 0 }

const parallelTextureRotation = { value: 0.0006 }
const parallelMoveForward = { value: 0.0016 }
const parallelOpacity = { value: 0 }

//document.getElementById('launch').addEventListener('click', event => launchExperience(event))
//document.getElementById('callToAction').addEventListener('click', event => prepareLaunchHorizonEvent(event))

init()

/**
 * Handle preload of assets and show launch call to action
 */
async function init() {
    initAudio()
    window.onload = () => {
        //document.getElementById('loading').remove()
        //document.getElementById('launch').className = 'fadeIn'
    }

    await showElementById("title")
    await showElementById("description")
    await showElementById("notice")
    await showElementById("entrypoint")
}

/**
 * iterate on all the audio and preload them using Howl
 */
function initAudio() {
    somniumAudio = new Howl({
        src: ['/audio/thesomnium.mp3']
    })
    oceansAudio = new Howl({
        src: ['/audio/oceans.mp3']
    })
}

/**
 * show document element by seting the class fadeIn
 * 
 * @param {String} id id of the element in the document
 * @param {Number} fadeInTime time in millisecond before fadein
 */
async function showElementById(id, fadeInTime = 1000) {
    return await new Promise(resolve => {
        setTimeout(() => {
            //document.getElementById(id).className = 'fadeIn'
            resolve()
        }, fadeInTime)
    })
}

/**
 * Entrypoint of the whole experience
 * Will be trigger by the click on "lauch experience"
 * 
 * @param {Object} event event of the click
 */
async function launchExperience(event) {
    event.preventDefault()

    document.getElementById('launch').style.visibility = 'hidden'

    document.getElementById('intro').className = 'fadeOut'
    setTimeout(() => document.getElementById('intro').remove(), 6000)

    somniumAudio.play()

    await introStoryEvent()
    await revealWormhole()
    await horizonAwakeningEvent()
    await revealCallToActionEvent()
}

/**
 * Handle the stories flow for the intro
 */
async function introStoryEvent() {
    await fadeInWaitThenFadeOut('firstStory', 8000)
    await fadeInWaitThenFadeOut('secondStory', 7000)
    await fadeInWaitThenFadeOut('thirdStory', 5000)
}

/**
 * Triggered for each story intro and outro
 * Handle the smooth effect
 * 
 * @param currentIdStory {String} name of the dom id on the page
 * @param time {Number} default time in millisecond before fadeout
 */
async function fadeInWaitThenFadeOut(currentIdStory, fadeOutTime = 1000) {
    await new Promise(resolve => setTimeout(resolve, 4000))

    document.getElementById(currentIdStory).className = 'fadeIn'

    return await new Promise(resolve => {
        setTimeout(() => {
            document.getElementById(currentIdStory).className = 'fadeOut'
            resolve()
        }, fadeOutTime)
    })
}

/**
 * Globally hide the cursor after 2s of inactivity
 */
function hideCursorOnInactivity() {
    let fadeInBuffer, timer
    document.getElementById('global').addEventListener('mousemove', () => {
        if (!fadeInBuffer && timer) {
            clearTimeout(timer)
            timer = 0
            document.getElementById('global').style.cursor = ''
        } else {
            document.getElementById('global').style.cursor = 'default'
            fadeInBuffer = false;
        }

        timer = setTimeout(() => {
            document.getElementById('global').style.cursor = 'none'
            fadeInBuffer = true;
        }, 2000)
    });
}

/**
 * Hide the space background and reveal the wormhole
 * The rendering of the scene start here!
 */
async function revealWormhole() {
    return await new Promise(resolve => {
        setTimeout(() => {
            document.getElementById('base-space').className = 'background-container fadeOut'

            // start rendering the scene now that we need it
            needRender = true

            document.getElementById('wormhole').className = 'fadeIn'
            resolve()
        }, 3000)
    })
}

/**
 * Make the horizon blink for the horizon event call to action
 * Timeout is synced to music
 */
async function horizonAwakeningEvent() {
    return await new Promise(resolve => {
        setTimeout(() => {
            const horizonGrowExposureCallToAction = new TWEEN.Tween(
                effectPass.effects[0].godRaysMaterial.uniforms.exposure
            ).to({ value: 4 }, 3000).easing(TWEEN.Easing.Cubic.In)

            const horizonReduceExposureCallToAction = new TWEEN.Tween(
                effectPass.effects[0].godRaysMaterial.uniforms.exposure
            ).to({ value: 0.8 }, 3000).easing(TWEEN.Easing.Cubic.Out)

            horizonGrowExposureCallToAction.start().chain(horizonReduceExposureCallToAction)
            resolve()
        }, 24000)
    })
}

/**
 * Show the call to action for the horizon event
 */
async function revealCallToActionEvent() {
    return await new Promise(resolve => {
        setTimeout(() => {
            document.getElementById("callToAction").style.display = "block"
            resolve()
        }, 3000)
    })
}

/**
 * Entrypoint of the horizon event
 * Will be trigger by the click on the horizon
 * 
 * @param {Object} event event of the click
 */
function prepareLaunchHorizonEvent(event) {
    event.preventDefault()

    document.getElementById('callToAction').remove()

    somniumAudio.fade(1, 0, 1500)
    oceansAudio.volume(0)
    oceansAudio.play()
    oceansAudio.fade(0, 1, 5000)

    const timeToLaunch = 12500
    const easingHideAndSpeed = TWEEN.Easing.Quintic.In
    const easingRotation = TWEEN.Easing.Quintic.Out

    const slowingTextureRotationDark = new TWEEN.Tween(darkTextureRotation)
        .to({ value: 0.0001 }, timeToLaunch)
        .easing(easingRotation)

    const slowingTextureRotationColorFull = new TWEEN.Tween(colorFullTextureRotation)
        .to({ value: 0.0001 }, timeToLaunch)
        .easing(easingRotation)

    const slowingGlobalRotation = new TWEEN.Tween(globalRotation)
        .to({ value: 0 }, timeToLaunch)
        .easing(easingRotation)

    const reduceBloomEffect = new TWEEN.Tween(bloomEffect.blendMode.opacity)
        .to({ value: 1 }, timeToLaunch)
        .easing(TWEEN.Easing.Elastic.Out)

    const reduceDark = new TWEEN.Tween(darkCylinderMaterial)
        .to({ opacity: 0.1 }, timeToLaunch)
        .easing(easingHideAndSpeed)

    const hideColorFull = new TWEEN.Tween(colorFullCylinderMaterial)
        .to({ opacity: 0 }, timeToLaunch)
        .easing(easingHideAndSpeed)

    const slowingSpeedDark = new TWEEN.Tween(darkMoveForward)
        .to({ value: 0.0001 }, timeToLaunch)
        .easing(easingHideAndSpeed)

    const slowingSpeedColorFull = new TWEEN.Tween(colorFullMoveForward)
        .to({ value: 0.0001 }, timeToLaunch)
        .easing(easingHideAndSpeed)

    // leaving normal space
    reduceBloomEffect.start()
    reduceDark.start()
    hideColorFull.start().onComplete(() => scene.remove(colorFullCylinder))

    // slowing general rotation
    slowingTextureRotationDark.start()
    slowingTextureRotationColorFull.start()
    slowingGlobalRotation.start()

    // slowing general speed
    slowingSpeedDark.start()
    slowingSpeedColorFull.start().onComplete(() => launchHorizonEvent())
}

/**
 * Horizon event
 * Water + Dark cylinder
 */
function launchHorizonEvent() {
    darkTextureRotation.value = 0.0040

    const showDark = new TWEEN.Tween(darkCylinderMaterial)
        .to({ opacity: 1 }, 500)
        .easing(TWEEN.Easing.Circular.Out)

    const showWater = new TWEEN.Tween(waterCylinderMaterial)
        .to({ opacity: 0.3 }, 500)
        .easing(TWEEN.Easing.Circular.Out)

    const speedUpDark = new TWEEN.Tween(darkMoveForward)
        .to({ value: 0.0086 }, 2000)
        .easing(TWEEN.Easing.Elastic.Out)

    const speedUpWater = new TWEEN.Tween(waterMoveForward)
        .to({ value: 0.0156 }, 2000)
        .easing(TWEEN.Easing.Elastic.Out)

    const horizonExposure = new TWEEN.Tween(effectPass.effects[0].godRaysMaterial.uniforms.exposure)
        .to({ value: 45 }, 35000)
        .easing(TWEEN.Easing.Circular.In)

    // huge speed at launch
    speedUpDark.start()
    speedUpWater.start()

    // show hyperspace
    scene.add(waterCylinder)
    showWater.start()
    showDark.start().onComplete(() => secondPhaseHorizonEvent())

    // launch long exposure from horizon
    // because of the huge timeout this will be trigger after all the horizon phase event
    horizonExposure.start().onComplete(() => enterParallelUniverse())
}

/**
 * Second phase Horizon event
 * Water cylinder
 */
async function secondPhaseHorizonEvent() {
    await new Promise(resolve => setTimeout(resolve, 6000))

    const hideDark = new TWEEN.Tween(darkCylinderMaterial)
        .to({ opacity: 0 }, 3000)
        .easing(TWEEN.Easing.Circular.Out)

    hideDark.start().onComplete(() => {
        scene.remove(darkCylinder)
        thirdPhaseHorizonEvent()
    })
}

/**
 * Third phase Horizon event
 * Water + light cylinder
 */
async function thirdPhaseHorizonEvent() {
    const showLight = new TWEEN.Tween(lightCylinderMaterial)
        .to({ opacity: 1 }, 3000)
        .easing(TWEEN.Easing.Sinusoidal.In)

    const speedUpRotation = new TWEEN.Tween(globalRotation)
        .to({ value: 0.030 }, 3000)
        .easing(TWEEN.Easing.Sinusoidal.In)

    scene.add(lightCylinder)
    showLight.start()
    speedUpRotation.start()
}

/**
 * entering the parallel universe
 * no cylinder
 */
async function enterParallelUniverse() {
    // workaround firefox bug on godrays fadeout
    document.getElementById('whitewall').style.zIndex = "9999"
    document.getElementById('whitewall').style.visibility = "visible"
    document.getElementById('wormhole').className = 'fadeOut'
    scene.remove(waterCylinder)
    scene.remove(lightCylinder)
    scene.remove(light)

    const lightLight = new THREE.AmbientLight(0xFFFFFF, 0.1)
    scene.add(lightLight)
    const blueLight = new THREE.AmbientLight(0x000080, 0.5)
    scene.add(blueLight)

    await new Promise(resolve => setTimeout(resolve, 3000))

    needRender = false

    document.getElementById('whitewall').className = 'fadeOut'
    await new Promise(resolve => setTimeout(resolve, 9000))
    document.getElementById('whitewall').remove()

    scene.remove(horizon)
    horizonMaterial.opacity = 0

    needRender = true
    document.getElementById('wormhole').className = 'fadeIn'

    await fadeInWaitThenFadeOut('fourthStory', 8000)
    showTeasingParalelUniverse()
}

/**
 * Show teasing for the parallel universe
 * dark + parallel cylinder
 */
async function showTeasingParalelUniverse() {
    globalRotation.value = 0.001

    darkTextureRotation.value = -0.0004
    darkMoveForward.value = 0.0004

    parallelTextureRotation.value = -0.0002
    parallelMoveForward.value = 0.0014

    const showDark = new TWEEN.Tween(darkCylinderMaterial)
        .to({ opacity: 1 }, 10000)
        .easing(TWEEN.Easing.Quadratic.In)

    const showParallel = new TWEEN.Tween(parallelCylinderMaterial)
        .to({ opacity: 1 }, 10000)
        .easing(TWEEN.Easing.Quadratic.In)

    scene.add(darkCylinder)
    showDark.start()

    scene.add(parallelCylinder)
    showParallel.start().onComplete(async() => showCredits())
}

/**
 * Show credits
 */
async function showCredits() {
    await new Promise(resolve => {
        setTimeout(() => {
            document.getElementById('outro').style.visibility = "visible"
            document.getElementById('outro').style.zIndex = "9999"
            document.getElementById('outro').className = 'fadeIn'
            resolve()
        }, 4500)
    })
}

// THREE.js part
const scene = new THREE.Scene()
window.scene = scene

const renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance", antialias: false, stencil: false, depth: false })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xffffff, 0)
renderer.domElement.id = 'wormhole'
    //renderer.domElement.className = 'fadeOut'

document.body.appendChild(renderer.domElement)
try { hideCursorOnInactivity() } catch (error) { console.error(error) }

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 0
camera.position.y = 10
camera.position.z = 0
camera.lookAt(0, 0, 0)

const commonCylinderGeometry = new THREE.CylinderBufferGeometry(1, 1, 20, 12, 0, true)

// dark space full of stars - background cylinder
const darkCylinderTexture = new THREE.TextureLoader().load('/images/dark.jpg')
darkCylinderTexture.wrapS = THREE.RepeatWrapping
darkCylinderTexture.wrapT = THREE.MirroredRepeatWrapping
darkCylinderTexture.repeat.set(1, 1)
const darkCylinderMaterial = new THREE.MeshLambertMaterial({
    side: THREE.BackSide,
    map: darkCylinderTexture,
    blending: THREE.AdditiveBlending,
    opacity: darkOpacity.value
})
const darkCylinder = new THREE.Mesh(commonCylinderGeometry, darkCylinderMaterial)

// colourfull space full of nebulas - main universe cylinder
const colorFullCylinderTexture = new THREE.TextureLoader().load('/images/colorfull.jpg')
colorFullCylinderTexture.wrapS = THREE.RepeatWrapping
colorFullCylinderTexture.wrapT = THREE.MirroredRepeatWrapping
colorFullCylinderTexture.repeat.set(1, 1)
const colorFullCylinderMaterial = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    map: colorFullCylinderTexture,
    blending: THREE.AdditiveBlending,
    opacity: colorFullOpacity.value
})
const colorFullCylinder = new THREE.Mesh(commonCylinderGeometry, colorFullCylinderMaterial)

// water - hyperspace cylinder
const waterCylinderTexture = new THREE.TextureLoader().load('/images/water.jpg')
waterCylinderTexture.wrapS = THREE.RepeatWrapping
waterCylinderTexture.wrapT = THREE.MirroredRepeatWrapping
waterCylinderTexture.repeat.set(1, 1)
const waterCylinderMaterial = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    map: waterCylinderTexture,
    blending: THREE.AdditiveBlending,
    opacity: waterOpacity.value
})
const waterCylinder = new THREE.Mesh(commonCylinderGeometry, waterCylinderMaterial)

// light cylinder - near horizon cylinder
const lightCylinderTexture = new THREE.TextureLoader().load('/images/light.jpg')
lightCylinderTexture.wrapS = THREE.RepeatWrapping
lightCylinderTexture.wrapT = THREE.MirroredRepeatWrapping
lightCylinderTexture.repeat.set(1, 1)
const lightCylinderMaterial = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    map: lightCylinderTexture,
    blending: THREE.AdditiveBlending,
    opacity: lightOpacity.value
})
const lightCylinder = new THREE.Mesh(commonCylinderGeometry, lightCylinderMaterial)

// parallel cylinder - parallel universe cylinder
const parallelCylinderTexture = new THREE.TextureLoader().load('/images/parallel.jpg')
parallelCylinderTexture.wrapS = THREE.RepeatWrapping
parallelCylinderTexture.wrapT = THREE.MirroredRepeatWrapping
parallelCylinderTexture.repeat.set(1, 1)
const parallelCylinderMaterial = new THREE.MeshLambertMaterial({
    side: THREE.BackSide,
    map: parallelCylinderTexture,
    blending: THREE.AdditiveBlending,
    opacity: parallelOpacity.value
})
const parallelCylinder = new THREE.Mesh(commonCylinderGeometry, parallelCylinderMaterial)

const light = new THREE.AmbientLight(0xFFFFFF, 1)

scene.add(darkCylinder)
scene.add(colorFullCylinder)
scene.add(light)

// handling horizon => this will be highly animated by godrays effect at post processing
const horizonMaterial = new THREE.MeshBasicMaterial({ opacity: 1 })
const horizonGeometry = new THREE.SphereBufferGeometry(0.25, 32, 32)
const horizon = new THREE.Mesh(horizonGeometry, horizonMaterial)
horizon.frustumCulled = false
horizon.matrixAutoUpdate = false
scene.add(horizon)

// handling post processing process
// godrays and bloom effects are added to the renderer
const godRaysEffectOptions = {
    height: 480,
    blendFunction: POSTPROCESSING.BlendFunction.ADD,
    color: 0x000000,
    kernelSize: POSTPROCESSING.KernelSize.SMALL,
    density: 1.2,
    decay: 0.92,
    weight: 1,
    exposure: 0.8,
    samples: 60,
    clampMax: 1.0
}
const godRaysEffect = new POSTPROCESSING.GodRaysEffect(camera, horizon, godRaysEffectOptions)
const bloomEffect = new POSTPROCESSING.BloomEffect({ blendFunction: POSTPROCESSING.BlendFunction.ADD, kernelSize: POSTPROCESSING.KernelSize.SMALL })
bloomEffect.blendMode.opacity.value = 4

// using a global variable because effects will be highly animated during the experience
effectPass = new POSTPROCESSING.EffectPass(camera, bloomEffect, godRaysEffect)
effectPass.renderToScreen = true

const composer = new POSTPROCESSING.EffectComposer(renderer)
composer.addPass(new POSTPROCESSING.RenderPass(scene, camera))
composer.addPass(effectPass)

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    composer.setSize(window.innerWidth, window.innerHeight)
    camera.updateProjectionMatrix()
})

function animate(time) {
    if (needRender) {
        TWEEN.update(time)

        darkCylinder.rotation.y += globalRotation.value
        darkCylinderTexture.offset.y -= darkMoveForward.value
        darkCylinderTexture.offset.x -= darkTextureRotation.value

        colorFullCylinder.rotation.y += globalRotation.value
        colorFullCylinderTexture.offset.y -= colorFullMoveForward.value
        colorFullCylinderTexture.offset.x -= colorFullTextureRotation.value

        waterCylinder.rotation.y += globalRotation.value
        waterCylinderTexture.offset.y -= waterMoveForward.value
        waterCylinderTexture.offset.x -= waterTextureRotation.value

        lightCylinder.rotation.y += globalRotation.value
        lightCylinderTexture.offset.y -= lightMoveForward.value
        lightCylinderTexture.offset.x -= lightTextureRotation.value

        parallelCylinder.rotation.y += globalRotation.value
        parallelCylinderTexture.offset.y -= parallelMoveForward.value
        parallelCylinderTexture.offset.x -= parallelTextureRotation.value

        composer.render()
    }
    requestAnimationFrame(animate)
}

animate()