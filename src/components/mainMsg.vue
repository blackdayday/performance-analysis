<template>
  <div class="msg">
      <div class="main">
          <el-tabs tab-position="left"  style="">
               <el-tab-pane label="个人信息">
                 <message></message>
               </el-tab-pane>
               <el-tab-pane label="地址管理">
                   <ad></ad>
               </el-tab-pane>
         </el-tabs>
      </div>
    
  </div>
</template>

<script>
import message from './dog/message.vue'
import ad from'./dog/ad.vue'
export default {
    data(){
        return{

        }
    },
    components:{
        message,
        ad,
    }
}
</script>

<style>
    .main{
        display: flex;
        justify-content: center;
    }
</style>