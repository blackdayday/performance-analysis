<template>
  <el-card style="min-height: 100%;">
    <div slot="header">
      <span>学生管理</span>
    </div>
    <div class="my-card-body">
      <div style="flex-grow: 0;padding-bottom: 5px;">
        <el-select size="small" clearable v-model="currentBjId" placeholder="请选择班级">
          <el-option v-for="bj in banjis" :key="bj.id" :label="bj.name" :value="bj.id"></el-option>
        </el-select>
      </div>
      <div style="flex-grow: 1;width: 100%;">
        <data-table ref="hihi" v-if="tableVisible" add edit delete refresh
          :tableAttribute="tableAttribute"
          :columnAttributes="columnAttributes"
          :rules="rules"
          :formObj="form"
          path="student/"
          pageable
          @current-change="currentChange"
        >
          <template slot="form">
            <input type="hidden" name="id" v-model="form.id"/>
            <input type="hidden" name="tbClassId" v-model="form.tbClassId"/>
            <el-form-item label="学号:" :label-width="labelWidth" prop="stuNo">
              <el-input v-model="form.stuNo" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="姓名:" :label-width="labelWidth" prop="name">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
          </template>
          <template slot="buttons">
            <el-button size="small" icon="el-icon-key" type="info" @click="resetPwd" :disabled="modifyDisable">密码复位</el-button>
          </template>
        </data-table>
      </div>
    </div>
  </el-card>
</template>

<script>
  import dataTable from '../dataTable.vue'
  export default {
    components:{dataTable},
    data() {
      return {
        currentBjId:'',
        modifyDisable:true,
        currentRow:'',
        banjis:[{id:1,name:'17级软件1班'},{id:2,name:'17级软件2班'}],
        path:'/student',
        tableAttribute:{
          border:true
        },
        columnAttributes:[
          {label:'序号',prop:'id'},
          {label:'学号',prop:'stuNo'},
          {label:'姓名',prop:'name'}
        ],
        form:{
          id:'',
          name:'',
          stuNo:'',
          tbClassId:''
        },
        tableVisible:false,
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
      this.$ajax.post('banji/list',{}).then(res=>{
        var result=res.data;
        this.banjis=result;
      })
    },
    watch: {
      currentBjId(val, oldValue) {
        this.tableVisible=false;
        if(val){
          this.tableAttribute.urlParam={tbClassId:val};
          this.$nextTick(()=>{
            this.tableVisible=true;
          })
        }
      }
    },
    methods:{
      currentChange(val,modifyDisable){
        this.modifyDisable=modifyDisable;
        this.currentRow=val;
      },
      resetPwd(){
        this.$confirm('是否要重置这个学生的密码？','提示',{
          onfirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          var id=this.currentRow.id;
          this.$ajax.post('student/resetPwd',{id:id}).then(res=>{
            var result=res.data;
            if(result.success){
              this.$notify.success({
                message:result.msg,
                duration:2000
              });
            }else{
              this.$notify.error({
                message:result.msg,
                duration:2000
              })
            }
          })
        }).catch(()=>{})
      }
    }
  }

</script>

<style>
  .my-card-body{
    width:100%;
    display: flex;
    flex-direction: column;
  }
  .row1 {
    height: 'auto';
    flex-grow: 0;
  }

</style>
