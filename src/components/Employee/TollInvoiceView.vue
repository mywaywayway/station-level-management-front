<template>
  <Head></Head>
  <el-container>
      <el-aside width="200px">
          <Sidebar></Sidebar>
      </el-aside>
      <el-main>
          <div style="display: flex">
              <h1 style="margin-left: 40%">普通发票管理</h1>
             <el-button  type="primary" @click="onEsc" style="margin: 2%;margin-left: 37%">退出</el-button>
          </div>
          <div style="margin: 2%">
              <el-select
                      v-model="value"
                      placeholder="查询类型"
                      size="small"
                      style="width: 100px;margin-top: 2%"

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
              <el-button type="primary" @click="onAddTollInvoice" style="margin-left: 60%">添加</el-button>
          </div>
          <el-table :data="filter" style="width: 100%">
              <el-table-column prop="ticketId" label="通行ID" width="auto" />
              <el-table-column prop="entryGate" label="进站点" width="auto" />
              <el-table-column prop="exitGate" label="出站点" width="auto" />
              <el-table-column prop="invoiceCode" label="支票代码" width="auto" />
              <el-table-column  prop="invoiceId"  label="支票ID" width="auto" />
              <el-table-column prop="amount" label="金额" width="auto" />
<!--              <el-table-column prop="paymentStatus" label="支付状态" width="auto" />-->
<!--              <el-table-column prop="payTime" label="支付时间" width="auto" />-->
              <el-table-column fixed="right" label="操作" width="auto">
                  <template #default="scope">
<!--                      <el-button link type="primary" size="small" @click="onEditTicket(scope.row)">编辑</el-button>-->
                      <el-button link type="primary" size="small" @click="onPrint(scope.row)">打印</el-button>
                  </template>
              </el-table-column>
          </el-table>

      </el-main>
      <el-dialog
              title="新增发票"
              v-model="addDialogVisible"
              width="30%"
              center
      >
      <el-form-item label="通行记录ID">
          <el-input v-model="addForm.ticketId" placeholder="输入通行记录ID"></el-input>

      </el-form-item>
          <br>
          <template #footer>
              <el-button @click="addDialogVisible=false">取消</el-button>
              <el-button @click="confirmAdd" type="primary">确定</el-button>
          </template>
      </el-dialog>
  </el-container>

</template>


<script  lang="ts">


import {computed, defineComponent, onMounted, onUnmounted, reactive, ref} from "vue";
import Head from "../Head.vue";
import Sidebar from "../Sidebar.vue";
import {useRouter} from "vue-router";
import {logs, pageInfo, tollInvoice} from "../../utils/interface.ts";
import request from "../../utils/request.ts";

import {ElMessage} from "element-plus";
export default defineComponent({
    components: {Head, Sidebar},

    setup() {
        const confirmAdd=()=>{
            request.get("/toll-invoice-entity/addTollInvoice/"+addForm.ticketId).then(res=>{
                if (res.data.code==200){
                    ElMessage({
                        message:'添加成功',
                        type:'success'
                    })
                    addDialogVisible.value=false;
                    logs.addLog.userId=pageInfo.userId;
                    logs.addLog.type='新增';
                    logs.addLog.operation='新增发票,发票绑定的通行ID为'+addForm.ticketId;
                    request.post("/logs-entity/addLogs",logs.addLog)
                    request.post("/toll-invoice-entity/getAllTollInvoice").then(res=>{

                        TollInvoiceData.splice(0,TollInvoiceData.length)
                        TollInvoiceData.push(...res.data.data)
                    })
                }else {
                    ElMessage({
                        message:'添加失败'+res.data.message,
                        type:'error'
                    })
                }

            })
        }

        const addDialogVisible = ref(false);

        const onEsc=()=>{

            router.push({
                path: '/billManagement/'+pageInfo.userId
            })
        }

        const addForm: tollInvoice = reactive({
            amount:0,
            entryGate:'',
            exitGate:'',
            invoiceCode:'',
            invoiceId:'',
            invoiceNumber:'',
            printerId:'',
            timestamp:'',
            tollCollector:'',
            vehicleType:'',
            vehicleWeight:0,
            weightLimit:0,
            ticketId:'',
        });

        const searchValue = ref('');

        const value = ref('1');

        const options=reactive([
            {
                value: '1',
                label: '通行ID查找'
            },
            {
                value: '2',
                label: '进站点查找'
            },
            {
                value:'3',
                label:'出站点查找'
            }
        ])

        const filter=computed(()=>{
             return TollInvoiceData.filter((item)=> {
                 if (value.value === '1') {
                      return item.ticketId.includes(searchValue.value)
                 } else if (value.value === '2') {
                     return item.entryGate.includes(searchValue.value)
                 } else if (value.value === '3') {
                     return item.exitGate.includes(searchValue.value)

                 }
             })


        })

        const onAddTollInvoice= () => {
           addDialogVisible.value=true;
          addForm.ticketId='';

            }
          const onPrint=(row :tollInvoice)=>{
              row.tollCollector=pageInfo.userId;
              row.timestamp=currentTime.value;
              console.log(row.printerId)
              request.post("/toll-invoice-entity/printTollInvoiceById",row).then(res=>{
                  if (res.data.code==200){
                      ElMessage({
                          message:'打印成功',
                          type:'success'
                      })
                  }
              })
          }
          const currentTime=ref<string>('')
        const updateCurrentTime = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            currentTime.value = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        };

        // 更新时间，每秒更新一次
        const timer = setInterval(updateCurrentTime, 1000);

        // 组件销毁时清除定时器
        onUnmounted(() => {
            clearInterval(timer);
        });

        const router = useRouter()
        const pageInfo:pageInfo=reactive({
            userId:'',
        })
        const TollInvoiceData: tollInvoice[] = reactive([])

        onMounted(() => {
            pageInfo.userId = <string>router.currentRoute.value.params.userid;
            request.post("/toll-invoice-entity/getAllTollInvoice").then(res=>{

                TollInvoiceData.splice(0,TollInvoiceData.length)
                TollInvoiceData.push(...res.data.data)
            })
        })
         const logs=reactive({
           addLog:{} as logs
         })
        return {
           logs,
            TollInvoiceData,
            onPrint,
            currentTime,
            onAddTollInvoice,
            value,
            options,
            searchValue,
            filter,
            addDialogVisible,
            addForm,
            onEsc,
            confirmAdd,
        }
    }
})
</script>


<style scoped>

</style>