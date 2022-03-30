<template>
  <el-form :model="form" :rules="rules" ref="form">
    <input type="hidden" name="id" v-model="form.id"/>
    <input type="hidden" name="tbClassId" v-model="form.tbClassId"/>
    <el-form-item label="学号:" :label-width="labelWidth" prop="stuNo">
      <el-input v-model="form.stuNo" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="姓名:" :label-width="labelWidth" prop="name">
      <el-input v-model="form.name" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    computed:mapState(['params']),
    data() {
      return {
        form: {
          id:'',
          name:'',
          stuNo:'',
          tbClassId:''
        },
        rules:{
          stuNo:[{
            required:true,
            message:'学号不能为空',
            trigger:'blur'
          },{
            type:'number',
            message:'学号必须为数字',
            trigger:'blur',
            transform: (value) => Number(value)
          }],
          name:[{required:true,message:'姓名不能为空',trigger:'blur'}]
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
    }
  }
</script>

<style>
</style>
