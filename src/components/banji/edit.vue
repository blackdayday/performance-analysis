<template>
  <el-form :model="form" :rules="rules" ref="form">
    <input type="hidden" name="id" v-model="form.id" />
    <el-form-item label="班级名称:" :label-width="labelWidth" prop="name">
      <el-input v-model="form.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="班主任" :label-width="labelWidth" prop="manager">
      <el-input v-model="form.manager" auto-complete="off"></el-input>
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
          manager:''
        },
        rules:{
          name:[{required:true,message:'班级名称不能为空',trigger:'blur'}],
          manager:[{required:true,message:'班主任不能为空',trigger:'blur'}]
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
      });
    }
  }
</script>

<style>
</style>
