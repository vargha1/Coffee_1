import './style.css'
import * as T from "three"
import gsap from "gsap";
import { CSS3DObject, CSS3DRenderer, OrbitControls, Reflector, TextGeometry, FontLoader, Font } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';;
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { TextureLoader } from "three";
import { VideoTexture } from "three";
import HelvetikerFont from "three/examples/fonts/helvetiker_regular.typeface.json";

const scene = new T.Scene();
const camera = new T.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000)
const loader = new GLTFLoader().setPath("./coffee/");
const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// renderer.toneMapping = T.CineonToneMapping
// renderer.toneMappingExposure = 1.5
// renderer.outputColorSpace = T.SRGBColorSpace
renderer.domElement.classList.add("absolute")

var click = new Audio('Sounds/click.mp3');
var whoosh = new Audio("Sounds/whoosh.mp3")
var ding = new Audio("Sounds/ding.mp3")
const audio = document.querySelector("audio");
const darkMaterial = new T.MeshBasicMaterial({ color: 'black' });
const materials = {};

camera.position.set(1000, 350, 1000)

document.addEventListener("DOMContentLoaded", () => {
  window.start = () => {
    audio.setAttribute('src', "CityCrowd.mp3")
    audio.play()
    document.querySelector("#startSection").classList.add("hidden")
    // gsap.to(camera.position, {
    //   x: -18,
    //   y: 5,
    //   z: 45,
    //   duration: 1.4,
    //   ease: "none",
    //   onUpdate: function () {
    //     controls.target = new T.Vector3(0, 13, 0)
    //     controls.update()
    //   },
    // },)
    document.getElementById("canvasHolder").appendChild(renderer.domElement);
    click.play()
    whoosh.play()
    window.setTimeout(() => { ding.play() }, 1000)


    // window.setInterval(() => {
    //   scene.traverseVisible(obj => {
    //     if (obj.name == "rain") {
    //       gsap.to(obj.position, {
    //         y: 0,
    //         duration: 2,
    //         ease: "none",
    //       })
    //     }
    //   })
    //   scene.traverseVisible(obj => {
    //     if (obj.name == "rain") {
    //       const [y] = Array(1).fill().map(() => T.MathUtils.randFloatSpread(45))
    //       obj.position.y = 40 + y
    //     }
    //   })
    // }, 2005);
  }
})

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

loader.load("VR.gltf", function (gltf) {
  var mesh = gltf.scene;
  console.log(mesh);
  // mesh.traverseVisible((obj) => {
  //   obj.layers.set(0)
  // })
  mesh.position.set(0, 1, 0);
  scene.add(mesh)
  loading()
})

const BLOOM_SCENE = 1;
const bloomLayer = new T.Layers();
bloomLayer.set(BLOOM_SCENE);

const renderScene = new RenderPass(scene, camera);
const outputPass = new OutputPass();

const bloomPass = new UnrealBloomPass(new T.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0
bloomPass.strength = 0.5
bloomPass.radius = 0.2

const bloomComposer = new EffectComposer(renderer);
bloomComposer.renderToScreen = false;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const mixPass = new ShaderPass(
  new T.ShaderMaterial({
    uniforms: {
      baseTexture: { value: null },
      bloomTexture: { value: bloomComposer.renderTarget2.texture }
    },
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,
  }), 'baseTexture'
);
mixPass.needsSwap = true;

const finalComposer = new EffectComposer(renderer);
finalComposer.addPass(renderScene);
finalComposer.addPass(mixPass);
finalComposer.addPass(outputPass);

const controls = new OrbitControls(camera, renderer.domElement)
// controls.enablePan = false
controls.minPolarAngle = 1.1;
controls.maxPolarAngle = 1.73;
controls.minDistance = 0;
controls.maxDistance = 2400;
controls.rotateSpeed = 0.5;
controls.update()
const ambientLight = new T.AmbientLight(0xffffff, 1.5)
scene.add(ambientLight)
const spl = new T.SpotLight(0xffffff, 30000000, 1300, Math.PI / 2 + 1, 0.4)
spl.position.set(0, 950, 0)
spl.target.position.set(0, 2, 0)
scene.add(spl)
// const splH = new T.SpotLightHelper(spl)
// scene.add(splH)

const raycaster = new T.Raycaster()

window.addEventListener('pointerdown', onMouseDown)

function onMouseDown(event) {
  camera.updateProjectionMatrix()
  controls.update()
  const coords = new T.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) * 2 - 1),
  )
  raycaster.setFromCamera(coords, camera)

  let intersections = raycaster.intersectObjects(scene.children, true);
  if (intersections.length > 0) {
    console.log(intersections[0].object);
    intersections[0].object.layers.toggle(BLOOM_SCENE)
  }
}

function darkenNonBloomed(obj) {
  if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
    materials[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}

function restoreMaterial(obj) {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
}

document.getElementById("loadingScreen").classList.add("z-[20]");
document.getElementById("loadingScreen").innerHTML = `<img src="images/loading.gif" class="w-auto h-[200px]">`
function loading() {
  document.getElementById("loadingScreen").classList.add("hidden")
}

function animate() {
  requestAnimationFrame(animate);
  // const spin = scene.children[scene.children.length - 1].children[0].getObjectByName("SA_Obj29PIV")
  // spin.rotateOnAxis(new T.Vector3(1,0,0) , 1)
  controls.update()
  scene.traverse(darkenNonBloomed);

  bloomComposer.render();
  scene.traverse(restoreMaterial);
  finalComposer.render();
  // camera.updateProjectionMatrix()
}
animate()