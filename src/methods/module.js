export function debounce(fn, delay = 500){
    let timer;
    return function (){
        let args = arguments;
        if(timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(()=>{
            fn.apply(this, args);
        },delay);
    }
}
export function initChart(){
    let chart = this.$refs.chart
    if(!chart) return

    //监听窗体大小变化
    this.resize = debounce(() => {
        if(chart) {
            chart.resize()
        }
    },200)
    window.removeEventListener('resize',this.resize)
    window.addEventListener('resize',this.resize)
}
