<template>
  <div>
      <el-card>
          <div>单次综合分析</div>
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
              <span>时间：</span>
              <el-select v-model="timeV">
                  <el-option
                    v-for="item in timeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                    >
                  </el-option>
              </el-select>
              <el-button @click="loadData" type='primary' size="small" :disabled='isUsed'>分析</el-button>
          </el-card>
         <div v-show="isShow">
          <el-card>
                <div>
                    <div>成绩解读：</div>
                    <span v-html="gradeAnalysisHtml"></span>
                </div>
          </el-card>
          <el-card>
              <div>分布图</div>
              <el-card>
                  <tend-pie :data="pieData"></tend-pie>
              </el-card>
              <el-card>
                  <div>详情</div>
                    <!-- <tab-table></tab-table> -->
              </el-card>
          </el-card>
          <el-card>
              <div>科目详情表</div>
              <el-card>
                  <grade-table :tableData="detailData" :colDetail='colDetail'></grade-table>
              </el-card>
          </el-card>
          <el-card>
              <div>班级排名表</div>
              <el-card>
                  <grade-table :tableData="rankData" :colDetail='rankCol' :ischange="false"></grade-table>
              </el-card>
          </el-card>
          </div>
          <el-card v-show="!isShow" style="height:600px">
              请选择班级和考试时间，并点击分析
          </el-card>
      </el-card>
  </div>
</template>

<script>
import pie from '../echarts/pie.vue'
import tabTable from './tabTable.vue'
import tendPie from '../echarts/tendPie.vue'
import gradeTable from './gradeTable.vue'
export default {
  components: { pie , tendPie , tabTable , gradeTable},
    data(){
        return{
            isShow: false,
            fst_data: [],
            classOptions:[],
            timeOptions:[],
            classV: '',
            timeV: '',
            gradeAnalysisHtml:'',
            pieData:[],
            coursesData:[],
            detailData:[],
            courses:[],
            colDetail:[
                {
                    prop: 'name',
                    label: '科目',
                    align: 'center',
                    width: '180',
                },
                {
                    prop: 'avgGrade',
                    label: '平均分',
                    align: 'center',
                    width: '180',
                },
                {
                    prop: 'avgConGrade',
                    label: '平均折算分',
                    align: 'center',
                    width: '180',
                },
                {
                    prop: 'maxGrade',
                    label: '最高分',
                    align: 'center',
                    width: '180',
                },
                {
                    prop: 'minGrade',
                    label: '最低分',
                    align: 'center',
                    width: '180',
                },
                {
                    prop: 'pre',
                    label: '及格率',
                    align: 'center',
                    width: '180',
                },
            ],
            rankData:[],
            rankCol: [],
            // isUsed:false,
        }
    },
    watch:{
        classV(val){
            this.isShow = false
        },
        
    },
    computed:{
        isUsed(){
            return !this.classV || !this.timeV
        },
    },
    methods:{
        loadData(){
            //等待getData完成
            this.getData()
            // this.getData()
            console.log('开始')
        },
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
                        this.timeOptions.push({
                            id:item.id,
                            name:item.exam_name
                        })
                    })
                    this.timeV = this.timeOptions[0].name
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
                    let obj = {};
                     result.forEach(item=>{
                        obj[item.name] = item.classHour
                    })
                    this.coursesData = obj
                    
                }
            })
        },
        getData(){
            this.isShow = false;
            this.$ajax.post('grade/banjiGradeList',{
                tbClassId:this.classV
                }).then(res=>{
                    console.log(res.data)
                let result = res.data.tableData;
                if(result.length>0){
                    
                   let keys = Object.keys(result[0])
                   keys = keys.filter(item=>{
                       return item.indexOf(this.timeV)>-1
                   })
                //    keys = ['姓名','学号',...keys]
                   console.log(keys)
                   this.fst_data = []
                   result.forEach(item=>{
                       
                       let data_temp = []
                       data_temp.push(item['姓名'])
                       data_temp.push(item['学号'])
                       keys.forEach(key=>{
                           let obj = {}
                           obj.grade = item[key]===null?0:item[key]
                           obj.name = key
                           obj.maxGrade = this.coursesData[key]
                           obj.convertGrade = item[key]===null?0:(item[key]/this.coursesData[key]*100).toFixed(2)
                           data_temp.push(obj)
                       })
                       
                       this.fst_data.push(data_temp)
                       this.handleStuData(this.fst_data)
                       
                    })
                    //饼状图
                       this.pieData = []
                       this.pieData = [...this.fst_data]
                       //详情
                       this.detail()
                        //排名
                        this.totalData()
                       //成绩解读
                       this.analysisDataHtml()
                    console.log(this.fst_data)
                    this.isShow = true;
                }
            })
        },
        handleStuData(data){
            let temp = []
            data.forEach(item=>{
                let avgGrade = 0

                item.forEach(item2=>{
                    if(typeof item2 === 'object'){
                        avgGrade += Number(item2.convertGrade)
                    }
                })
                avgGrade = item.length<=2?0:(avgGrade/(item.length-2)).toFixed(2)
                item.forEach(item2=>{
                    if(typeof item2 === 'object'){
                        item2.tend = this.isTend(avgGrade-item2.convertGrade)
                        // item2.avgGrade = avgGrade
                    }
                })
                let little = 0
                let big = 0
                let liArr = []
                let biArr = []
                item.forEach(item2=>{
                    if(typeof item2 === 'object'){
                        if(item2.tend === 1){
                            little++
                            liArr.push(item2.name.split('-')[0])
                        }else if(item2.tend === 2){
                            big++
                            biArr.push(item2.name.split('-')[0])
                        }
                    }
                })
                item.little = little
                item.big = big
                item.liArr = liArr
                item.biArr = biArr
                item.avgGrade = avgGrade
                item.isTend = little>0||big>0
                item.isliTend = little>0?true:false
                item.isbiTend = big>0?true:false 
            })
            // console.log(data)
            // this.fst_data = temp
            
        },
        analysisDataHtml(){
            let data = []
            data = [...this.fst_data]
            this.bigTend = 0
            data.forEach((item,i)=>{
                if(item.isTend){
                    this.bigTend++
                }
            })
            let str = ''
            let first = ''
            first = `<div class="analysis-first">（1）班上有<span style='color:red'>${this.bigTend}</span>人，出现偏科情况</div>`
            this.gradeAnalysisHtml = first
        },
        //科目数据
        detail(){
            console.log("detail")
            let data = []
            data = [...this.fst_data]
            let courses = []
            data[0].forEach((item2,i) =>{
                if(typeof item2 === 'object'){
                    courses.push(item2.name)
                }
            })
            this.courses = courses
            // let arr_all = []
            let coursesData = []
            courses.forEach(it=>{
                let arr = []
                data.forEach(item=>{
                    item.forEach(item2=>{
                        if(typeof item2 === 'object'){
                            if(item2.name === it){
                                arr.push({
                                    grade:item2.grade,
                                    convertGrade:item2.convertGrade,
                                    name:item2.name
                                    })
                            }
                        }
                    })
                })
                coursesData.push(arr)
            })
            console.log(coursesData)
            console.log(courses)
            let detailData = []
            coursesData.forEach((item,i)=>{
                let obj = {}
                let avg = 0
                let avgCon = 0
                let max = 0
                let min = 0
                let pre = 0
                item.forEach((it,i)=>{
                    avg += Number(it.grade)
                    avgCon += Number(it.convertGrade)
                    if(this.isQualified(it.convertGrade)){
                        pre++
                    }
                    if(i===0){
                        max = it.grade
                        min = it.grade
                    }else{
                        if(it.grade>max){
                            max = it.grade
                        }
                        if(it.grade<min){
                            min = it.grade
                        }
                    }
                })
                avg = (avg/item.length).toFixed(2)
                avgCon = (avgCon/item.length).toFixed(2)
                pre = (pre/item.length*100).toFixed(2)
                obj = {
                    name:item[0].name.split('-')[0],
                    avgGrade:avg,
                    avgConGrade:avgCon,
                    maxGrade:max,
                    minGrade:min,
                    pre:`${pre}%`
                }
                detailData.push(obj)
            })
            this.detailData = [...detailData]
            console.log(detailData)
            console.log('456')
        },
        //总分数据
        totalData(){
            let data = []
            data = [...this.fst_data]
            let temp_data = []
            //写到这了
            data.forEach(item=>{
                let obj = {}
                let total = 0
                obj.name = item[0]
                obj.num = item[1]
                let keys = Object.keys(item)
                item.forEach((item2,i)=>{
                    if(typeof item2 === 'object'){
                        // obj[keys[i]] = item2.grade
                        obj[`${item2.name}`] = item2.grade
                        total += Number(item2.grade)
                    }
                })
                obj.total = total
                temp_data.push(obj)
            })
            temp_data.sort((a,b)=>{
                return b.total-a.total
            })
            temp_data.forEach((item,i)=>{
                item.rank = i+1
            })
            this.rankCol = []
            this.courses.forEach((item,i)=>{
                let obj = {
                    prop: `${item}`,
                    label: `${item}`,
                    align: 'center',
                    width: '100'
                }
                this.rankCol.push(obj)
            })
            this.rankCol.push({
                prop: 'total',
                label: '总分',
                align: 'center',
                width: '100',
            })
            this.rankCol.unshift({
                prop: 'num',
                label: '学号',
                align: 'center',
                width: '100',
            })
            this.rankCol.unshift({
                prop: 'name',
                label: '姓名',
                align: 'center',
                width: '100',
            })
            this.rankCol.unshift({
                prop: 'rank',
                label: '排名',
                align: 'center',
                width: '80',
            })
            
            this.rankData = [...temp_data]
            console.log(this.rankData)
            console.log(this.rankCol)
            console.log(temp_data)
            console.log("temp_data")
            
        },
        //根据判断是否偏科（文字）
        isTend(difScore){
          difScore = Math.abs(difScore)
          if(difScore<15){
            return 0
          }else if(difScore<=20){
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
        //是否合格
        isQualified(grade){
            if(grade>=60){
                return true
            }else{
                return false
            }
        },
    },
    created(){
        this.getClass()
        this.getTime()
        this.getAllCourses()
    }
}
</script>

<style>

</style>