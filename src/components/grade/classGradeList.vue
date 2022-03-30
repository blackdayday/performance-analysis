<template>
  <div style="height: 100%;">
    <el-card class="box-card">
      <div slot="header">班级成绩查询</div>
      <div style="margin-bottom: 5px;">
        <el-select size="small" v-model="classId" placeholder="请选择班级" @change="onSelectChange" clearable>
          <el-option v-for="obj in bjs" :key="obj.id" :value="obj.id" :label="obj.name"></el-option>
        </el-select>
      </div>
      <div class="classGradeListHeight">
        <el-table :data="data" size="small" v-if="tableVisible" border >
          <el-table-column v-for="(col,index) in columnAttribes" :key="index" :label="col" :prop="col"></el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        classId: '',
        bjs:[],
        columnAttribes:[],
        tableAttribe:{},
        headerStyle:{
          backgroundColor:'#ddd'
        },
        tableVisible:false,
        data:[]
      }
    },
    created() {
      this.$ajax.post('banji/list',{}).then(res=>{
        var result=res.data;
        console.log(res)
        this.bjs=result;
      })
    },
    methods:{
      onSelectChange(val){
        console.log(val);
        console.log("val");
        if(val){
          this.tableVisible=true;
          
          this.$ajax.post('grade/banjiGradeList',{tbClassId:val}).then(res=>{
            var result=res.data;
            console.log(res.data)
            this.columnAttribes=result.cols;
            let temp_data=result.tableData;
            temp_data.forEach((it,i) => {
              
            });
            this.data = temp_data
            this.tableVisible=true;
          })
        }else{
          this.tableVisible=false;
        }
      }
    }

  }
</script>

<style>
.classGradeListHeight{
  height: calc(100% - 37px);
}

</style>
