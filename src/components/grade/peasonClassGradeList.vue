<template>
  <el-card style="height: 100%;">
    <div slot="header">
      <span>班级成绩查询</span>
    </div>
    <el-table :data="data" size="small" border>
      <el-table-column v-for="(col,index) in colNames" :key="index" :prop="col" :label="col"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
        data: [],
        colNames:[],
        ClassId: 0,
      }
    },
    mounted(){
      this.findMyCourseId()
      // this.loadData()
    },
    computed:{
      ...mapGetters([
        'getUser'
      ])
    },
    created(){
      // this.findMyCourseId()
    },
    methods:{
      loadData(){
        console.log(this.ClassId)
        console.log("this.ClassId")
        this.$ajax.post('grade/banjiGradeList',{tbClassId:this.ClassId}).then(res=>{
        console.log(res.data)
        let result=res.data;
        if(result.tableData&&result.tableData.lenght!=0){
          this.colNames=result.cols;
          this.data=result.tableData;
        }
      })
      },
      findMyCourseId(){
        this.$ajax.post('student/list',{}).then(res=>{
          let result = res.data
          console.log(res)
          console.log("res")
          // console.log(this.getUser)
          let userId = this.getUser?this.getUser.name:'0000' 
          let myClassId = 2
          if(result&&result.lenght!=0){
            result.forEach((it,i)=>{
              if(userId === it['username']){
                myClassId = it['tbClassId']
              }
            })
          }
          console.log(myClassId)
          this.ClassId = Number(myClassId)
          this.loadData()
        })
      },
    }
  }
</script>

<style>
</style>
