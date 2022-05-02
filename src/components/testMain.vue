<template>
  <div class="container">
    <div class="leftMenu">
      <el-menu
        default-active="/grade/peasonGradeList"
        :unique-opened="true"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        :router="true"
        active-text-color="#ffd04b">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>成绩分析</span>
          </template>
          <el-menu-item index="/grade/peasonGradeList">个人成绩分析</el-menu-item>
          <el-menu-item index="/grade/peasonClassGradeList">班级成绩分析</el-menu-item>
        </el-submenu>
        
      </el-menu>
    </div>
    <div class="rightDiv">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
</script>

<style>
  .container {
    display: flex;
    flex-direction: row;
  }
  .leftMenu{
    width: 200px;
    background-color: #545c64;
    flex-grow: 0;
    /* height: 100%; */
  }
  .rightDiv {
    flex-grow: 1;
    background-color: lightgray;
    min-height: calc(100vh - 102px);
  }
</style>
