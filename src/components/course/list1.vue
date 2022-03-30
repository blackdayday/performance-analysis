<template>
  <edit-data-table add edit delete pageable :url='url' :tableAttribute="tableAttribute"  :saveUrl="saveUrl" :deleteUrl="deleteUrl" :columnAttributes="columnAttributes" :editData="editData" editPage="/course/edit"></edit-data-table>
</template>

<script>
  import EditDataTable from '../EditDataTable.vue'
  export default {
    components:{EditDataTable},
    data() {
      return {
        url: 'course/page',
        saveUrl:'course/save',
        deleteUrl:'course/delete',
        columnAttributes:[
          {label:'序号',prop:'id'},
          {label:'课程名称',prop:'name'},
          {label:'课时数',prop:'classHour'}
        ],
        tableAttribute:{
          border:true,
          maxHeight:400
        },
        editData:{
          id:'',
          name:'',
          classHour:''
        }

      }
    },
  }
</script>

<style>
</style>
