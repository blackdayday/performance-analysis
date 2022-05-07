<template>
  <div >
      <div v-if="1">
        <el-card>
           <h4>成绩解读：</h4>
           <div v-html="anyHtml"></div>
        </el-card>
        <el-card>
          <span>占比图：</span>
          <div class="cp">
              <el-card class="one">
                 <span>班级：</span>
                  <div  id='chartpie'></div>
              </el-card>
              <el-card class="two">
                 <span>对比班级：</span>
                  <div  id='cpchartpie'></div>
              </el-card>
          </div>
        </el-card>
      <el-card>
        <span>对比详情表：</span>
        <el-table :data="tableData" border height="200" width='100%'>
             <el-table-column v-for="(item,index) in colDetail" :key='index' :prop="item.prop" :label="item.label" :align="item.align" :width="item.width"></el-table-column>
        </el-table>
      </el-card>
      
      </div>
    <div v-else ref="mychartpie" id='mychartpie'>
      暂无数据
    </div>
  </div>
</template>

<script>
export default {
//   name:'cp-pie',
  data(){
    return{
      options:{},
      options_cp:{},
      show:false,
      styleWidth:'',
      tableData: [],
      colDetail: [],
      anyHtml: '暂无解读'
    }
  },
  props:{
    data:{
      type:Array,
      default:()=>[]
    },
    cpdata:{
      type:Array,
      default:()=>[]
    }
    
  },
  watch:{
    data(val){
      console.log(val);
      console.log('pie')
      this.loadData()
    },
    options(val){
      console.log(val);
    //   this.loadData()
    this.initCharts()
    },
    
  },
  mounted(){
    this.loadData()
    this.initCharts()
    // this.watchChart()
  },
  destroyed(){
    // window.removeEventListener('resize', this.resize);
  },
  methods:{
    loadData(){
        let data_temp = [...this.data]
        let data_cp = [...this.cpdata]
        // let data_temp = []
        data_temp.forEach(item=>{
          item.level = this.levelGrade(item.converGrade)
        })
        data_cp.forEach(item=>{
          item.level = this.levelGrade(item.converGrade)
        })
        console.log(data_temp)
        console.log(data_cp)
        console.log("data_temp")
        let level=[
            { value: 0, name: '不及格' },
            { value: 0, name: '合格' },
            { value: 0, name: '中等' },
            { value: 0, name: '良好' },
            { value: 0, name: '优秀' }
        ]
        let level_cp=[
            { value: 0, name: '不及格' },
            { value: 0, name: '合格' },
            { value: 0, name: '中等' },
            { value: 0, name: '良好' },
            { value: 0, name: '优秀' }
        ]

        data_temp.forEach(item=>{
            level[item.level].value++
        })
        data_temp.forEach(item=>{
            item.level = this.levelGrade(item.converGrade)
        })
        // console.log(1)
        data_cp.forEach(item=>{
            level_cp[item.level].value++
        })
        data_cp.forEach(item=>{
             item.level = this.levelGrade(item.converGrade)
        })
        this.handleTable([...data_temp],[...data_cp])
        // console.log(1)
        // console.log(data_cp)
        // console.log(data_temp)
        this.options = {
           title: {
             left: 'center'
           },
           tooltip: {
             trigger: 'item'
           },
           legend: {
             orient: 'horizontal',
             left: 'center'
           },
           series: [
             {
               name: '成绩分布',
               type: 'pie',
               radius: '60%',
               width: '100%',
                height: '100%',
               data: level,
               emphasis: {
                 itemStyle: {
                   shadowBlur: 10,
                   shadowOffsetX: 0,
                   shadowColor: 'rgba(0, 0, 0, 0.5)'
                 }
               }
             }
            ]
        }
        this.options_cp =  {
           title: {
             left: 'center'
           },
           tooltip: {
             trigger: 'item'
           },
           legend: {
             orient: 'horizontal',
             left: 'center'
           },
           series: [
             {
               name: '成绩分布',
               type: 'pie',
               radius: '60%',
               width: '100%',
               height: '100%',
               data: level_cp,
               emphasis: {
                 itemStyle: {
                   shadowBlur: 10,
                   shadowOffsetX: 0,
                   shadowColor: 'rgba(0, 0, 0, 0.5)'
                 }
               }
             }
            ]
        }      
    },
    handleTable(data,cpdata){
        let tableData = []
        let colDetail = []
        let obj_temp = {
            num_all: 0,
            excellent: 0,
            exc_pre: 0,
            good: 0,
            good_pre: 0,
            medium: 0,
            medium_pre: 0,
            pass: 0,
            pass_pre: 0,
            fail: 0,
            fail_pre: 0,
            max_grade: 0,
            avg_grade: 0,
            ispass: 0,
        }
        //深拷贝
        let obj = JSON.parse(JSON.stringify(obj_temp))
        let obj_cp = JSON.parse(JSON.stringify(obj_temp))
        let len = data.length
        let len_cp = cpdata.length
        data.forEach((item,index)=>{
            if(item.level === 0){
                obj.fail++
            }else if(item.level === 1){
                obj.pass++
                obj.ispass++
            }else if(item.level === 2){
                obj.medium++
                obj.ispass++
            }else if(item.level === 3){
                obj.good++
                obj.ispass++
            }else if(item.level === 4){
                obj.excellent++
                obj.ispass++
            }
            obj.avg_grade += item.grade
        })
        obj.exc_pre = (obj.excellent/len*100).toFixed(2)+'%'
        obj.good_pre = (obj.good/len*100).toFixed(2)+'%'
        obj.medium_pre = (obj.medium/len*100).toFixed(2)+'%'
        obj.pass_pre = (obj.pass/len*100).toFixed(2)+'%'
        obj.fail_pre = (obj.fail/len*100).toFixed(2)+'%'
        obj.ispass = (obj.ispass/len*100).toFixed(2)
        obj.max_grade = data[0].grade
        obj.num_all = len
        obj.avg_grade = (obj.avg_grade/len).toFixed(2)
        obj.class = '本班级'
        cpdata.forEach((item,index)=>{
            if(item.level === 0){
                obj_cp.fail++
            }else if(item.level === 1){
                obj_cp.pass++
                obj_cp.ispass++
            }else if(item.level === 2){
                obj_cp.medium++
                obj_cp.ispass++
            }else if(item.level === 3){
                obj_cp.good++
                obj_cp.ispass++
            }else if(item.level === 4){
                obj_cp.excellent++
                obj_cp.ispass++
            }
            obj_cp.avg_grade += item.grade
        })
        obj_cp.exc_pre = (obj_cp.excellent/len_cp*100).toFixed(2)+'%'
        obj_cp.good_pre = (obj_cp.good/len_cp*100).toFixed(2)+'%'
        obj_cp.medium_pre = (obj_cp.medium/len_cp*100).toFixed(2)+'%'
        obj_cp.pass_pre = (obj_cp.pass/len_cp*100).toFixed(2)+'%'
        obj_cp.fail_pre = (obj_cp.fail/len_cp*100).toFixed(2)+'%' 
        obj_cp.ispass = (obj_cp.ispass/len_cp*100).toFixed(2)
        obj_cp.max_grade = cpdata[0].grade
        obj_cp.num_all = len_cp
        obj_cp.avg_grade = (obj_cp.avg_grade/len_cp).toFixed(2)
        obj_cp.class = '对比班级'
        tableData.push(obj)
        tableData.push(obj_cp)
        let arr = ['班级','总人数','优秀人数','优秀率','良好人数','良好率','中等人数','中等率','及格人数','及格率','不及格人数','不及格率']
        let arr_prop = ['class','num_all','excellent','exc_pre','good','good_pre','medium','medium_pre','pass','pass_pre','fail','fail_pre']
        
        arr.forEach((item,i)=>{
            colDetail.push({
                prop: arr_prop[i],
                label: item,
                align: 'center',
                width: '100'
            })
        })
        this.tableData = [...tableData]
        this.colDetail = [...colDetail]
        console.log(this.tableData)
        console.log(this.colDetail)
        console.log(47865456387)
        this.handleHtml([...tableData])
    },
    handleHtml(data){
        let html = ''
        let a = data[0]
        let b = data[1] 
        //平均分
        html += `<a>（1）本班的平均分为<b>${a.avg_grade}</b>,对比班级的平均分为<b>${b.avg_grade}</b>,相比<b>${this.cpGrade((a.avg_grade-b.avg_grade).toFixed(2))}</b></a>`
        //最高分
        html += `<a>（2）本班的最高分为<b>${a.max_grade}</b>,对比班级的最高分为<b>${b.max_grade}</b>,相比<b>${this.cpGrade(a.max_grade-b.max_grade)}</b></a>`
        //优秀率
        // html += `<a>（4）本班的优秀率为<b>${a.exc_pre}</b>,对比班级的优秀率为${b.exc_pre},相比${a.exc_pre-b.exc_pre}</a>`
        //pass率
        html += `<a>（3）本班的及格率(折算分高于60)为<b>${a.ispass}%</b>,对比班级的及格率为<b>${b.ispass}%</b>,相比<b>${this.cpPre(a.ispass-b.ispass)}</b></a>`
        //将<a>替换为<div class="analysis-title">
        html = html.replace(/<a/g,'<div class="analysis-title"')
        html = html.replace(/<\/a>/g,'</div>')
        //将<b>替换为<span style='color:red'>
        html = html.replace(/<b/g,'<span style="color:red"')
        html = html.replace(/<\/b>/g,'</span>')
        this.anyHtml = html
    },
    cpGrade(d){
        if(d>0){
            return `高${d}分`
        }else if(d<0){
            return `低${-d}分`
        }else{
            return '一样'
        }
    },
    cpPre(d){
        if(d>0){
            return `高${d}%`
        }else if(d<0){
            return `低${-d}%`
        }else{
            return '一样'
        }
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
    initCharts(){
      var myChartpie = this.$echarts.init(document.getElementById('chartpie'))
      var cpChartpie = this.$echarts.init(document.getElementById('cpchartpie'))
      console.log(this.options)
      myChartpie.setOption(this.options) 
      cpChartpie.setOption(this.options_cp)
    },
    
  }
}
</script>

<style>
#mychartpie {
  height: 500px;

}
#chartpie {
  height: 500px;
  width: 600px;
}
#cpchartpie {
  height: 500px;
  width: 600px;
}

.cp{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.one{
  width: 50%;
}
.two{
  width: 50%;
}
.analysis-title{
    font-size:20px;
    margin-bottom:10px;
    margin-top: 10px;
}
</style>