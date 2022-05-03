<template>
  <div ref='chart'>
      <div id='mychart' v-show="isShow" :style="styleWidth" ref="mychart">

      </div>
    <div v-if="!isShow">
      暂无数据
    </div>
  </div>
</template>

<script>
import { debounce } from '../../methods/module.js'
export default {
  name:'line-chart',
  data(){
    return{
      options:{},
      show:false,
      styleWidth:'',
    }
  },
  props:{
    chartOptions:{
      type:Object,
      default:{}
    },
    isShow:{
      type:Boolean,
      default:false
    },
    // xData:{
    //   type:Array,
    //   default:[]
    // },
    // yData:{
    //   type:Array,
    //   default:[]
    // },
  },
  computed:{
    
  },
  watch:{
    chartOptions(val){
      this.initCharts()
    }
    // xData(val){
    //   console.log(val);
    //   if(val.length>0){
    //     this.initCharts()
    //   }
    // },
    // yData(val){
    //   console.log(val);
    //   this.initCharts()
    // },
  },
  mounted(){
    this.initCharts()
    this.watchChart()
  },
  destroyed(){
    window.removeEventListener('resize', this.resize);
  },
  methods:{
    initCharts(){
      var myChart = this.$echarts.init(document.getElementById('mychart'))
     
      myChart.setOption(this.chartOptions) 
    },
    //窗体变化
    watchChart(){
      let chart = this.$refs.chart
      if(!chart) return
      // console.log(chart);
      this.chartWidth = chart.clientWidth
      // console.log(this.chartWidth);
      //监听窗体大小变化
      this.resize = debounce(() => {
        if(chart){
          this.chartWidth = chart.clientWidth
          // console.log(this.chartWidth);
          let width = this.chartWidth-30
          this.styleWidth = `width:${width}px`
          // console.log(this.styleWidth)
          this.$echarts.dispose(document.getElementById('mychart'))
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
#mychart{
  height: 500px;
  width: 1000px;
}
</style>