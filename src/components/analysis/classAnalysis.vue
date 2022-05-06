<template>
  <div class="main">
      <el-card>
          <div>班级成绩分析</div>
          
              <el-card>
                  <span>班级</span>
                    <el-select v-model="bjId" placeholder="请选择班级">
                        <el-option v-for="item in bjs" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <span>科目</span>
                    <el-select v-model="courseId" placeholder="请选择科目">
                        <el-option v-for="item in courses" :key="item.id" :label="item.key" :value="item.key"></el-option>
                    </el-select>
                    <el-button @click="handlePie" :disabled='isUsed' type="primary" size="small">分析</el-button>
              </el-card>
              <div v-show="isShow">
              <el-card>
                  <span >成绩解读：</span>
                  <div  v-html="analysisHtml">
                      
                  </div>
              </el-card>
              <el-card>
                  <span>成绩分布：</span>
                  <el-card>
                    <div>
                        <pie :data="pieData"></pie>
                    </div> 
                  </el-card>
                  <el-card>
                      <span>查看详情</span>
                      <el-tabs v-model="activeName" @tab-click="handleClick">
                         <el-tab-pane label="优秀" name="first">
                            <tab-table :tableData='excellent'></tab-table>
                         </el-tab-pane>
                         <el-tab-pane label="良好" name="second">
                            <tab-table :tableData='good'></tab-table>
                         </el-tab-pane>
                         <el-tab-pane label="中等" name="third">
                            <tab-table :tableData='medium'></tab-table>
                         </el-tab-pane>
                         <el-tab-pane label="及格" name="fourth">
                             <tab-table :tableData='pass'></tab-table>
                         </el-tab-pane>
                         <el-tab-pane label="不及格" name="fifth">
                            <tab-table :tableData='fail'></tab-table>
                         </el-tab-pane>
                      </el-tabs>
                  </el-card>
              </el-card> 
              <el-card>
                  <span>排名表：</span>
                  <el-table border :data="levelData" height="500" style="margin-left:90px">
                      <el-table-column prop="rank" label="排名" align="center" width="100">
                          
                      </el-table-column>
                      <el-table-column prop="num" label="学号" align="center" width="250">

                      </el-table-column>
                      <el-table-column prop="name" label="姓名" align="center" width="250">

                      </el-table-column>
                      <el-table-column prop="grade" label="成绩" align="center" width="250">

                      </el-table-column>
                      
                  </el-table>
              </el-card>
              </div>
              <el-card v-show="!isShow" style="height:600px">
                  请选择班级和单次科目，点击分析按钮
              </el-card>
      </el-card>
  </div>
</template>

<script>
import pie from '../echarts/pie.vue';
import tabTable from './tabTable.vue';
export default {
  components: { pie },
    data() {
        return {
            exam_sort: [],
            isShow: false,
            bjId: '',
            bjs: [],
            courses: [],
            courseId: '',
            pieData: [],
            activeName: 'first',
            levelData: [],
            tableData: [],
            analysisHtml: '暂无解读',
            allData: [],
            maxGrade: 100,
            coursesData: [], // 科目表
            //五个数组
            excellent: [],
            good: [],
            medium: [],
            pass: [],
            fail: [],
        }
    },
    components:{
        pie,
        tabTable
    },
    //深度监听
    watch:{
        bjId(newVal,oldVal){
            this.getData(newVal);
        },
        courseId(newVal,oldVal){
            this.coursesData.forEach(item=>{
                if(item.name === newVal){
                    this.maxGrade = item.classHour;
                }
            })
            // this.handlePie();
        },
        tableData(newVal,oldVal){
            this.arrLevel(newVal);
        }
    },
    methods:{
        getClassList(){
            this.$ajax.post('banji/list',{
            }).then(res=>{
                let result = res.data;
                console.log(result);
                if(result.length>0){
                    let arr = [];
                    result.forEach(item=>{
                        arr.push({
                            id:item.id,
                            name:item.name
                        })
                    })
                    this.bjs = arr;
                    this.bjId = this.bjs[0].id;
                }
            })
        },
        getData(bjId){
            console.log(bjId);
            this.isUsed = true; //命名反了，不想改
            this.isShow = false;
            this.courseId = '';
            this.courses = [];
            this.$ajax.post('grade/banjiGradeList',{
                tbClassId:bjId
            }).then(res=>{
                let result = res.data.tableData;
                console.log(result);
                console.log("allgrade")
                if(result.length>0){
                    result.forEach(item =>{
                        this.allData.push(item);
                    })
                    let arr = [];
                    arr = Object.keys(result[0])
                    // arr = arr.map(item=>{
                    //     return item.split('-')[0];
                    // })
                    arr = [...new Set(arr)];
                    // console.log(arr)
                    arr = arr.filter(item=>{
                        // console.log(item)
                        return item!='姓名'&&item!='学号'&&item!='总分'
                    })
                    // console.log(arr)
                    let tem_arr = []
                    tem_arr = arr.map(item=>{
                        return {
                            key:item,
                            value:item
                        }
                    })
                    //课程排序
                    this.coursesData.forEach(item=>{
                        tem_arr.forEach(it=>{
                            if(it.value === item.name){
                                this.courses.push(it);
                            }
                        })
                    })

                    this.courseId = this.courses[0].value;
                    console.log(this.courses);
                    console.log(this.courseId);
                    this.isUsed = false;
                    // this.handlePie()
                }
            })
        },
        handleHtml(){
            console.log('开始解读');
            let html = '';  //解读
            let data = [...this.tableData]
            let first = ''
            let second = ''
            let third = ''
            let fourth = ''
            //最高分
            let max = 0;
            let max_name = [];
            //平均分
            let avg_grade = 0;
            let avg_conver = 0;
            //及格率
            let pre_qua = 0;
            let num_qua = 0;
            //优秀率
            let pre_good = 0;
            let num_good = 0;
            max = data[0].grade;
            data.forEach(item=>{
                if(item.grade === max){
                    let str = `${item.name}（${item.num}）`;
                    max_name.push(str);
                }
                avg_grade += Number(item.grade);
                avg_conver += Number(item.converGrade);
                if(Number(item.converGrade)>=60){
                    num_qua++;
                }
                if(Number(item.converGrade)>=90){
                    num_good++;
                }
            })
            avg_grade = avg_grade/data.length;
            avg_conver = avg_conver/data.length;
            pre_qua = (num_qua/data.length*100).toFixed(2);
            pre_good = (pre_good/data.length*100).toFixed(2);
            max_name = max_name.join('、');
            first = `<div class="analysis-title">（1）<a>${max_name}</a>同学获得本科最高分，分数为<a>${max}分;</div>`;
            second = `<div class="analysis-title">（2）本科平均分为<a>${avg_grade}</a>分，<a>${this.reText(avg_conver)}</a>;</div>`;
            third = `<div class="analysis-title">（3）及格率为<a>${pre_qua}</a>%，及格人数为<a>${num_qua}</a>人;</div>`;
            fourth = `<div class="analysis-title">（4）优秀率为<a>${pre_good}</a>%,优秀人数为<a>${num_good}</a>人。</div>`;
            this.analysisHtml = first+second+third+fourth;
            //将<a>替换成<span style='color:red'>
            this.analysisHtml = this.analysisHtml.replace(/<a/g,'<span style="color:red"');
            //将</a>替换成</span>
            this.analysisHtml = this.analysisHtml.replace(/<\/a>/g,'</span>');

        },
        reText(g){
            if(Number(g)>=60){
                return '及格';
            }else{
                return '不及格';
            }
        },
        handlePie(){
            this.isShow = true;
            let data = []
            this.allData.forEach(item=>{
                data.push({
                    name:item['姓名'],
                    num:item['学号'],
                    grade:item[this.courseId] === null?0:item[this.courseId],
                    converGrade:item[this.courseId] === null?0:item[this.courseId]/this.maxGrade*100
                })
            })
            data = data.sort((a,b)=>{
                return b.grade - a.grade
            })
            //循环增加排名
            data.forEach((item,index)=>{
                item.rank = index+1;
            })
            this.tableData = []
            this.tableData = [...data];

            this.pieData = [...data];
            this.levelData = [...data];
            this.tableData.forEach(item=>{
                item.level = this.levelGrade(item.converGrade);
            })
            this.handleHtml();
            console.log(data);
            console.log("pie")

        },
        handleClick(){

        },
        levelGrade(val){
        if(val<60){
            return 0
        }else if(val<70){
            return 1
        }else if(val<80){
            return 2
        }else if(val<90){
            return 3
        }else{
            return 4
        }
        },
        arrLevel(newVal){
            //判断Level赋值给五个数组
            this.excellent = [];
            this.good = [];
            this.medium = [];
            this.pass = [];
            this.fail = [];
            console.log(newVal);
            for(let i = 0; i < newVal.length; i++){
                console.log(newVal[i].level);
                if(newVal[i].level == 4){
                    this.excellent.push(newVal[i]);
                }else if(newVal[i].level == 3){
                    this.good.push(newVal[i]);
                }else if(newVal[i].level == 2){
                    this.medium.push(newVal[i]);
                }else if(newVal[i].level == 1){
                    this.pass.push(newVal[i]);
                }else if(newVal[i].level == 0){
                    this.fail.push(newVal[i]);
                }
            }
            // console.log(this.excellent);
            // console.log('excellent');
            // console.log(this.good);
            // console.log('good');
            // console.log(this.medium);
            // console.log('medium');
            // console.log(this.pass);
            // console.log('pass');
            // console.log(this.fail);
            // console.log('fail');
        },
        getGradeSort(){
            this.$ajax.post('exam/list',{
            }).then(res=>{
                let result = res.data;
                console.log(result);
                console.log("213");
                if(result.length>0){
                    let arr = [];
                    this.exam_sort = result
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
                    let arr = [...result]
                    let temp = [];
                    this.exam_sort.forEach(item=>{
                        arr.forEach(it=>{
                            if(it.name.indexOf(item.exam_name)>-1){
                                temp.push(it);
                            }
                        })
                    })
                    console.log(temp);
                    console.log("456789");
                    this.coursesData = temp;
                }
            })
        }
        
    },
    created(){
        this.getGradeSort()
        this.getAllCourses()
        this.getClassList();
    },
    mounted(){
        this.getGradeSort()
        this.getAllCourses()
        this.getClassList();

    },


}
</script>

<style>
#sChart {
    width: 100%;
    height: 100%;
    background-color: aliceblue;
}
.analysis-title{
    font-size:20px;
    margin-bottom:10px;
    margin-top: 10px;
}
</style>