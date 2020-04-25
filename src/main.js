import Vue from 'vue'
import App from './App.vue'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueScheduler from 'v-calendar-scheduler';
import VueSweetalert2 from 'vue-sweetalert2';
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'v-calendar-scheduler/lib/main.css';
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'sweetalert2/dist/sweetalert2.min.css';
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

Vue.config.productionTip = true

Vue.use(VueSweetalert2);
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(require('vue-moment'));
Vue.use(VueScheduler);
new Vue({ el: '#app', router, render: h => h(App) })
