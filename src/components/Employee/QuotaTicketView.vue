<template>
<Head></Head>
  <el-container>
      <el-aside width="200px">
          <Sidebar></Sidebar>
      </el-aside>
      <el-main>
          <div style="display: flex">
              <h1 style="margin-left: 40%">定额发票管理</h1>
              <el-button  type="primary" @click="onEsc" style="margin: 2%;margin-left: 35%">退出</el-button>
          </div>

          <div style="display:flex;margin: 2%">
              <el-select
                  v-model="value"
                  placeholder="查询类型"
                  size="small"
                  style="width: 100px;margin-top: 2.5%"

              >
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
              </el-select>
              <el-input v-model="searchValue" placeholder="请输入关键字" style="height: 20%;width: 20%;margin-top: 2%; margin-left: 2%"
                        clearable/>
              <el-button type="primary"  @click="onAddQuotaTicket" style="margin-left: 50%;margin-top: 1%">新增发票</el-button>
          </div>
          <el-table :data="filter" style="width: 100%">
              <el-table-column prop="quotaPlateNumber" label="车牌号" width="auto" />
<!--              <el-table-column prop="entryGate" label="进站点" width="auto" />-->
<!--              <el-table-column prop="exitGate" label="出站时间" width="auto" />-->
              <el-table-column prop="quotaInvoiceCode" label="支票代码" width="auto" />
              <el-table-column  prop="ticketNumber"  label="支票ID" width="auto" />
              <el-table-column prop="quotaTicketAmount" label="金额" width="auto" />
          </el-table>
      </el-main>

      <el-dialog
      title="新增定额发票"
      v-model="addDialogVisible"
      width="30%"
      center
      >
     <el-form-item label="通行ID">
          <el-input v-model="ticketId" placeholder="请输入通行ID"></el-input>
     </el-form-item>
          <template #footer>
              <el-button @click="addDialogVisible=false">取消</el-button>
              <el-button type="primary" @click="confirmAdd">确定</el-button>
          </template>
      </el-dialog>
  </el-container>
</template>
<script  lang="ts">

import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import Head from "../Head.vue";
import Sidebar from "../Sidebar.vue";
import request from "../../utils/request.ts";
import {logs, pageInfo, quotaTicket} from "../../utils/interface.ts";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
export default defineComponent({
    name:"quotaTicketView",
    components: {Sidebar, Head},
    setup(){
        const confirmAdd=()=>{
           request.get("/quota-ticket-entity/addQuotaTicketByTicketId/"+ticketId.value).then(res=>{
                if(res.data.code===200){
                    addDialogVisible.value=false
                    ElMessage({
                        message:'添加成功',
                        type:'success'
                    })
                    logs.addLogs.userId=pageInfo.userId
                    logs.addLogs.userName='admin'
                    logs.addLogs.type='新增'
                    logs.addLogs.operation='新增定额发票,发票绑定的通行ID为'+ticketId.value
                    request.post("/logs-entity/addLogs",logs.addLogs)
                    request.post("/quota-ticket-entity/getALlQuotaTicket").then(res=>{
                        quotaTicketData.splice(0,quotaTicketData.length);
                        quotaTicketData.push(...res.data.data)
                    })
                }else {
                    ElMessage({
                        message:'添加失败'+res.data.message,
                        type:'error'
                    })
                }
           })
        }

        const addDialogVisible = ref(false)
        const ticketId=ref('')
        const filter=computed(()=>{
            return quotaTicketData.filter((item)=>{
                if(value.value==='1') return item.quotaPlateNumber.includes(searchValue.value)
                if(value.value==='2') return item.quotaInvoiceCode.includes(searchValue.value)
                if(value.value==='3') return item.ticketNumber.includes(searchValue.value)
            })
        })

        const value = ref('1')
         const searchValue = ref('')


        const options = [
            {
                value: '1',
                label: '车牌号'
            },
            {
                value: '2',
                label: '支票代码'
            },
            {
                value: '3',
                label: '支票ID'
            },

        ];
        const onAddQuotaTicket=()=>{
            addDialogVisible.value=true
            ticketId.value=''
        }
        const onEsc=()=>{

            router.push({
                path: '/billManagement/'+pageInfo.userId
            })
        }

        const  pageInfo:pageInfo=reactive({
              userId:'',
          })
        const quotaTicketData:quotaTicket[]=reactive([]);
        const router = useRouter()
        onMounted(() => {
            pageInfo.userId=<string>router.currentRoute.value.params.userid
            request.post("/quota-ticket-entity/getALlQuotaTicket").then(res=>{
                quotaTicketData.splice(0,quotaTicketData.length);
                quotaTicketData.push(...res.data.data)


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
            quotaTicketData,
            onAddQuotaTicket,
            onEsc,
            value,
            options,
            searchValue,
            filter,
            addDialogVisible,
            ticketId,
            confirmAdd,

        }
    }
})
</script>
<style scoped>

</style>