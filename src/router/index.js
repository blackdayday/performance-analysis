import Vue from 'vue'
import Router from 'vue-router'
// import Login from '../components/login.vue'
// import Main from '../components/main.vue'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
 return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/testMain',
      name:'testMain',
      component: ()=>import('../components/testMain.vue'),
      children:[{
        path:'/grade/peasonGradeList',
        name:'peasonGradeList',
        component:()=>import ('../components/grade/peasonGradeList.vue')
      },{
        path:'/grade/peasonClassGradeList',
        name:'peasonClassGradeList',
        component:()=>import('../components/grade/peasonClassGradeList.vue')
      }]
    },{
      path:'/',
      name: 'Login',
      component: ()=>import ('../components/mainMsg.vue')
    },{
      path:'/main',
      name:'Main',
      component: ()=>import ('../components/main.vue'),
      children:[{
        path:'/banji/manage',
        name: 'banjiManage',
        component:()=>import ('../components/banji/list1.vue'),
        children:[{
          path:'/banji/edit/',
          name:'banjiEdit',
          component:()=>import('../components/banji/edit.vue')
        }]
      },{
        path:'/course/manage',
        name:'courseManage',
        component:()=>import('../components/course/list2.vue'),
        children:[{
          path:'/course/edit/',
          name:'courseEdit',
          component:()=>import('../components/course/edit.vue')
        }]
      },{
        path:'/student/manage',
        name:'studentManage',
        component:()=>import('../components/student/list1.vue'),
      },{
        path:'/grade/classGradeManage',
        name:'classGradeManage',
        component:()=>import('../components/grade/classGradeManage.vue')
      },{
        path:'/grade/peasonGradeManage',
        name:'peasonGradeManage',
        component:()=>import('../components/grade/peasonGradeManage.vue')
      },{
        path:'/grade/classGradeList',
        name:'classGradeList',
        component:()=>import('../components/grade/classGradeList.vue')
      },{
        path:'/menu/manage',
        name:'menuManage',
        component:()=>import('../components/menu/manage.vue')
      }

      ]
    }
    /* {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    } */
  ]
})
