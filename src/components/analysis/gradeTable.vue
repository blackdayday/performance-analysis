<template>
  <div>
      <el-table v-show="isShow" :data="tableData" border height="400">
          <el-table-column v-for="(item,index) in colDetail" :key='index' :prop="item.prop" :label="item.label" :align="item.align" :width="item.width">
              <!-- <slot name="handleClick" :index="index" :row="row"></slot> -->
          </el-table-column>
          
          <!-- <el-table-column  label="跳转" align="center" width="250">
              <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleClick(scope.$index,scope.row)">查看详情</el-button>
              </template>
         </el-table-column> -->

      </el-table>
      <div v-show="!isShow">暂无数据</div>
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
    // watch:{
    //     tableData(val){
    //         console.log(val) 
    //         console   
    //     },
    // },
    props:{
        tableData:{
            type:Array,
            default:function(){
                return []
            }
        },
        colDetail:{
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
        },
        ischange:{
            type:Boolean,
            default:false
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