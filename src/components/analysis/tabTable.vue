<template>
  <div>
      <el-table v-if="isShow" :data="tableData" border height="400">
          <el-table-column prop="num" label="学号" align="center" width="250"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center" width="250"></el-table-column>
          <el-table-column prop="grade" label="成绩" align="center" width="250"></el-table-column>
          <el-table-column  label="跳转" align="center" width="250">
              <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleClick(scope.$index,scope.row)">查看详情</el-button>
              </template>
         </el-table-column>

      </el-table>
      <div v-else>暂无学生的分数为此等级</div>
  </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    computed:{
        isShow(){
            return this.tableData.length>0;
        },
    },
    props:{
        tableData:{
            type:Array,
            default:function(){
                return []
            }
        },
        colNames:{
            type:Array,
            default:function(){
                return []
            }
        }
    },
    methods:{
        handleClick(index,row){
            console.log(1)
            // this.$emit('handleClick',index,row)
        }
    }
}
</script>

<style>

</style>