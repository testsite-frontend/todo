import { createRouter,createWebHashHistory,createWebHistory } from "vue-router"
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'
import Show from '../views/Show.vue'
import Edit from '../views/Edit.vue'
import NotFound from '../views/NotFound.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'


const routes = [
  { path: '/', component: Home },
  { path: '/show/:id', component: Show },
  { path: '/edit/:id', component: Edit },
  { path: '/:pathMatch(.*)*', component: NotFound },
  { path: '/register' , component : Register },
  { path: '/login' , component : Login }
]

const router = createRouter({
    history:createWebHistory(),
    routes,
})


 //ページ遷移前にチェック
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.user) { //ユーザー情報取得してチェック
    await auth.fetchUser()
  }

  //未ログインで/login,/register以外に遷移への遷移はリダイレクト
  if (!auth.user && to.path !== '/login' && to.path !== '/register') { 
    return '/login'
  }
})



export default router

