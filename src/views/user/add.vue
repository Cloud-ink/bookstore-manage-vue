<template>
    <div class="app-container">
      <el-form ref="temp" :model="temp" label-width="80px">
        <el-form-item label="用户名称">
            <el-input v-model="temp.userName" placeholder="用户名" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="用户号码">
            <el-input v-model="temp.userPhone" placeholder="用户号码" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱">
            <el-input v-model="temp.userEmail" placeholder="用户邮箱" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="用户地址">
            <el-input v-model="temp.userAddress" placeholder="用户地址" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
            <el-input v-model="temp.userPassword" placeholder="用户密码" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="用户性别">
            <el-select v-model="temp.userGender" placeholder="请选择性别">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
            <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="temp.userName" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
            <el-time-picker placeholder="选择时间" v-model="temp.date2" style="width: 100%;"></el-time-picker>
            </el-col>
        </el-form-item>
        <el-form-item label="备注">
            <el-input type="textarea" v-model="temp.userName"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
                <el-button>取消</el-button>

        </el-form-item>
      </el-form>
    </div>
</template>

<script>
import { saveUser, getById, updateById } from '@/api/user'

export default {
    data(){ 
        return{
            userSaveVo: {},
            saveBtnDisabled: false, //按钮是否可用，防止用户重复提交
            temp: {
                id:'',
                userName:'',
                userPhone:'',
                userEmail:'',
                userGender: 0,
                userAddress:''
            },
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
        update: 'Edit',
        create: 'Create'
        
      },
       rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        //验证输入信息，是否必须输入，提示信息，什么时候判断
        id:[{required: true, message: 'Id必须输入', trigger: 'change'}],
        userName:[{required: true, message: '姓名必须输入', trigger: 'change'}],
        userPhone:[{required: true, message: '手机号必须输入', trigger: 'change'}],
        userEmail:[{required: true, message: '邮箱必须输入', trigger: 'change'}],
        userGender:[{required: true, message: '性别必须输入', trigger: 'change'}],
        userAddress:[{required: true, message: '生日必须输入', trigger: 'change'}]
      },
        }
    },
    created(){
        //$route路由本身，$router操作路由对象
        if(this.$route.params.id){//如果路由中没有参数不执行，如果有就执行
            this.fetchDataById(this.$route.params.id)
        }
    },

    methods: {
        saveOrUpdate(){
            this.saveBtnDisabled = true
            if(!this.temp.id){
                this.saveData
            } else {
                this.updateData();
            }
        },
        saveData(){
            saveUser(this.temp).then(response => {
                this.$message({
                    message: response.message,
                    type: 'success'
                })
                this.$router.push({path: '/user'})
            })
        },
        //数据更新
        updateData(){
            updateById(this.temp).then(response => {
                this.$message({
                    message: response.message,
                    type: 'success'
                })
                this.$router.push({path: '/user'})
            })
        },
         //根据id查user
        fetchDataById(id){
            getById(id).then(response => {
                this.temp = response.data.item
            })
        },
    }
}
</script>
