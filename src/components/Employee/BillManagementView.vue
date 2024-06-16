<template>
  <Head></Head>
    <el-container>
        <el-aside width="200px">
          <Sidebar style="height: 500px"></Sidebar>
        </el-aside>
        <el-main>
            <div style="display: flex">
                <el-card style="margin: 2%;margin-left: 5%;width: 30%">
                    <template #header>
                        <div style="display: flex">
                            <p>普通发票管理</p>
                            <el-button style="margin-top: 10%;margin-left: 20%" @click="onTollInvoice">进入</el-button>
                        </div>

                    </template>
                    <img
                            src="https://imgb15.photophoto.cn/20201030/enshifengjingqutupian-39528540_3.jpg"
                            style="width: 100%;height: 200px"
                    />
                </el-card>
            <el-card style="margin: 2%;margin-left: 10%;width: 30%">
                <template #header>
                    <div style="display: flex">
                        <p>定额发票管理</p>
                        <el-button  style="margin-top: 10%;margin-left: 20%" @click="onQuotaTicket">进入</el-button>
                    </div>

                </template>
                <img
                        src="https://imgb15.photophoto.cn/20201228/xuejingtupian-40296432_3.jpg"
                        style="width: 100%;height: 200px"
                />
            </el-card>
            <el-card style="margin: 2%;margin-left: 10%;width: 30%">
                <template #header>
                    <div style="display: flex">
                        <p>申请管理</p>
                        <el-button style="margin-top: 10%;margin-left: 20%" @click="onApplication">进入</el-button>
                    </div>

                </template>
                <img
                        src="https://imgb15.photophoto.cn/20201019/fangshetuantupian-39388065_3.jpg"
                        style="width: 100%"
                />
            </el-card>
            </div>
        </el-main>
    </el-container>
</template>

<script  lang="ts">


import {defineComponent, onMounted, reactive} from "vue";
import Head from "../Head.vue";
import Sidebar from "../Sidebar.vue";
import router from "../../router";
import {pageInfo} from "../../utils/interface.ts";
import {useRouter} from "vue-router";
import request from "../../utils/request.ts";

export default defineComponent({
    name: "BillManagement",
    components: {
        Head,
        Sidebar,
    },

    setup() {
        const onApplication=()=>{
            router.push({
                path:"/employee/application/"+pageInfo.userId
            })
        }

        const router = useRouter()
        const pageInfo:pageInfo=reactive({
            userId:'',
        })
        const onTollInvoice = () => {
            router.push({
                path: "/employee/tollInvoice/"+pageInfo.userId
            })
        }
        const onQuotaTicket=()=>{
            router.push({
                path:"/employee/QuotaTicket/"+pageInfo.userId
            })
        }
        onMounted(() => {
            pageInfo.userId = <string>router.currentRoute.value.params.userid;

        })

        return {
            onTollInvoice,
            onQuotaTicket,
            onApplication,
        }
    }
})
</script>


<style>


</style>