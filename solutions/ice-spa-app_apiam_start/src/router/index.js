import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Error from '@/components/Error'
import Promo from '@/components/Promo'
import Profile from '@/components/Profile'
import LoginForm from '@/components/LoginForm'
import { validateAccessLocal, validateAccessOkta, logoutLocal, logoutOkta, singleLogout, redirect, loginOkta, checkOktaSession } from '../auth'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    //Public pages
    { path: '*', redirect: '/home' }, //redirect to make sure you land in a page
    { path: '/home', component: Home }, //home page
    { path: '/loginform', component: LoginForm },
    { path: '/error', component: Error },
    //Private pages (displayed only user access is validated)
    { path: '/premium-promos', beforeEnter: validateAccessLocal, component: Promo },
    { path: '/profile', beforeEnter: validateAccessLocal, component: Profile },
    //Functions without page
    { path: '/login', component: loginOkta },
    { path: '/logoutLocal', component: logoutLocal },
    { path: '/redirect', component: redirect },
    { path: '/checkOktaSession', component: checkOktaSession },
    { path: '/logoutOkta', component: logoutOkta },
    { path: '/singleLogout', component: singleLogout }
  ]
})
