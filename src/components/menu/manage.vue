<template>
  <el-card style="min-height: 100%;">
    <div slot="header"><span>菜单管理</span></div>
    <data-table size="small" path="menu/" url="list" :tableAttribute="tableAttributes" :columnAttributes="columnAttributes" :formObj="form" @showDialog="parentShow">
      <template v-slot:form>
        <input type="hidden" v-model="form.id" />
        <el-form-item label="上级菜单项" label-width="100px" prop="parentId">
          <select-tree v-model="form.parentId" :options="combotreeData" :props="combotreeProps"></select-tree>
        </el-form-item>
        <el-form-item label="菜单名称" label-width="100px" prop="name"><el-input v-model="form.name" auto-complete="off"></el-input></el-form-item>
        <el-form-item label="路径" label-width="100px" prop="url"><el-input v-model="form.url" auto-complete="off"></el-input></el-form-item>
        <el-form-item label="图标" label-width="100px" prop="icon"><el-input v-model="form.icon" auto-complete="off"></el-input></el-form-item>
        <el-form-item label="权限" label-width="100px" prop="roleId">
          <el-select v-model="form.roleId" style="width: 100%;" clearable>
            <el-option v-for="permission in permissions" :key="permission.id" :value="permission.id" :label="permission.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" label-width="100px" prop="sort1"><el-input v-model="form.idx1" auto-complete="off"></el-input></el-form-item>
      </template>
    </data-table>
  </el-card>
</template>

<script>
import dataTable from '../dataTable.vue';
import SelectTree from '../SelectTree.vue';
export default {
  components: { dataTable, SelectTree },
  data() {
    return {
      tableAttributes: {
        border: true,
        'row-key': 'id',
        'default-expand-all': true
        // lazy: true,
        // 'tree-props':{children: 'children', hasChildren: 'hasChildren'},
        // load: this.load
      },
      permissions: [],
      combotreeProps: {
        parent: 'parentId',
        value: 'id',
        label: 'name',
        children: 'children'
      },
      combotreeData: [],
      data: [],
      form: {
        id: '',
        name: '',
        url: '',
        icon: '',
        roleId: '',
        parentId: '',
        idx1: ''
      },
      rules: [],
      columnAttributes: [
        {
          label: '菜单名称',
          prop: 'name'
        },
        {
          label: '路径',
          prop: 'url'
        },
        {
          label: '图标',
          prop: 'icon'
        },
        {
          label: '权限',
          prop: 'role.name'
        },
        {
          label: '上级菜单',
          prop: 'parentName'
        },
        {
          label: '排序',
          prop: 'idx1'
        }
      ]
    };
  },
  methods: {
    load(tree, treeNode, resolve) {
      this.$ajax.post('menu/list', { parentId: tree.id }).then(res => {
        var result = res.data;
        return resolve(result);
      });
    },
    parentShow(curr, data) {
      //console.log(data);
      var combotreeData = [];
      for(var i=0;i<data.length;i++){
        combotreeData.push(deepCopy(data[i],{}));
      }
      deleteCurr(combotreeData, curr.id);
      this.combotreeData = combotreeData;
    }
  },
  created() {
    /* this.$ajax.post('menu/list',{}).then(res=>{
        var result=res.data;
        this.combotreeData=result;
      }); */
    this.$ajax.post('banji/list', {}).then(res => {
      console.log(res.data)
      this.permissions = res.data;
    });
  }
};
function deleteCurr(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    var ele = arr[i];
    if (ele.id && ele.id == value) {
      arr.splice(i, 1);
      return;
    } else {
      if (ele.children && ele.children.length > 0) {
        deleteCurr(ele.children, value);
      }
    }
  }
}

function copyArray(array) {
  var arr = [];
  for (var i = 0; i < array.length; i++) {
    var ele = Object.assign({}, array[i]);
    arr.push(ele);
    if (ele.children && ele.children.length > 0) {
      arr[i].children = copyArray(ele.children);
    }
  }
  return arr;
}
function deepCopy(o, c) {
  var c = c || {};
  for (var i in o) {
    if (typeof o[i] === 'object') {
      //要考虑深复制问题了
      if (o[i].constructor === Array) {
        //这是数组
        c[i] = [];
      } else {
        //这是对象
        c[i] = {};
      }
      deepCopy(o[i], c[i]);
    } else {
      c[i] = o[i];
    }
  }
  return c;
}
</script>

<style></style>
