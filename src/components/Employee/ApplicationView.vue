<template>
 <Head></Head>
  <el-container>
      <el-aside width="200px">
        <Sidebar style="height: 500px"></Sidebar>
      </el-aside>
      <el-main>

          <div style="display: flex">
              <h1 style="margin-left: 40%">申请管理</h1>
              <el-button  type="primary" @click="onEsc" style="margin: 2%;margin-left: 37%">退出</el-button>
          </div>
          <div style="display: flex;margin: 2%">
              <el-radio-group v-model="filterType1" style="margin-right: 1%">
                  <el-radio value="1" size="small">已通过</el-radio>
                  <el-radio value="2" size="small">未通过或未审核</el-radio>
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
<!--         <el-scrollbar>-->
          <el-table :data="filter" style="width: 100%;height: 370px">
              <el-table-column prop="requestId" label="申请ID" width="auto" />
              <el-table-column prop="itemName" label="申请物品" width="auto" />
              <el-table-column prop="quantity" label="申请数量" width="auto" />
              <el-table-column prop="reason" label="申请原因" width="auto" />
              <el-table-column prop="requestDate" label="申请时间" width="auto" />
              <el-table-column prop="status" label="申请状态" width="auto" />
              <el-table-column fixed="right" label="操作" width="auto">
                  <template #default="scope">
                      <el-button type="danger" size="small" @click="onDelete(scope.row)" >删除</el-button>
                      <el-button type="primary" size="small" @click="onChange(scope.row)" >修改</el-button>
                  </template>
              </el-table-column>
          </el-table>
<!--         </el-scrollbar>-->
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
  title="确定删除"
  v-model="deleteDialogVisible"
  width="30%"
  center
  >
  <div>
      <el-text>确定删除ID为：{{form.deleteId}} 的申请吗？</el-text>

  </div>
<template #footer>
      <el-button type="primary" @click="confirmDelete">确定</el-button>
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
import {application, pageInfo} from "../../utils/interface.ts";
import request from "../../utils/request.ts";
import router from "../../router";
import {ElMessage} from "element-plus";
import {logs} from "../../utils/interface.ts";
export default defineComponent({
    components: {Sidebar, Head},

    setup(){
        const logs=reactive({
          addLog:{} as logs,
          changeLog:{} as logs,
          deleteLog:{} as logs,
        })
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
                form.addApplication.status="未审核"
                request.post("/materialwithdrawalrequest-entity/addMaterialWithDrawalRequest",form.addApplication).then(res=>{
                    if (res.data.code==200){
                        ElMessage.success('添加成功')
                        applicationList.push(form.addApplication)
                        addDialogVisible.value=false
                        request.get("/materialwithdrawalrequest-entity/getApplicationByName/"+pageInfo.userName).then(res=>{
                            applicationList.splice(0,applicationList.length)
                            applicationList.push(...res.data.data)
                        })
                        logs.addLog.userId=pageInfo.userId
                        logs.addLog.type="新增"
                        logs.addLog.operation="新增了申请物品："+JSON.stringify(form.addApplication)
                        request.post("/logs-entity/addLogs",logs.addLog)
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
        }
        const confirmDelete=()=>{
            request.get("/materialwithdrawalrequest-entity/deleteById/"+form.deleteId).then(res=>{
                if (res.data.code==200){
                    ElMessage.success('删除成功')
                    applicationList.splice(applicationList.findIndex(item=>item.requestId==form.deleteId),1)
                    deleteDialogVisible.value=false
                     logs.deleteLog.userId=pageInfo.userId
                      logs.deleteLog.type="删除"
                      logs.deleteLog.operation="删除了申请物品："+JSON.stringify(form.deleteApplication)
                      request.post("/logs-entity/addLogs",logs.deleteLog)
                }else{
                    ElMessage.error('删除失败')
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
           if(form.changApplication.status=="审核未通过")
           {
                form.changApplication.status="未审核"
           }
            request.post("/materialwithdrawalrequest-entity/updateById",form.changApplication).then(res=>{
                if (res.data.code==200){
                    ElMessage.success('修改成功')
                    changeDialogVisible.value=false
                    request.get("/materialwithdrawalrequest-entity/getApplicationByName/"+pageInfo.userName).then(res=>{
                        applicationList.splice(0,applicationList.length)
                        applicationList.push(...res.data.data)
                    })
                    logs.changeLog.userId=pageInfo.userId
                    logs.changeLog.type="修改"
                    logs.changeLog.operation+="到"+JSON.stringify(form.changApplication)
                     request.post("/logs-entity/addLogs",logs.changeLog)
                }else{
                    ElMessage.error('修改失败')
                }

            })
        }
        const form=reactive({
            changApplication:{} as application,
            deleteId:'',
            deleteApplication:{} as application,
            addApplication:{} as application,
        })
        const itemName:string[]=reactive([])
        const changeDialogVisible=ref(false)
        const onDelete=(row :application)=>{
          if (row.status=="审核通过"){
              ElMessage.error('已审核通过，无法删除')
              return
          }
          deleteDialogVisible.value=true
            form.deleteId= row.requestId
            form.deleteApplication=row
        }
        const onChange=(row:application)=>{
            if (row.status=="审核通过"){
                ElMessage.error('已审核通过，无法修改')
                return
            }
            form.changApplication=row
            logs.changeLog.operation="修改了申请物品：从原来的"+JSON.stringify(row)
            changeDialogVisible.value=true
        }

        const pageInfo:pageInfo=reactive({
                userId:'',
                uerName:'',
        })
        const applicationList:application[] =reactive([])
        const filter=computed(()=>{
            return applicationList.filter((item)=>{
              if (filterType1.value==''){
                  return item
              }
                if (filterType1.value=='1'){
                  if (filterType2.value=='1') {
                      return (item.itemName.includes(filterKey.value)&&item.status.includes('审核通过')&&item.itemName.includes('发票'))
                  }else{
                      return (item.requestDate.includes(filterKey.value)&&item.status.includes('审核通过')&&item.itemName.includes('发票'))
                  }
                }else {
                    if (filterType2.value=='1') {
                        return (item.itemName.includes(filterKey.value)&&!item.status.includes('审核通过')&&item.itemName.includes('发票'))
                    }else{
                        return (item.requestDate.includes(filterKey.value)&&!item.status.includes('审核通过')&&item.itemName.includes('发票'))
                    }
                }

            })
        })

        onMounted(() => {
            pageInfo.userId=<string>router.currentRoute.value.params.userid
            request.get("/user-entity/getUserById/"+pageInfo.userId).then(res=>{
                pageInfo.userName= res.data.data.userName
                request.get("/materialwithdrawalrequest-entity/getApplicationByName/"+pageInfo.userName).then(res=>{

                    applicationList.push(...res.data.data)
                })
            })
            request.post("/materials-entity/getAllMaterials").then(res=>{
                res.data.forEach((item)=>{
                    itemName.push(item.name)
                })

            })
        })
        return{
            pageInfo,
            applicationList,
            filter,
            onChange,
            onDelete,
            changeDialogVisible,
            form,
            itemName,
            confirmChange,
            deleteDialogVisible,
            confirmDelete,
            onAddApplication,
            addDialogVisible,
            confirmAdd,
            options,
            filterKey,
            filterType1,
            filterType2,
            onEsc,
            logs,
        }
    }
})
</script>



<style scoped>

</style>