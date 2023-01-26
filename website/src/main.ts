import { createApp } from 'vue'
import VTypical from 'vue-typical'
import 'ununura.css'
import './style.css'
import App from './App.vue'

createApp(App).component('v-typical', VTypical).mount('#app')
