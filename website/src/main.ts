import { createApp } from 'vue'
import { router } from './routes'
import VTypical from 'vue-typical'
import App from './App.vue'
import 'ununura.css'
import './style.css'

createApp(App).use(router).component('v-typical', VTypical).mount('#app')
