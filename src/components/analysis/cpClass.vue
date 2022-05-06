<template>
  <el-card>
    <div>班级对比</div>
    <el-card>
        <span>班级：</span>
        <el-select v-model="classId" placeholder="请选择班级" >
          <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <span>对比班级：</span>
        <el-select v-model="classId2" placeholder="请选择班级" >
          <el-option v-for="item in classListCp" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button @click="loadData" type="primary" size="small" :disabled='isUsed'>查询</el-button>
    </el-card>
    <el-card v-show="isShow" style='height:600px'>
      <span >时间：</span>
      <el-select v-model="chooseTime" placeholder="请选择时间">
         <el-option v-for="item in timeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <span>科目：</span>
      <el-select v-model="chooseSub" placeholder="请选择科目">
         <el-option v-for="item in subjectOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button @click="handleData" type="primary" size="small" >对比</el-button>
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
      classListCp:[],
      classId:'',
      classId2:'',
      timeOptions:[],
      subjectOptions:[],
      chooseTime:'',
      chooseSub:'',
    }
  },
  computed:{
    isUsed(){
      return !(this.classId && this.classId2)
    } 
  },
  watch:{
    classId(val){
      this.classId2 = ''
      this.classListCp = []
      //已选的设置为不可选
      this.classList.forEach(item=>{
        if(item.id == val){
          
        }else{
          this.classListCp.push(item)
        }
      })
      console.log(this.classListCp)
    }
  },
  created(){
    this.getClass()
  },
  mounted(){

  },
  methods:{
    loadData(){
      console.log("开始查询")
      let a = Promise.all([this.getData(this.classId),this.getData(this.classId2)])
      a.then(([data,cp_data])=>{
        this.isShow = true
        console.log('两个班级都有成绩数据')
        console.log(data,cp_data)
        this.fstData = [...data]
        this.cpData = [...cp_data]
        this.handleTime()
      }).catch(err=>{
        this.isShow = false
        console.log(err)
      })
    },
    handleData(){
      console.log("开始对比")
    },
    handleTime(){
      console.log("开始处理时间")

    },
    getClass(){
      this.classList = []
      this.$ajax.post('banji/list',{}).then(res=>{
        let result = res.data;
        if(result.length>0){
            result.forEach(item=>{
                this.classList.push({
                    id:item.id,
                    name:item.name,
                    disabled:false
                })
           })
          this.classId = result[0].id
        }
      })
   },
    getData(id){
      return new Promise((resolve,reject)=>{
        this.$ajax.post('grade/banjiGradeList',{
                tbClassId:id           
                }).then(res=>{
                  console.log(res.data)
                  let result = res.data.tableData;
                  if(result.length>0){
                     resolve(result)
                  }else{
                    reject('没有数据')
                  }
                  
       })
      })
           
    },
    }
    
  
}
</script>

<style>

</style>