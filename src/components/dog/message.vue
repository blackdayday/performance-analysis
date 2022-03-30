<template>
  <div class="center">
    <!-- <el-page-header @back="goBack" content="个人信息"> </el-page-header> -->
    <div class="header">
      <div class="avatar header-item">
        <div>
          <el-upload
            :style="styleChange()"
            class="avatar"
            action="http://localhost:8088/product/upload-imgs"
            name="img"
            :headers="header"
            :show-file-list="false"
            :auto-upload="true"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="body">
         <div class="body-item">
           <!-- <p> 用户名：{{ user.userName }}</p> -->
           <span>用户名：</span>
           <el-input
             placeholder="请输入内容"
             v-model="username"
             :disabled="!isEdit">
           </el-input>
         </div>
         <div class="body-item">
           <!-- <p> 个性签名：{{ user.sign }}</p> -->
           <span>个性签名：</span>
           <el-input
             placeholder="请输入内容"
             v-model="username"
             :disabled="!isEdit">
           </el-input>
         </div>
         <div class="body-item">
           <!-- <p>注册时间：{{user.createtime}}</p> -->
           <span>注册时间：</span>
           <el-input
             placeholder="请输入内容"
             v-model="username"
             :disabled="!isEdit">
           </el-input>
         </div>
         <div class="body-item" style="display:flex">
             <el-button @click="edit()">{{isEdit?'提交':'编辑'}}</el-button>
             <el-button @click="backEdit()" v-show="isEdit">撤回</el-button>
         </div>
    </div>
    
  </div>
</template>
<script>
export default {
  data() {
    return {
      imageUrl: require("@/assets/bg.png"),
      header: { token: this.$store.getters.getToken },
      user: {},
      updatePwd: {
        uid: null,
        oldPwd: "",
        newPwd: "",
      },
      confirmPwd: "",
      username: '狗熊',
      isEdit: false,
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    styleChange(){
      console.log()
      return this.imageUrl?'padding: 0px':'padding: 75px'
    },
    goBack() {
      this.$router.push("/allGoods");
    },
    getFile: function (event) {
      this.file = event.target.files[0];
      console.log("getFile", this.file);
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    update() {
      console.log("获取到了user信息", this.user);
      this.$axios.post("/user/updateUserInfo", this.user).then((res) => {
        console.log("更新成功了吗？", res);
        this.$message({
          message: "修改成功",
          type: "success",
        });
      });
    },
    updatePwdBtn() {
      this.updatePwd.uid = this.user.uid;
      console.log(this.updatePwd);
      this.$axios
        .post("/user/updateUserPassword", this.updatePwd)
        .then((res) => {
          console.log(res);
          if (res.data.state == 201) {
            this.$message.error("修改密码失败，原密码不正确");
          } else {
            (this.updatePwd.oldPwd = ""),
              (this.updatePwd.newPwd = ""),
              (this.confirmPwd = "");
            this.$message({
              message: "修改成功",
              type: "success",
            });
          }
        });
    },
    edit(){
        this.isEdit = true
    },
    backEdit(){
        this.isEdit = false
    }
  },
  created() {
    let uid = this.$store.getters.getUserId;
    this.$axios
      .get("/user/user-info/" + uid, {
        headers: {
          token: this.$store.getters.getToken,
        },
      })
      .then((res) => {
        this.user = res.data.data;
        console.log("this.user", this.user);
      });
  },
};
</script>
<style scoped>
.center {
    /* background: url("~@/assets/bg2.png");  */
  margin: 0 auto;
  padding: 12px 12px;
  width: 1200px;
  height: 100vh;
  background-color: #fff;
}
.header {
  width: 1200px auto;
  height: 200px auto;
  display: flex;
  margin: 20px auto;
  justify-content: center;
  align-items: center;
}
.body {
  width: 1200px auto;
  height: 200px;
  /* background-color: red; */
  display: flex;
  flex-direction:column;
  
}
.header-item {
  margin: 0 2%;
  
  align-items: center;
  justify-content: center;
}
.body-item {
   margin: 10px auto 10px 400px;
  /* display: flex;
  justify-content: center; */
}
.header .avatar {
  background-color: rgb(187, 187, 187);
  width: 200px;
  height: 200px;
  border-radius: 100px;
  overflow: hidden;
}
.header .avatar img {
  width: 100%;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.avatar {
  border-radius: 100px;
  width: 200px;
  height: 200px;
  display: block;
}
/* .el-input{
  width: 600px;
} */
</style>