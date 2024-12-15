import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import { OrbitControls } from 'three-stdlib'
import { Sky } from 'three/addons/objects/Sky.js'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75, // Field of View
  window.innerWidth / window.innerHeight, // Aspect Ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Add a light to the scene
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(2, 1, 1)
scene.add(light)

const sky = new Sky()
sky.scale.setScalar(450000)

const phi = THREE.MathUtils.degToRad(90)
const theta = THREE.MathUtils.degToRad(90)
const sunPosition = new THREE.Vector3().setFromSphericalCoords(1, phi, theta)

sky.material.uniforms.sunPosition.value = sunPosition

scene.add(sky)

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.screenSpacePanning = true
controls.minDistance = 1 // Minimum zoom distance
controls.maxDistance = 50 // Maximum zoom distance

const loader = new GLTFLoader()

loader.load(
  '/hot_air_balloon.glb', // Path to the GLB file
  (gltf) => {
    // Add the loaded model to the scene
    scene.add(gltf.scene)
  },
  (progress) => {},
  (error) => {
    console.error('An error occurred while loading the GLB file:', error)
  }
)

// Animate the scene
const animate = () => {
  requestAnimationFrame(animate)

  controls.update()
  renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
