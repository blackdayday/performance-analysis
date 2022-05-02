<template>
  <button @click="textShow()"></button>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        textShow(){
            let all = ''
            for(let i =0;i<1000;i++){
                let a = Math.round(Math.random()*100)
                all += `INSERT INTO 'grade' VALUES('${i}','${a}','1','2');`
            }
            console.log(all)
        }
    }
}
</script>

<style>

</style>