<template>
  <div class="fullHeight">
    <!-- 编辑对话框 -->
    <el-dialog title="编辑" :visible.sync="showDialog">
      <el-form :model="form">
        <input type="hidden" name="id" v-model="form.id"/>
        <el-form-item label="课程名称:" :label-width="labelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课时数" :label-width="labelWidth">
          <el-input v-model="form.classHour" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveCourse">提交</el-button>
      </div>
    </el-dialog>
    <el-card class="box-card">
      <div slot="header">
        <span>课程管理</span>
      </div>
      <el-row style="margin-bottom: 2px;">
        <el-col span="21">
          <el-button size="small" icon="el-icon-plus" type="info" @click="add">新增班级</el-button>
          <el-button size="small" icon="el-icon-refresh" type="success" @click="refresh">刷新表格</el-button>
        </el-col>
        <el-col :span="3">
        <el-input
          prefix-icon="el-icon-search"
          placeholder="搜索"
          clearable
          size="small"
          v-model="queryParam.search"
          @change="searchChange"></el-input>
        </el-col>
      </el-row>
      <el-table :data="tableData" border small max-height="460" style="width: 100%;">
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="name" label="课程名称"></el-table-column>
        <el-table-column prop="classHour" label="课时数"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[2, 10, 20, 50, 100, 200]"
          :page-size="queryParam.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    computed:{
      currentPage(){
        return this.queryParam.offset/this.queryParam.limit+1;
      }
    },
    data() {
      return {
        showDialog: false,
        form:{
          id:'',
          name:'',
          classHour:''
        },
        labelWidth:"100px",
        tableData:[],
        queryParam:{
          limit:20,
          offset:1,
          sort:'id',
          order:'asc',
          search:''
        },
        total:0

      }
    },
    methods:{
      saveCourse(){
        this.$ajax.post('course/save',this.form).then(res=>{
          var result=res.data;
          if(result.success){
            this.$notify.success({
              title:'提示',
              message:result.msg,
              duration:2000
            });
            this.showDialog=false;
            this.refrushTable();
          }else{
            this.$notify.error({
              title:'提示',
              message:result.msg,
              duration:2000
            })
          }
        }).catch(e=>{
          this.$message.error({
            title:'提示',
            message:'网络连接失败...'
          })
        })
      },
      refrushTable(){
        this.$ajax.post('course/page',this.queryParam).then(res=>{
          var result=res.data;
          this.tableData=result.rows;
          this.total=result.total;
        });
      },
      refresh(){
        this.queryParam.offset=0;
        this.queryParam.search='';
        this.refrushTable();
      },
      add(){
        this.form.id='';
        this.form.name='';
        this.form.classHour='';
        this.showDialog=true;
      },
      handleSizeChange(val){
        this.queryParam.limit=val;
        this.refrushTable();
      },
      handleCurrentChange(val){
        this.queryParam.offset=this.queryParam.limit*(val-1);
        this.refrushTable();
      },
      searchChange(){
        this.refrushTable();
      },
      handleEdit(row){
        this.form=row;
        this.showDialog=true;
      },
      handleDelete(row){
        this.$confirm('是否要删除此班级？','提示',{
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(()=>{
          this.$ajax.post('banji/delete',row).then(res=>{
            var result=res.data;
            if(result.success){
              this.$notify.success({
                title:'提示',
                message:result.msg
              });
              this.refrushTable();
              this.dialogFormVisible=false;
            }else{
              this.$notify.error({
                title:'提示',
                message:result.msg
              })
            }
          }).catch(e=>{
            this.$message({
              type:'error',
              message:'网络连接失败...',
              showClose: true
            })
          })
        })
      }
    },
    created(){
      this.refrushTable();
    }
  }
</script>

<style>
  .fullHeight {
    height: 100%;
  }
  .box-card {
    height: 100%;
  }
</style>
