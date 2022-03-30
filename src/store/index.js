import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store=new Vuex.Store({
  //全局变量
  state:{
    user: undefined,
    isLogined: false,
    name: '',
    token:undefined,
    params:undefined,

  },
  // 修改全局变量必须通过mutations中的方法
  // mutations只能采用同步方法
  mutations:{
    refreshState(state){
      state.isLogined=sessionStorage.getItem("isLogined");
      state.name=sessionStorage.getItem("name");
      state.token=sessionStorage.getItem("token");
    },
    login(state,data){
      var user=data.user;
      var token=data.token;
      var name=data.name;
      state.user=user;
      state.isLogined=true;
      state.token=token;
      state.name=name;
      window.sessionStorage.setItem("name",name);
      window.sessionStorage.setItem("token",token);
      window.sessionStorage.setItem("isLogined",true);
      console.log(state)
      console.log("state")
    },
    logout(state){
      state.user=undefined;
      state.isLogined=false;
      state.name='';
      state.token=undefined;
      window.sessionStorage.removeItem("isLogined");
      window.sessionStorage.removeItem("name");
      window.sessionStorage.removeItem("token");
    },
    getUser(state){
      return state.user
    },
    setUser(state,user){
      state.user=user;
    },
    getIsLogined(state){
      //state.isLogined=window.sessionStorage.getItem("isLogined");
      return state.isLogined;
    },
    setIsLogined(state,isLogined){
      //window.sessionStorage.setItem("isLogined",isLogined);
      state.isLogined=isLogined;
    },
    getName(state){
      //state.name=window.sessionStorage.getItem("name");
      return state.name();
    },
    setName(state,name){
      //window.sessionStorage.setItem("name",name);
      state.name=name;
    },
    getToken(state){
      //state.token=window.sessionStorage.getItem("token");
      return state.token;
    },
    setToken(state,token){
      //window.sessionStorage.setItem("token",token);
      state.token=token;
    },
    getParams(state){
      return state.params;
    },
    setParams(state,params){
      state.params=params;
    }

  },
  getters: {
    getUser(state){
      return state.user
    },
    getIsLogined(state){
      //state.isLogined=window.sessionStorage.getItem("isLogined");
      return state.isLogined;
    },
    getName(state){
      //state.name=window.sessionStorage.getItem("name");
      return state.name;
    },
    getParams(state){
      return state.params;
    },
    getToken(state){
      //state.token=window.sessionStorage.getItem("token");
      return state.token;
    },
  },
  // 异步方法用actions
  // actions不能直接修改全局变量，需要调用commit方法来触发mutation中的方法
  actions: {
    login (context, user,name,token) {
        context.commit('login',user,name,payload)
    },
    logout (context) {
        context.commit('logout')
    }
  }
})
export default store;
