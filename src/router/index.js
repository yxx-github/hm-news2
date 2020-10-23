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
import MyStar from '../views/MyStar.vue'
import Home from '../views/Home.vue'
import Detail from '../views/Detail.vue'
import TabsEdit from '../views/TabsEdit.vue'

// 注册
Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由规则
  routes: [{
      // 重定向
      path: '/',
      redirect: '/home'
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
    },
    {
      path: '/mystar',
      component: MyStar
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/detail/:id',
      component: Detail
    },
    {
      path: '/tabsedit',
      component: TabsEdit
    }
  ]
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const authPath = ['/user', '/edit', '/myfollow', '/mycomment', '/mystar']

  if (authPath.includes(to.path)) {
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