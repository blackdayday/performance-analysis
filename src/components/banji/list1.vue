<template>
  <el-card style="min-height: 100%;">
    <div slot="header">
      <span>班级管理</span>
    </div>
    <data-table size="small" add edit delete refresh
      :tableAttribute="tableAttribute"
      :columnAttributes="columnAttributes"
      :rules="rules"
      :formObj="form"
      path="banji/"
      pageable
    >
      <template v-slot:form>
        <input type="hidden" name="id" v-model="form.id" />
        <el-form-item label="班级名称" :label-width="labelWidth" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="班主任" :label-width="labelWidth" prop="manager">
          <el-input v-model="form.manager" auto-complete="off"></el-input>
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
        tableVisiable: false,
        url: 'banji/page',
        saveUrl:'banji/save',
        deleteUrl:'banji/delete',
        columnAttributes:[
          {label:'序号',prop:'id'},
          {label:'班级名称',prop:'name'},
          {label:'班主任',prop:'manager'}
        ],
        tableAttribute:{
          border:true
        },
        form:{
          id:'',
          name:'',
          manager:''
        },
        cardBodyStyle:{
          height: '400'
        },
        rules:{
          name:[{required:true,message:'班级名称不能为空',trigger:'blur'}],
          manager:[{required:true,message:'班主任不能为空',trigger:'blur'}]
        },
        labelWidth: '100px',

      }
    },
    created() {

    },
    mounted() {
      // var cardHeight=window.getComputedStyle(this.$refs.card).height;
      // var cardBodyHeight=cardHeight.substr(0,cardHeight.length-2)-(20.8+37+40);
      // this.cardBodyStyle.height=cardBodyHeight+'px';
      // this.tableAttribute.maxHeight=cardBodyHeight-72;
      this.tableVisiable=true;
      // console.log(this.cardBodyStyle);
    }
  }
</script>

<style>
.box-card{
  height: 100%;
}
</style>
