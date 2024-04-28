

<template xmlns:el-button="http://www.w3.org/1999/html">
<Head></Head>
    <el-container>
        <el-aside width="200px">
            <Sidebar></Sidebar>
        </el-aside>
        <el-main style="margin-top: 2%">
            <el-radio-group v-model="size">
                <el-radio value="large">Large</el-radio>
                <el-radio value="default">Default</el-radio>
                <el-radio value="small">Small</el-radio>
            </el-radio-group>
            <el-descriptions
                class="margin-top"
               style="margin-top: 5%"
                :column="3"
                :size="size"
                border
            >
<!--                <template #extra>-->
<!--                    <el-button type="primary">Operation</el-button>-->
<!--                </template>-->
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <user />
                            </el-icon>
                            用户ID
                        </div>
                    </template>
                    {{personInfo.userId}}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <user />
                            </el-icon>
                            用户名
                        </div>
                    </template>
                    {{personInfo.userName}}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Male />
                            </el-icon>
                            性别
                        </div>
                    </template>
                    {{personInfo.sexy}}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <iphone />
                            </el-icon>
                            手机号码
                        </div>
                    </template>
                    {{ personInfo.telephone }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <location />
                            </el-icon>
                            生日
                        </div>
                    </template>
                    {{ personInfo.birthday }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <office-building />
                            </el-icon>
                            工号
                        </div>
                    </template>
                    {{ personInfo.workId }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Message />
                            </el-icon>
                           电子邮箱
                        </div>
                    </template>
                    {{ personInfo.email }}
                </el-descriptions-item>
            </el-descriptions>

            <el-button style="margin-left: 30%;margin-top: 5%" @click="onChangeInfo">修改基本个人信息</el-button>
            <el-button style="margin-left: 10%;margin-top:5% " @click="onChangePassword">修改密码</el-button>
        </el-main>

        <el-dialog
            v-model="changePersonINfoDialogVisible"
            title="修改基本信息"
            width="30%"
            center>

            <el-form :model="changePersonInfo"  ref="changePersonInfoForm" label-width="80px">
                <el-form-item label="用户ID" prop="userName">
                    {{changePersonInfo.userId}}
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="changePersonInfo.userName"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sexy">
                    <el-radio-group v-model="changePersonInfo.sexy">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>

                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机号码" prop="telephone">
                    <el-input v-model="changePersonInfo.telephone"></el-input>
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                      <el-date-picker
                          v-model="changePersonInfo.birthday"
                          type="date"
                          placeholder="选择你的生日"

                      />
                </el-form-item>
                <el-form-item label="工号" prop="workId">
                  {{changePersonInfo.workId}}
                </el-form-item>
                <el-form-item label="电子邮箱" prop="email">
                    <el-input v-model="changePersonInfo.email"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary" @click="makeSureChangePersonInfo">提交</el-button>
                    <el-button  @click="changePersonINfoDialogVisible=false">取消</el-button>
                    </span>

            </template>
        </el-dialog>

        <el-dialog
            v-model="changePasswordDialogVisible"
            title="修改密码"
            width="30%"
            center>
            <el-form :v-model="passwordData">
                <el-form-item>
                    <el-input v-model="passwordData.oldPassword" show-password placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="passwordData.newPassword" show-password placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="passwordData.makeSurePassword" show-password placeholder="请再次输入新密码"></el-input>
                </el-form-item>

            </el-form>
            <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary" @click="makeSureChangePassword">提交</el-button>
                    <el-button  @click="changePersonINfoDialogVisible=false">取消</el-button>
                    </span>

            </template>
        </el-dialog>

    </el-container>
</template>

<script  lang="ts">

import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import Sidebar from "../Sidebar.vue";
import Head from "../Head.vue";
import {
    Iphone,
    Location,
    OfficeBuilding,
    Tickets,
    User,
    Message,
    Male,
} from '@element-plus/icons-vue'
import {ComponentSize, ElMessage} from "element-plus";

import request from "../../utils/request.ts";
import {changePassword, pageInfo, user} from "../../utils/interface.ts";
import router from "../../router";
export  default  defineComponent({
    name: "PersonInfoView",
    components: {
        Sidebar,
        Head
    },

    setup() {
        const makeSureChangePassword=()=>{
            if (passwordData.oldPassword == "" || passwordData.newPassword == "" || passwordData.makeSurePassword == "") {
                ElMessage.error("请填写完整信息")
            }
            if (passwordData.oldPassword!=personInfo.password){
                ElMessage.error("旧密码错误")
            }
            if(passwordData.newPassword!=passwordData.makeSurePassword){
                ElMessage.error("两次密码不一致")
            }else {
                personInfo.password=passwordData.newPassword
                request.post("/user-entity/updateUserById/",personInfo).then((res)=>{
                    if(res.data.code==200){
                        ElMessage.success("修改成功")
                        changePasswordDialogVisible.value=false
                    }else {
                        ElMessage.error("修改失败")
                    }
                })
            }
        }
        const onChangePassword = () => {
            changePasswordDialogVisible.value = true
        }
        const changePasswordDialogVisible= ref(false)

        const passwordData : changePassword = reactive({
            oldPassword: "",
            newPassword: "",
            makeSurePassword: ""
        })

        const makeSureChangePersonInfo = () => {
              request.post("/user-entity/updateUserById/",changePersonInfo).then((res)=>{
                  if(res.data.code==200){
                      changePersonINfoDialogVisible.value=false
                      ElMessage.success("修改成功")
                      personInfo.userName=changePersonInfo.userName
                      personInfo.sexy=changePersonInfo.sexy
                      personInfo.telephone=changePersonInfo.telephone
                      personInfo.birthday=changePersonInfo.birthday
                      personInfo.email=changePersonInfo.email
                  }else {
                      ElMessage.error("修改失败")
                  }
              })
        }
        const onChangeInfo= () => {
            changePersonINfoDialogVisible.value = true
            changePersonInfo.userName=personInfo.userName
            changePersonInfo.sexy=personInfo.sexy
            changePersonInfo.telephone=personInfo.telephone
            changePersonInfo.birthday=personInfo.birthday
            changePersonInfo.workId=personInfo.workId
            changePersonInfo.email=personInfo.email
            changePersonInfo.userId=personInfo.userId
            changePersonInfo.userAvatar=personInfo.userAvatar
            changePersonInfo.userType=personInfo.userType
            changePersonInfo.password=personInfo.password
            changePersonInfo.applicationRegistration=personInfo.applicationRegistration
        }

        const changePersonINfoDialogVisible = ref(false)
          const pageInfo:pageInfo=reactive({
            userId:"",
            userName:"",
          })
        const personInfo : user =reactive({
            applicationRegistration:0,
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
        const changePersonInfo:user=reactive({
            applicationRegistration:0,
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
        onMounted(()=>{
            pageInfo.userId=<string>router.currentRoute.value.params.userid
            request.get("/user-entity/getUserById/"+pageInfo.userId).then(res=>{
                pageInfo.userName=res.data.userName
                personInfo.applicationRegistration=res.data.applicationRegistration
                personInfo.birthday=res.data.data.birthday
                personInfo.email=res.data.data.email
                personInfo.password=res.data.data.password
                personInfo.sexy=res.data.data.sexy
                personInfo.telephone=res.data.data.telephone
                personInfo.userAvatar=res.data.data.userAvatar
                personInfo.userId=res.data.data.userId
                personInfo.userName=res.data.data.userName
                personInfo.userType=res.data.data.userType
                personInfo.workId=res.data.data.workId

            })
        })

        const size = ref<ComponentSize>('default')
        const iconStyle = computed(() => {
            const marginMap = {
                large: '8px',
                default: '6px',
                small: '4px',
            }
            return {
                marginRight: marginMap[size.value] || marginMap.default,
            }
        })
        return {
            Head,
            Iphone,
            Location,
            OfficeBuilding,
            Tickets,
            passwordData,
            User,
            Male,
            Message,
            iconStyle,
            size,
            pageInfo,
            changePersonINfoDialogVisible,
            personInfo,
            changePersonInfo,
            onChangeInfo,
            makeSureChangePersonInfo,
            changePasswordDialogVisible,
            onChangePassword,
            makeSureChangePassword,
        }
    }
})

</script>

<style scoped>
.el-descriptions {
    margin-top: 20px;
}
.cell-item {
    display: flex;
    align-items: center;
}
.margin-top {
    margin-top: 20px;
}
</style>