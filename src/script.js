import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Texture Loader
const textureLoader = new THREE.TextureLoader()

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

const venomBakedTexture = textureLoader.load('venom.jpg')
venomBakedTexture.flipY = false
venomBakedTexture.encoding = THREE.sRGBEncoding

const curtain1BakedTexture = textureLoader.load('curtain1.jpg')
curtain1BakedTexture.flipY = false
curtain1BakedTexture.encoding = THREE.sRGBEncoding

const curtain2BakedTexture = textureLoader.load('curtain2.jpg')
curtain2BakedTexture.flipY = false
curtain2BakedTexture.encoding = THREE.sRGBEncoding

const pisoBakedTexture = textureLoader.load('floor3.jpg')
pisoBakedTexture.flipY = false
pisoBakedTexture.encoding = THREE.sRGBEncoding

const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
const curtain1BakedMaterial = new THREE.MeshBasicMaterial({ map: curtain1BakedTexture })
const curtain2BakedMaterial = new THREE.MeshBasicMaterial({ map: curtain2BakedTexture })
const pisoBakedMaterial = new THREE.MeshBasicMaterial({ map: pisoBakedTexture })
const venomBakedMaterial = new THREE.MeshBasicMaterial({ map: venomBakedTexture })
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    roughness: 0.2,
    metalness: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    transmission: 0.9,
    ior: 1.5
})
const keysLightMaterial = new THREE.MeshBasicMaterial({ color: 0xFF3E07 })
const cpuLedLightMaterial = new THREE.MeshBasicMaterial({ color: 0xFF1900 })

gltfLoader.load(
    '/models/Room/bakedmodel.glb',
    (gltf) => {
        //Smooth shading to child and add to scene

        gltf.scene.traverse((child) => {
            child.material = bakedMaterial

            if (child.name.includes('vidrio')) {
                child.material = glassMaterial
            }
        })

        const floorMesh = gltf.scene.getObjectByName('piso')
        floorMesh.material = pisoBakedMaterial

        const venomMesh = gltf.scene.getObjectByName('venom')
        venomMesh.material = venomBakedMaterial

        const curtain1Mesh = gltf.scene.getObjectByName('cortina1')
        curtain1Mesh.material = curtain1BakedMaterial

        const curtain2Mesh = gltf.scene.getObjectByName('cortina2')
        curtain2Mesh.material = curtain2BakedMaterial

        const frontalRing1 = gltf.scene.getObjectByName('aroFrontal1')
        const frontalRing2 = gltf.scene.getObjectByName('aroFrontal2')
        const frontalRing3 = gltf.scene.getObjectByName('aroFrontal3')
        const topRing1 = gltf.scene.getObjectByName('aroSuperior1')
        const topRing2 = gltf.scene.getObjectByName('aroSuperior2')
        const backRing = gltf.scene.getObjectByName('aroTrasero')
        const keysLight = gltf.scene.getObjectByName('luzTeclas')
        const cpuLed = gltf.scene.getObjectByName('ledFrontal')

        cpuLed.material = cpuLedLightMaterial
        keysLight.material = keysLightMaterial

        scene.add(gltf.scene)

        // Animation
        // mixer = new THREE.AnimationMixer(gltf.scene)
        // const action = mixer.clipAction(gltf.animations[2])
        // action.play()
    }
)

/**
 * Floor
 */
// const floor = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(10, 10),
//     new THREE.MeshStandardMaterial({
//         color: '#444444',
//         metalness: 0,
//         roughness: 0.5
//     })
// )
// floor.receiveShadow = true
// floor.rotation.x = - Math.PI * 0.5
// scene.add(floor)

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
// scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.camera.left = - 7
// directionalLight.shadow.camera.top = 7
// directionalLight.shadow.camera.right = 7
// directionalLight.shadow.camera.bottom = - 7
// directionalLight.position.set(- 5, 5, 0)
// scene.add(directionalLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
// directionalLight.position.set(5, 5, 5)
// scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#010101')
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Model animation
    if (mixer) {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()