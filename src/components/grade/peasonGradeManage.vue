<template>
  <el-card class="box-card">
    <div slot="header">
      <span>个人成绩管理</span>
    </div>
      <div class="card-body">
        <el-row class="row">
          <el-col :span="24">
            <el-select size="mini" v-model="bjId" placeholder="请选择班级" @change="onBjChange">
              <el-option v-for="bj in bjs" :key="bj.id" :label="bj.name" :value="bj.id"></el-option>
            </el-select>
            <el-select size="mini" v-model="studentId" placeholder="请选择学生" @change="onStudentChange">
              <el-option v-for="student in stus" :key="student.id" :label="student.name" :value="student.id"></el-option>
            </el-select>
            <el-button icon="el-icon-search" type="primary" size="mini" :disabled="searchBtnDisable" @click="onSearchClick">查询</el-button>
          </el-col>
        </el-row>
        <div class="table">
          <el-table :data="data" size="mini" border ref="singleTable" highlight-current-row v-if="tableVisible">
            <el-table-column label="课程" prop="course.name"></el-table-column>
            <el-table-column label="成绩">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.grade" @change="onGradeChange(scope.row)"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableVisible:false,
      searchBtnDisable:true,
      bjId: '',
      studentId:'',
      bjs:[{
        id:1,
        name:'17级软件1班'
      },{
        id:2,
        name:'17级软件2班'
      }],
      stus:[{
        id:1,
        name:'张三'
      },{
        id:2,
        name:'李四'
      }],
      cardHeight:600,
      maxHeight:400,
      data:[],
    }
  },
  methods:{
    onBjChange(val){
      if(val){
        this.$ajax.post('student/list',{tbClassId:this.bjId}).then(res=>{
          var result=res.data;
          this.stus=result;
          this.studentId='';
          this.searchBtnDisable=true;
        })
      }else{
        this.stus=[];
      }
      this.tableVisible=false;
    },
    onStudentChange(){
      this.tableVisible=false;
      this.searchBtnDisable=false;
    },
    onSearchClick(){
      this.$ajax.post('grade/list',{studentId:this.studentId}).then(res=>{
        this.data=res.data;
        this.tableVisible=true;
      })
    },
    onGradeChange(row){
      if(Number(row.grade)){
        var param={
          id:row.id,
          studentId:row.student.id,
          courseId:row.course.id,
          grade:row.grade
          };
          console.log(row.grade)
        this.$ajax.post('grade/save',param).then(res=>{
          console.log(res.data)
          var result=res.data;
          if(result.success){
            this.$notify.success('成绩修改成功');
          }
        })
      }else{
        this.$notify.error({message:'成绩必须为数字',duration:2000});
        row.grade='';
      }
    }
   },
  mounted() {
    this.$ajax.post('banji/list',{}).then(res=>{
      var result=res.data;
      this.bjs=result;
      this.tableVisible=false;
    });
  }
}

</script>

<style>
  .box-card {
    height: calc(100% - 2px);
  }
  .row{
    margin: 0 0 5px 0;
  }
  .card-body {
    height: calc(100% );
  }
  .table {
    height: calc(100% - 33px);
  }
  /* .el-table--fit {
    height: 100%;
  } */
</style>
