<template>
  <div>
      <el-card>
          hello world!
          <el-card>
              <span>班级</span>
              <el-select v-model="bjId" placeholder="请选择班级">
                  <el-option v-for="item in bjs" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <span>科目</span>
              <el-select v-model="timeId" placeholder="请选择时间">
                  <el-option v-for="item in timeData" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
          </el-card>
          <el-card>
              <el-upload                
               	class="upload-demo"                
               	ref="upload"                
               	action=""                
               	:auto-upload="false"                
               	:file-list="fileList"                
               	:on-change="handleChange"                
               	multiple                
               	:show-file-list="false"                
               >              
               <el-button type="primary" :disabled='isChoosed'>导入数据</el-button>                         
               </el-upload>
          </el-card>
          <el-card style="height:600px">
              <el-table border :data="tableData" v-show="isShow">
                  <el-table-column  v-for="(it,index) in colTab" :key="index" :label="it.label" :prop="it.prop" :align="it.align" :width="it.align"></el-table-column>
              </el-table>
              <el-button type="primary" v-show="isShow" @click="saveExcel">确认保存</el-button>
              <p v-show="!isShow">请上传EXCEK文件，并注意格式</p>
          </el-card>
      </el-card>
      
  </div>
</template>

<script>
export default {
    data(){
        return {
            fileList: [],
            file:'',
            exportData:[],
            bjId: '',
            bjs: [],
            courses: [],
            courseId: '',
            coursesData: [],
            timeId: '',
            timeData: [],
            courses: [],//提取科目
            namesData: [],
            namesId: [],
            stuData: [],

            colTab: [],
            tableData: [],
            isChoosed: true,
            isShow: false,
        }
    },
    watch:{
        exportData(val){
            console.log(111)
            console.log(val)
        },
        timeId(val){
            if(val){
                this.isChoosed = false
                this.checkGrade()
            }
            
        },
        bjId(val){
            this.getStu(val)
            this.timeId = ''
            this.isChoosed = true
        }
    },
    created(){
        this.getGradeSort()
        // this.getAllCourses()
        this.getClassList();
    },
    mounted(){
        this.getGradeSort()
        // this.getAllCourses()
        this.getClassList();
        // this.getStu()

    },
    methods:{
        handleChange(file,fileList){        
            this.fileList = [fileList[fileList.length - 1]]; // 只能上传一个Excel，重复上传会覆盖之前的        
            this.file = file.raw;
            //创建一个新的 FileReader        
            let reader = new FileReader()
            let _this = this
            //动读取指定的 Blob 或 File 内容                
            reader.readAsArrayBuffer(this.file)        
            reader.onload = function () {  
                //读取成功
                
                console.log(reader.result)
                //所读取文件的数据
            	let buffer = reader.result 

            	let bytes = new Uint8Array(buffer)           
            	let length = bytes.byteLength            
            	let binary = ''            
            	for (let i = 0; i < length; i++) {                
            		 binary += String.fromCharCode(bytes[i]) ? String.fromCharCode(bytes[i]) : 'null'           
            	}  
                console.log('读取成功')        
            	let XLSX = require('xlsx')           
            	let wb = XLSX.read(binary, {                
            		type: 'binary'            
            	})            
            	let outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
                _this.exportData = outdata  
                _this.showTable()          
            	console.log(outdata)
                console.log('传入的数据')
            }
            
         },
        showTable(val){

            console.log(7894654)
            let data = [...this.exportData]
            this.tableData = [...this.exportData]
            let col = data[0]
            let keys = Object.keys(col)
            this.colTab = []
            keys.forEach((it,i) => {
                this.colTab.push({
                    label: it,
                    prop: it,
                    width: 100,
                    align: 'center',
                 })
            })
            this.isShow = true
        },
        saveExcel(){
            let data = [...this.exportData]
            data.forEach((it,i) => {
                let id = 0
                this.stuData.forEach((item,index) => {
                    if(Number(it['学号']) === Number(item.stuNo)&&it['姓名'] === item.name){
                        id = item.id
                    }
                })
                let param = {
                       id:row.id,
                       studentId:id,
                       courseId:cId,
                       grade:grade,
                       isUsed:true
                    };
            })
        },
        checkGrade(){
            console.log(this.timeId)
            // return
            let namesArr = []
            this.courses.forEach(item => {
                let name = item+'-'+this.timeId
                namesArr.push(name)
            })
            let namesID = []
            // console.log(namesArr)
            // console.log(this.namesData)
            this.namesData.forEach((item,i) => {
                if(namesArr.includes(item)){
                    namesID.push(i)
                }
            })
            this.namesId = namesID
            // console.log(namesID)
            namesID.forEach(item => {
                console.log(this.coursesData[item])
                let name_id = this.coursesData[item].id
                this.createdSub(name_id)
            })
            return
        },
        createdSub(val){
            this.$ajax.post('grade/findGradeListByCourseIdAndBanjiId',{courseId:val,banjiId:this.bjId})
            .then(res=>{
                console.log(res)
                console.log("创建科目")
            })
        },
        getClassList(){
            this.$ajax.post('banji/list',{
            }).then(res=>{
                let result = res.data;
                console.log(result);
                if(result.length>0){
                    let arr = [];
                    result.forEach(item=>{
                        arr.push({
                            id:item.id,
                            name:item.name
                        })
                    })
                    this.bjs = arr;
                    this.bjId = this.bjs[0].id;
                }
            })
        },
        getGradeSort(){
            this.$ajax.post('exam/list',{
            }).then(res=>{
                let result = res.data;
                // console.log(result);
                // console.log("213");
                if(result.length>0){
                    let arr = [];
                    this.exam_sort = result
                    this.exam_sort.forEach(item=>{
                        arr.push({
                            id:item.id,
                            name:item.exam_name
                            })
                    })
                    this.timeData = arr;
                    // this.timeId = this.timeData[0].id;
                }
                this.getAllCourses()
            })
        },
        getAllCourses(){
            this.$ajax.post('course/list',{
            }).then(res=>{
                let result = res.data;
                // console.log(result);
                // console.log("123");
                if(result.length>0){
                    let arr = [...result]
                    let temp = [];
                    this.exam_sort.forEach(item=>{
                        arr.forEach(it=>{
                            if(it.name.indexOf(item.exam_name)>-1){
                                temp.push(it);
                            }
                        })
                    })
                    console.log(temp);
                    console.log("课程信息");
                    this.coursesData = temp;
                    this.courseId = this.coursesData[0].id;
                    let names = [];
                    let namesData = [];
                    temp.forEach((item,i)=>{
                        names.push(item.name.split('-')[0])
                        namesData.push(item.name)
                    })
                    this.namesData = namesData;
                    names = [...new Set(names)];
                    this.courses = names;
                    console.log(this.courses);
                    console.log("课程名称");
                }
            })
        },
        getStu(val){
            this.$ajax.post('student/list',{tbClassId:val}).then(res=>{
                let result = res.data;
                console.log(result);
                console.log("学生信息");
                if(result.length>0){
                    this.stuData = [...result]
                }else{
                    this.$message({
                      type:'error',
                      message:'该班学生人数为0，请先添加学生信息',
                      duration : 3000
                    })
                }
            })
        },
   }
  }
</script>

<style>

</style>