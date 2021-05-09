<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline" size="mini">
      <el-form-item label="商品名">
        <el-autocomplete
          class="inline-input"
          v-model="listQuery.productName"
          :fetch-suggestions="querySearch"
          placeholder="请输入商品名"
          :trigger-on-focus="false"
          value-key="product_name"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="用户号码">
        <el-input v-model="listQuery.product" placeholder="号码" style="width: 100px"></el-input>
      </el-form-item>
      <el-form-item label="用户性别">
        <el-select v-model="listQuery.product" clearable placeholder="性别" style="width: 80px">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="resetData">清空</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" size="mini" @click="batchRemove">批量删除</el-button>
      </el-form-item>
      <!-- 
        <el-form-item>
          <el-date-picker 
            v-model=""
            placeholder="时间"
            value-format="yyyy-MM-dd"/>
        </el-form-item>
       -->
    </el-form>
    <el-table
      :key="tableKey"
      :data="list"
      border stripe
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
    <el-table-column type="selection" >
      
    </el-table-column>
    <el-table-column align="center" label="#" width="95">
      <template slot-scope="scope">
          {{ (page - 1)*limit + scope.$index + 1 }}
        </template>
    </el-table-column>
      <el-table-column label="商品名" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户号码" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.product }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户性别" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.product === 1" type="success">男</el-tag>
          <el-tag v-if="row.product === 0" type="success">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户邮箱" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.product }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户地址" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.product }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link :to="'/user/edit/'+row.id">
            <el-button type="primary" size="mini" >
              修改
            </el-button>
          </router-link>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete($index)">
            删除
          </el-button>
        </template> -->
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination 
      v-show="total>0" 
      :total="total" 
      :page.sync="page" 
      :limit.sync="limit" 
      @pagination="fetchData" />
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPv, deleteById, fetchListPage, batchDelete, selectNameByKey } from '@/api/product'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
   name: 'ProductManage',
   components: { Pagination },
   directives: { waves },
   filters: {
     statusFilter(status) {
       const statusMap = {
         published: 'success',
         draft: 'info',
         deleted: 'danger'
       }
       return statusMap[status]
     },
     typeFilter(type) {
       return calendarTypeKeyValue[type]
     }
   },
  data() {
    return {
      banner1:{},
      tableKey: 0,

      multipleSelection: [],//多选框
      list: null, //用户列表
      total: 0,//总数
      page: 1,//当前页
      limit: 10,//每页数量
      listLoading: true,
      listQuery: {//查询表单
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    //图片
    quxiao:function(){
      var imgsrc = $("#imgsrc").attr("src");
      var str_after=imgsrc.split("/");
      var str_img=str_after[src_after.length-1];
      $.post("/model/deletefile",{path:str_img},function(data){
        $("#url img").attr("src","/imctemp-rainy/no_img.png");
        vm.navigation.imgsrc="";
        alert(data);
      })
    },
    //下载图片
    tupian:function(){
      var form = new FormData();
      form.append("file",document.getElementById("file").files[0]);
      $.ajax({
        url: "/model/upload",
        data:form,
        cache:false,
        async:false,
        type:"POST",
        dataType:'json',
        processData:false,
        contentType:false,
        success:function(data){
          if(data){
            var pic ="/imctemp-rainy/"+data.fileName;
            $("#url img").attr("src",pic);
            vm.banner1.bpic= data.xfileName;
          }else{
            alert("失败");
          }
        },
        error:function(er){alert(JSON.stringify(data));
        }
      });
    },
    nadd:function(){
      $.post("/home/badd",{banner1:JSON.stringify(vm.banner1)},function(data){
        if(daya.success==1){
          alert(data.message);
          window.location.href="/model/type";
        }else{
          alert(data.message);
        }
      })
    },

    //获取用户列表
    fetchData() {      
      fetchListPage(this.page, this.limit, this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
      alert(status)
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetData(){
      this.listQuery = {
        id:'',
        userName:'',
        userPhone:'',
        userEmail:'',
        userGender:'',
        userAddress:''
      }
    },
    //删除用户信息
    handleDelete(index) {
      //询问是否删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                //嵌套写法可以使用串着写then(()=>{return }).then()
                const tmpUser = this.list[index];
                deleteById(tmpUser.id).then(()=>{
                  this.$notify({
                  title: 'Success',
                  message: 'Delete Successfully',
                  type: 'success',
                  duration: 2000
                })
                this.list.splice(index, 1);
                this.fetchData()
                });
              }).catch((err) => {
                if( err === 'cancel' ){
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });  
                }        
              });
      //传入的是（一行，及这一行list的下标），然后通过下标获取对象，再获取empid
    },
    //当表格中的多选框发生变化时
    handleSelectionChange(selection){
      this.multipleSelection = selection
    },
    //批量删除
    batchRemove(){
      //询问是否删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                const idList = []
                this.multipleSelection.forEach(item => {
                  idList.push(item.id)
                })
                batchDelete(idList).then(response => {
                  this.fetchData()
                  this.$message({
                    message: response.message,
                    type: 'success'
                  })
                })
              }).catch((err) => {
                if(err === 'canel'){
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  })
                }
              })
    },
    //输入建议
    querySearch(queryString, callback){
      selectNameByKey(queryString).then(response => {
        callback(response.data.nameList)
      })

    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
  
}
</script>