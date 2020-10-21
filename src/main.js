// 配置vue
import Vue from 'vue'
import App from './App.vue'

// 路由
import router from './router'

Vue.config.productionTip = false

// 引入公共样式
import './styles/base.less'
import './styles/iconfont.css'

// 引入lib-flexible
import 'lib-flexible'

// 引入子组件
import HmHeader from './components/HmHeader.vue'
// 注册全局组件
Vue.component('hm-header', HmHeader)

import HmLogo from './components/HmLogo.vue'
Vue.component('hm-logo', HmLogo)

import HmButton from './components/HmButton.vue'
Vue.component('hm-button', HmButton)

import HmPost from './components/HmPost.vue'
Vue.component('hm-post', HmPost)

import HmComment from './components/HmComment.vue'
Vue.component('hm-comment', HmComment)

import HmFloor from './components/HmFloor.vue'
Vue.component('hm-floor', HmFloor)

import {
  Field,
  Toast,
  Cell,
  CellGroup,
  Dialog,
  Radio,
  RadioGroup,
  Uploader,
  List,
  Tab,
  Tabs,
  PullRefresh,
  Sticky,
  Icon
} from 'vant'
Vue.use(Field)
Vue.use(Toast)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Uploader)
Vue.use(List)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(PullRefresh)
Vue.use(Sticky)
Vue.use(Icon)

// 注册全局过滤器
import moment from 'moment'
Vue.filter('date', (val, format = 'YYYY-MM-DD') => {
  return moment(val).format(format)
})

// 处理 axios 把 axios 挂到 Vue原型上

import axios from 'axios'
Vue.prototype.$axios = axios
// 基准地址
axios.defaults.baseURL = 'http://localhost:3000'

// 请求拦截器
axios.interceptors.request.use(config => {
  let token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

// 响应拦截器
axios.interceptors.response.use(res => {
  const {
    statusCode,
    message
  } = res.data
  if (statusCode === 401 && message === '用户信息验证失败') {
    // 将本地失效的toekn删除
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')

    // 跳转到login
    router.push('/login')
  }

  return res
})

// 创建bus实例 （事件总线）
const bus = new Vue()
Vue.prototype.$bus = bus // 挂载到原型上


// 搭建vue实例
new Vue({
  // 挂载路由
  router,
  render: h => h(App)
}).$mount('#app')