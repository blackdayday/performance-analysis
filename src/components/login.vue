<template>
  
  <div class="logindemo" style="height:500px;width:1000px;margin: 0 auto;border:10px solid #FF7F50;background-color: beige;">
    <!-- <img :src="imglocation"  width="100%" height="100%" style="z-index:-1;position: absolute;"> -->
    <el-form ref="form" :model="user" :rules="rules" status-icon label-width="100px">
      <el-row type="flex" justify="center">
        <el-col :span="5">
          <el-form-item label-width="70px" style="width: 100%;">
            <span>
              <font style="width: 100%; text-align: center;" color="#606266" size="5">登 录</font>
            </span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :span="5">
          <el-form-item label="账户:" prop="name" >
            <el-input v-model="user.name" size="small"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :span="5">
          <el-form-item label="密码:" prop="password">
            <el-input type="password" v-model="user.password" size="small"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-form-item>
          <el-button style="padding: 12px 50px;" type="primary" @click="submit">登录</el-button>
          <!-- <el-button @click="register">注册</el-button> -->
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="center">
        <font color="pink" size="3">账户admin, 密码1234</font>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { mapState , mapMutations } from 'vuex';
  export default {
    name: 'Login',
    computed:mapState(['name','isLogined']),
    data(){
      return {
        user:{},
        imglocation:require("@/assets/bg.png"),
        rules:{
          name:[{
            required:true,
            message:'用户名不能为空',
            trigger:'blur'
          }],
          password:[{
            required:true,
            message: '密码不能为空',
            trigger:'blur'
          }]
        }
      }
    },
    methods:{
      ...mapMutations(['login','setUser','setName','setIsLogined','setToken']),
      to_login(){
        this.$router.replace('/main');
      },
      /* submit(){
        console.log(this.user);
        if(this.user.name==='admin' && this.user.password==='123'){
          this.$notify({
            type : 'success',
            message : '欢迎你，'+this.user.name,
            duration : 3000
          })
          this.$router.replace('/main')
        }else{
          this.$message({
            type:'error',
            message:'用户名或密码错误',
            showClose:true
          })
        }
      }, */
      submit(){
        this.$refs.form.validate(valid=>{
          var param={username:this.user.name,password:this.user.password};
          //this.$ajax.get('app/login2',{params:param}).then(res=>{
          if(valid){
            this.$ajax.post('login',param).then(res=>{
                var result=res.data;
                // console.log(result);
                if(result.success){
                   // this.setUser(this.user);
                   // this.setIsLogined(true);
                   // this.setName(result.data.name);
                   // this.setToken(result.data.token);
                  //sessionStorage.setItem("token",result.data.token);
                  // console.log(result.data.roles);
                   var _data={user:this.user,name:result.data.name,token:result.data.token};
                  this.login(_data);
                  // this.$notify({
                  //   type:'success',
                  //   message:result.msg,
                  //   duration: 3000
                  // });
                  var roles=result.data.roles;
                  if(roles.indexOf('ROLE_STUDENT')>-1){
                    this.$router.push('/grade/peasonGradeList');
                  }else{
                    this.$router.push('/banji/manage')
                  }
                }else{
                  this.$message({
                    type:'error',
                    message:result.msg,
                    showClose:true
                  });
                  this.user.name='';
                  this.user.password='';
                }
            }).catch(e=>{
              // console.log(e);
              this.$message({
                type:'error',
                message:'网络连接失败...',
                showClose: true
              })
            })
          } else {
            return false
          }
        })
      },
      register(){
        this.$router.replace('/main')
      }
    }
  }
</script>

<style>
.logindemo{
  background-color: beige;
  /* background: url("~@/assets/bg2.png");
  width: 100%;
  height: 100%;
  background-size: 1000px auto; */
}
</style>
