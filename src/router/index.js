import Vue from 'vue'
import Router from 'vue-router'

// Containers
const Calendar = () => import('@/components/Calendar')
Vue.use(Router)

export default new Router({
  mode: 'history', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    {
      path: '/',
      redirect: '/calendar',
      name: 'Home',
      component: Calendar,
    }
  ]
}