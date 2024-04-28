import {createRouter, createWebHistory} from "vue-router";
import LoginView from "../components/LoginView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },

    {
      path:'/',
      name:'login',
      component:LoginView
    },
    {
        path:'/employeeHome/:userid',
        name:'employeeHome',
           component:()=> import('@/components/Employee/Home.vue')
    },
      {
          path:'/employeeInfo/:userid',
          name:'employeeInfo',
          component:()=> import('@/components/Employee/PersonInfoView.vue')
      },
      {
          path:'/BillManagement/:userid',
          name:'BillManagement',
          component:()=> import('@/components/Employee/BillManagementView.vue')
      },
      {
          path:'/signIn/:userid',
          name:'signIn',
          component:()=> import('@/components/Employee/SignInView.vue')
      },
      {
          path:'/goThrough/:userid',
          name:'goThrough',
          component:()=> import('@/components/Employee/GoThroughView.vue')
      },

  ]
})
export default router

