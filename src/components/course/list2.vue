<template>
  <el-card style="min-height: 100%;">
    <div slot="header">
      <span>课程管理</span>
    </div>
    <data-table add edit delete refresh
      :tableAttribute="tableAttribute"
      :columnAttributes="columnAttributes"
      :rules="rules"
      :formObj="form"
      size="small"
      path="course/"
      pageable
    >
      <template v-slot:form>
        <input type="hidden" name="id" v-model="form.id"/>
        <el-form-item label="课程名称" :label-width="labelWidth" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课时数" :label-width="labelWidth" prop="classHour">
          <el-input v-model="form.classHour" auto-complete="off"></el-input>
        </el-form-item>
      </template>
    </data-table>

  </el-card>

</template>

<script>
  import dataTable from '../dataTable.vue'
  export default {
    components:{dataTable},
    data() {
      return {
        tableAttribute:{
          border:true,

        },
        columnAttributes:[
          {label:'序号',prop:'id'},
          {label:'课程名称',prop:'name'},
          {label:'课时数',prop:'classHour'}
        ],
        form:{
          id:'',
          name:'',
          classHour:''
        },
        labelWidth: '100px',
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
        }
      }
    }

  }

</script>

<style>

</style>
