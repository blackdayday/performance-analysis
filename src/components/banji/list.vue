<template>
  <div style="height: 100%;">
    <!-- 编辑对话框 -->
    <el-dialog title="编辑班级" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <input type="hidden" name="id" v-model="form.id"/>
        <el-form-item label="班级名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班主任" :label-width="formLabelWidth">
          <el-input v-model="form.manager" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveBanji">提交</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑对话框线束 -->


    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>班级管理</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="openDialog">新增班级</el-button> -->
      </div>
      <el-row style="margin-bottom: 2px;">
        <el-col :span="21">
          <el-button size="small" icon="el-icon-plus" type="info" @click="openDialog">新增班级</el-button>
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
       <el-table
          :data="tableData"
          border
          size="small"
          max-height="460"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="序号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="班级名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="manager"
            label="班主任">
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
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
        tableData: [],
        queryParam:{
          limit:20,
          offset:1,
          sort:'id',
          order:'asc',
          search:''
        },
        total:0,
        dialogFormVisible:false,
        form: {
          id:'',
          name:'',
          manager:''
        },
        formLabelWidth: '120px'
      }
    },
    created() {
      this.refrushTable();
    },
    methods:{
      searchChange(){
        this.queryParam.offset=0;
        this.refrushTable();
      },
      refresh(){
        this.queryParam.offset=0;
        this.queryParam.search='';
        this.refrushTable();
      },
      handleSizeChange(val){
        this.queryParam.limit=val;
        this.refrushTable();
      },
      handleCurrentChange(val){
        this.queryParam.offset=this.queryParam.limit*(val-1);
        this.refrushTable();
      },
      refrushTable(){
        this.$ajax.post('banji/page',this.queryParam).then(res=>{
          var result=res.data;
          this.tableData=result.rows;
          this.total=result.total;
        });
      },
      openDialog(){
        this.$ajax.post('banji/findById',{}).then(res=>{
          var result=res.data;
          this.form=result;
          if(this.form.id==null){
            this.form.id='';
          }
          this.dialogFormVisible=true;
        })
      },
      saveBanji(){
        this.$ajax.post('banji/save',this.form).then(res=>{
          var result=res.data;
          if(result.success){
            this.$notify.success({
              title:'提示',
              message:result.msg,
              duration:2000
            });
            this.refrushTable();
            this.dialogFormVisible=false;
          }else{
            this.$notify.error({
              title:'提示',
              message:result.msg,
              duration:2000
            })
          }
        }).catch(e=>{
          //console.log(e);
          this.$message({
            type:'error',
            message:'网络连接失败...',
            showClose: true
          })
        })
      },
      handleEdit(row){
        this.form=row;
        if(!this.form.isUsed){
          this.form.isUsed=''
        }
        this.dialogFormVisible=true;
      },
      handleDelete(row){
        this.$confirm('是否要删除此班级？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
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
    }
  }
</script>

<style>

   .box-card {
     height: calc(100% - 2px);
   }
   .el-card__body{
     height: calc(100%-57px);
   }
   .el-table td,.el-table th {
     padding: 4px 0;
   }
   .block{
     margin-top:2px;
   }
</style>
