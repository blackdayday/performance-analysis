<template>
  <el-form :model="form" ref="form" :rules="rules">
    <input type="hidden" name="id" v-model="form.id"/>
    <el-form-item label="课程名称:" :label-width="labelWidth" prop="name">
      <el-input v-model="form.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="课时数" :label-width="labelWidth" prop="classHour">
      <el-input v-model="form.classHour" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import {mapState} from 'vuex';
export default {
  computed:mapState(['params']),
  data() {
    return {
      form: {
        id:'',
        name:'',
        classHour:''
      },
      rules:{
        name:[{required:true,message:'课程名称不能为空',trigger:'blur'}],
        classHour:[
          {required:true,message:'课时数不能为空',trigger:'blur'},
          {
             type:'number',
             message:'课时数必须为数字',
             trigger:'blur',
             transform: (value) => Number(value)
          }
        ]
      },
      labelWidth:'100px'
    }
  },
  created() {
    this.form=this.params;
  },
  updated(){
    this.$refs.form.validate(valid=>{
      this.$emit('change',valid);
    })
  },


}
</script>

<style>
</style>
