<template>
  <el-card style="height: 100%;">
    <div slot="header">
      <span>班级成绩分析</span>
    </div>
    <el-card>
      <span>科目:</span>
      <el-select v-model="value" >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
      </el-select>
    </el-card>
    <el-card>
      <div>
        <div>成绩解读：</div>
        <span v-html="gradeAnalysisHtml"></span>
      </div>
    </el-card>
    <el-card>
      <div>
        <div>整体分析图</div>
        <div style="diplay:flex;flex-direction:row;justify-content:flex-start;">
          <div class="a">
            <Pie :data="pieData"></Pie>
          </div>
          <!-- <span class="b">
            <span>111</span>
            <span>222</span>
          </span> -->
        </div>

        <!-- <Chart :chartOptions="chartOptions"></Chart> -->
      </div>
      
    </el-card>
    <el-card>
      <div>
         <div>班级排名表</div>
         <div style="margin:10px 100px">
           <el-table 
           :data="pieData"
           :default-sort = "{prop: 'grade', order: 'descending'}"
           border
           max-height="500"
           >
             <el-table-column
               label="排名"
               align="center"
               type="index"
               width="80">
             </el-table-column>
             <el-table-column
               prop="num"
               label="学号"
               align="center"
               width="180">
             </el-table-column>
             <el-table-column
               prop="name"
               label="姓名"
               align="center"
               width="180">
             </el-table-column>
             <el-table-column
               prop="grade"
               label="实际分数"
               align="center"
               width="180">
             </el-table-column>
             <el-table-column
               prop="converGrade"
               label="折算分数"
               align="center"
               width="180">
               </el-table-column>
             <!-- <el-table-column
               prop="rank"
               label="排名"
               width="180"> -->
           </el-table>
          </div>
      </div>
    </el-card>
    <!-- <el-card>
      <el-table :data="data" size="small" border style="width: 100%">
        <el-table-column v-for="(col,index) in colNames" :key="index" :prop="col" :label="col"></el-table-column>
      </el-table>
    </el-card> -->
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Chart from '../echarts/line-chart.vue'
import Pie from '../echarts/pie.vue'
  export default {
    data() {
      return {
        data: [],
        colNames:[],
        ClassId: 0,
        chartOptions: {},
        value: '',
        options:{},
        pieData:[],
        coursesData:[],
        gradeAnalysisHtml:'',
      }
    },
    components:{
      Chart,
      Pie
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
    watch:{
      value(val){
        this.initChart()
        this.handlePie(val)
      },
      pieData(val){
        this.addHtml()
      }
    },
    created(){
      this.getCourses()
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
          
          this.handleOptions()
        }
      })
      },
      getCourses(){
        this.$ajax.post('course/list',{}).then(res=>{
          
          let result=res.data;
          if(result.length!=0){
            this.coursesData = result
            console.log(this.coursesData)
            console.log('课程')
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
      handleOptions(){
        console.log(this.colNames)
        
        this.options = this.colNames.map(item => {
          if(item.indexOf('-') === -1){
            return null
          }
          return {
            value: item,
            label: item,
            disabled: false
          }
        })
        
        //去掉null
        this.options = this.options.filter(item => item != null)
        //options首项加入总分
        // this.options.unshift({
        //   value: '总分',
        //   label: '总分',
        //   disabled: false
        // })
        this.value=this.options[0].value
        console.log(this.options)
      },
      handlePie(val){
          let pie_data = []
          //获取课程的满分
          let fullScore = 0
          this.coursesData.forEach((it,i)=>{
            if(val === it['name']){
              fullScore = it['classHour']
            }
          })
          this.data.forEach((it,i)=>{
            pie_data.push({
              name:it['姓名'],
              num:it['学号'],
              grade:it[val]===null?0:it[val],
              converGrade:(it[val]===null?0:it[val]/fullScore*100).toFixed(2)
            })
          })
          this.pieData = pie_data
          console.log(pie_data)
        },
      addHtml(){
        let data = []
        this.pieData.forEach((item,i)=>{
          data.push(item)
        })
        let myGrade = 0
        let rank = 1
        console.log(111)
        data.sort((a,b)=>{
          return b.grade-a.grade
        })
        data.forEach((item,it)=>{
          if(Number(item.num)===Number(this.getUser.name)){
            myGrade = item.grade
            rank += it
          }
        })
        //平均分
        let avgGrade = 0
        data.forEach((item,it)=>{
          avgGrade += Number(item.grade)
        })
        avgGrade = (avgGrade/data.length).toFixed(2)
        //最高分
        let heighGrade = data[0].grade
        //最高分的学生名
        let heighGradeName = data[0].name
        //最低分
        let lowGrade = data[data.length-1].grade

        console.log(myGrade)
        console.log(avgGrade)
        console.log(rank)
        console.log("111111")
        let htmlStr = `<p class='testAn'>（1）你的成绩为：${myGrade}分，在班上的排名为：第${rank}名</p>
                       <p class='testAn'>（2）班级平均分为：${avgGrade}分</p>
                       <p class='testAn'>（3）${heighGradeName}同学获得班级最高分，${heighGrade}分</p>
                      `
        this.gradeAnalysisHtml = htmlStr
      },
      initChart(){
        let xData = []
        let yData = []
        console.log(this.data)
        console.log("数据")
        this.data.forEach(item => {
          xData.push(item['姓名'])
          yData.push(item[`${this.value}`])
        })
        this.chartOptions = {
          // title: {
          //   text: '成绩趋势图'
          // },
          tooltip: {
              trigger: 'axis'
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          toolbox: {
              feature: {
                saveAsImage: {}
              }
          },
          legend: {
            data: ['成绩']
          },
          xAxis: {
            data: xData
          },
          yAxis: {},
          series: [{
            name: '成绩',
            type: 'line',
            data: yData
          }]
        }
      }
      
      
    }
  }
</script>

<style>
.textAn{
  font-size:16px;
  margin: 15px 5px 5px 5px;
}
</style>
