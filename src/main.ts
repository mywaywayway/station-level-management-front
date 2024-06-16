import { createApp } from 'vue'
import './style.css'
import ECharts from 'vue-echarts'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "./router";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import  'echarts'

createApp(App)
.component('v-chart', ECharts)
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus)

app.use(router)
app.mount('#app')