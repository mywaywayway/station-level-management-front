

<template>
<Head></Head>
    <el-container>
        <el-aside width="200px">
          <Sidebar style="height: 500px"></Sidebar>
        </el-aside>
        <el-main style="margin-top: 2%">
          <div style="display: flex">
          <el-card  style="margin-right: 5%">
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
          </el-card>
          <el-card>
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
          </el-card>
          </div>
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
                <el-form-item label="输入现密码">
                    <el-input v-model="passwordData.oldPassword" show-password placeholder="请输入现在的密码"></el-input>
                </el-form-item>
                <el-form-item label="输入新密码">
                    <el-input v-model="passwordData.newPassword" show-password placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码">
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
import {logs} from "../../utils/interface.ts";
import upload from "@icon-park/vue-next/lib/icons/Upload";
import {
    Iphone,
    // Location,
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
   name:"PersonInfo",
    components: {
        Sidebar,
        Head
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
            console.log(response.data);
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

      const makeSureChangePassword=()=>{
            if (passwordData.oldPassword == "" || passwordData.newPassword == "" || passwordData.makeSurePassword == "") {
                ElMessage.error("请填写完整信息")
              return;
            }
            if(passwordData.newPassword!=passwordData.makeSurePassword){
                ElMessage.error("两次密码不一致")
                return;
            }else {
              request.get("/user-entity/updatePasswordById/"+pageInfo.userId+"/"+passwordData.oldPassword+"/"+passwordData.newPassword).then(res=>{
                if(res.data.code==200){
                  changePasswordDialogVisible.value=false
                  ElMessage.success("修改成功")
                  logs.changeLog.userId=pageInfo.userId
                  logs.changeLog.type="修改"
                  logs.changeLog.operation="修改密码"
                  request.post("/logs-entity/addLogs",logs.changeLog)
                }else {
                  ElMessage.error("修改失败,"+res.data.message)
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
                    logs.changeLog.operation+="修改为"+JSON.stringify(personInfo)
                    request.post("/logs-entity/addLogs",logs.changeLog)
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
            logs.changeLog.userId=personInfo.userId
            logs.changeLog.type="修改"
            logs.changeLog.operation="修改基本信息,从原来的"+JSON.stringify(changePersonInfo)
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
        const logs=reactive({
          changeLog:{} as logs,
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
            logs,
            upload,
        }
    }
})

</script>

<style scoped>

.cell-item {
    display: flex;
    align-items: center;
}
.margin-top {
    margin-top: 20px;
}
</style>