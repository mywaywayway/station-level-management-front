<template>
    <div  style="background: #3b9bc9">
        <el-container>
            <el-header>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <div class="grid-content ep-bg-purple"/>
                        站级管理系统
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content ep-bg-purple"/>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content ep-bg-purple"/>
                        用户名称：{{ pageInfo.userName }}
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content ep-bg-purple"/>
                        <el-dropdown style="left: 20%">

      <span class="el-dropdown-link">
      个人中心
      <el-icon class="el-icon--right">
        <arrow-down/>
      </el-icon>
    </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item>
                                        <el-button @click="onPersonInfo">个人信息中心</el-button>
                                    </el-dropdown-item>
<!--                                    <el-dropdown-item>-->
<!--                                        <el-button @click="onAvatar">头像更换</el-button>-->
<!--                                    </el-dropdown-item>-->
                                    <el-dropdown-item>
                                        <el-button @click="onEsc">退出登录</el-button>
                                    </el-dropdown-item>

                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <el-image :src="personInfo.userAvatar"
                                  style=" height: 50px;width: 50px;border-radius: 50%;margin-left: 50%"></el-image>
                    </el-col>
                </el-row>
            </el-header>
        </el-container>

        <el-dialog
                title="更改头像"
                width="40%"
                v-model="avatarDialogVisible"
                center
        >
            <el-image :src="personInfo.userAvatar" style=" height: 300px;width: 380px"></el-image>
            <br>
            <br>
            <el-upload
                    action=""
                    :http-request="upload"
                    :show-file-list="false">
              <br>
                <el-button class="" style="margin-left: 50%">上传头像</el-button>
                <br>
            </el-upload>
        </el-dialog>

    </div>
</template>



<script lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { defineComponent, onMounted, reactive, ref } from "vue";

import { pageInfo, user } from "../utils/interface.ts";
import request from "../utils/request.ts";

import upload from "@icon-park/vue-next/lib/icons/Upload";
import router from "../router";

export default defineComponent({
    name: "Head",
    components: {
        ArrowDown
    },
    setup() {


        const upload = (options: UploadRequestOptions): XMLHttpRequest => {
            const file = options.file;
            const formData = new FormData();
            formData.append("smfile", file);
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/v2/upload");
            xhr.setRequestHeader("Authorization", "xh6KJgvlS2ZWDNps1BEk24oz6lAH3p2v");
            xhr.onload = function () {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    // console.log(response);
                    personInfo.userAvatar = response.data.url;
                    console.log(personInfo.userAvatar);

                    // console.log("上传成功");
                    request.post("/user-entity/updateUserById", personInfo)
                        .then(res => {
                            // console.log(res);
                            console.log("上传成功");
                            location.reload();
                        })
                        .catch(err => {
                            console.log(err);
                            console.log("上传失败");
                        });
                } else {
                    console.error("上传失败", xhr.statusText);
                }
            };
            xhr.onerror = function () {
                console.error("上传失败");
            };
            xhr.send(formData);
            return xhr;
        };


        const avatarDialogVisible = ref(false)
        const onAvatar = () => {
            avatarDialogVisible.value = true;
        }

        const personInfo: user = reactive({
            applicationRegistration: 0,
            birthday: "",
            email: "",
            password: "",
            sexy: "",
            telephone: "",
            userAvatar: "",
            userId: "",
            userName: "",
            userType: "",
            workId: ""
        })

        const pageInfo: pageInfo = reactive({
            userId: "",
            userName: "",
        })




        onMounted(() => {
            pageInfo.userId = <string>router.currentRoute.value.params.userid;
            request.get("/user-entity/getUserById/" + pageInfo.userId).then(res => {

              console.log(res.data)
              pageInfo.userName = res.data.data.userName;
                personInfo.applicationRegistration = res.data.data.applicationRegistration;
                personInfo.birthday = res.data.data.birthday;
                personInfo.email = res.data.data.email;
                personInfo.password = res.data.data.password;
                personInfo.sexy = res.data.data.sexy;
                personInfo.telephone = res.data.data.telephone;
                personInfo.userAvatar = res.data.data.userAvatar;
                personInfo.userId = res.data.data.userId;
                personInfo.userName = res.data.data.userName;
                personInfo.userType = res.data.data.userType;
                personInfo.workId = res.data.data.workId;
                pageInfo.userName = res.data.data.userName;

            })
        })
        const onEsc = () => {
            router.push({
                path: '/'
            })

        }
        const onPersonInfo = () => {

            router.push({
                path:'/employeeInfo/'+pageInfo.userId,
            })
        }
        return {
            onEsc,
            onPersonInfo,
            pageInfo,
            personInfo,
            onAvatar,
            avatarDialogVisible,
            upload,
        }
    }
})

export { upload };
</script>

<style scoped>
.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}
</style>




