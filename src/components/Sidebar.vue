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
            userId:''

        })
        onMounted(() => {
            pageInfo.userId = <string>router.currentRoute.value.params.userid;
            // request.get("/user-entity/getUserById/" + pageInfo.userId).then(res => {
            //     pageInfo.userName = res.data.data.userName;
            // })
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
        const handleOpen = (key: string, keyPath: string[]) => {
            console.log(key, keyPath)
        }
        const handleClose = (key: string, keyPath: string[]) => {
            console.log(key, keyPath)
        }
        return {
            handleOpen,
            handleClose,
            onBillManagement,
            pageInfo,
            onSignIn,
            onGoThrough,
        }
    }
})


</script>

<template>
    <div>
        <el-container>
            <el-aside width="200px">
                <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    default-openeds="['1']"
                >
                    <el-sub-menu index="1">
                        <template #title>
                            <el-icon><location/></el-icon>
                            <span>菜单</span>
                        </template>
                        <el-menu-item-group >
                            <el-menu-item index="1-1"  @click="onBillManagement">票据管理</el-menu-item>
                            <el-menu-item index="1-2" @click="onSignIn">签到</el-menu-item>
                        </el-menu-item-group>
                         <el-menu-item-group >
                            <el-menu-item index="1-3" @click="onGoThrough">通行查询</el-menu-item>
                         </el-menu-item-group>
                        <el-menu-item-group >
                            <el-menu-item index="1-4">item four</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>

                </el-menu>
            </el-aside>
        </el-container>
    </div>

</template>

<style scoped>

</style>