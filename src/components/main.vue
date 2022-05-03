<template>
    <!-- <div class="main-container"> -->
    <div class="container">
      <div class="leftMenu">
        <el-menu
          default-active="/banji/manage"
          :unique-opened="openOne"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          :router="isRouter"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-key"></i>
              <span>成绩分析</span>
            </template>
              <el-menu-item index="/analysis/studentAnalysis">个人成绩分析</el-menu-item>
              <el-menu-item index="/analysis/classAnalysis">班级单科单次</el-menu-item>
              <el-menu-item index="/analysis/oneCoursesAn">班级单科综合</el-menu-item>
              <el-menu-item index="/analysis/classAllAnalysis">班级单次综合</el-menu-item>
              <el-menu-item index="/analysis/cpClass">班级对比</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>成绩管理</span>
            </template>
              <el-menu-item index="/grade/classGradeManage">班级成绩管理</el-menu-item>
              <el-menu-item index="/grade/peasonGradeManage">个人成绩管理</el-menu-item>
              <el-menu-item index="/grade/classGradeList">班级成绩查询</el-menu-item>
              <el-menu-item index="/grade/classGradeList">成绩快速导入</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>系统设置</span>
            </template>
              <el-menu-item index="/banji/manage">班级管理</el-menu-item>
              <el-menu-item index="/course/manage">课程管理</el-menu-item>
              <el-menu-item index="/student/manage">学生管理</el-menu-item>
              <el-menu-item index="/menu/manage">菜单管理</el-menu-item>
          </el-submenu>
          
        </el-menu>
        
      </div>
      <div class="rightDiv">
        <router-view></router-view>
      </div>
    </div>
</template>

<script>
  import {mapState} from 'vuex';
  export default{
    data() {
      return {
        openOne: true,
        isRouter: true
      }
    },
   computed:{...mapState(['user'])},
   methods:{

    }
  }
</script>

<style>
/* .main-container{
   height: 100%;
   display: flex;
   flex-flow: row nowrap;
   justify-content: start;
   align-items: flex-start;

 }
 .el-aside {
    background-color: #D3DCE6;
    background-color: #545c64;
    color: #333;
    width: 200px;
    text-align: center;
    line-height: 200px;
    height: 100%;
  }
  .main-main {
      background-color: #E9EEF3;
      background-color: red;
      color: #333;
      width: calc(100% - 200px);

      line-height: 160px;
      height: 100%;
    }
     .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 198px;
        min-height: 400px;
        height: 100%;
      }
    .el-menu{
      text-align: left;
    } */
  .container {
    display: flex;
    flex-direction: row;
  }
  .leftMenu{
    width: 12.5rem;
    background-color: #545c64;
    flex-grow: 0;
    /* height: 100%; */
  }
  .rightDiv {
    flex-grow: 1;
    padding-left: 5px;
    /* background-color: lightgray; */
    min-height: calc(100vh - 102px);
  }


</style>
