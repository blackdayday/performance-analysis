import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import store from '../store'
import router from '../router'

axios.defaults.baseURL="http://localhost:8081/";
Vue.prototype.$ajax=axios;


/* axios.defaults.headers = {
  "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
}; */

// request 拦截器
axios.interceptors.request.use(function(config){
  store.commit("refreshState");
  if(store.state.token){
      config.headers.Authorization=store.state.token;
  }

  if(config.method!='get'){
    var sendData = new FormData();
    var data=config.data;
    Object.keys(data).forEach(key => {
        sendData.append(key, data[key]);
    });
    config.data=sendData;
  }
  return config;
},function(error){
  return Promise.reject(error);
});

// response 拦截器
axios.interceptors.response.use(
response => {
  return response;
},
error => {
  //var logout=mapMutations(['logout']);
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // console.log(error.response);
        store.commit('logout');
        router.replace({
          path: "/",
          //query: { redirect: router.currentRoute.fullPath } //登录成功后跳入浏览的当前页面
        });
    }
  }
  return Promise.reject(error.response);
}
);
