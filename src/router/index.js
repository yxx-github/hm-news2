// 配置路由信息
import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入组件
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import Edit from '../views/Edit.vue'
import MyFollow from '../views/MyFollow.vue'
import MyComment from '../views/MyComment.vue'

// 注册
Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由规则
  routes: [{
      // 重定向
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/edit',
      name: 'edit',
      component: Edit
    },
    {
      path: '/myfollow',
      component: MyFollow
    },
    {
      path: '/mycomment',
      component: MyComment
    }
  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/user') {
    let token = localStorage.getItem('token')

    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})
// 导出
export default router