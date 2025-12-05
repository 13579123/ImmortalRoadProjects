import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    name: 'RedeemCode',
    path: '/redeem-code',
    meta: {name: "兑换码设置" , enum: true},
    component: () => import('../views/redeem-code')
  },
  {
    name: 'ItemPage',
    path: '/item',
    meta: {name: "物品编辑" , enum: true},
    component: () => import('../views/item.vue')
  },
  {
    name: 'MapPage',
    path: '/map',
    meta: {name: "地图编辑" , enum: true},
    component: () => import('../views/map.vue')
  },
  {
    name: 'MapMonsterPage',
    path: '/map-monster',
    meta: {name: "地图怪物编辑" , enum: false},
    component: () => import('../views/map-monster.vue')
  },
  {
    name: 'MovementArt',
    path: '/movement-art',
    meta: {name: "招式预览" , enum: true},
    component: () => import('../views/movement-art.vue')
  },
  {
    name: 'MethodExercise',
    path: '/method-exercise',
    meta: {name: "功法编辑" , enum: true},
    component: () => import('../views/method-exercise.vue')
  },
  {
    name: 'FolkPrescription',
    path: '/folk-prescription',
    meta: {name: "丹药配方" , enum: true},
    component: () => import('../views/folk-prescription.vue')
  },
]


const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
