import './style.css'
import * as T from "three"
import gsap from "gsap";
import { OrbitControls, Reflector, TextGeometry, FontLoader } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';;
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { TextureLoader } from "three";
import { DRACOLoader } from 'three/examples/jsm/Addons.js';
import RajdHani from "./RajdHani.json"

const font2 = new FontLoader().parse(RajdHani)
const scene = new T.Scene();
const camera = new T.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
const loader = new GLTFLoader().setPath("./coffee/");
const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
const draco = new DRACOLoader()
draco.setDecoderPath('/examples/jsm/libs/draco/');
loader.setDRACOLoader(draco)

const textGeometry2 = new TextGeometry('Design By Almubdieuntech.', {
  font: font2,
  size: 5,
  depth: 0.6,
});
textGeometry2.computeBoundingBox();
const textMat = new T.MeshStandardMaterial({ color: 0xffff00 })
const textMesh = new T.Mesh(textGeometry2, textMat)
textMesh.position.set(-59, 10, -35)
textMesh.rotation.y = -1.55

scene.add(textMesh)

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

camera.position.set(-120, 150, 70)

let elem = document.createElement('div');
elem.className = "flex absolute h-[100dvh] items-center justify-center md:left-[20%] md:right-[20%] left-0 right-0"
elem.id = "wrapper"
elem.innerHTML = `
    <div
      class="flex md:flex-row flex-col relative bg-[#1d1f39] z-[26] h-fit rounded-[20px] flex-wrap transition-all duration-300"
      id="popframe">
      <form onsubmit="start()" class="flex flex-col px-5 py-1 justify-center items-center md:text-[16px] text-[10px] w-full">
        <label class="py-2 text-white" for="name">Name of Restaurant</label>
        <input type="text" name="name" class="px-2 py-1 border-zinc-500 border-2 rounded-[5px] text-black" id="name" required>
        <button
          class="text-[40px] text-white hover:text-violet-600" type="submit">
          Start</button>
      </form>
    </div>
    `
document.getElementById("startSection").appendChild(elem)

document.addEventListener("DOMContentLoaded", () => {
  window.start = () => {
    event.preventDefault();
    const textGeometry = new TextGeometry(event.target[0].value, {
      font: font2,
      size: 3,
      depth: 0.6,
    });
    textGeometry.computeBoundingBox();
    const textMat2 = new T.MeshStandardMaterial({ color: 0xffff00 })
    const textMesh2 = new T.Mesh(textGeometry, textMat2)
    textMesh2.position.set(11, 14, 10)
    textMesh2.rotation.y = 1.55
    const textMesh3 = new T.Mesh(textGeometry, textMat2)
    textMesh3.position.set(4, 68, 10)
    textMesh3.rotation.y = 1.55

    scene.add(textMesh2)
    scene.add(textMesh3)
    audio.setAttribute('src', "CityCrowd.mp3")
    audio.play()
    document.querySelector("#startSection").classList.add("hidden")
    gsap.to(camera.position, {
      x: 180,
      y: 8,
      z: 140,
      duration: 6,
      ease: "expo.inOut",
      onStart: () => controls.enabled = false,
      onComplete: () => controls.enabled = true,
    },)
    gsap.to(controls.target, {
      x: 0,
      y: 13,
      z: 0,
      duration: 5,
      ease: "expo.inOut",
      onStart: () => controls.enabled = false,
      onComplete: () => controls.enabled = true,
      onUpdate: function () {
        controls.update()
      }
    })
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

let mixer, clock;
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

loader.load("shop design Ai 01 GLTF.gltf", function (gltf) {
  var mesh = gltf.scene;
  mesh.scale.set(0.2, 0.2, 0.2);
  const planeGeo = new T.PlaneGeometry(450, 450)
  const reflector = new Reflector(planeGeo, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777
  });

  console.log(mesh);
  // reflector.position.y = 1
  reflector.rotation.x = - Math.PI / 2;
  scene.add(reflector);
  mesh.position.set(0, 1, 0);
  mesh.traverseVisible((obj) => {
    if (obj.name == "SA_Obj126PIV") {
      obj.material.transparent = true;
      obj.material.opacity = 0.93;
    }
    if (obj.name == "SA_Obj20PIV") obj.layers.toggle(BLOOM_SCENE)
    if (obj.name == "SA_Obj30PIV") obj.layers.toggle(BLOOM_SCENE)
    if (obj.name == "polySurface25PIV") obj.layers.toggle(BLOOM_SCENE)
    if (obj.name == "SA_Obj95PIV") obj.layers.toggle(BLOOM_SCENE)
    if (obj.name == "SA_Obj49Shape_1") obj.layers.toggle(BLOOM_SCENE)
    if (obj.name == "SA_Obj19PIV") obj.layers.toggle(BLOOM_SCENE)
    if (obj.name == "SA_Obj135PIV") obj.layers.toggle(BLOOM_SCENE)
    if (obj.name == "polySurface29PIV") obj.layers.toggle(BLOOM_SCENE)
    if (obj.name == "SA_Obj11PIV") obj.layers.toggle(BLOOM_SCENE)
    if (obj.name == "SA_Obj10:PIV") obj.layers.toggle(BLOOM_SCENE)
    if (obj.name == "SA_Obj9:PIV") obj.layers.toggle(BLOOM_SCENE)
    if (obj.name == "SA_Obj8:PIV") obj.layers.toggle(BLOOM_SCENE)
    if (obj.name == "SA_Obj35PIV") obj.layers.toggle(BLOOM_SCENE)
    if (obj.name == "SA_Obj28Shape_1") obj.layers.toggle(BLOOM_SCENE)

    if (obj.name == "polySurface22PIV") {
      new TextureLoader().load("./images/Test.png", function (texture) {
        texture.wrapS = T.RepeatWrapping;
        texture.repeat.x = 1;
        texture.flipY = false;
        obj.material = new T.MeshStandardMaterial({ map: texture });
      })
      // obj.layers.toggle(BLOOM_SCENE)
    }
    // if (obj.name == "SA_Obj29PIV") {
    //   const box = new T.Box3().setFromObject(obj);
    //   const center = box.getCenter(new T.Vector3());

    //   // Re-center the model
    //   obj.position.sub(center);
    //   pivot.add(obj)
    // }
  })
  mixer = new T.AnimationMixer(mesh);
  gltf.animations.forEach((clip) => {
    mixer.clipAction(clip).play();
  });
  clock = new T.Clock()
  animate()
  scene.add(mesh)
  loading()
})

loader.setPath("./mug/");
let points, points2, group;
loader.load("shop design Ai 02.gltf", function (gltf) {
  const mesh = gltf.scene;

  mesh.scale.set(0.35, 0.35, 0.35);
  mesh.position.set(-225, 3, 65)
  mesh.traverse(obj => {
    if (obj.name == "Obj41PIV") {
      const geo5 = obj.geometry;
      const posAtr = geo5.attributes.position;
      const positions = posAtr.array; // Directly access the array
      const vertices = [];

      for (let i = 0; i < posAtr.count; i++) {
        vertices.push({
          x: posAtr.getX(i),
          y: posAtr.getY(i),
          z: posAtr.getZ(i)
        });
      }

      const pointGeometry = new T.BufferGeometry();
      pointGeometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
      const pointMaterial = new T.PointsMaterial({ color: 0x00ffff, size: 0.05 });
      points = new T.Points(pointGeometry, pointMaterial);
      points.scale.set(0.35, 0.35, 0.35)
      points.position.set(-18, 87, 5)
      points.layers.toggle(BLOOM_SCENE)
      points.name = "points"

      pointGeometry.computeBoundingBox();
      var boundingBox = pointGeometry.boundingBox;
      var center = new T.Vector3(-18, 87, 5);
      boundingBox.getCenter(center);

      // Center the pointGeometry around the origin
      pointGeometry.translate(-center.x, -center.y, -center.z);
      scene.add(points);
    }
  })
  // scene.add(mesh)
})

loader.setPath("./TextModels/")
loader.load("Text.gltf", function (gltf) {
  const mesh = gltf.scene
  mesh.rotation.y = 1.6
  mesh.position.x = 90
  mesh.scale.set(0.55, 0.55, 0.55)
  console.log(mesh);
  for (let i = 0; i < mesh.children.length; i++) {

    const geo5 = mesh.children[i].children[0].geometry;
    const posAtr = geo5.attributes.position;
    const positions = posAtr.array; // Directly access the array
    const vertices = [];

    for (let i = 0; i < posAtr.count; i++) {
      vertices.push({
        x: posAtr.getX(i),
        y: posAtr.getY(i),
        z: posAtr.getZ(i)
      });
    }

    const pointGeometry = new T.BufferGeometry();
    pointGeometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    const pointMaterial = new T.PointsMaterial({ color: 0xe18a2d, size: 0.05 });
    points2 = new T.Points(pointGeometry, pointMaterial);
    points2.scale.set(0.75, 0.75, 0.75)
    points2.position.set(90, 0, 0)
    points2.rotation.y = 1.6
    // points2.layers.toggle(BLOOM_SCENE)
    points2.name = "points" + (i + 1)
    scene.add(points2);
  }
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
controls.enablePan = false
controls.minPolarAngle = 1;
controls.maxPolarAngle = 1.5;
controls.minDistance = 0;
controls.maxDistance = 2400;
controls.rotateSpeed = 0.5;
controls.update()
const spl = new T.SpotLight(0xe1ceb2, 10000000, 530, Math.PI / 2 + 1.2, 0.4)
spl.position.set(0, 450, 0)
spl.target.position.set(0, 2, 0)
scene.add(spl)
// const splH = new T.SpotLightHelper(spl)
// scene.add(splH)
const dl = new T.DirectionalLight(0xffffff, 0.75)
camera.add(dl)
scene.add(camera)

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
    // intersections[0].object.layers.toggle(BLOOM_SCENE)
    if (intersections[0].object.name == "points") {
      const geo5 = intersections[0].object.geometry;
      const posAtr = geo5.attributes.position;
      const positions = posAtr.array; // Directly access the array
      const vertices = [];

      for (let i = 0; i < posAtr.count; i++) {
        vertices.push({
          x: posAtr.getX(i),
          y: posAtr.getY(i),
          z: posAtr.getZ(i)
        });
      }
      vertices.forEach((vertex, i) => {
        const originalY = vertex.y;
        const originalZ = vertex.z

        gsap.to(vertex, {
          duration: 1.4,
          y: -25, // animate to a new random y position
          z: Math.random() * 40 - 20,
          yoyo: true, // animate back to the original position
          onUpdate: () => {
            // Update the positions in the geometry
            positions[i * 3 + 2] = vertex.z;
            positions[i * 3 + 1] = vertex.y;
            geo5.attributes.position.needsUpdate = true;
          }
        });
        gsap.to(vertex, {
          duration: 1.4,
          y: originalY, // animate to a new random y position
          z: originalZ,
          yoyo: true, // animate back to the original position
          delay: 1.4,
          onUpdate: () => {
            // Update the y position in the geometry
            positions[i * 3 + 2] = vertex.z;
            positions[i * 3 + 1] = vertex.y;
            geo5.attributes.position.needsUpdate = true;
          }
        });
      });
    }
    if (intersections[0].object.name == "points4") {
      click.play()
      whoosh.play()
      gsap.to(camera.position, {
        x: 17,
        y: 15.5,
        z: -83,
        duration: 5,
        ease: "expo.inOut",
        onStart: () => controls.enabled = false,
        onComplete: () => controls.enabled = true,
      },)
      gsap.to(controls.target, {
        x: -1,
        y: 7,
        z: -86,
        duration: 5,
        ease: "expo.inOut",
        onStart: () => controls.enabled = false,
        onComplete: () => controls.enabled = true,
      })
    }
    if (intersections[0].object.name == "points1") {
      click.play()
      whoosh.play()
      gsap.to(camera.position, {
        x: -28.5,
        y: 85,
        z: -85,
        duration: 5,
        ease: "expo.inOut",
        onStart: () => controls.enabled = false,
        onComplete: () => controls.enabled = true,
      },)
      gsap.to(controls.target, {
        x: -28.5,
        y: 85,
        z: 0,
        duration: 5,
        ease: "expo.inOut",
        onStart: () => controls.enabled = false,
        onComplete: () => controls.enabled = true,
      })
    }
    if (intersections[0].object.name == "points3") {
      click.play()
      whoosh.play()
      gsap.to(camera.position, {
        x: 360,
        y: 5,
        z: 0,
        duration: 5,
        ease: "expo.inOut",
        onStart: () => controls.enabled = false,
        onComplete: () => controls.enabled = true,
      },)
      gsap.to(controls.target, {
        x: 0,
        y: 5,
        z: 0,
        duration: 5,
        ease: "expo.inOut",
        onStart: () => controls.enabled = false,
        onComplete: () => controls.enabled = true,
      })
    }
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

// function addStars() {
//   const geometry = new T.SphereGeometry(0.3, 0.3, 0.3);
//   const mat = new T.MeshStandardMaterial({ color: 0xffffff })
//   const starsMesh = new T.Mesh(geometry, mat)
//   starsMesh.name = "star1";

//   const [x, z] = Array(2).fill().map(() => T.MathUtils.randFloatSpread(450))
//   const [y] = Array(1).fill().map(() => T.MathUtils.randFloatSpread(200))

//   starsMesh.position.set(x, 200 + y, z);
//   scene.add(starsMesh);
// }

// Array(1000).fill().forEach(addStars)

// scene.traverseVisible(obj => {
//   if (obj.name == "star1") {
//     const [y] = Array(1).fill().map(() => T.MathUtils.randFloatSpread(200))
//     obj.position.y = 200 + y
//     setTimeout(() => {
//       // gsap.to(obj.position, {
//       //   y: 3,
//       //   duration: 6,
//       //   yoyo: true
//       // })
//     }, 100)
//   }
// })

let particles, pos = [], vel = [], isSnowing = false, isRaining = false, hasFlowers = false, rain, rainGeo, rainCount = 1600;
const numSnowflakes = 1600;
const maxRange = 500, minRange = maxRange / 2;
const minHeight = 75;

const geo6 = new T.BufferGeometry();
window.addSnow = () => {
  if (isSnowing || isRaining || hasFlowers) {
    scene.remove(particles)
    pos = [];
    vel = [];
    isSnowing = false;
    isRaining = false;
    hasFlowers = false;
  } else if (!isSnowing) {
    for (let i = 0; i < numSnowflakes; i++) {
      pos.push(
        Math.floor(Math.random() * maxRange - minRange),
        Math.floor(Math.random() * minRange + minHeight),
        Math.floor(Math.random() * maxRange - minRange))

      vel.push(
        Math.floor(Math.random() * 3 - 1.5) * 0.1,
        1,
        Math.floor(Math.random() * 3 - 1.5) * 0.1)
    }
    geo6.setAttribute("position", new T.Float32BufferAttribute(pos, 3))
    geo6.setAttribute("velocity", new T.Float32BufferAttribute(vel, 3))

    const flakeMat = new T.PointsMaterial({
      size: 2,
      map: new TextureLoader().load("images/12.png"),
      blending: T.AdditiveBlending,
      depthTest: true,
      transparent: true,
      opacity: 0.7
    })
    particles = new T.Points(geo6, flakeMat);
    scene.add(particles)
    isSnowing = true;
    isRaining = false;
    hasFlowers = false;
  }
}

function updateParticles() {
  if (particles) {
    for (let i = 0; i < numSnowflakes * 3; i += 3) {
      particles.geometry.attributes.position.array[i] -= particles.geometry.attributes.velocity.array[i];
      particles.geometry.attributes.position.array[i + 1] -= particles.geometry.attributes.velocity.array[i + 1];
      particles.geometry.attributes.position.array[i + 2] -= particles.geometry.attributes.velocity.array[i + 2];
      if (particles.geometry.attributes.position.array[i + 1] < 0) {
        particles.geometry.attributes.position.array[i] = Math.floor(Math.random() * maxRange - minRange);
        particles.geometry.attributes.position.array[i + 1] = Math.floor(Math.random() * minRange + minHeight);
        particles.geometry.attributes.position.array[i + 2] = Math.floor(Math.random() * maxRange - minRange);
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;
  }
}


window.addRain = () => {
  if (isRaining || isSnowing || hasFlowers) {
    scene.remove(particles)
    pos = [];
    vel = [];
    isRaining = false;
    isSnowing = false;
    hasFlowers = false;
  } else if (!isRaining) {
    for (let i = 0; i < rainCount; i++) {
      pos.push(
        Math.floor(Math.random() * maxRange - minRange),
        Math.floor(Math.random() * minRange + minHeight),
        Math.floor(Math.random() * maxRange - minRange))

      vel.push(
        Math.floor(Math.random() * 3 - 1.5) * 0.001,
        5,
        Math.floor(Math.random() * 3 - 1.5) * 0.001)
    }
    geo6.setAttribute("position", new T.Float32BufferAttribute(pos, 3))
    geo6.setAttribute("velocity", new T.Float32BufferAttribute(vel, 3))

    const flakeMat = new T.PointsMaterial({
      size: 1,
      map: new TextureLoader().load("images/rain.png"),
      blending: T.AdditiveBlending,
      depthTest: true,
      transparent: true,
      opacity: 0.7
    })
    particles = new T.Points(geo6, flakeMat);
    scene.add(particles)
    isRaining = true;
    isSnowing = false;
    hasFlowers = false;
  }
}

window.addFlowers = () => {
  if (isRaining || isSnowing || hasFlowers) {
    scene.remove(particles)
    pos = [];
    vel = [];
    isRaining = false;
    isSnowing = false;
    hasFlowers = false;
  } else if (!hasFlowers) {
    for (let i = 0; i < rainCount; i++) {
      pos.push(
        Math.floor(Math.random() * maxRange - minRange),
        Math.floor(Math.random() * minRange + minHeight),
        Math.floor(Math.random() * maxRange - minRange))

      vel.push(
        Math.floor(Math.random() * 3 - 1.5) * 0.001,
        1,
        Math.floor(Math.random() * 3 - 1.5) * 0.001)
    }
    geo6.setAttribute("position", new T.Float32BufferAttribute(pos, 3))
    geo6.setAttribute("velocity", new T.Float32BufferAttribute(vel, 3))

    const flakeMat = new T.PointsMaterial({
      size: 1,
      map: new TextureLoader().load("images/rain.png"),
      blending: T.AdditiveBlending,
      depthTest: true,
      transparent: true,
      opacity: 0.7
    })
    particles = new T.Points(geo6, flakeMat);
    scene.add(particles)
    isRaining = true;
    isSnowing = false;
    hasFlowers = false;
  }
}

// addRain()

function animate() {
  requestAnimationFrame(animate);
  mixer.update(clock.getDelta());
  var elapsedTime = clock.getElapsedTime();

  // Define the rotation speed
  var rotationSpeed = 0.5; // Radians per second

  // Calculate the rotation angles for each axis
  var angle = rotationSpeed * elapsedTime;
  // console.log(camera.position);

  scene.traverse(obj => {
    if (obj.name == "polySurface26Shape") {
      obj.material.color.setHex("0x" + document.getElementById("color").value.slice(1))
      obj.material.blendColor.setHex("0x" + document.getElementById("color").value.slice(1))
      obj.material.map = null

    }
  })

  // Apply the rotation to the cube
  // points.rotation.x = angle; // Rotate around X axis
  points.rotation.y = angle; // Rotate around Y axis
  // points.rotation.z = angle;
  // console.log(camera.position);

  updateParticles();

  controls.update();

  scene.traverse(darkenNonBloomed);
  bloomComposer.render();
  scene.traverse(restoreMaterial);
  finalComposer.render();
  // camera.updateProjectionMatrix()
}