import Vue from 'vue'
import Router from 'vue-router'
import Prdigree from '@/views/prdigree'
import PrdigreePreview from '@/views/prdigree-preview'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/prdigree' : '',
  routes: [
    {
      path: '/',
      name:"index",
      component: Prdigree
    },
    {
      path: '/preview/:id',
      name:"preview",
      component: PrdigreePreview
    }
  ]
})
