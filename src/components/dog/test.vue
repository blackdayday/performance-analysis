<template>
  <div class="main">
      <div class="address" style="">
          <div>
              <el-row :gutter="12"> 
                  <el-col v-for="(item,i) in arr" :span="6"  :key="i">
                    <div class='border' @click="chooseAd(item,i)" v-show="isShow(i)" :style="styleChange(i)">
                        <h1  style="font-size:1px;margin:0 0 0 0">
                            广东肇庆（狗熊收）
                            <Span v-if="i===0" style="color:red;">
                                默认地址
                            </Span>
                        </h1>
                        <span  class='text'>
                            狗熊是憨个狗熊是狗熊是憨个狗熊是憨个狗熊是憨个狗熊是憨个狗熊是憨个狗憨个狗熊是憨个狗熊是憨个狗熊是
                     <!-- {{item.name}} -->
                        </span>
                    </div>
                 </el-col>
             </el-row>
             <div @click="showAllAd()" style="font-size:1px;margin:0 0 0 0">
                 展示全部地址
             </div>
          </div>
      </div>
      <div class="order">
          <p>
              确认订单信息
          </p>
          <div>
              <el-row :gutter="5">
                  <el-col :span="7">
                      <div style="text-align:center;border-bottom:1px solid blue">
                          店铺宝贝
                      </div>
                  </el-col>
                  <el-col :span="5">
                      <div style="text-align:center;border-bottom:1px solid blue">
                          商品属性
                      </div>
                  </el-col>
                  <el-col :span="4">
                      <div style="text-align:center;border-bottom:1px solid blue">
                          单价
                      </div>
                  </el-col>
                  <el-col :span="4"> 
                      <div style="text-align:center;border-bottom:1px solid blue">
                          数量
                      </div>
                  </el-col>
                  <el-col :span="4">
                      <div style="text-align:center;border-bottom:1px solid blue">
                          小计
                      </div> 
                  </el-col>
              </el-row>
              <div>{{`店铺名`}}</div>
              <div v-for="(it,i) in orderArr" :key="i">
              <el-row :gutter="5">
                  <el-col :span="12">
                      <div style="text-align:center;border-bottom:1px solid blue">
                          {{it.detail}}
                      </div>
                  </el-col>
                  
                  <el-col :span="4">
                      <div style="text-align:center;border-bottom:1px solid blue">
                          {{it.price}}
                      </div>
                  </el-col>
                  <el-col :span="4"> 
                      <!-- <div style="text-align:center;border-bottom:1px solid blue">
                          {{it.saleAmout}}
                      </div> -->
                      <el-input-number v-model="it.saleAmout" size="mini"></el-input-number>
                  </el-col>
                  <el-col :span="4">
                      <div style="text-align:center;border-bottom:1px solid blue">
                          {{it.price}}
                      </div> 
                  </el-col>
              </el-row>
              </div>
          </div>
      </div>
      <div>
          <div style="display:flex;justify-content:flex-end">
              <div style="height:100px;width:300px;border:1px solid red">

             </div>
          </div>
         <div style="display:flex;justify-content:flex-end">
             <button @click="submit()" style="width:70px;background-color:red;border:1px solid red">提交订单</button>
         </div>
             
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            arr:[
                {
                    name: '111'
                },
                {
                    name: '111'
                },
                {
                    name: '111'
                },
                {
                    name: '111'
                },
                {
                    name: '111'
                },
                {
                    name: '111'
                },
            ],
            orderArr: [
                {
                    name:'aaa',
                    saleAmout: 1,
                    price: 199,
                    detail: 'BB,我好中意你啊'
                },
                {
                    name:'aaa',
                    saleAmout: 1,
                    price: 199,
                    detail: 'BB,我好中意你啊'
                },
            ],
            isShowAll:false,
            showStyle:0
        }
    },
    computed: {
        
    },
    methods: {
        chooseAd(it,i){
            this.showStyle = i
            console.log(it)
            console.log(i)
        },
        isShow(i){
            return this.isShowAll||i<4
        },
        styleChange(i){
            if(this.showStyle === i){
                return `background: linear-gradient(white,white) padding-box,repeating-linear-gradient(-45deg,red 0,  0.3em,white 0,blue 0.75em);`
            }else{
                return ''
            }
        },
        showAllAd(){
            this.isShowAll = !this.isShowAll
        },
        submit(){
            console.log('提交')
        }
    },
    mounted(){

    }
}
</script>

<style>
    .main{
        background-color: white;
    }
    .card{
        background-color: white;
        
        border: 1px solid transparent;
        border-bottom: 0;                
        border-radius: 200px 200px 0 0;
    }
    .border{
                 position: relative;
                 height: 100px;
                 margin: 10px  0px 10px 0px;
                 border: 3px solid transparent ;
                 /* background: linear-gradient(white,white) padding-box,
                 repeating-linear-gradient(-45deg,red 0,  0.3em,white 0,blue 0.75em); */
                 background: linear-gradient(white,white) padding-box,
                 repeating-linear-gradient(-45deg,#ccc 0, #ccc 0.5em,white 0,white 0.75em);
                
             }
    .text{
        
        font-size:5px;
    }
</style>