<template>
  <el-card style="min-height: 100%;">
    <div slot="header">个人成绩查询</div>
    <el-table :data="data" border size="small">
      <el-table-column prop="course.name" label="课程名"></el-table-column>
      <el-table-column prop="grade" label="成绩"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    data() {
      return {
        data: []
      }
    },
    created() {
      this.$ajax.post('grade/myGrade',{
      }).then(res=>{
        var result=res.data;
        console.log(result.data);
        this.data=result.data;
      })
    },
    methods:{
      ...mapMutations([
        'login',
        'setUser',
        'setName',
        'setIsLogined',
        'setToken',
        // 'getUser',
        ]),
    },
    computed:{
      ...mapGetters([
        'getName',
      ]),
    },
    mounted() {
      console.log(this.getName)
    },
  }
</script>

<style>
</style>
