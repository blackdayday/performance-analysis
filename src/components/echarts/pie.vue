<template>
  <div ref='chart'>
      <div id='mychartpie' v-if="1" :style="styleWidth" ref="mychartpie">

      </div>
    <div v-else>
      暂无数据
    </div>
  </div>
</template>

<script>
import { debounce } from '../../methods/module.js'
export default {
  name:'pie',
  data(){
    return{
      options:{},
      show:false,
      styleWidth:'',
    }
  },
  props:{
    data:{
      type:Array,
      default:()=>[]
    },
    
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
    this.watchChart()
  },
  destroyed(){
    window.removeEventListener('resize', this.resize);
  },
  methods:{
    loadData(){
        let data_temp = this.data
        data_temp.forEach(item=>{
          item.level = this.levelGrade(item.converGrade)
        })
        console.log(data_temp)
        console.log("data_temp")
        let level=[
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
        console.log(data_temp)
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
      var myChartpie = this.$echarts.init(document.getElementById('mychartpie'))
      console.log(this.options)
      myChartpie.setOption(this.options) 
    },
    //窗体变化
    watchChart(){
      let chart = this.$refs.chart
      if(!chart) return
      console.log(chart);
      this.chartWidth = chart.clientWidth
      console.log(this.chartWidth);
      //监听窗体大小变化
      this.resize = debounce(() => {
        if(chart){
          this.chartWidth = chart.clientWidth
          console.log(this.chartWidth);
          let width = this.chartWidth-30
          this.styleWidth = `width:${width}px`
          console.log(this.styleWidth)
          this.$echarts.dispose(document.getElementById('mychartpie'))
          this.initCharts()
        }
      }, 1000)
      window.removeEventListener('resize', this.resize)
      window.addEventListener('resize', this.resize)
    },
  }
}
</script>

<style>
#mychartpie {
  height: 500px;
  width: 1000px;
}
</style>