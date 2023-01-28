<template>
  <div @click.prevent.stop="router.push('/')" class="flex[h-center v-center] style:cursor-pointer w:100% h:200px">
    <div id="canvas" class="z:0 flex[h-center v-center] bg:transparent w:100% h:200px" />
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
  const renderer = new THREE.WebGLRenderer({ alpha: true })

  renderer.setSize(200, 200)
  document.querySelector('#canvas')?.appendChild(renderer.domElement)

  const geometry = new THREE.IcosahedronGeometry(2, 0)
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 1,
    metalness: 1,
  })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  const light = new THREE.AmbientLight(0xcccccc)
  light.position.set(0, 0, 0)
  scene.add(light)
  const light2 = new THREE.PointLight(0x000000, 50, 2.0)
  light2.castShadow = true
  light2.position.set(0, 0, 0)
  light2.shadow.camera.near = 1
  light2.shadow.camera.far = 60
  light2.shadow.bias = -0.005
  scene.add(light2)
  const light3 = new THREE.DirectionalLight(0xffeedd)
  light3.position.set(0, 1, 1)
  const light4 = new THREE.DirectionalLight(0xffeedd)
  light4.position.set(0, 0, 10)
  const light5 = new THREE.DirectionalLight(0xffeedd)
  light5.position.set(10, 10, 10)
  scene.add(light3)

  camera.position.z = 5

  const animate = () => {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.002
    cube.rotation.y += 0.002

    renderer.render(scene, camera)
  }

  animate()
})
</script>
