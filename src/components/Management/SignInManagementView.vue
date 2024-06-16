

<template>
   <Head></Head>
  <el-container>
    <el-aside width="200px" style="height: 500px">
      <Sidebar style="height: 500px"></Sidebar>
    </el-aside>
    <el-main>
      <h1 style="margin-left: 40%">排班</h1>
      <div style="display:flex;">
        <el-date-picker
        v-model="pageTime.currentData"
          type="date"
          placeholder="选择日期"
          style="width: 200px"
        ></el-date-picker>
        <el-button @click="panduan">刷新</el-button>
        <el-button type="primary" style="margin-left: 40%" @click="onAddSignIn">排班</el-button>
      </div>
      <el-table :data="filter" style="width: 100%;height: 400px" >
        <el-table-column prop="userName" label="员工" width="auto" />
        <el-table-column  prop="date"  label="日期" width="auto" />
        <el-table-column prop="workingTime" label="上班时间" width="auto" />
        <el-table-column prop="offDutyTime" label="下班时间" width="auto" />

<!--        <el-table-column prop="clockTime2" label="下班打卡时间" width="auto" />-->
        <el-table-column fixed="right" label="操作" width="auto">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="onDelete(scope.row)">
              删除
            </el-button>
            <el-button link type="primary" size="small" @click="onChange(scope.row)">
              修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
   <el-dialog
   title="排班"
    v-model="addDialogVisible"
    width="60%"
    center
   >
     <el-form :inline="true">
        <el-form-item label="员工" style="width: 40%">
          <el-select v-model="pageInfo.addContextOwner.userId" placeholder="请选择员工">
            <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
       <el-form-item label="日期">
            <el-date-picker
            v-model="pageInfo.addContextOwner.date"
            type="date"
            placeholder="选择日期"
            ></el-date-picker>
        </el-form-item>
        <el-form-item label="上班时间">
          <el-date-picker
          v-model="pageInfo.addContextOwner.workingTime"
          placeholder="选择上班时间"
          type="datetime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="下班时间">
          <el-date-picker
          v-model="pageInfo.addContextOwner.offDutyTime"
          placeholder="选择下班时间"
          type="datetime"
          ></el-date-picker>
        </el-form-item>


     </el-form>
      <template #footer>
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </template>
   </el-dialog>

  <el-dialog
   title="修改"
    v-model="changeDialogVisible"
    width="60%"
    center
  >
    <el-form :inline="true">
      <el-form-item label="员工" style="width: 40%">
        <el-select v-model="pageInfo.changeContextOwner.userId" placeholder="请选择员工">
          <el-option
          v-for="item in userList"
          :key="item.userId"
          :label="item.userName"
          :value="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
        v-model="pageInfo.changeContextOwner.date"
        placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="上班时间">
        <el-date-picker
        v-model="pageInfo.changeContextOwner.workingTime"
        placeholder="选择上班时间"
         type="datetime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="下班时间">
        <el-date-picker
        v-model="pageInfo.changeContextOwner.offDutyTime"
        placeholder="选择下班时间"
         type="datetime"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="changeDialogVisible=false">取消</el-button>
      <el-button type="primary" @click="confirmChange">确定</el-button>
    </template>
  </el-dialog>
   <el-dialog
   title="删除提示"
    v-model="deleteDialogVisible"
    width="30%"
    center
   >
     <el-text style="color: blueviolet;margin-left: 30%">确认删除该排班吗？</el-text>
      <template #footer>
        <el-button @click="deleteDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">确定</el-button>
      </template>
   </el-dialog>

</template>

<script  lang="ts">

import Head from "../Head.vue";
import {computed, defineComponent, onMounted, onUnmounted, reactive, ref} from "vue";
import Sidebar from "../Sidebar.vue";

import router from "../../router";
import request from "../../utils/request";
import {contextOwner, contextOwnerView, logs, user} from "../../utils/interface";
import {ElMessage} from "element-plus";


export default defineComponent({
    name:"signInManagementView",
    components: {Head,Sidebar},
    setup(){

      const deleteDialogVisible=ref(false)
      const confirmDelete=()=>{
        request.get("/context-owner-entity/deleteContextOwnerById/"+pageInfo.deleteContextOwner.id).then(res=>{
          if (res.data.code==200){
            deleteDialogVisible.value=false
            ElMessage({
              message:'删除成功',
              type:'success'
            })
            logs.deleteLogs.userId=pageInfo.userId
            logs.deleteLogs.type='删除'
            logs.deleteLogs.operation='删除排班:'+JSON.stringify(pageInfo.deleteContextOwner)
            request.post("/logs-entity/addLogs",logs.deleteLogs)
            request.post("/Context-owner-user-view-entity/getALlContextOwnerUserView").then(res=>{
              contextOwnerViewList.splice(0,contextOwnerViewList.length);
              contextOwnerViewList.push(...res.data.data)
            })
          }else {
            ElMessage({
              message:'删除失败'+res.data.message,
              type:'error'
            })
          }

        })
      }
      const confirmChange=()=>{
          let date=pageInfo.changeContextOwner.date
          pageInfo.changeContextOwner.date=parseTime(date)
           let workingTime=pageInfo.changeContextOwner.workingTime
           pageInfo.changeContextOwner.workingTime=parseTime1(workingTime)
          let offDutyTime=pageInfo.changeContextOwner.offDutyTime
            pageInfo.changeContextOwner.offDutyTime=parseTime1(offDutyTime)
           if (pageInfo.changeContextOwner.userId == '' || pageInfo.changeContextOwner.date == '' || pageInfo.changeContextOwner.workingTime == '' || pageInfo.changeContextOwner.offDutyTime == '') {
              ElMessage({
                message: '请填写完整',
                type: 'error'
              })
              return
            }
           request.post("/context-owner-entity/updateContextOwnerById",pageInfo.changeContextOwner).then(res=>{
             if (res.data.code==200){
               changeDialogVisible.value=false
               ElMessage({
                 message:'修改成功',
                 type:'success'
               })
                logs.changeLogs.userId=pageInfo.userId
                logs.changeLogs.type='修改'
                logs.changeLogs.operation+=' 改为 '+JSON.stringify(pageInfo.changeContextOwner)
                request.post("/logs-entity/addLogs",logs.changeLogs)
               request.post("/Context-owner-user-view-entity/getALlContextOwnerUserView").then(res=>{
                 contextOwnerViewList.splice(0,contextOwnerViewList.length);
                 contextOwnerViewList.push(...res.data.data)
               })
             }else {
               ElMessage({
                 message:'修改失败'+res.data.message,
                 type:'error'
               })
             }
           })
      }
      const confirmAdd = () => {
         console.log(pageInfo.addContextOwner)
          let data=pageInfo.addContextOwner.date
           pageInfo.addContextOwner.date=parseTime(data)
           if (pageInfo.addContextOwner.userId == '' || pageInfo.addContextOwner.date == '' || pageInfo.addContextOwner.workingTime == '' || pageInfo.addContextOwner.offDutyTime == '') {
                ElMessage({
                  message: '请填写完整',
                  type: 'error'
                })
                return
           }
        request.post("/context-owner-entity/addContextOwner",pageInfo.addContextOwner).then(res => {
          if (res.data.code == 200) {
            addDialogVisible.value = false
            ElMessage({
              message: '添加成功',
              type: 'success'
            })
            logs.addLogs.userId = pageInfo.userId
            logs.addLogs.userName = 'admin'
            logs.addLogs.type = '新增'
            logs.addLogs.operation= '新增排班:'+JSON.stringify(pageInfo.addContextOwner)
            request.post("/logs-entity/addLogs", logs.addLogs)
            pageInfo.addContextOwner=reactive({} as contextOwner)
            request.post("/Context-owner-user-view-entity/getALlContextOwnerUserView").then(res => {
              contextOwnerViewList.splice(0, contextOwnerViewList.length);
              contextOwnerViewList.push(...res.data.data)
            })
          }else {
            ElMessage({
              message: '添加失败,' + res.data.message,
              type: 'error'
            })
          }
        })
      }
      
      const addDialogVisible=ref(false)
      const onAddSignIn=()=>{
        addDialogVisible.value=true
        console.log(pageTime.currentData)
        pageInfo.addContextOwner.date=pageTime.currentData
        pageInfo.addContextOwner.workingTime=parseTime(pageTime.currentData)+'T09:00:00'
        pageInfo.addContextOwner.offDutyTime= parseTime(pageTime.currentData)+'T17:00:00'
      }
      const panduan = () => {
        pageTime.currentData=''
      }
      const filter=computed(()=>{
        return contextOwnerViewList.filter((item)=>{
          if (pageTime.currentData=='')
          {
            return true
          }
          return item.date.includes(parseTime(pageTime.currentData))
        })
      })

      const pageTime=reactive({
        currentTime:'',
        currentData:''
      })

      function parseTime (str:string) {

        if ((str + '').indexOf('-') != -1) {
          str = str.replace(new RegExp(/-/gm), '/')
        }
        let d = new Date(str)
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`

      }

       function parseTime1(str:string) {

         if ((str + '').indexOf('-') != -1) {
           str = str.replace(new RegExp(/-/gm), '/')
         }
         let d = new Date(str)
         const year = d.getFullYear();
         const month = (d.getMonth() + 1).toString().padStart(2, '0');
         const day = d.getDate().toString().padStart(2, '0');
         const hours = d.getHours().toString().padStart(2, '0');
         const minutes = d.getMinutes().toString().padStart(2, '0');
         const seconds = d.getSeconds().toString().padStart(2, '0');
         return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
       }

      const updateCurrentTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        pageTime.currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      }
      const timer = setInterval(updateCurrentTime, 1000);
      onUnmounted(() => {
        clearInterval(timer);
      });
      const onDelete=(row:contextOwner)=>{
        deleteDialogVisible.value=true
        pageInfo.deleteContextOwner=row

      }
      const changeDialogVisible=ref(false)
      const onChange=(row:contextOwner)=>{
        changeDialogVisible.value=true
        pageInfo.changeContextOwner=row
        logs.changeLogs.operation='修改排班:从 '+JSON.stringify(row)
      }

      const pageInfo = reactive({
        userId: '',
        userType: '',
        addContextOwner:{} as contextOwner,
        changeContextOwner:{} as contextOwner,
        deleteContextOwner:{} as contextOwner,
      })
      const userList:user []=reactive([]);
      const contextOwnerViewList: contextOwnerView[] = reactive([]);
      onMounted(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        pageTime.currentData = `${year}-${month}-${day}`;
        pageInfo.userId = <string>router.currentRoute.value.params.userid;
        request.get("/user-entity/getUserById/" + pageInfo.userId).then(res => {
          pageInfo.userType = res.data.data.userType;
        })
        request.post("/Context-owner-user-view-entity/getAllEmployee").then(res=>{
          userList.splice(0,userList.length);
          userList.push(...res.data.data)
        })
       request.post("/Context-owner-user-view-entity/getALlContextOwnerUserView").then(res=>{
         contextOwnerViewList.splice(0,contextOwnerViewList.length);
         contextOwnerViewList.push(...res.data.data)


       })
      })
      const logs=reactive({
        addLogs:{} as logs,
        changeLogs:{} as logs,
        deleteLogs:{} as logs

      })
        return {

          logs,
           pageInfo,
          contextOwnerViewList,
            onDelete,
            onChange,
          pageTime,
          updateCurrentTime,
          filter,
          panduan,
          userList,
          addDialogVisible,
          onAddSignIn,
          confirmAdd,
          changeDialogVisible,
          confirmChange,
          deleteDialogVisible,
          confirmDelete,
        }
    }
})


</script>
<style scoped>

</style>