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
              <el-select v-model="courseId" placeholder="请选择科目">
                  <el-option v-for="item in coursesData" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
               <el-button type="primary">点击上传</el-button>                         
               </el-upload>
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
        }
    },
    watch:{
        exportData(val){
            console.log(111)
            console.log(val)
        },
        courseId(val){
            this.checkGrade()
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

    },
    methods:{
        handleChange(file,fileList){        
            this.fileList = [fileList[fileList.length - 1]]; // 只能上传一个Excel，重复上传会覆盖之前的        
            this.file = file.raw;
            //创建一个新的 FileReader        
            let reader = new FileReader()
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
                this.exportData = outdata            
            	console.log(outdata)
                console.log('传入的数据')
            }
         },
        checkGrade(){
            this.$ajax.post('grade/findGradeListByCourseIdAndBanjiId',{courseId:this.courseId,banjiId:this.bjId})
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
                }
            })
        }
   }
  }
</script>

<style>

</style>