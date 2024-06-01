import {createRouter, createWebHistory} from "vue-router";




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path:'/',
      name:'login',
      component:()=> import('@/components/LoginView.vue')
    },
    {
        path:'/employeeHome/:userid',
        name:'employeeHome',
        component:()=> import('@/components/Employee/Home.vue')
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

      {
          path:'/employee/QuotaTicket/:userid',
          name:'quotaTicket',
          component:()=>import('@/components/Employee/QuotaTicketView.vue')
      },

      {
          path:'/employee/TollInvoice/:userid',
          name:'employeeTollInvoice',
          component:()=> import('@/components/Employee/TollInvoiceView.vue')
      },
      {
          path:'/employeeInfo/:userid',
          name:'employeeInfo',
          component:()=> import('@/components/Employee/EmployeeInfoView.vue')
      },
      {
          path:'/employee/application/:userid',
          name:'application',
          component:()=> import('@/components/Employee/ApplicationView.vue')
      },
      {
          path:'/management/signInManagement/:userid',
          name:'signInManagement',
            component:()=> import('@/components/Management/SignInManagementView.vue')
      },
      {
          path:'/management/applicationManagement/:userid',
            name:'applicationManagement',
          component:()=> import('@/components/Management/ApplicationManagementView.vue')
      },
      {
          path:'/systemManagement/employeeManagement/:userid',
          name:'employeeManagement',
          component:()=> import('@/components/SystemManagement/EmployeeManagementView.vue')
      },
      {
          path:'/systemManagement/applicationSystemManagement/:userid',
            name:'applicationSystemManagement',
            component:()=> import('@/components/SystemManagement/ApplicationSystemManagementView.vue')
      },
      {
          path:'/systemManagement/logsUserView/:userid',
            name:'logsUserView',
            component:()=> import('@/components/SystemManagement/LogsManagementView.vue')
      }

  ]
})
export default router

