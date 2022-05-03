<template>
  <el-card style="min-height: 100%;">
    <div slot="header">单科综合分析</div>
    <el-card>
         <span>班级：</span>
         <el-select v-model="classV">
             <el-option
               v-for="item in classOptions"
               :key="item.id"
               :label="item.name"
               :value="item.id"
               >
             </el-option>
         </el-select>
         <span>科目:</span>
         <el-select v-model="value" size="small">
             <el-option
               v-for="item in courseName"
               :key="item.value"
               :label="item.label"
               :value="item.value"
               :disabled="item.disabled">
             </el-option>
         </el-select>
         <span>期望分：</span>
         <el-input v-model="expectScore" size="small" style="width: 100px;" :disabled='isEdit'></el-input>
         <el-button @click="getData" type='primary' size="small" >分析</el-button>
     </el-card>
    <div v-show="isShow">
    <el-card>
      <div>
        <h4>趋势图</h4>
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
        <h4>综合分析表格</h4>
        <grade-table :tableData="tableData" :colDetail="colDetail"></grade-table>
    </el-card>
    </div>
    <el-card v-show="!isShow" style="height:600px">
        请选择班级和科目，输入期望分，点击分析按钮
    </el-card>
  </el-card>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { debounce } from '../../methods/module.js'
  import Chart from '../echarts/line-chart.vue'
  import gradeTable from './gradeTable.vue'
  export default {
    data() {
      return {
        isShow:false,
        data: [],
        tempData: [],
        tableData: [],
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
        timeData:   [],
        chartOptions: {},
        value: '',
        time: '',
        resize: '',
        expectScore: 80,
        isEdit: false,
        gradeText: '本科成绩考试稳定',
        gradeAnalysisHtml: '<span style="color: #00a854;">暂无解读</span>',
        allGradeAnalysisHtml: '<span style="color: #00a854;">暂只对单次考试进行解读</span>',
      
        classV: '',
        // timeV: '',
        classOptions: [],
        // timeOptions: [],
        fst_data: [],
        arr_time: [],
        isShow: false,
      
      }
    },
    components:{
      Chart,
      gradeTable,
    },
    watch: {
        classV(val){
            this.isShow = false
        }
    },
    created() {
    //   this.loadData()
        this.getClass()
        this.getTime()
        this.getAllCourses()
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
        getClass(){
            this.$ajax.post('banji/list',{}).then(res=>{
                let result = res.data;
                if(result.length>0){
                    result.forEach(item=>{
                        this.classOptions.push({
                            id:item.id,
                            name:item.name
                        })
                    })
                    this.classV = result[0].id
                }
            })
        },
        getTime(){
            this.$ajax.post('exam/list',{}).then(res=>{
                let result = res.data;
                console.log("result")
                console.log(result)
                if(result.length>0){
                    result.forEach(item=>{
                        this.timeData.push({
                            id:item.id,
                            name:item.exam_name
                        })
                    })
                    // this.timeV = this.timeOptions[0].name
                }
            })
        
        },
        getAllCourses(){
            this.$ajax.post('course/list',{
            }).then(res=>{
                let result = res.data;
                console.log(result);
                console.log("123");
                if(result.length>0){
                    let arr = []
                    result.forEach(item=>{
                        arr.push(item.name.split('-')[0])
                    })
                    arr = [...new Set(arr)]
                    this.courseName = arr.map(item=>{
                        return {
                            value: item,
                            label: item,
                            disabled: false
                        }
                    })
                    this.value = this.courseName[0].value
                    
                }
            })
        },
        //加载
        getData(){
            this.isShow = false
            this.$ajax.post('grade/banjiGradeList',{
                tbClassId:this.classV
                }).then(res=>{
                    console.log(res.data)
                let result = res.data.tableData;
                if(result.length>0){
                    
                   let keys = Object.keys(result[0])
                   keys = keys.filter(item=>{
                       return item.indexOf(this.value)>-1
                   })
                   let arr_time = []
                   //根据时间表排序
                   this.timeData.forEach(item=>{
                       keys.forEach(key=>{
                           if(key.indexOf(item.name)>-1){
                               arr_time.push(key)
                           }
                       })
                   })
                   this.arr_time = [...arr_time]
                   console.log(arr_time)
                   console.log(keys)
                   this.fst_data = []
                   result.forEach(item=>{
                       
                       let data_temp = []
                       data_temp.push(item['姓名'])
                       data_temp.push(item['学号'])
                       let obj = {}
                       arr_time.forEach(key=>{
                        //    console.log(key)
                        //    console.log(item[key])
                           obj[key] = item[key]===null?0:Number(item[key])
                       })
                       data_temp.push(obj)
                       this.fst_data.push(data_temp)
                       
                    //    this.handleStuData(this.fst_data)
                       this.isShow = true
                    })
                    this.lineHandle()
                    this.handleTbale()
                    console.log(this.fst_data)
                    console.log("dfhjklhsfajkasdhfj")
                }
            })
        },
        lineHandle(){
            let data = [...this.fst_data]
            let y_data = []
            let x_data_temp = [...this.arr_time]
            let x_data = []
            let wishData = []
            this.arr_time.forEach(item=>{
                x_data.push(item.split('-')[1])
                wishData.push(this.expectScore)
            })
            console.log(x_data)
            x_data_temp.forEach(item=>{
                let avg_grade = 0
                data.forEach(item2=>{
                    let it = item2[2]
                    avg_grade += it[item]
                })
                console.log(avg_grade)
                avg_grade = data.length>2?(avg_grade/(data.length-2)).toFixed(2):0
                y_data.push(Number(avg_grade))
            })
            this.y_data = y_data
            console.log(y_data)
            this.chartOptions = {
                  // title: {
                  //   text: '成绩趋势图'
                  // },
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data: [`平均分`, '期望分']
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
                    data: x_data
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
                      name: `平均分`,
                      type: 'line',
                      stack: '总量',
                      data: y_data
                    },
                    // {
                    //   name: `折算分`,
                    //   type: 'line',
                    //   data: converData
                    // }
                  ]
                }
                this.isShow = true
                this.gradeAnalysis(y_data)
        },
        handleTbale(){
            let data = [...this.fst_data]
            let times = [...this.arr_time]
            let temp_arr = []
            times.forEach(item=>{
                let obj = {}
                let ex_count = 0
                let qu_count = 0
                data.forEach(item2=>{
                    let it = item2[2]

                })
            })
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
        //根据最后一次成绩分析学生成绩状况
        gradeAnalysis(){
          let first = ''
          let second = ''
          let third = ''
          let fourth = ''

          let grade=this.y_data[this.y_data.length-1];
          //平均分(保留两位小数)
          let average = (this.y_data.reduce((a, b) => a + b, 0) / this.y_data.length).toFixed(2);
          console.log(average)
          //最高分(保留两位小数)
          let max = Math.max.apply(null, this.y_data).toFixed(2);
          console.log(max)
          //方差
          let variance=this.y_data.reduce((a,b)=>a+Math.pow(b-average,2))/this.y_data.length;
          console.log(variance)
          //标准差(保留两位小数)
          let standardDeviation=Math.sqrt(variance).toFixed(2);
          console.log(standardDeviation)
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
          console.log(second)
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
          let g_html = `<p class='textAn'>（1）班级本科考试发挥<span style='color:${this.isStable(standardDeviation)}'>${first}</span></p>
                        <p class='textAn'>（2）本次考试（最新）成绩为<span style='color:${this.isQualified(grade)}'>${grade}</span>分，处于<span style='color:${this.isQualified(grade)}'>${this.scoredText(grade)}</span>
                          ,<span style='color:${this.isHigh(grade,this.expectScore)}'>${this.scoredCon(grade,this.expectScore)}</span>期望分数<span style='color:${this.isHigh(grade,this.expectScore)}'>${this.scored(grade,this.expectScore)}</span></p>
                        <p class='textAn'>（3）本科平均分为<span style='color:${this.isQualified(average)}'>${average}</span>分
                          ,处于<span style='color:${this.isQualified(average)}'>${second}</span>
                          ,<span style='color:${this.isHigh(average,this.expectScore)}'>${third}</span>期望分数<span style='color:${this.isHigh(average,this.expectScore)}'>${this.scored(average,this.expectScore)}</span></p>
                        <p class='textAn'>（4）期望达标率 ( 平均分达到期望分数次数/总次数 ) 是<span style='color:${this.isHigh(fourth,this.expectScore)}'>${fourth}</span></p>
                        <p class='textAn'>（5）最高平均分为<span style='color:${this.isQualified(max)}'>${max}</span>分，处于<span style='color:${this.isQualified(max)}'>${this.scoredText(max)}</span>
                          ,<span style='color:${this.isHigh(max,this.expectScore)}'>${this.scoredCon(max,this.expectScore)}</span>期望分数<span style='color:${this.isHigh(max,this.expectScore)}'>${this.scored(max,this.expectScore)}</span></p>
                        `
          this.gradeAnalysisHtml=g_html;
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
            return `${Math.abs(c).toFixed(2)}分`
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
