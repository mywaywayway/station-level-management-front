<template>
  <Head></Head>
  <el-container>
    <el-aside width="200px">
      <Sidebar style="height: 500px"></Sidebar>
    </el-aside>
    <el-main>

      <div style="display: flex">
        <h1 style="margin-left: 40%">申请管理</h1>
<!--        <el-button  type="primary" @click="onEsc" style="margin: 2%;margin-left: 37%">退出</el-button>-->
      </div>
      <div style="display: flex;margin: 2%">
        <el-radio-group v-model="filterType1" style="margin-right: 1%">
          <el-radio value="1" size="small">已通过</el-radio>
          <el-radio value="2" size="small">未审核</el-radio>
        </el-radio-group>
        <el-select
            v-model="filterType2"
            placeholder="选择查询类型"
            size="small"
            style="width: 150px;margin-right: 1%;margin-top: 0.5%"
        >
          <el-option
              v-for="item in options"
              :label="item.label"
              :value="item.value"
          />
        </el-select>

        <el-input v-model="filterKey" placeholder="请输入搜索内容" style="width: 200px"></el-input>

        <el-button type="primary" @click="onAddApplication" style="margin-left: 35%">新增</el-button>
      </div>

      <el-table :data="filter" style="width: 100%;height: 400px">
        <el-table-column prop="requesterName" label="申请人" width="auto" />
        <el-table-column prop="itemName" label="申请物品" width="auto" />
        <el-table-column prop="quantity" label="申请数量" width="auto" />
        <el-table-column prop="reason" label="申请原因" width="auto" />
        <el-table-column prop="requestDate" label="申请时间" width="auto" />
        <el-table-column prop="status" label="状态" width="auto" />
        <el-table-column fixed="right" label="操作" width="auto">
          <template #default="scope">
            <el-button type="primary" size="small" @click="onExamine(scope.row)" >审核</el-button>
<!--            <el-button type="primary" size="small" @click="onChange(scope.row)" >修改</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>

  <el-dialog
      title="修改申请"
      v-model="changeDialogVisible"
      width="30%"
      center
  >
    <el-form-item label="申请ID">
      <el-text>{{form.changApplication.requestId}}</el-text>
    </el-form-item>
    <el-form-item label="申请物品">
      <el-select
          v-model="form.changApplication.itemName"
          placeholder="Select"
          size="large"
          style="width: 150px"
      >
        <el-option
            v-for="item in itemName"
            :key="item"
            :label="item"
            :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="申请数量">
      <el-input v-model="form.changApplication.quantity" placeholder="输入申请数量"></el-input>
    </el-form-item>
    <el-form-item label="申请原因">
      <el-input v-model="form.changApplication.reason" placeholder="输入申请原因"></el-input>
    </el-form-item>
    <el-form-item label="申请时间">
      <el-text>{{form.changApplication.requestDate}}</el-text>
    </el-form-item>

    <template #footer>
      <el-button type="primary" @click="confirmChange">确定</el-button>
      <el-button @click="changeDialogVisible=false">取消</el-button>
    </template>

  </el-dialog>
  <el-dialog
      title="申请"
      v-model="deleteDialogVisible"
      width="60%"
      center
  >
    <div>
      <el-form :inline="true">
        <el-form-item label="申请人">
          <el-text>{{form.examineApplication.requesterName}}</el-text>
        </el-form-item>
        <el-form-item label="申请物品">
          <el-text>{{form.examineApplication.itemName}}</el-text>
        </el-form-item>
        <el-form-item label="申请数量">
          <el-text>{{form.examineApplication.quantity}}</el-text>
        </el-form-item>
        <el-form-item label="申请原因">
          <el-text>{{form.examineApplication.reason}}</el-text>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-text>{{form.examineApplication.requestDate}}</el-text>
        </el-form-item>
      </el-form>

    </div>
    <template #footer>
      <el-button type="primary" @click="confirmExamine">通过</el-button>
      <el-button type="danger" @click=notPassExamine>驳回</el-button>
      <el-button @click="deleteDialogVisible=false">取消</el-button>
    </template>
  </el-dialog>
  <el-dialog
      title="新增申请"
      v-model="addDialogVisible"
      width="30%"
      center
  >
    <el-form-item label="申请物品">
      <el-select
          v-model="form.addApplication.itemName"
          placeholder="Select"
          size="large"
          style="width: 150px"
      >
        <el-option
            v-for="item in itemName"
            :key="item"
            :label="item"
            :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="申请数量">
      <el-input v-model="form.addApplication.quantity" placeholder="输入申请数量"></el-input>
    </el-form-item>
    <el-form-item label="申请原因">
      <el-input v-model="form.addApplication.reason" placeholder="输入申请原因"></el-input>
    </el-form-item>
    <template #footer>
      <el-button type="primary" @click="confirmAdd">确定</el-button>
      <el-button @click="addDialogVisible=false">取消</el-button>
    </template>
  </el-dialog>
</template>


<script  lang="ts">


import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import Head from "../Head.vue";
import Sidebar from "../Sidebar.vue";
import {application, logs, pageInfo} from "../../utils/interface.ts";
import request from "../../utils/request.ts";
import router from "../../router";
import {ElMessage} from "element-plus";

export default defineComponent({
  components: {Sidebar, Head},

  setup(){
    const onEsc=()=>{

      router.push({
        path: '/billManagement/'+pageInfo.userId
      })
    }

    const filterKey = ref('');
    const filterType1 = ref('2');
    const filterType2 = ref('1');
    const options = [
      {
        value: '1',
        label: '申请物品查询'
      },
      {
        value: '2',
        label: '时间查询'
      },

    ];
   const notPassExamine=()=>{
      form.examineApplication.status='审核未通过'
      request.post("/materialwithdrawalrequest-entity/updateById",form.examineApplication).then(res=>{
        if (res.data.code==200){
          ElMessage.success('申请已被驳回')
          deleteDialogVisible.value=false
          logs.changeLogs.userId=pageInfo.userId
          logs.changeLogs.operation='驳回申请物品'+JSON.stringify(form.examineApplication)
          logs.changeLogs.type='修改'
          request.post("/logs-entity/addLogs",logs.changeLogs)
          request.post("/materialwithdrawalrequest-entity/getAllApplication").then(res=>{
            applicationList.splice(0,applicationList.length)
            applicationList.push(...res.data.data)
          })
        }else{
          ElMessage.error('驳回失败')
        }

      })
   }
    const confirmAdd=()=>{
      if (form.addApplication.itemName==null||form.addApplication.quantity==null||form.addApplication.reason==null){
        ElMessage.error('请填写完整信息')
        return
      }
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      form.addApplication.requestDate= `${year}-${month}-${day}`;
      request.get("/user-entity/getUserById/"+pageInfo.userId).then(res=>{
        form.addApplication.requesterName=res.data.data.userName

        request.post("/materialwithdrawalrequest-entity/addMaterialWithDrawalRequest",form.addApplication).then(res=>{
          if (res.data.code==200){
            ElMessage.success('添加成功')
            applicationList.push(form.addApplication)
            addDialogVisible.value=false
            logs.addLogs.userId=pageInfo.userId
            logs.addLogs.operation='新增申请物品'+JSON.stringify(form.addApplication)
            logs.addLogs.type='新增'
            request.post("/logs-entity/addLogs",logs.addLogs)
            request.post("/materialwithdrawalrequest-entity/getAllApplication").then(res=>{
              applicationList.splice(0,applicationList.length)
              applicationList.push(...res.data.data)
            })
          }else{
            ElMessage.error('添加失败')
          }
        })
      })

    }
    const addDialogVisible=ref(false)
    const onAddApplication=()=>{
      addDialogVisible.value=true
      form.addApplication=reactive({}as application)
      form.addApplication.status='未审核'
    }
    const confirmExamine=()=> {
      request.post("/materialwithdrawalrequest-entity/examine", form.examineApplication).then(res => {
        if (res.data.code == 200) {
          ElMessage.success('审核通过')
          deleteDialogVisible.value = false
          logs.changeLogs.userId = pageInfo.userId
          logs.changeLogs.operation = '审核通过申请物品' + JSON.stringify(form.examineApplication)
          logs.changeLogs.type = '修改'
          request.post("/logs-entity/addLogs", logs.changeLogs)
          request.post("/materialwithdrawalrequest-entity/getAllApplication").then(res=>{
           applicationList.splice(0,applicationList.length)
            applicationList.push(...res.data.data)
          })
        } else {
          ElMessage.error(res.data.message)
        }
      })
    }

    const deleteDialogVisible=ref(false)

    const confirmChange=()=>{
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const date = `${year}-${month}-${day}`;
      form.changApplication.requestDate=date
      request.post("/materialwithdrawalrequest-entity/updateById",form.changApplication).then(res=>{
        if (res.data.code==200){
          ElMessage.success('修改成功')
          changeDialogVisible.value=false


        }else{
          ElMessage.error('修改失败')
        }

      })
    }
    const form=reactive({
      changApplication:{} as application,
      deleteId:'',
      addApplication:{} as application,
      examineApplication:{} as application,
    })
    const itemName:string[]=reactive([])
    const changeDialogVisible=ref(false)
    const onExamine=(row :application)=>{
      if (row.status=="审核通过"){
        ElMessage.error('已审核通过')
        return
      }
      deleteDialogVisible.value=true
      form.examineApplication=row

    }
    const onChange=(row:application)=>{
      if (row.status=="审核通过"){
        ElMessage.error('已审核通过，无法修改')
        return
      }
      form.changApplication=row
      changeDialogVisible.value=true
    }

    const pageInfo:pageInfo=reactive({
      userId:'',
      uerName:'',
    })
    const applicationList:application[] =reactive([])
    const filter=computed(()=>{
      return applicationList.filter((item)=>{
        if (filterType1.value=='1'){
          if (filterType2.value=='1') {
            return (item.itemName.includes(filterKey.value)&&item.status.includes('审核通过')&&item.itemName.includes('发票'))
          }else{
            return (item.requestDate.includes(filterKey.value)&&item.status.includes('审核通过')&&item.itemName.includes('发票'))
          }
        }else {
          if (filterType2.value=='1') {
            return (item.itemName.includes(filterKey.value)&&item.status.includes('未审核')&&item.itemName.includes('发票'))
          }else{
            return (item.requestDate.includes(filterKey.value)&&item.status.includes('未审核')&&item.itemName.includes('发票'))
          }
        }

      })
    })

    onMounted(() => {
      pageInfo.userId=<string>router.currentRoute.value.params.userid
      request.get("/user-entity/getUserById/"+pageInfo.userId).then(res=>{
        pageInfo.userName= res.data.data.userName
        request.post("/materialwithdrawalrequest-entity/getAllApplication").then(res=>{

          applicationList.push(...res.data.data)
        })
      })
      request.post("/materials-entity/getAllMaterials").then(res=>{
        res.data.forEach((item )=>{
          itemName.push(item.name)
        })

      })
    })
    const logs=reactive({
      addLogs:{} as logs,
      changeLogs:{} as logs,
      deleteLogs:{} as logs
    })
    return{
      notPassExamine,
      pageInfo,
      applicationList,
      filter,
      onChange,
      onExamine,
      changeDialogVisible,
      form,
      itemName,
      confirmChange,
      deleteDialogVisible,
      confirmExamine,
      onAddApplication,
      addDialogVisible,
      confirmAdd,
      options,
      filterKey,
      filterType1,
      filterType2,
      onEsc,
      logs
    }
  }
})
</script>



<style scoped>

</style>