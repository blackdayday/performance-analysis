<template>
  <el-card style="min-height: 100%;">
    <div slot="header">个人成绩分析</div>
    <el-card>
      <span>科目:</span>
      <el-select v-model="value" size="small">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
      </el-select>
      <span>个人期望分：</span>
      <el-input v-model="expectScore" size="small" style="width: 100px;" :disabled='isEdit'></el-input>
      <el-button type="primary" @click="confirm" size="small">确认</el-button>
    </el-card>
    <el-card>
      <div>
        <h4>单科成绩趋势图</h4>
        <Chart :chartOptions="chartOptions" :isShow="isShow"></Chart>
     </div>
    </el-card>
    <el-card>
      <div>
        <h4>单科成绩解读：</h4><br/>
        <span v-html="gradeAnalysisHtml"></span>
     </div>
    </el-card>
    <el-card>
       <div >综合成绩</div>
       <el-card>
         <div style="margin:10px 5px">
             <span>筛选时间：</span>
             <el-select v-model="time" size="small">
                 <el-option
                   v-for="item in timeOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"
                   :disabled="item.disabled">
                 </el-option>
             </el-select>

          </div>
       </el-card>
       
       <!-- 对选择的时间的考试的全部科目进行解读 -->
       <el-card>
         <div>
           <h4>综合解读：</h4>
           <span v-html="allGradeAnalysisHtml"></span>
         </div>
       </el-card>
       <el-card>
         <h4>成绩表</h4>
         <el-table :data="tableData" border size="small" max-height="500">
           <el-table-column prop="course.name" label="课程名"></el-table-column>
           <el-table-column prop="grade" label="实际分数"></el-table-column>
           <el-table-column prop="convertGrade" label="折算分数"></el-table-column>
         </el-table>
         <el-button style="margin:5px 5px" type='success' size="small">导出</el-button>

       </el-card>
       
    </el-card>
    
  </el-card>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { debounce } from '../../methods/module.js'
  import Chart from '../echarts/line-chart.vue'
  export default {
    data() {
      return {
        data: [],
        tempData: [],
        tableData: [],
        isShow: false,
        x_data: [],
        y_data: [],
        courseData: [],
        courseName: [],
        // courseTime: [],
        options: {
          value: '',
          label: '',
          disabled: false
        },
        timeOptions: {
          value: '',
          label: '',
          disabled: false
        },
        chartOptions: {},
        value: '',
        time: '',
        resize: '',
        expectScore: 80,
        isEdit: false,
        gradeText: '本科成绩考试稳定',
        gradeAnalysisHtml: '<span style="color: #00a854;">暂无解读</span>',
        allGradeAnalysisHtml: '<span style="color: #00a854;">暂只对单次考试进行解读</span>'
      }
    },
    components:{
      Chart
    },
    watch: {
      courseName(val) {
        this.value = val[0]
        this.hadleOptions(val)
        this.confirm()
      },
      //初始数据
      tempData(val){
         this.data = this.addConvertGrade(val)
      },
      data(val) {
        this.tableData = val
        let timeOptions = this.getTimeptions(val)
        this.timeOptions = timeOptions
        // console.log(timeOptions)
      },
      time(val) {
        this.filterTable(val)
        // console.log(val)
        // console.log('val')
        if(val === '全部'){
          this.allGradeAnalysisHtml = '<span style="color: #00a854;">暂只对单次考试进行解读</span>'
        }else{
          this.allGradeAnalysis()
        }
        // console.log(this.allGradeAnalysisHtml)
      }
    },
    created() {
      this.loadData()
    },
    methods:{
      ...mapMutations([
        'login',
        'setUser',
        'setName',
        'setIsLogined',
        'setToken',
        // 'getUser',
        ]),
        loadData(){
          this.$ajax.post('grade/myGrade',{
             }).then(res=>{
                var result=res.data;
                // console.log(result.data);
                if(result.data.length>0){
                  this.tempData=result.data;
                  this.handleData(result.data);
                }
              })
        },
        initChart(){
          let cData = []
          let xData = []
          let yData = []
          let converData = []
          let wishData = []
          //筛选出课程名
          cData = this.data.map(item => 
          {
            if(item.course.name.indexOf(this.value) != -1){
              return item
            }
            return null
          })
          cData = cData.filter(item => item != null)
          // console.log(cData)
          cData.forEach(item => {
            if(item){
              xData.push(item.course.name)
              yData.push(item.grade)
              converData.push(item.convertGrade)
              wishData.push(this.expectScore)
            }
          })
          // console.log(xData)
          // console.log(yData)
          // this.x_data = xData
          this.y_data = yData
          this.chartOptions = {
            // title: {
            //   text: '成绩趋势图'
            // },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: [`实际成绩`, '期望分', '折算分']
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
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: xData
            },
            yAxis: {
              type: 'value',
            },
            color: ['red'],
            series: [
              {
                name: `期望分`,
                type: 'line',
                data: wishData
              },
              {
                name: `实际成绩`,
                type: 'line',
                stack: '总量',
                data: yData
              },
              {
                name: `折算分`,
                type: 'line',
                data: converData
              }
            ]
          }
          this.isShow = true
          this.gradeAnalysis()
        },
        
        handleData(data){
          let Data=data;
          let courseData=[];
          let courseName=[];
          // let courseTime=[];
          for(var i=0;i<Data.length;i++){
            courseData.push(Data[i].course.name);
          }
          courseData.forEach((it,i) => {
            let name = it.split('-')[0];
            // let time = it.split('-')[1];
            courseName.push(name);
            // courseTime.push(time);
          });
          //数组去重
          courseName = [...new Set(courseName)];
          // courseTime = [...new Set(courseTime)];
          this.courseName=courseName;
          // this.courseTime=courseTime;
        },
        hadleOptions(data){
          let options=[];
          for(var i=0;i<data.length;i++){
            options.push({
              value:data[i],
              label:data[i],
              disabled:false
            })
          }
          this.options=options;
        },
        confirm(){
          //防抖动
          debounce(() => {
            this.initChart()
          }, 500)()
        },
        //根据最后一次成绩分析学生成绩状况
        gradeAnalysis(){
          console.log(this.y_data)
          console.log("fdsakfhskejhfjkh")
          let first = ''
          let second = ''
          let third = ''
          let fourth = ''
          let grade=this.y_data[this.y_data.length-1];
          //平均分(保留两位小数)
          let average = (this.y_data.reduce((a, b) => a + b, 0) / this.y_data.length).toFixed(2);
          //最高分(保留两位小数)
          let max = Math.max.apply(null, this.y_data).toFixed(2);
          //方差
          let variance=this.y_data.reduce((a,b)=>a+Math.pow(b-average,2))/this.y_data.length;
          //标准差(保留两位小数)
          let standardDeviation=Math.sqrt(variance).toFixed(2);
          //判断成绩状况
          //标准差判断是否稳定
          if(standardDeviation<=5){
            first = '很稳定'
          }else if(standardDeviation<=10){
            first = '稳定'
          }else if(standardDeviation<=20){
            first = '稍有不稳定'
          }else{
            first = '不稳定'
          }
          //平均分判断是否合格
          second = this.scoredText(average,this.expectScore);
          //判断平均分和期望分的关系
          third = this.scoredCon(average,this.expectScore);
          //判断每次实际分数与期望分的达标率
          let count=0;
          for(var i=0;i<this.y_data.length;i++){
            if(this.y_data[i]>=this.expectScore){
              count++;
            }
          }
          fourth = count/this.y_data.length*100+'%';
          let g_html = `<p class='textAn'>（1）本科考试发挥<span style='color:${this.isStable(standardDeviation)}'>${first}</span></p>
                        <p class='textAn'>（2）本次考试（最新）成绩为<span style='color:${this.isQualified(grade)}'>${grade}</span>分，处于<span style='color:${this.isQualified(grade)}'>${this.scoredText(grade)}</span>
                          ,<span style='color:${this.isHigh(grade,this.expectScore)}'>${this.scoredCon(grade,this.expectScore)}</span>期望分数<span style='color:${this.isHigh(grade,this.expectScore)}'>${this.scored(grade,this.expectScore)}</span></p>
                        <p class='textAn'>（3）本科平均分为<span style='color:${this.isQualified(average)}'>${average}</span>分
                          ,处于<span style='color:${this.isQualified(average)}'>${second}</span>
                          ,<span style='color:${this.isHigh(average,this.expectScore)}'>${third}</span>期望分数<span style='color:${this.isHigh(average,this.expectScore)}'>${this.scored(average,this.expectScore)}</span></p>
                        <p class='textAn'>（4）期望达标率 ( 实际分数达到期望分数次数/总次数 ) 是<span style='color:${this.isHigh(fourth,this.expectScore)}'>${fourth}</span></p>
                        <p class='textAn'>（5）最高分成绩为<span style='color:${this.isQualified(max)}'>${max}</span>分，处于<span style='color:${this.isQualified(max)}'>${this.scoredText(max)}</span>
                          ,<span style='color:${this.isHigh(max,this.expectScore)}'>${this.scoredCon(max,this.expectScore)}</span>期望分数<span style='color:${this.isHigh(max,this.expectScore)}'>${this.scored(max,this.expectScore)}</span></p>
                        `
          this.gradeAnalysisHtml=g_html;
        },
        allGradeAnalysis(){
          let first = ''
          let second = ''
          let third = ''
          let gradeAllData = [];
          // console.log(this.tableData)
          this.tableData.forEach((item,i)=>{
            gradeAllData.push({
              name:item.course.name,
              grade:item.grade,
              maxGrade:item.course.classHour,
              convertGrade:item.convertGrade
            })
          })
         gradeAllData.sort((a,b)=>{
            return b.convertGrade-a.convertGrade
          })
          console.log(gradeAllData)
          console.log("sdfddsfsd")
          //最高折算分数 
          let maxConvertGrade = Number(gradeAllData[0].convertGrade);
          //最低折算分数
          let minConvertGrade = Number(gradeAllData[gradeAllData.length-1].convertGrade);
          //平均折算分数
          let averageConvertGrade = (gradeAllData.reduce((a, b) => a + Number(b.convertGrade), 0) / gradeAllData.length).toFixed(2);
          // console.log(averageConvertGrade)
          let maxName = []
          let minName = []
          gradeAllData.forEach((item,i)=>{
            if(item.convertGrade==maxConvertGrade){
              maxName.push(item.name)
            }
            if(item.convertGrade==minConvertGrade){
              minName.push(item.name)
            }
          })
          let onlyTend = []
          let bigTend = []
          gradeAllData.forEach((item,i)=>{
            
            let tend = this.isTend(item.convertGrade-averageConvertGrade)
            item.tend = tend
            if(tend === 1){
              onlyTend.push(item)
            }else if(tend === 2){
              bigTend.push(item)
            }
          })
          let tendhtml = this.handleTend(onlyTend,bigTend)

          let allHtml = `
                        <p class='testAn'>（1）平均折算分数为${averageConvertGrade}分</p>
                        <p class='testAn'>（2）最高折算分数为<span style='color:${this.isQualified(maxConvertGrade)}'>${maxConvertGrade.toFixed(2)}</span>分，课程为<span style='color:${this.isQualified(maxConvertGrade)}'>${this.getNameStr(maxName)}</span></p>
                        <p class='testAn'>（3）最低折算分数为<span style='color:${this.isQualified(minConvertGrade)}'>${minConvertGrade.toFixed(2)}</span>分，课程为<span style='color:${this.isQualified(minConvertGrade)}'>${this.getNameStr(minName)}</span></p>
                        ${tendhtml}
                        `
          this.allGradeAnalysisHtml=allHtml;
          // console.log(gradeAllData)
          // console.log("gradeObj")
        },
        //数组循环，提取‘-’前面的名字，合并成字符串
        getNameStr(arr){
          // console.log(arr)
          let name = '';
          arr.forEach((item,i)=>{
            
              name+=item.split('-')[0]+'、';
            
            
          })
          return name.substring(0,name.length-1);
        },
        //处理偏科数据，输出html
        handleTend(ol,bg){
          let allHtml = '';
          let olStr = ol.length>0?'稍偏科课程有':'稍偏科课程无'
          let bgStr = bg.length>0?'偏科课程有':'偏科课程无'
            ol.forEach((item,i)=>{
              if(i===ol.length-1){
                olStr+=`<span style='color:red'>${item.name.split('-')[0]}</span>`
              }else{
                olStr+=`<span style='color:red'>${item.name.split('-')[0]}</span>、`
              }
              
            })
            bg.forEach((item,i)=>{
              if(i===bg.length-1){
                bgStr+=`<span style='color:red'>${item.name.split('-')[0]}</span>`
              }else{
                bgStr+=`<span style='color:red'>${item.name.split('-')[0]}</span>、`
              }
            })
          allHtml = `<p class='testAn'>（4）${olStr}；${bgStr}</p>`
          // console.log(allHtml)
          return allHtml

        },
        //根据判断是否偏科（文字）
        isTend(difScore){
          difScore = Math.abs(difScore)
          if(difScore<20){
            return 0
          }else if(difScore<=30){
            return 1
          }else{
            return 2
          }
          // if(difScore<=10){
          //   return '全能'
          // }else if(difScore<=20){
          //   return '不偏科'
          // }else if(difScore<=30){
          //   return '稍偏科'
          // }else{
          //   return '严重偏科'
          // }
        },


        //判断两个分数关系
        scoredCon(a,b){
         if(a>b){
            return '高于'
          }else if(a<b){
            return '低于'
          }else{
            return '等于'
          }
        },
        //是否稳定
        isStable(standardDeviation){
          if(standardDeviation<=5){
            return 'green'
          }else if(standardDeviation<=10){
            return 'orange'
          }else if(standardDeviation<=20){
            return 'red'
          }else{
            return 'red'
          }
        },
        //是否合格（颜色）
        isQualified(average){
          if(average>=60){
            return 'green'
          }else{
            return 'red'
          }
        },
        //是否合格（文字）
        scoredText(grade){
          if(grade>=60){
            return '合格'
          }else{
            return '不合格'
          }
        
        },
        //分差
        scored(a,b){
          let c=a-b;
          if(c===0){
            return ''
          }else{
            return `${Math.abs(c)}分`
          }
          
        },
        //平均分与期望分的关系
        isHigh(average,expectScore){
          if(average>expectScore){
            return 'green'
          }else if(average<expectScore){
            return 'red'
          }else{
            return 'orange'
          }
        },
        //达标率
        isHigh(fourth,expectScore){
          if(fourth>=expectScore){
            return 'green'
          }else{
            return 'red'
          }
        },
        //在数组中循环根据课程名的-提取，得到el-select的options
        getTimeptions(data){
          let options = [];
          let arr = []
          for(var i=0;i<data.length;i++){
            let name = data[i].course.name.split('-')[1];
            arr.push(name);
          }
          arr = [...new Set(arr)]
          arr.forEach(item=>{
            options.push({
              value:item,
              label:item,
              disabled:false
            })
          })
          options.unshift({
            value:'全部',
            label:'全部',
            disabled:false
          })
          this.time = '全部'
          return options;
        
        },
        //根据时间筛选表格数据
        filterTable(time){
          if(time === '全部'){
            this.tableData = this.data
            return
          }
          this.tableData = this.data.filter(item=>{
            return item.course.name.indexOf(this.time)>-1
          })
        },
        //为tableData循环添加折算分数
        addConvertGrade(data){
          data.forEach((item,i)=>{
            item.convertGrade = (item.grade/item.course.classHour*100).toFixed(2);
          })
          // console.log(data)
          return data
        },
    },
    computed:{
      ...mapGetters([
        'getName',
      ]),
    },
    mounted() {
      console.log(this.getName)
    },
  }
</script>

<style>
.textAn{
  font-size:16px;
  margin: 15px 5px 5px 5px;
}
</style>
