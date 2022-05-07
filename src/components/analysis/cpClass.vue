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
    <div v-show="isShow" >
      <el-card>
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
      
        <cp-pie :data="piedata" :cpdata="cp_piedata"></cp-pie>
      
      
    </div>
    <el-card v-show='!isShow' style='height:600px'></el-card>
  </el-card>
  
</template>

<script>
import cpPie from '../echarts/cpPie.vue'
export default {
 components:{ cpPie },
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
      fstData:[],
      cpData:[],
      fstCol:[],
      cpCol:[],
      piedata:[],
      cp_piedata:[],
      time_arr:[],
      maxGrade:100,
      coursesData: [],
      exam_sort: [],
      tableData: [],
      colDetail: [],
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
    this.getGradeSort()
  },
  mounted(){
    // this.getClass()
    // this.getGradeSort()
  },
  methods:{
    loadData(){
      console.log("开始查询")
      let a = Promise.all([this.getData(this.classId),this.getData(this.classId2)])
      a.then(([data,cp_data])=>{
        this.isShow = true
        console.log('两个班级都有成绩数据')
        console.log(data,cp_data)
        this.fstData = [...data.tableData]
        this.cpData = [...cp_data.tableData]
        this.fstCol = [...data.cols]
        this.cpCol = [...cp_data.cols]
        this.handleTime()
      }).catch(err=>{
        this.isShow = false
        console.log(err)
      })
    },
    handleData(){
      console.log("开始对比")
      if(this.chooseSub == '全部'){
        this.anaylysisData()
        console.log('全部科目')
        return
      }
      let name = this.chooseSub+'-'+this.chooseTime
      this.gradeMax(name)
      // console.log(name)
      // console.log(this.time_arr)
      this.time_arr.includes(name) ? this.anaylysisData() : this.warnning()
    },
    anaylysisData(){
      console.log("开始分析")
       let data = []
       let name = this.chooseSub+'-'+this.chooseTime
       this.fstData.forEach(item=>{
           data.push({
               name:item['姓名'],
               num:item['学号'],
               grade:item[this.courseId] === null?0:item[name],
               converGrade:item[this.courseId] === null?0:(item[name]/this.maxGrade*100).toFixed(2)
           })
       })
        let cp_data = []
        this.cpData.forEach(item=>{
            cp_data.push({
                name:item['姓名'],
                num:item['学号'],
                grade:item[this.courseId] === null?0:item[name],
                converGrade:item[this.courseId] === null?0:(item[name]/this.maxGrade*100).toFixed(2)
            })
        })

       data = data.sort((a,b)=>{
           return b.grade - a.grade
       })
        cp_data = cp_data.sort((a,b)=>{
            return b.grade - a.grade
        })
       //循环增加排名
       data.forEach((item,index)=>{
           item.rank = index+1;
       })
        cp_data.forEach((item,index)=>{
            item.rank = index+1;
        })

       this.piedata = [...data];
       this.cp_piedata = [...cp_data];
      //  this.handleTable()
    },
    handleTable(){
      console.log("开始处理表格")
    },
    gradeMax(name){
      this.coursesData.forEach(item=>{
        if(item.name == name){
          this.maxGrade = item.classHour?item.classHour:100
        }
      })
      console.log(this.maxGrade)
    },
    warnning(){
      console.log("请选择正确的时间和科目")
      this.$message({
        message:'本课程没录入成绩',
        type:'warning',
        duration:3000
        })
    },
    handleTime(){
      console.log("开始处理时间")
      let fst = [...this.fstCol]
      let cp = [...this.cpCol]
      let fst_time = fst.filter(item=>{
        return item != '学号'&&item != '姓名'&&item != '总分'
      })
      let cp_time = cp.filter(item=>{
        return item != '学号'&&item != '姓名'&&item != '总分'
      })
      //将两个数组重复的提取出来
      let time_arr = fst_time.filter(item=>{
        return cp_time.includes(item)
      })
      this.time_arr = [...time_arr]
      let time_time = time_arr.map(item=>{
        return item.split('-')[1]
      })
      
      time_time = [...new Set(time_time)]
      let time_sub = time_arr.map(item=>{
        return item.split('-')[0]
      })
      
      time_sub = [...new Set(time_sub)]
      console.log(time_time)
      console.log(time_sub)
      this.timeOptions = []
      time_time.forEach(item=>{
        this.timeOptions.push({id:item,name:item})
      })
      this.subjectOptions = [{id:"全部",name:"全部"}]
      time_sub.forEach(item=>{
        this.subjectOptions.push({id:item,name:item})
      })
      this.chooseTime = this.timeOptions[0].id
      this.chooseSub = this.subjectOptions[0].id
      // console.log(this.timeOptions)
      // console.log(this.subjectOptions)
      // console.log(78946)
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
    getAllCourses(){
        this.$ajax.post('course/list',{
        }).then(res=>{
            let result = res.data;
            // console.log(result);
            // console.log("123");
            if(result.length>0){
                let arr = [...result]
                let temp = [];
                this.exam_sort.forEach(item=>{
                    arr.forEach(it=>{
                        if(it.name.indexOf(item.exam_name)>-1){
                            temp.push(it);
                        }
                    })
                })
                // console.log(temp);
                // console.log("456789");
                this.coursesData = temp;
            }
        })
    },
    getGradeSort(){
            this.$ajax.post('exam/list',{
            }).then(res=>{
                let result = res.data;
                // console.log(result);
                // console.log("213");
                if(result.length>0){
                    let arr = [];
                    this.exam_sort = result
                }
                this.getAllCourses()
            })
    },
    getData(id){
      return new Promise((resolve,reject)=>{
        this.$ajax.post('grade/banjiGradeList',{
                tbClassId:id           
                }).then(res=>{
                  console.log(res.data)
                  let result = res.data;
                  if(result.tableData.length>0){
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