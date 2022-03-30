<template>
  <div class="studentFull">
    <el-breadcrumb separator="/" style="padding: 10px;background-color: azure">
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form style="margin-top: 10px;">
      <el-form-item label="班级:">
        <el-select v-model="currentBjId" placeholder="请选择班级" clearable="" size="mini">
          <el-option v-for="banji in banjis" :key="banji.id" :label="banji.name" :value="banji.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="tableCss">
      <edit-data-table
        v-if="tableVisible"
        pageable
        add
        edit
        delete
        editPage="/student/edit"
        url="student/page"
        deleteUrl="student/delete"
        saveUrl="student/save"
        :columnAttributes="columnAttributes"
        :tableAttribute="tableAttribute"
        :editData="editData"
      ></edit-data-table>
    </div>
  </div>
</template>

<script>
  import EditDataTable from '../EditDataTable.vue'
  export default {
    components:{EditDataTable},
    data() {
      return {
        tableVisible:false,
        currentBjId:'',
        banjis:[
          {
            id:1,
            name:'17级软件1班'
          },{
            id:2,
            name:'17级软件2班'
          },{
            id:3,
            name:'17级软件3班'
          }
        ],
        url:'student/page',
        saveUrl:'student/save',
        deleteUrl:'student/delete',
        tableAttribute:{
          border:true,
          maxHeight:400
        },
        columnAttributes:[
          { label:'序号' , prop:'id' },
          { label:'学号' , prop:'stuNo'},
          { label:'姓名' , prop:'name'}
        ],
        editData:{
          id:'',
          stuNo:'',
          name:'',
          tbClass:{}
        }
      }
    },
    watch:{
      currentBjId(newVal,oldVal){
        this.tableVisible=false;
        if(newVal){
          this.tableAttribute.urlParam={tbClassId:newVal};
          this.$nextTick(()=>{
            this.tableVisible=true;
          })
        }
      }
    },
    created() {
      this.$ajax.post('banji/list',{}).then(res=>{
        var result=res.data;
        this.banjis=result;
      })
    }
  }

</script>

<style>
  .studentFull{
      height: calc(100% - 40px);
      padding: 20px;
      background-color: ghostwhite;
  }
  .tableCss{
    height: calc(100% - 94px);
  }
</style>
