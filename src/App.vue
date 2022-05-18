<template>
  <div id="app" style="display: flex; flex-direction: column;">
    <!-- <img :src="imglocation"  width="100%" height="100%" style="z-index:-1;position: absolute;"> -->
    <el-container>
      <el-header class="header" style="height: 60px;">
        <h3>成绩分析系统</h3>
        <h4 v-if="isLogined">
          欢迎你：
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{name}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">修改密码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <a href="javascript:void(0)" style="color:#808080" @click="to_logout">注销</a>
        </h4>
      </el-header>
      <el-main class="main">
        <router-view class="main"/>
      </el-main>
    </el-container>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="旧密码" label-width="100px" prop="oldPwd">
          <el-input type="password" v-model="form.oldPwd" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="100px" prop="newPwd">
          <el-input type="password" v-model="form.newPwd" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="密码确认" label-width="100px" prop="pwd2">
          <el-input type="password" v-model="form.pwd2" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changPwd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState,mapMutations} from 'vuex';
  export default {
  name: 'App',
  data() {
    var checkPwd=(rule,value,callbacck)=>{
        if(!value){
          return callbacck(new Error('密码确认不能为空'));
        }
        setTimeout(()=>{
          if(value!== this.form.newPwd){
            return callbacck(new Error('两次输入的密码不一致'));
          }else{
            callbacck();
          }
        },100);
    };
    return {
      dialogVisible:false,
      imglocation:require("@/assets/bg.png"),
      form:{
        oldPwd:'',
        newPwd:'',
        pwd2:''
      },
      rules:{
        oldPwd:[{required:true,message:'旧密码不能为空',trigger:'blur'}],
        newPwd:[{required:true,message:'新密码不能为空',trigger:'blur'}],
        pwd2:[{validator:checkPwd,trgger:'blur'},]
      }
    }
  },
  methods:{
    ...mapMutations(['logout']),
    to_logout(){
      this.$ajax.post('logout',{}).then(res=>{
        var result=res.data;
        //console.log(result);
        this.logout();
        this.$router.replace("/");
      })
    },
    handleCommand(commond){
      this.dialogVisible=true;
    },
    changPwd(){
      var form=this.$refs.form;
      form.validate(valid=>{
        if(valid){
          this.$ajax.post('changePwd',this.form).then(res=>{
            var result=res.data;
            this.$notify.warning({message:res.data.msg,duration:2000});
            form.resetFields();
            this.dialogVisible=false;
            this.to_logout();
          });
        }
      })
    }
  },
  computed:{
    ...mapState(['isLogined','name'])
  }
}
</script>

<style>
  html,body,#app {
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }
  .header{
    background-color: #483D8B;
    color: white;
    flex-grow: 0;
  }

  .main {
    /* background: url("~@/assets/bg.png"); */
    /* background-color: #E1F3D8; */
    /* height: calc(100vh - 60px); */
    background: url("~@/assets/1.png"); 
    width: 100%;
    height: 100%;
    background-size: 1000px auto;
    flex-grow: 1;
  }
  
  .el-container{
    height: 100%;
  }
  .header h4{
    display: inline-block;
    float: right;
  }
  .header h3 {
    display: inline-block;
    width: auto;
  }
  .header h4 a {
    margin-left: 10px;
    margin-right: 20px;
  }
  .el-menu {
    border-right: 0rem;
  }
   .el-dropdown-link {
      cursor: pointer;
      color: white;
    }
</style>
