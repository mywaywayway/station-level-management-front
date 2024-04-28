<template>
    <div  id="main">
        <div style="display: flex;height: 10%;width: 10%">


              <div id="form">
                 <h1 style="margin: 5%;margin-left: 40%">LogIn</h1>
                <div id="one">
                  <me id="icon1" theme="outline" size="40" fill="#333" :strokeWidth="2" strokeLinecap="butt"/>
                  <el-input style="width: 40%" v-model="form.userId" clearable maxlength="20" show-word-limit></el-input>
                </div>

                <br>
                <div id="two">
                  <keyboard-one theme="outline" size="40" fill="#333" :strokeWidth="2"/>
                  <el-input style="width: 40%" v-model="form.password" show-password clearable maxlength="20"></el-input>
                    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
                </div>
                <div id="three">
                    <el-radio-group v-model="form.userType">
                        <el-radio :value="1">员工</el-radio>
                        <el-radio :value="2">管理员</el-radio>
                        <el-radio :value="3">系统管理员</el-radio>
                    </el-radio-group>
                </div>
                <el-button @click="login" id="loginButton">登录</el-button>
                 <el-button id="registerButton" @click="registerButton">注册</el-button>
              </div>
        </div>

    </div>

    <el-dialog v-model="registerDialogVisible" title="注册申请" width="30%" center>
        <el-form-item label="账号">
            <el-input v-model="registerForm.userId" placeholder="请输入账号，不超过20字"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
            <el-input v-model="registerForm.userName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别">
            <el-radio-group v-model="registerForm.sexy">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="类别">
            <el-radio-group v-model="registerForm.userType">
                <el-radio label="1">员工</el-radio>
                <el-radio label="2">管理员</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="生日">
            <el-date-picker
                    v-model="registerForm.birthday"
                    type="date"
                    placeholder="选择你的生日"

            />
        </el-form-item>
        <el-form-item label="邮箱">
            <el-input v-model="registerForm.email" placeholder="请输入email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
            <el-input v-model="registerForm.telephone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="工号">
            <el-input v-model="registerForm.workId" placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="registerForm.password" show-password placeholder="请输入密码"></el-input>
        </el-form-item>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="registerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="makeSureRegister">
          注册
        </el-button>
      </span>
        </template>
    </el-dialog>

</template>

<script lang="ts">
import {defineComponent, reactive, ref} from "vue";
import {Me, KeyboardOne} from '@icon-park/vue-next';


import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import request from "../utils/request.ts";
import {user} from "../utils/interface.ts";


export default defineComponent({
  name: "LoginView",
  components: {
    Me, KeyboardOne
  },
  setup() {
      const registerForm : user =reactive({
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

      const registerDialogVisible= ref(false);

      const pattern = /^(?=.*[^\s])(.{6,})$/;

    const form = ref({
      userId: '',
      password: '',
      userType: ''
    })
    const router = useRouter();
    const login = () => {

      request.post("/user-entity/login/",form.value).then(res => {
        // console.log(res.data)
        // console.log(res.data.length)
        if (res.data.code==200){
          ElMessage.success("登录成功")
            console.log(res.data.data.userId)
          router.push({
            path:'/employeeHome/'+res.data.data.userId
          })
        }else {
          ElMessage.error(res.data.message)
        }

      })
    }
    const registerButton = () => {
      // router.push("/register")
        registerDialogVisible.value= true;
        registerForm.applicationRegistration=0,
            registerForm.birthday="",
            registerForm.email= "",
            registerForm.password= "",
            registerForm.sexy="",
            registerForm.telephone="",
            registerForm.userAvatar= "",
            registerForm.userId="",
            registerForm.userName= "",
            registerForm.userType= "",
            registerForm.workId=""
    }
    const makeSureRegister = () => {
        request.post("/user-entity/addUser/",registerForm).then(res => {
            console.log(res.data)
            console.log(res.data.length)
            if (res.data.code==200){
                ElMessage.success("注册成功")
                registerDialogVisible.value=false;
            }else {
                ElMessage.error(res.data.message)
            }

        })
    }


      const errorMessage = ref('');
      const validatePassword = () => {
          if (pattern.test(form.value.password)) {
              // 密码合法，执行相应的操作
              errorMessage.value = ''; // 清空错误消息
              // 这里可以执行其他操作，比如提交表单或者其他逻辑
          } else {
              // 密码不合法，显示错误消息
              errorMessage.value = 'Password cannot be empty';
          }
      };
    return {
      login,
      form,
        registerForm,
        registerButton,
        validatePassword,
        errorMessage,
        registerDialogVisible,
        makeSureRegister,
    }
  }

})
</script>

<style scoped>
#main {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #fff8f8;
}
#form{
  position: absolute;
  width: 40%;
  height: 50%;
  top: 25%;
  left: 35%;
    padding: 1%;
  background-color: white;
}
#one {
  position: absolute;
  width: 100%;
  top: 25%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;

}

#two {
  position: absolute;
  width: 100%;
  top: 40%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
#three {
    position: absolute;
    width: 100%;
    top: 55%;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
#loginButton{
  position: absolute;
  width: 10%;
  top: 67%;
  left: 32%;
}
#registerButton{
  position: absolute;
  width: 10%;
  top: 67%;
  left: 52%;
}

body {
  background-color: #a6a9de;
  height: 100%;
  width: 100%;
}
</style>