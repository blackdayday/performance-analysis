<template>
  <div >
    <el-dialog title="编辑" :visible.sync="dialogVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <slot name="form"></slot>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSaveBtnClick" >提交</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-row style="margin-bottom: 5px;">
      <el-col :span="20">
        <el-button :size="size" type="info" icon="el-icon-plus" @click="onAddClick">新增</el-button>
        <el-button :size="size" type="info" icon="el-icon-edit" :disabled="modifyDisabled" @click="onEditClick" v-if='showEdit'>修改</el-button>
        <el-button :size="size" type="info" icon="el-icon-delete" :disabled="modifyDisabled" @click="onDeleteClick">删除</el-button>
        <slot name="buttons"></slot>
        <el-button :size="size" type="success" icon="el-icon-refresh" @click="onRefreshClick">刷新</el-button>
      </el-col>
      <el-col :span="4"><el-input :size="size" prefix-icon="el-icon-search" clearable v-model="search" @change="onSearchChange" placeholder="搜索"></el-input></el-col>
    </el-row>
    <el-table ref="singleTable" :size="size" highlight-current-row v-bind="tableAttribute" @current-change="onCurrentChange" :data="data">
      <el-table-column v-for="obj in columnAttributes" :key="obj.id" v-bind="obj"></el-table-column>
    </el-table>
    <div class="block" v-if="pageable" >
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageParam.page"
        :page-sizes="pageParam.pageSizes"
        :page-size="pageParam.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dataTable',
  props: {
    add: {
      type: Boolean,
      default: true
    },
    edit: {
      type: Boolean,
      default: true
    },
    delete: {
      type: Boolean,
      default: true
    },
    refresh: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    },
    tableAttribute: {
      type: Object,
      required: true
    },//表格属性
    columnAttributes: {
      type: Array,
      required: true
    },//表头
    rules: {
      type: Object
    },
    path: {
      type: String
    },
    url: {
      type: String,
      default: 'page'
    },
    saveUrl: {
      type: String,
      default: 'save'
    },
    deleteUrl: {
      type: String,
      default: 'delete'
    },
    pageable: {
      type: Boolean,
      default: false
    },
    pageAttribe: {
      type: Object
    },
    formObj:{
      type: Object,
      required : true
    }
    ,
    sortTime:{
      type: Array,
      default: () => []
    }
  },
  watch:{
    sortTime(val){
      console.log(val)
      console.log("1213")
    }
  },
  computed: {
    requestParam() {
      var o = {
        limit: this.pageParam.size,
        offset: (this.pageParam.page - 1) * this.pageParam.size,
        sort: this.pageParam.sort,
        order: this.pageParam.order,
        search: this.search
      };
      return Object.assign(o, this.tableAttribute.urlParam);
    }
  },
  data() {
    return {
      dialogVisible: false,
      valid: true,
      modifyDisabled: true,
      tablePropty: {},
      columnPropties: [],
      data: [],
      current: {},
      form: {},
      ajax: {
        url: '',
        saveUrl: '',
        deleteUrl: ''
      },
      pageParam: {
        size: 200,
        page: 1,
        sort: 'id',
        order: 'asc',
        pageSizes: [2, 10, 20, 50, 100, 200]
      },
      search: '',
      total: 0,
      showEdit: true,
      coursesName: [],
      coursesData: [],
    };
  },
  methods: {
    onAddClick() {
      emptyObj(this.form);
      Object.assign(this.form,this.tableAttribute.urlParam);
      //this.form={};
      this.dialogVisible=true;
      this.$emit('showDialog',this.form,this.data);
    },
    getTable(){
      return this.$refs.singleTable;
    },
    getData(){
      return this.data;
    },
    onDeleteClick() {
      if(this.ajax.url === 'course/page'){
        this.delMany()
      }else{
        this.delOne();
      }
      
    },
    delOne(){
      this.$confirm('是否要删除这条数据？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        this.$ajax.post(this.ajax.deleteUrl,this.current).then(res=>{
          var result=res.data;
          if(result.success){
            this.$notify.success({
              message:result.msg,
              duration:2000
            });
            this.refreshTable();
          }else{
            this.$notify.error({
              message:result.msg,
              duration:2000
            })
          }
        })
      }).catch(e=>{

      })
    },
    delMany(){
      this.$confirm('是否要删除这个课程吗？（如果有该科已有部分录入成绩，无法全部删除）','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        console.log(this.current)
        let name = this.current.name;
        let arr = []
        this.coursesName.forEach((item,i)=>{
          if(item.indexOf(name)>-1){
            arr.push(i)
          }
        })
        arr.forEach(item=>{
          let obj = {
            id:this.coursesData[item].id,
            name:this.coursesData[item].name,
            classHour:this.coursesData[item].classHour,
          }
          console.log(obj)
          this.delSub(obj)
        })
        
      }).catch(e=>{

      })
    },
    delSub(obj){
      this.$ajax.post(this.ajax.deleteUrl,obj).then(res=>{
          var result=res.data;
          if(result.success){
            this.$notify.success({
              message:result.msg,
              duration:2000
            });
            this.refreshTable();
          }else{
            this.$notify.error({
              message:result.msg,
              duration:2000
            })
          }
        })
    },
    onEditClick() {
      Object.assign(this.form, this.current);
      //console.log(this.form);
      this.dialogVisible = true;
      this.$emit('showDialog',this.form,this.data);
    },
    onCurrentChange(val) {
      this.current = val;
      if(val){
        this.modifyDisabled=false;
      }else{
        this.modifyDisabled=true;
      }
      this.$emit('current-change',val,this.modifyDisable);
    },
    refreshTable() {
      this.getTable().setCurrentRow();
      // console.log(this.ajax.url);
      // console.log(this.requestParam);
      this.$ajax.post(this.ajax.url, this.requestParam).then(res => {
        // console.log(res)
        // console.log("this.requestParam")
        console.log(this.ajax.url)
        
        var result = res.data;
        if (result.data.rows) {
          if(this.ajax.url === 'course/page'){
            this.showEdit = false; 
            let arr = result.data.rows
            this.coursesData = [...arr]
            let name = []
            let nameOp = []
            arr.forEach(item => {
              name.push(item.name)
            })
            this.coursesName = [...name]
            name = name.map(item => {return item.split('-')[0]})
            name = [...new Set(name)]
            name.forEach((it,i) => {
              let max_grade = 100
              arr.forEach(item => {
                if(item.name.split('-')[0] === it){
                  max_grade = item.classHour
                }
              })
              nameOp.push({
                id: i+1,
                name: it,
                classHour: max_grade
              })
            })
            this.data = nameOp;
            this.total = nameOp.length;
          }else{
            this.data = result.data.rows;
            this.total = result.data.total;
          }
          
        } else {
          this.data = result;
        }
        // console.log(this.data)
        // console.log(this.total)
        this.$emit('current-change',null,true);
      });
    },
    onSaveBtnClick() {
      //console.log(1);
      console.log(Object.assign(this.form,this.tableAttribute.urlParam))
      console.log(4564654658)
      
      if(this.ajax.url === 'course/page'){
        let time = Object.assign(this.form,this.tableAttribute.urlParam).name
        this.sortTime.forEach(item => {
          let name = time+'-'+item.exam_name
          if(this.coursesName.includes(name)){
            return
          }
          let obj = {
            id: '',
            name: name,
            classHour: this.form.classHour
          }
          this.bigAdd(obj)
          console.log(obj)
          console.log(name)
        })
        return
      }
      this.$refs.form.validate(valid=>{
        if(valid){
          this.$ajax.post(this.ajax.saveUrl,Object.assign(this.form,this.tableAttribute.urlParam)).then(res=>{
            var result=res.data;
            if(result.success){
              this.$notify.success({
                message:result.msg,
                duration:2000
              });
              this.dialogVisible=false;
              this.refreshTable();
            }else{
              this.$notify.error({
                message:result.msg,
                duration:2000
              })
            }
          })
        }
      })
    },
    bigAdd(form){
      this.$ajax.post(this.ajax.saveUrl,form).then(res=>{
        var result=res.data;
            if(result.success){
              this.$notify.success({
                message:result.msg,
                duration:2000
              });
              this.dialogVisible=false;
              this.refreshTable();
            }else{
              this.$notify.error({
                message:result.msg,
                duration:2000
              })
            }
      })
    },
    onRefreshClick() {
      this.refreshTable();
    },
    onSearchChange() {
      this.pageParam.page=1;
      this.refreshTable();
    },
    handleSizeChange(val){
      this.pageParam.size=val;
      this.refreshTable();
    },
    handleCurrentChange(val){
      this.pageParam.page=val;
      this.refreshTable();
    },
    // loadData(){
    //   this.$ajax.post(`${this.path}list`,{}).then(res =>{
    //     console.log(res)
    //     console.log("初始数据")
    //   })
    // },
  },
  created() {
    this.form=this.formObj;
    this.ajax.url = this.url;
    this.ajax.saveUrl = this.saveUrl;
    this.ajax.deleteUrl = this.delete;
    if (this.path) {
      console.log(this.path)
      this.ajax.url = this.path + this.url;
      this.ajax.saveUrl = this.path + this.saveUrl;
      this.ajax.deleteUrl = this.path + this.deleteUrl;
    }
    if (this.pageable) {
      console.log(this.pageable)
      this.pageParam = Object.assign({}, this.pageParam, this.pageAttribe);
    }
  },
  mounted() {
    // this.loadData()
    this.refreshTable();
    
  }
};

function emptyObj(obj){
  for( var key in obj){
    var o = obj[key];
    if(o instanceof Object){
      emptyObj(o);
    }else{
      obj[key]='';
    }
  }
}
</script>

<style>
.el-pagination{
  padding: 5px 5px;
}
</style>
