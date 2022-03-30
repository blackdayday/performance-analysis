<template>
  <div style="height: 100%;" ref="tableContrainer">
    <!-- 对话框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <router-view @change="onFormChange" v-if="dialogFormVisible"></router-view>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSaveBtnClick" :disabled="valid">提交</el-button>
      </div>
    </el-dialog>
    <!-- 工具框 -->
    <el-row style="margin-bottom: 2px;">
      <el-col :span="21">
        <el-button size="small" type="info" icon="el-icon-plus" :disabled="addBtn.disabled" @click="onAddBtnClick" v-if="addBtn.visible">新增</el-button>
        <el-button size="small" type="info" icon="el-icon-edit" :disabled="editBtn.disabled==true" @click="onEditBtnClick" v-if="editBtn.visible">编辑</el-button>
        <el-button size="small" type="info" icon="el-icon-delete" :disabled="deleteBtn.disabled" @click="onDeleteBtnClick" v-if="deleteBtn.visible">删除</el-button>
        <el-button size="small" icon="el-icon-refresh" type="success" @click="refreshTable">刷新</el-button>
      </el-col>
      <el-col :span="3"><el-input size="small" prefix-icon="el-icon-search" clearable v-model="search" @change="onSearchChange" placeholder="搜索"></el-input></el-col>
    </el-row>
    <!-- 数据表格 -->
    <el-table
      v-if="tableVisible"
      ref="singleTable"
      size="small"
      v-bind="tableAttribute"
      highlight-current-row
      :max-height="maxHeight"
      @current-change="onCurrentChenge"
      :data="data">
      <el-table-column v-for="colAttr in columnAttributes" :key="colAttr.id" v-bind="colAttr"></el-table-column>
    </el-table>
    <!-- 导航栏 -->
    <div  v-if="pageable" >
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
  import {mapMutations} from 'vuex';
export default {
  name: 'EditDataTable',
  props: {
    add: {
      type: Boolean,
      default: false
    },
    edit: {
      type: Boolean,
      default: false
    },
    delete: {
      type: Boolean,
      default: false
    },
    tableAttribute: {
      type: Object
    },
    columnAttributes: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      default: () => []
    },
    url: {
      type: String
    },
    saveUrl: {
      type: String
    },
    deleteUrl:{
      type: String
    },
    pageable: {
      type: Boolean,
      default: false
    },
    pageAttribute: {
      type: Object
    },
    editData: {
      type: Object,
      required: true
    },
    editPage:{
      type:String
    }

  },
  computed: {
    /**
     * 请求参数
     */
    requestParam() {
      var o= {
        limit: this.pageParam.size,
        offset:(this.pageParam.page - 1) * this.pageParam.size,
        sort: this.pageParam.sort,
        order: this.pageParam.order,
        search: this.search
      };
      return Object.assign(o,this.tableAttribute.urlParam);
    }
  },

  data() {
    return {
      valid:true,
      tableVisible:false,
      dialogFormVisible: false, //对话框是否显示
      addBtn: { visible: false, disabled: false },
      editBtn: { visible: false, disabled: true },
      deleteBtn: { visible: false, disabled: true },
      ajax: {
        url: '',
        saveUrl: 'save',
        deleteUrl:'delete'
      },
      maxHeight:400,
      isPageAble: false,
      data: [],
      columns: [
        { label: '序号', type: 'index', width: '50', align: 'center' },
        { type: 'selection', align: 'center', width: 55 },
        { label: '日期', prop: 'date', width: '120', align: 'center', sortable: true },
        { label: '工作内容', prop: 'content', headerAlign: 'center' },
        { label: '工期是否延误', prop: 'isDelay', headerAlign: 'center', width: 130 },
        { label: '延误原因', prop: 'delayReason', headerAlign: 'center' }
      ],
      pageParam: {
        size: 10,
        page: 1,
        sort: 'id',
        order: 'asc',
        pageSizes:[2, 10, 20, 50, 100, 200]
      },
      search: '',
      total: 0,
      currentData:null,
      formData:null
    };
  },
  created() {
    if (this.add) {
      this.addBtn.visible = true;
    }
    if(this.tableAttribute.maxHeight){
      this.maxHeight=this.tableAttribute.maxHeight;
    }
    if (this.edit) {
      this.editBtn.visible = true;
    }
    if (this.delete) {
      this.deleteBtn.visible = true;
    }
    if(this.url){
      this.ajax.url=this.url;
    }
    if(this.saveUrl){
      this.ajax.saveUrl=this.saveUrl;
    }
    if(this.deleteUrl){
      this.ajax.deleteUrl=this.deleteUrl;
    }
    if (this.pageable) {
      if(this.pageAttribute){
        this.pageParam = this.pageAttribute;
      }
    }


    //this.refreshTable();
  },
  mounted() {
    var heightCss=window.getComputedStyle(this.$refs.tableContrainer).height;
    var height=heightCss.substr(0,heightCss.length-2);
    height=height-72;
    //console.log(height);
    if(height>200){
      this.maxHeight=height;
    }
    this.tableVisible=true;
    this.refreshTable();
  },
  methods: {
    ...mapMutations(['setParams']),
    onAddBtnClick() {
      this.formData={};
      this.setParams(this.formData);
      this.$router.push({
        path: this.editPage,
      });
      this.dialogFormVisible = true;
    },
    onSaveBtnClick() {
      this.valid=true;
      this.$ajax.post(this.ajax.saveUrl,this.formData)
      .then(res=>{
        var result=res.data;
        if(result.success){
          this.dialogFormVisible=false;
          this.$notify.success(result.msg);
          this.refreshTable();
        }else{
          this.$notify.warning(result.msg);
        }
      })
    },
    refreshTable(){
      //this.pageParam.page=1;
      //console.log(this.requestParam);
      this.$ajax
        .post(this.url, this.requestParam)
        .then(res => {
          var result = res.data;
          if(result.rows){
            this.data = result.rows;
            this.total = result.total;
          }else{
            this.data=result;
          }
        })
    },
    onCurrentChenge(val){
      this.currentData=val;
      if(val){
        this.editBtn.disabled=false;
        this.deleteBtn.disabled=false;
      }else{
        this.editBtn.disabled=true;
        this.deleteBtn.disabled=true;
      }
      // console.log(this.currentData);
    },
    onFormChange(val){
      this.valid=!val;
    },
    onEditBtnClick(){
        var form=Object.assign({},this.currentData);
        this.formData=form;
        this.setParams(form);
        this.$router.push({
          path: this.editPage,
        });
        this.dialogFormVisible=true;
    },
    onDeleteBtnClick(){
      this.$confirm('是否要删除选中的记录？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.$ajax.post(this.deleteUrl,this.currentData).then(res=>{
          var result=res.data;
          if(result.success){
            this.$notify.success(result.msg);
            this.refreshTable();
          }else{
            this.$notify.warning(result.msg);
          }
        });
      }).catch((e)=>{

      });
    },
    onSearchChange(val){
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
    }
  },

};
</script>

<style>

</style>
