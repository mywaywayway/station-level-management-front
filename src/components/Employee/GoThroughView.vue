<template>
    <Head></Head>
    <el-container>
        <el-aside width="200px">
            <Sidebar></Sidebar>
        </el-aside>
        <el-main>
            <div style="display: flex">
                <el-radio-group v-model="searchType">
                    <el-radio label="车牌查询">车牌查询</el-radio>
                    <el-radio label="站点查询">站点查询</el-radio>
                    <el-radio label="时间查询">时间查询</el-radio>
                </el-radio-group>
                   <el-input style="margin: 2%;width: 25%" v-model="search"></el-input>
                <el-button type="primary" style="margin: 2%   " @click="onAddTicket">新增</el-button>
            </div>

            <el-table
            :data="filter"
            style="width: 100%"
            >

                <el-table-column prop="plateNumber" label="车牌号" width="auto" />
                <el-table-column prop="entranceStation" label="进站点" width="auto" />
                <el-table-column prop="entranceTime" label="出站时间" width="auto" />
                <el-table-column prop="exitStation" label="出站点" width="auto" />
                <el-table-column  prop="exitTime"  label="出站时间" width="auto" />
                <el-table-column prop="amount" label="金额" width="auto" />
                <el-table-column prop="paymentStatus" label="支付状态" width="auto" />
                <el-table-column prop="payTime" label="支付时间" width="auto" />
                <el-table-column fixed="right" label="" width="auto">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="onEditTicket(scope.row)">编辑</el-button>
                        <el-button link type="primary" size="small" @click="onDeleteTicket(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>

    <el-dialog
    title="编辑通行记录"
    v-model="editTicketDialogVisible"
    width="30%"
    center
    >
        <el-form  v-model="changeTicket" style="width: auto">
            <el-form-item label="车牌号" style="width: 75%">
                <el-input v-model="changeTicket.plateNumber"></el-input>
            </el-form-item>
            <el-form-item label="进站点" style="width: 75%">
                <el-input v-model="changeTicket.entranceStation"></el-input>
            </el-form-item>
            <el-form-item label="进站时间">
                <el-date-picker
                    v-model="changeTicket.entranceTime"
                    placeholder="选择时间"
                    type="datetime"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="出站点" style="width: 75%">
                <el-input v-model="changeTicket.exitStation"></el-input>
            </el-form-item>
            <el-form-item label="出站时间">
                <el-date-picker
                    v-model="changeTicket.exitTime"
                    type="datetime"
                    placeholder="出站时间"
                />
            </el-form-item>
            <el-form-item label="金额" style="width: 75%">
                <el-input v-model="changeTicket.amount"></el-input>
            </el-form-item>
            <el-form-item label="支付状态" >
                <el-radio-group v-model="changeTicket.paymentStatus">
                    <el-radio label="已支付">已支付</el-radio>
                    <el-radio label="未支付">未支付</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="支付时间">
                <el-date-picker
                    v-model="changeTicket.payTime"
                    type="datetime"
                    placeholder="支付时间"
                >
                </el-date-picker>
            </el-form-item>
        </el-form>
        <template #footer>
                   <span class="dialog-footer">
                        <el-button @click="editTicketDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="confirmChangeTicket">确 定</el-button>
                    </span>
        </template>
    </el-dialog>

    <el-dialog
    title="新增通行记录"
    v-model="addTicketDialogVisible"
    width="30%"
    center
    >
        <el-form  v-model="addTicket" style="width: auto">
            <el-form-item label="车牌号" style="width: 75%">
                <el-input v-model="addTicket.plateNumber"></el-input>
            </el-form-item>
            <el-form-item label="进站点" style="width: 75%">
                <el-input v-model="addTicket.entranceStation"></el-input>
            </el-form-item>
            <el-form-item label="进站时间">
                <el-date-picker
                    v-model="addTicket.entranceTime"
                    placeholder="选择时间"
                    type="datetime"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="出站点" style="width: 75%">
                <el-input v-model="addTicket.exitStation"></el-input>
            </el-form-item>
            <el-form-item label="出站时间">
                <el-date-picker
                    v-model="addTicket.exitTime"
                    type="datetime"
                    placeholder="出站时间"

                />
            </el-form-item>
            <el-form-item label="金额" style="width: 75%">
                <el-input v-model="addTicket.amount"></el-input>
            </el-form-item>
            <el-form-item label="支付状态" >
                <el-radio-group v-model="addTicket.paymentStatus">
                    <el-radio label="已支付">已支付</el-radio>
                    <el-radio label="未支付">未支付</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="支付时间">
                <el-date-picker
                    v-model="addTicket.payTime"
                    type="datetime"
                    placeholder="支付时间"
                >
                </el-date-picker>
            </el-form-item>
        </el-form>
        <template #footer>
                   <span class="dialog-footer">
                        <el-button @click="addTicketDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="confirmAddTicket">确 定</el-button>
                    </span>
        </template>
    </el-dialog>
    <el-dialog
    title="确定删除通行记录"
    v-model="deleteTicketDialogVisible"
    width="70%"
    center
    >
    <el-descriptions>
      <el-descriptions-item label="车牌号">{{deleteTicket.plateNumber}}</el-descriptions-item>
        <el-descriptions-item label="进站点">{{deleteTicket.entranceStation}}</el-descriptions-item>
        <el-descriptions-item label="进站时间">{{deleteTicket.entranceTime}}</el-descriptions-item>
        <el-descriptions-item label="出站点">{{deleteTicket.exitStation}}</el-descriptions-item>
        <el-descriptions-item label="出站时间">{{deleteTicket.exitTime}}</el-descriptions-item>
        <el-descriptions-item label="金额">{{deleteTicket.amount}}</el-descriptions-item>
        <el-descriptions-item label="支付状态">{{deleteTicket.paymentStatus}}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{deleteTicket.payTime}}</el-descriptions-item>
    </el-descriptions>

    <template #footer>
                   <span class="dialog-footer">
                        <el-button @click="deleteTicketDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="confirmDeleteTicket">确 定</el-button>
                    </span>
        </template>

    </el-dialog>

</template>

<script  lang="ts">
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import Sidebar from "../Sidebar.vue";
import Head from "../Head.vue";
import request from "../../utils/request.ts";
import {useRouter} from "vue-router";
import {ticket} from "../../utils/interface.ts";
import {ElMessage} from "element-plus";
import {logs} from "../../utils/interface.ts";
export default defineComponent({
    name: "goThroughView",
    components: {
        Sidebar,
        Head,
    },
    setup() {
        const logs=reactive({
          changeLogs:{} as logs,
          deleteLogs:{} as logs,
          addLogs:{} as logs,
        })
        const deleteTicketId = reactive({
            deleteTicketId:''
        })
         const confirmDeleteTicket=()=>{
            request.get("/ticket-entity/deleteTicketById/"+deleteTicketId.deleteTicketId).then(res=>{
                if (res.data.code === 200){
                    ElMessage.success('删除成功')
                    deleteTicketDialogVisible.value = false
                    logs.deleteLogs.userId=pageInfo.userId
                    logs.deleteLogs.type='删除'
                    logs.deleteLogs.operation+='删除通行记录'+JSON.stringify(deleteTicket)
                    request.post("/logs-entity/addLogs",logs.deleteLogs)
                    request.post("/ticket-entity/getAllTicket").then(res => {
                        ticketList.splice(0,ticketList.length)
                        ticketList.push(...res.data.data)
                    })
                }else {
                    ElMessage.error('删除失败')
                }
            })
         }

        const deleteTicketDialogVisible=ref(false)
        const confirmChangeTicket = () => {
            if (changeTicket.paymentStatus === '已支付') {
                if (changeTicket.payTime === '') {
                    ElMessage.error('支付时间不能为空')
                    return
                }
            }
            if (changeTicket.paymentStatus === '未支付') {
                changeTicket.payTime = ''
            }
            // var operation=changeTicket;
            // console.log(operation);
            request.post('/ticket-entity/updateTicketById', changeTicket).then(res => {
                if (res.data.code === 200){
                    ElMessage.success('修改成功')
                    editTicketDialogVisible.value = false
                    logs.changeLogs.userId=pageInfo.userId
                    logs.changeLogs.type='修改'
                    logs.changeLogs.operation+='修改为'+JSON.stringify(changeTicket)
                    request.post("/logs-entity/addLogs",logs.changeLogs)
                    request.post("/ticket-entity/getAllTicket").then(res => {
                        ticketList.splice(0,ticketList.length)
                        ticketList.push(...res.data.data)
                    })
                }else {
                    ElMessage.error('修改失败')
                }

            })
        }
        const editTicketDialogVisible=ref(false)
        const changeTicket=reactive({
            plateNumber: '',
            entranceStation: '',
            entranceTime: '',
            exitStation: '',
            exitTime: '',
            amount: 0,
            paymentStatus: '',
            payTime: '',
            ticketId: ''
        })
        const deleteTicket=reactive({
            plateNumber: '',
            entranceStation: '',
            entranceTime: '',
            exitStation: '',
            exitTime: '',
            amount: 0,
            paymentStatus: '',
            payTime: '',
            ticketId: ''
        })
        const onEditTicket = (row: ticket) => {
            editTicketDialogVisible.value=true
            changeTicket.plateNumber=row.plateNumber
            changeTicket.entranceStation=row.entranceStation
            changeTicket.entranceTime=row.entranceTime
            changeTicket.exitStation=row.exitStation
            changeTicket.exitTime=row.exitTime
            changeTicket.amount=row.amount
            changeTicket.paymentStatus=row.paymentStatus
            changeTicket.payTime=row.payTime
            changeTicket.ticketId=row.ticketId
            logs.changeLogs.operation='修改通行记录:从原来的'+JSON.stringify(changeTicket)
        }
        const onDeleteTicket = (row: ticket) => {
            if (row.paymentStatus === '已支付') {
                ElMessage.error('已支付的通行记录不能删除')
                return
            }
            deleteTicket.plateNumber=row.plateNumber
            deleteTicket.entranceStation=row.entranceStation
            deleteTicket.entranceTime=row.entranceTime
            deleteTicket.exitStation=row.exitStation
            deleteTicket.exitTime=row.exitTime
            deleteTicket.amount=row.amount
            deleteTicket.paymentStatus=row.paymentStatus
            deleteTicket.payTime=row.payTime
            deleteTicket.ticketId=row.ticketId
            deleteTicketDialogVisible.value=true
            deleteTicketId.deleteTicketId=row.ticketId
            logs.deleteLogs.operation='删除通行记录'+JSON.stringify(deleteTicket)
        }
        const confirmAddTicket=()=>{
            if (addTicket.paymentStatus === '已支付') {
                if (addTicket.payTime === '') {
                    ElMessage.error('支付时间不能为空')
                    return
                }
            }
            if (addTicket.paymentStatus === '未支付') {
                changeTicket.payTime = ''
            }
             request.post('/ticket-entity/addTicket',addTicket).then(res=>{
                 if(res.data.code===200){
                     addTicketDialogVisible.value=false
                      ElMessage.success('新增成功')
                      logs.addLogs.userId=pageInfo.userId
                      logs.addLogs.type='新增'
                      logs.addLogs.operation='新增通行记录'+JSON.stringify(addTicket)
                     request.post("/logs-entity/addLogs",logs.addLogs)
                     request.post("/ticket-entity/getAllTicket").then(res => {
                         ticketList.splice(0,ticketList.length)
                         ticketList.push(...res.data.data)
                     })
                 }
             })
        }

        const addTicketDialogVisible = ref(false)
        const addTicket = reactive({
            plateNumber: '',
            entranceStation: '',
            entranceTime: '',
            exitStation: '',
            exitTime: '',
            amount: '',
            paymentStatus: '',
            payTime: '',
            ticketId: ''
        })
        const  onAddTicket=()=> {
            addTicketDialogVisible.value = true
        }
         const searchType = ref('车牌查询')
        const filter = computed(() => {
            return ticketList.filter((item) => {

                if(searchType.value==='站点查询'){
                    return (
                        item.entranceStation.includes(search.value) ||
                        item.exitStation.includes(search.value)
                    );
                }
                else if(searchType.value==='时间查询'){
                    return (
                        item.entranceTime.includes(search.value) ||
                        item.exitTime.includes(search.value) ||
                        item.payTime.includes(search.value)
                    );
                }
                else{
                    return (
                        item.plateNumber.includes(search.value)
                    );
                }
            });
        });

        const search=ref('')

         const pageInfo = reactive({
              userId: ''
          })
        const router = useRouter()
        const ticketList :ticket[] = reactive([])

        onMounted(() => {
            pageInfo.userId=<string>router.currentRoute.value.params.userid
            request.post("/ticket-entity/getAllTicket").then(res => {
                ticketList.splice(0,ticketList.length)
                 ticketList.push(...res.data.data)
            })
        })
        return {
            pageInfo,
            ticketList,
            search,
            filter,
            searchType,
            onAddTicket,
            addTicket,
            addTicketDialogVisible,
            confirmAddTicket,
            onEditTicket,
            onDeleteTicket,
            editTicketDialogVisible,
            changeTicket,
            confirmChangeTicket,
            deleteTicketDialogVisible,
            deleteTicket,
            confirmDeleteTicket,
            deleteTicketId,
            logs
        }
    }

})

</script>


<style scoped>

</style>