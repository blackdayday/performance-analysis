<template>
  <el-card>
    <div>班级对比</div>
    <el-card>
        <span>班级：</span>
        <el-select v-model="chartOptions.classId" placeholder="请选择班级" @change="changeClass">
          <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <span>对比班级：</span>
        <el-select v-model="chartOptions.classId2" placeholder="请选择班级" @change="changeClass2">
          <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button @click="loadData" type="primary" size="small">对比</el-button>
    </el-card>
    <el-card v-show='!isShow' style='height:600px'></el-card>
  </el-card>
  
</template>

<script>
export default {
  data(){
    return{
      isShow:false,
      classList:[],
      chartOptions:{
        classId:'',
        classId2:'',
      }
    }
  },
  methods:{
    loadData(){
      console.log("开始对比")
    },
  }
}
</script>

<style>

</style>