<template>
  <el-card class="box-card">
    <div slot="header">
      <span>班级成绩管理</span>
    </div>
    <div class="box-card" ref="cardBody">
      <el-row style="margin-bottom: 5px;">
        <el-col :span="24">
          <el-select size="mini" placeholder="请选择班级" v-model="tbClassId" @change="onChange">
            <el-option v-for="tbClass in bjs" :key="tbClass.id" :value="tbClass.id" :label="tbClass.name"></el-option>
          </el-select>
          <el-select size="mini" placeholder="评选择课程" v-model="courseId" @change="onChange">
            <el-option v-for="course in courses" :key="course.id" :value="course.id" :label="course.name"></el-option>
          </el-select>
          <el-button size="mini" icon="el-icon-search" type="primary" @click="onQueryClick">查询</el-button>
        </el-col>
      </el-row>
      <el-table
        size="mini"
        :data="data"
        border
        ref="singleTable"
        highlight-current-row
        v-if="tableVisible"
        :max-height="maxHeight">
        <el-table-column v-for="(col,index) in columnAttributes" :key="index" v-bind="col"></el-table-column>
        <el-table-column label="成绩" width="150">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.grade" @change="onGreadeChange(scope.row)"></el-input>
            <!-- <el-input-number size="mini" v-model="scope.row.grade" @change="onGreadeChange(scope.row)"></el-input-number> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        tableVisible:false,
        tbClassId: '',
        courseId: '',
        bjs:[{
          id:1,
          name:'180001班'
        },{
          id:2,
          name:'180002班'
        },{
          id:3,
          name:'180003班'
        }],
        courses:[{
          id:1,
          name:'语文'
        },{
          id:2,
          name:'数学'
        },{
          id:3,
          name:'英语'
        }],
        columnAttributes:[
          {label:'学号',prop:'student.stuNo'},
          {label:'姓名',prop:'student.name'},
        ],
        data:[],
        maxHeight:400
      }
    },
    created() {

    },
    mounted() {
      this.loadClass()
      this.loadData()
    },
    methods:{
      loadData(){
        var cardHeight=window.getComputedStyle(this.$refs.cardBody).height;
        var cardBodyHeight=cardHeight.substr(0,cardHeight.length-2);
        //console.log(cardBodyHeight);
        this.maxHeight=cardBodyHeight-40;
        this.$ajax.post('grade/banjiGradeList',{}).then(res=>{
          var result=res.data;
          console.log(result)
          console.log("result")
          if(result.success){
            this.bjs=result.data.bjs;
            this.courses=result.data.courses;
          }
        })
      },
      loadClass(){
        this.$ajax.post('banji/list',{}).then(res=>{
        let result=res.data;
        // console.log(result)
        // console.log("test")
        result?this.bjs = result:this.bjs = this.bjs
        })
        this.$ajax.post('course/list',{}).then(res=>{
        let result=res.data;
        // console.log(result)
        // console.log("test")
        result?this.courses = result:this.courses = this.courses
        })
      },
      onQueryClick(){
        this.$ajax.post('grade/findGradeListByCourseIdAndBanjiId',{courseId:this.courseId,banjiId:this.tbClassId})
        .then(res=>{
          var result=res.data;
          this.data=result;
          this.tableVisible=true;

        })
      },
      onGreadeChange(row){
        if(Number(row.grade)){
          var param={
            id:row.id,
            studentId:row.student.id,
            courseId:row.course.id,
            grade:row.grade,
            isUsed:true
            };
            console.log(param)
            console.log("param")
          this.$ajax.post('grade/addGradeList',param)
          .then(res=>{
            var result=res.data;
            if(result.success){
              this.$notify.success(result.msg);
            }
          })
        }else{
          this.$notify.error({message:'成绩必须为数字',duration:2000});
          row.grade=''
        }
      },
      onChange(){
        this.tableVisible=false;
      }
    }
  }
</script>

<style>
.fullHeight {
  height: 100%;
}
.box-card{
  height: 100%;
}
.el-card__body {
  height: calc( 100% - 98px);
}

</style>
