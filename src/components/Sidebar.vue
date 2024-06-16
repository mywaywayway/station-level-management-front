<script  lang="ts">


import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
import {defineComponent, onMounted, reactive} from "vue";
import {useRouter} from "vue-router";
import {pageInfo} from "../utils/interface.ts";
import request from "../utils/request.ts";


export default defineComponent({
    name: "Sidebar",
    components: {
    },
    setup() {
        const pageInfo:pageInfo=reactive({
            userId:'',
            userType:'',
        })
        onMounted(() => {
            pageInfo.userId = <string>router.currentRoute.value.params.userid;
            request.get("/user-entity/getUserById/" + pageInfo.userId).then(res => {
                pageInfo.userType = res.data.data.userType;
            })
        })
        const router = useRouter()
        const onBillManagement = () => {
          router.push({
            path: '/billManagement/'+pageInfo.userId
          })
        }
        const onSignIn = () => {
          router.push({
            path: '/signIn/'+pageInfo.userId
          })
        }
        const onGoThrough = () => {
          router.push({
            path: '/goThrough/'+pageInfo.userId
          })
        }
        const onSignInManagement=()=>{
          router.push({
            path: '/management/signInManagement/' +pageInfo.userId
          })
        }
        const onApplication=()=>{
          router.push({
            path: '/management/applicationManagement/' +pageInfo.userId
          })
        }

        const handleOpen = (key: string, keyPath: string[]) => {
            console.log(key, keyPath)
        }
        const handleClose = (key: string, keyPath: string[]) => {
            console.log(key, keyPath)
        }

        const onEmployeeManagement=()=>{
          router.push({
            path: '/systemManagement/employeeManagement/' +pageInfo.userId
          })
        }
        const onApplicationManagement=()=>{
          router.push({
            path: '/systemManagement/applicationSystemManagement/' +pageInfo.userId
          })
        }
        const onLogsManagement=()=>{
          router.push({
            path: '/systemManagement/logsUserView/'+pageInfo.userId
          })
        }
        const onView=()=>{
          router.push({
            path: '/management/view/' +pageInfo.userId
          })
        }
        return {
            handleOpen,
            handleClose,
            onBillManagement,
            pageInfo,
            onSignIn,
            onGoThrough,
            onSignInManagement,
          onApplication,
          onEmployeeManagement,
          onApplicationManagement,
          onLogsManagement,
          onView,
        }
    }
})


</script>

<template>
    <div style="background-color: #545c64">
        <el-container  style="background-color: #545c64">
            <el-aside width="200px" >
                <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    default-openeds="['1']"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                >
                    <el-sub-menu index="1" v-if="pageInfo.userType=='1'">
                        <template #title>
                            <el-icon><location/></el-icon>
                            <span>菜单</span>
                        </template>
                        <el-menu-item-group >
                            <el-menu-item index="1-1"  @click="onBillManagement">票据管理</el-menu-item>
                            <el-menu-item index="1-2" @click="onSignIn">签到</el-menu-item>
                        </el-menu-item-group>
                         <el-menu-item-group >
                            <el-menu-item index="1-3" @click="onGoThrough">通行管理</el-menu-item>
                         </el-menu-item-group>

                    </el-sub-menu>
                  <el-sub-menu index="1" v-if="pageInfo.userType=='2'">
                    <template #title>
                      <el-icon><location/></el-icon>
                      <span>菜单</span>
                    </template>
                    <el-menu-item-group >
                      <el-menu-item index="1-1"  @click="onSignInManagement">排班管理</el-menu-item>
                      <el-menu-item index="1-2" @click="onApplication">材料申请审核</el-menu-item>
                      <el-menu-item index="1-2" @click="onView">收费站数据</el-menu-item>
                    </el-menu-item-group>
<!--                    <el-menu-item-group >-->
<!--                      <el-menu-item index="1-3" @click="onGoThrough">通行查询</el-menu-item>-->
<!--                    </el-menu-item-group>-->
<!--                    <el-menu-item-group >-->
<!--                      <el-menu-item index="1-4">item four</el-menu-item>-->
<!--                    </el-menu-item-group>-->
                  </el-sub-menu>
                  <el-sub-menu index="1" v-if="pageInfo.userType=='3'">
                    <template #title>
                      <el-icon><location/></el-icon>
                      <span>菜单</span>
                    </template>
                    <el-menu-item-group >
                      <el-menu-item index="1-1"  @click="onEmployeeManagement">员工信息管理</el-menu-item>
                      <el-menu-item index="1-2" @click="onApplicationManagement">注册申请管理</el-menu-item>
                      <el-menu-item index="1-3" @click="onLogsManagement">日志管理</el-menu-item>
                    </el-menu-item-group>
<!--                    <el-menu-item-group >-->
<!--                      <el-menu-item index="1-3" @click="onGoThrough">通行查询</el-menu-item>-->
<!--                    </el-menu-item-group>-->

                  </el-sub-menu>
                </el-menu>
            </el-aside>
        </el-container>
    </div>

</template>

<style scoped>

</style>