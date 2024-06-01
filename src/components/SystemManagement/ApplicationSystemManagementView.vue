<template>
  <Head></Head>
  <el-container>
    <el-aside width="200px">
      <Sidebar></Sidebar>
    </el-aside>
    <el-main>
      <h1 style="margin-left: 40%">用户注册管理</h1>
      <div style="display:flex;">
        <el-radio-group v-model="filterType1" style="margin-right: 1%">
          <el-radio value="1" size="default">普通员工</el-radio>
          <el-radio value="2" size="default">管理员</el-radio>
        </el-radio-group>
        <el-input v-model="filterType2" placeholder="请输入员工姓名或工号" style="width: 20%"></el-input>
      </div>
      <el-table :data="filter">

        <el-table-column prop="userName" label="员工姓名" width="auto"></el-table-column>
        <el-table-column prop="userAvatar" label="头像" width="auto">
          <template #default="scope">
            <el-image :src="scope.row.userAvatar" style="width: 50px;height: 50px"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="sexy" label="性别" width="auto"></el-table-column>
        <el-table-column prop="birthday" label="生日" width="auto"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="auto"></el-table-column>
        <el-table-column prop="telephone" label="电话" width="auto"></el-table-column>
        <el-table-column prop="workId" label="工号" width="auto"></el-table-column>
        <el-table-column prop="password" label="密码" width="auto"></el-table-column>
        <el-table-column prop="applicationRegistration" label="状态">
          <template #default="scope">
            <el-tag v-if="scope.row.applicationRegistration==1" type="success">已注册</el-tag>
            <el-tag v-else-if="scope.row.applicationRegistration==0" type="warning">未审核</el-tag>
            <el-tag v-else type="danger">审核未通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="right" label="操作" width="auto" style="display: flex">
          <template #default="scope" style="display: flex">
            <el-button type="primary" size="small"  @click="edit(scope.row)">审核</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-main>
  </el-container>
  <el-dialog
      v-model="changePersonInfoDialogVisible"
      title="审核注册信息"
      width="60%"
      center>

    <el-form :inline="true"  :model="form.changUser"  ref="changePersonInfoForm" label-width="auto">
      <el-form-item label="用户ID" prop="userName">
        {{form.changUser.userId}}
      </el-form-item>
      <el-form-item label="用户名" prop="userName" style="margin-left: 23%">
        <el-input v-model="form.changUser.userName"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="性别" prop="sexy">
        <el-radio-group v-model="form.changUser.sexy">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item  label="用户类别" prop="userType" style="margin-left: 13%">

        <el-radio-group v-model="form.changUser.userType">
          <el-radio :label="1">普通员工</el-radio>
          <el-radio :label="2">管理员</el-radio>
        </el-radio-group>

      </el-form-item>
      <br>
      <el-form-item label="手机号码" prop="telephone">
        <el-input v-model="form.changUser.telephone"></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
            v-model="form.changUser.birthday"
            type="date"
            placeholder="选择你的生日"

        />
      </el-form-item>
      <el-form-item label="工号" prop="workId">
        <el-input v-model="form.changUser.workId"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="form.changUser.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.changUser.password"></el-input>
      </el-form-item>

    </el-form>
    <template #footer>
                    <span class="dialog-footer">
                      <el-button type="primary" @click="makeSureChangePersonInfo">通过 </el-button>
                      <el-button type="danger" @click="makeSureNotPass">不通过</el-button>
                    <el-button  @click="changePersonInfoDialogVisible=false">取消</el-button>
                    </span>

    </template>
  </el-dialog>
  <el-dialog
      title="删除用户"
      v-model="deletePersonInfoDialogVisible"
      width="30%"
      center
  >
    <el-form  :model="form.deleteUser"  ref="deleteUserForm" label-width="auto">
      <el-form-item label="用户ID" prop="userName">
        {{form.deleteUser.userId}}
      </el-form-item>
      <el-form-item label="用户名" prop="userName" >
        {{form.deleteUser.userName}}
      </el-form-item>

      <el-form-item label="性别" prop="sexy">
        {{form.deleteUser.sexy}}
      </el-form-item>
      <el-form-item  label="用户类别" prop="userType" >
        {{form.deleteUser.userType}}
      </el-form-item>

      <el-form-item label="手机号码" prop="telephone">
        {{form.deleteUser.telephone}}
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        {{form.deleteUser.birthday}}
      </el-form-item>
      <el-form-item label="工号" prop="workId">
        {{form.deleteUser.workId}}
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        {{form.deleteUser.email}}
      </el-form-item>
      <el-form-item label="密码" prop="password">
        {{form.deleteUser.password}}
      </el-form-item>

    </el-form>
    <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary" @click="makeSureDeletePersonInfo">提交</el-button>
                    <el-button  @click="deletePersonInfoDialogVisible=false">取消</el-button>
                    </span>

    </template>
  </el-dialog>
</template>

<script  lang="ts">

import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import Head from "../Head.vue";
import Sidebar from "../Sidebar.vue";
import router from "../../router";
import {pageInfo, user} from "../../utils/interface";
import request from "../../utils/request.ts";
import {ElMessage} from "element-plus";
export default defineComponent({
  components: {Head,Sidebar},

  setup() {

    const makeSureDeletePersonInfo = () => {
      request.get("/user-entity/deleteUserInfoById/"+form.deleteUser.userId).then(res=>{
        if(res.data.code==200){
          deletePersonInfoDialogVisible.value=false
          ElMessage.success("删除成功")
          request.post("/user-entity/getAllRegister").then(res=>{
            userData.splice(0,userData.length)
            userData.push(...res.data.data)
          })
        }else {
          ElMessage.error("删除失败")
        }

      })
    }

    const deletePersonInfoDialogVisible=ref(false)
    const deleteRow=(row:user)=>{
      form.deleteUser=row
      deletePersonInfoDialogVisible.value=true
    }
    const makeSureNotPass=()=>{
      form.changUser.applicationRegistration=2
      request.post("/user-entity/updateUserById/",form.changUser).then((res)=>{
        if(res.data.code==200){
          changePersonInfoDialogVisible.value=false
          ElMessage.success("审核完成")
          request.post("/user-entity/getAllRegister").then(res=>{
            userData.splice(0,userData.length)
            userData.push(...res.data.data)
          })
        }else {
          ElMessage.error("审核失败")
        }
      })
    }
    const makeSureChangePersonInfo = () => {
      form.changUser.applicationRegistration=1
      request.post("/user-entity/updateUserById/",form.changUser).then((res)=>{
        if(res.data.code==200){
          changePersonInfoDialogVisible.value=false
          ElMessage.success("审核完成")
          request.post("/user-entity/getAllRegister").then(res=>{
            userData.splice(0,userData.length)
            userData.push(...res.data.data)
          })
        }else {
          ElMessage.error("审核失败")
        }
      })
    }
    const edit=(row:user)=>{
      form.changUser=row
      changePersonInfoDialogVisible.value=true
    }
    const changePersonInfoDialogVisible=ref(false)
    const filterType2 = ref('')
    const filterType1 = ref('1')
    const filter=computed(()=>{
      return userData.filter(
          (item)=>{
            return item.userType==filterType1.value&&(item.userName.includes(filterType2.value)||item.workId.includes(filterType2.value))
          }
      )

    })
    const pageInfo:pageInfo=reactive({
      userId:'',
      userType:'',
    })
    const form=reactive({
      changUser:{} as user,
      deleteUser:{} as user,
    })


    const userData:user[]=reactive([])

    onMounted(() => {
      pageInfo.userId = <string>router.currentRoute.value.params.userid;
      request.post("/user-entity/getAllRegister").then(res=>{

        userData.push(...res.data.data)
      })
    })


    return {
      form,
      userData,
      pageInfo,
      filterType1,
      filterType2,
      filter,
      changePersonInfoDialogVisible,
      edit,
      makeSureChangePersonInfo,
      deleteRow,
      deletePersonInfoDialogVisible,
      makeSureDeletePersonInfo,
      makeSureNotPass,
    }
  }

})
</script>

<style scoped>

</style>