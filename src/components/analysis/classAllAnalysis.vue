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
                    <!-- <tab-table></tab-table> -->
                    <!-- <div v-html="dtaHtml"></div> -->
                    <div class="analysis-title">
                    <span>偏科情况：</span>
                    <span v-for="(item,index) in stu_data" :key="index" @click="showTendStu(item)" style="color:red">{{item[0]}}({{item[1]}}){{end(stu_data.length,index)}}</span>
                    <el-tooltip placement="top">
                      <div slot="content">可点击学生名字，查看学生成绩</div>
                      <i class="el-icon-warning"></i>
                    </el-tooltip>
                    </div>
                    <div v-show="showTable">
                        <div>{{stu}}的成绩：</div>
                        <el-table   :data="stu_table" border height="150">
                            <el-table-column v-for="(item,index) in col_stu" :key='index' :prop="item.prop" :label="item.label" :align="item.align" :width="item.width">
                            </el-table-column>
                         </el-table>
                    </div>
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
                  <grade-table :tableData="rankData"  :colDetail='rankCol' :ischange="false"></grade-table>
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
            dtaHtml: '',
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
                {
                    prop: 'good',
                    label: '优秀率',
                    align: 'center',
                    width: '180',
                },
            ],
            rankData:[],
            rankCol: [],
            stu_data: [],
            stu_table: [],
            col_stu: [],
            showTable: false,
            stu: '',
            // height: '50px',
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
        end(a,b){
            if(a === b+1){
                return ''
            }
            return '、'
        },
        loadData(){
            //等待getData完成
            this.showTable = false
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
                       this.pieTend()
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
            let data_t = [...this.detailData]
            
            
            data_t.forEach((item,i)=>{
                item.goodnum = Number(item.good.split('%')[0])
                item.prenum = Number(item.pre.split('%')[0])
            })
            data_t.sort((a,b)=>{return b.goodnum-a.goodnum})
            //数组排序
            let maxgood = data_t[0].goodnum
            // console.log(maxgood)
            // console.log(data_t)
            data_t.sort((a,b)=>{return b.prenum-a.prenum})
            let maxpre = data_t[0].prenum
            // console.log(maxpre)
            // console.log(data_t)
            // console.log(111)
            let arr_good = []
            let arr_pre = []
            data_t.forEach((item,i)=>{
                if(item.goodnum === maxgood){
                    arr_good.push(item.name)
                }
                if(item.prenum === maxpre){
                    arr_pre.push(item.name)
                }
            })
            //数组转字符串
            arr_good = arr_good.join('、')
            arr_pre = arr_pre.join('、')
            let sec = ''
            let trd = ''
            
            sec = `<div class="analysis-title">（2）<span style='color:red'>${arr_pre}</span>及格率最高，为<span style='color:red'>${maxpre}%</span></div>`
            if(maxpre === 0){
                sec = `<div class="analysis-title">（2）所有科目及格率都为0%</div>`
            }
            trd = `<div class="analysis-title">（3）<span style='color:red'>${arr_good}</span>科优秀率最高，为<span style='color:red'>${maxgood}%</span></div>`
            if(maxgood === 0){
                trd = '<div class="analysis-title">（3）所有科目优秀率都为0%</div>'
            }
            let str = ''
            let first = ''
            first = `<div class="analysis-title">（1）班上有<span style='color:red'>${this.bigTend}</span>人，出现偏科情况</div>`
            let four = ``
            let five = ``
            let temp_arr = []
            console.log(this.rankData)
            let totaL_max = this.rankData[0].total
            let total_avg = 0
            this.rankData.forEach((item,i)=>{
                total_avg += item.total
                if(item.total === totaL_max){
                    temp_arr.push(`${item.name}（${item.num}）`)
                }
            })
            total_avg = (total_avg/this.rankData.length).toFixed(2)
            temp_arr = temp_arr.join('、')
            four = `<div class="analysis-title">（4）<span style='color:red'>${temp_arr}</span>同学获得班级总分最高分，分数为<span style='color:red'>${totaL_max}</span>分</div>`
            five = `<div class="analysis-title">（5）班级总分平均分为<span style='color:red'>${total_avg}</span>分</div>`
            this.gradeAnalysisHtml = first+sec+trd+four+five
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
                let good = 0
                item.forEach((it,i)=>{
                    avg += Number(it.grade)
                    avgCon += Number(it.convertGrade)
                    if(this.isQualified(it.convertGrade)){
                        pre++
                    }
                    if(Number(it.convertGrade)>=90){
                        good++
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
                good = (good/item.length*100).toFixed(2)
                obj = {
                    name:item[0].name.split('-')[0],
                    avgGrade:avg,
                    avgConGrade:avgCon,
                    maxGrade:max,
                    minGrade:min,
                    pre:`${pre}%`,
                    good:`${good}%`
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
        pieTend(){
            let data = [...this.pieData]
            let showTend = false
            let names = []
            let nums = []
            let stu_data = []
            data.forEach(item =>{
                if(item.isTend){
                    showTend = true
                    names.push(item[0])
                    nums.push(item[1])
                    stu_data.push(item)
                }
            })
            this.stu_data = [...stu_data]
            console.log(names)
            console.log("names")
            let inithtml = `<span>偏科情况：</span>`
            if(showTend){
                // this.pieTendHtml = inithtml
                let str = ''
                names.forEach((item,i)=>{
                    str += `<button style='color:red' @click='showTendStu(${i})'>${item}(${nums[i]})</button>`
                })
                this.dtaHtml = inithtml+str
            }else{
                inithtml += '没有同学偏科'
                this.dtaHtml = inithtml
            }
        },
        showTendStu(item){
            console.log(item)
            let data = [...item]
            let obj = {}
            let obj_temp = {}
            this.stu = data[0]+'('+data[1]+')'
            data.forEach((it,i)=>{
                if(typeof it === 'object'){
                    let sub = it.name.split('-')[0]
                    obj[`${sub}`] = it.grade
                    obj_temp[`${sub}`] = this.tendStr(it.tend)
                }
            })
            this.stu_table = [obj,obj_temp]
            let keys = Object.keys(obj)
            let arr =[]
            keys.forEach(item=>{
                arr.push({
                    label:item,
                    prop:item,
                    align: 'center',
                    width: '100',
                })
            })
            this.col_stu = [...arr]
            this.showTable = true
            console.log(this.col_stu)
            console.log(this.stu_table)
            console.log("stu_table")
        },
        tendStr(tend){
            tend = Number(tend)
            if(tend === 0){
                return '正常'
            }else if(tend === 1){
                return '稍偏科'
            }else if(tend === 2){
                return '偏科'
            }
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
.analysis-title{
    font-size:20px;
    margin-bottom:10px;
    margin-top: 10px;
}
</style>