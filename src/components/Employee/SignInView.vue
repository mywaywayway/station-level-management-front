<template>
  <Head></Head>
  <el-container>
        <el-aside width="200px">
          <Sidebar style="height: 500px"></Sidebar>
        </el-aside>
        <el-main>
            <h1 style="margin-left: 30%;color: brown">注：签到超过5小时不可签到</h1>
              <div style="display: flex;margin: 2%">
                  <el-select
                          v-model="filterType"
                          placeholder="选择查询类型"
                          size="default"
                          style="width: 150px;margin-right: 1%;margin-top: 2.3%"
                  >
                      <el-option
                              v-for="item in options"
                              :label="item.label"
                              :value="item.value"
                      />
                  </el-select>
                <el-date-picker
                type="date"
                style="height: 20%;width: 20%;margin-top: 2%; margin-left: 2%"
                v-model="searchTime"
                >

                </el-date-picker>
<!--                  <el-input v-model="search" placeholder="请输入关键字" style="height: 20%;width: 20%;margin-top: 2%; margin-left: 2%"-->
<!--                            clearable/>-->
                <el-button type="primary" style=" height: 20%;margin-top: 2%;margin-left: 2%" @click="renew">重置</el-button>
                  <p style="margin-left: 30%">{{ currentTime }}</p>

              </div>


            <el-table :data="filter" style="width: 100%;height: 400px" >
                <el-table-column  prop="date"  label="日期" width="auto" />
                <el-table-column prop="workingTime" label="上班时间" width="auto" />
                <el-table-column prop="offDutyTime" label="下班时间" width="auto" />
                <el-table-column prop="clockTime1" label="上班打卡时间" width="auto" />
                <el-table-column prop="clockTime2" label="下班打卡时间" width="auto" />
                <el-table-column fixed="right" label="" width="auto">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="signIn1(scope.row)">
                            上班签到
                        </el-button>
                        <el-button link type="primary" size="small" @click="signIn2(scope.row)">下班签到</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>

    </el-container>
</template>

<script lang="ts">

import Head from "../Head.vue";
import Sidebar from "../Sidebar.vue";
import {computed, defineComponent, onMounted, onUnmounted, reactive, ref} from "vue";

import request from "../../utils/request.ts";
import router from "../../router";
import {contextOwner, logs, pageInfo} from "../../utils/interface.ts";
import {ElMessage} from "element-plus";

export  default  defineComponent({
    name: "signInView",
    components: {
        Head,
        Sidebar,
    },
    setup() {
      const renew=()=>{
        search.value=''
        searchTime.value=''
      }
        const searchTime = ref('');
        const filterType = ref('1');
        const options = [
            {
                value: '1',
                label: '未签到'
            },
            {
                value: '2',
                label: '已签到'
            },
            {
                value: '3',
                label: '全部'
            }

        ];

        const filter = computed(() => {
            return contextOwnerList.filter((item) => {
            if (searchTime.value==='')
            {
              if(filterType.value === '1') {
                return   ((item.date.includes(search.value) ||
                            item.workingTime.includes(search.value) ||
                            item.offDutyTime.includes(search.value))&&
                        (item.clockTime1===null||item.clockTime2===null))

              }
              if(filterType.value === '2') {
                return   ((item.date.includes(search.value) ||
                        item.workingTime.includes(search.value) ||
                        item.offDutyTime.includes(search.value))&&
                    (item.clockTime1!==null&&item.clockTime2!==null))
              }else {
                return   (item.date.includes(search.value) ||
                    item.workingTime.includes(search.value) ||
                    item.offDutyTime.includes(search.value))
              }

            }else {
              if(filterType.value === '1') {
                return   ((item.date.includes(search.value) ||
                            item.workingTime.includes(search.value) ||
                            item.offDutyTime.includes(search.value))&&
                        (item.clockTime1===null||item.clockTime2===null))&&
                    (item.date.includes(parseTime(searchTime.value)))
              }
              if(filterType.value === '2') {
                return   ((item.date.includes(search.value) ||
                        item.workingTime.includes(search.value) ||
                        item.offDutyTime.includes(search.value))&&
                    (item.clockTime1!==null&&item.clockTime2!==null))&&
                    (item.date.includes(parseTime(searchTime.value)))
              }else {
                return   (item.date.includes(search.value) ||
                    item.workingTime.includes(search.value) ||
                    item.offDutyTime.includes(search.value))&&
                    (item.date.includes(parseTime(searchTime.value)))
              }
            }


            });
        });
      function parseTime (str:string) {

        if ((str + '').indexOf('-') != -1) {
          str = str.replace(new RegExp(/-/gm), '/')
        }
        let d = new Date(str)
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`

      }
        const search=ref('')
        const contextOwnerList: contextOwner[] = reactive([]);

        const signIn2=(row:contextOwner)=>{
            if (row.clockTime1=== null){
                ElMessage({
                    message: '下班签到失败，上班未签到',
                    type: 'error'
                });
                return;
            }
            if (!row.clockTime2===null){
                ElMessage({
                    message: '下班签到失败，已签到',
                    type: 'error'
                });
                return;
            }
            if (!checkTimeDifference(row.offDutyTime,300)){
                ElMessage({
                    message: '下班签到失败，签到时间未到或已过',
                    type: 'error'
                });
                return;
            }
            else {
                const changeRow=row
                changeRow.clockTime2=currentTimeT.value;
                request.post("/context-owner-entity/updateContextOwnerOffDutyTIme",changeRow).then(res=>{
                    if (res.data.code===200){
                        ElMessage({
                            message: '下班签到成功',
                            type: 'success'
                        });
                        logs.changeLog.userId=pageInfo.userId
                        logs.changeLog.type="修改"
                        logs.changeLog.operation="下班签到"+JSON.stringify(changeRow)
                        request.post("/logs-entity/addLogs",logs.changeLog)
                        row.clockTime2=currentTimeT.value;
                    }else {
                        ElMessage({
                            message: res.data.message,
                            type: 'error'
                        });

                        row.clockTime2=''
                    }
                })
            }
        }
        const signIn1 = (row :contextOwner) => {
            if (!row.clockTime1!==null){
                ElMessage({
                    message: '签到失败，已签到',
                    type: 'error'
                });
                return;
            }
           if (!checkTimeDifference(row.workingTime,300)){
               ElMessage({
                   message: '签到失败，签到时间未到或已过',
                   type: 'error'
               });
               return;
           }

           const changeRow= row;
           changeRow.clockTime1 = currentTimeT.value;

           request.post("/context-owner-entity/updateContextOwnerById",changeRow).then(res => {
               if (res.data.code === 200) {
                   if (!checkTimeDifference(row.workingTime,30)){
                       ElMessage({
                           message: '签到成功，请尽量不要过晚签到',
                           type: 'success'
                       });
                       logs.changeLog.userId=pageInfo.userId
                       logs.changeLog.type="修改"
                       logs.changeLog.operation="上班签到"+JSON.stringify(changeRow)
                        request.post("/logs-entity/addLogs",logs.changeLog)
                       row.clockTime1 = currentTimeT.value;
                   }else {
                       ElMessage({
                           message: '签到成功',
                           type: 'success'
                       });
                     logs.changeLog.userId=pageInfo.userId
                     logs.changeLog.type="修改"
                     logs.changeLog.operation="上班签到"+JSON.stringify(changeRow)
                     request.post("/logs-entity/addLogs",logs.changeLog)
                       row.clockTime1 = currentTimeT.value;
                   }
               } else {
                   ElMessage({
                       message: '签到失败',
                       type: 'error'
                   });
               }
           })



        }
        const checkTimeDifference = (originalTime: string,time:number): boolean => {
            // 将原始时间字符串转换为日期对象
            const originalDate = new Date(originalTime);
            // 获取当前时间
            const currentDate = new Date();

            // 计算当前时间与原始时间的毫秒数差值
            const timeDifference = Math.abs(currentDate.getTime() - originalDate.getTime());

            // 转换为分钟
            const timeDifferenceInMinutes = Math.floor(timeDifference / (1000 * 60));

            // 如果时间差不超过30分钟，则返回true，否则返回false
            return timeDifferenceInMinutes <= time;
        };
        const pageInfo:pageInfo = reactive({
            userId: '',
        })

        const currentTime = ref<string>('');
        const currentTimeT = ref<string>('');
        onMounted(() => {
          const now = new Date();
          const year = now.getFullYear();
          const month = (now.getMonth() + 1).toString().padStart(2, '0');
          const day = now.getDate().toString().padStart(2, '0');
          searchTime.value= `${year}-${month}-${day}`;
            pageInfo.userId = <string>router.currentRoute.value.params.userid;
            request.get("/context-owner-entity/getContextOwnerById/" + pageInfo.userId).then(res => {
                contextOwnerList.splice(0, contextOwnerList.length)
                contextOwnerList.push(...res.data.data);
                     console.log(contextOwnerList)
            })
        })
        const updateCurrentTime = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            currentTimeT.value = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        };

        // 更新时间，每秒更新一次
        const timer = setInterval(updateCurrentTime, 1000);

        // 组件销毁时清除定时器
        onUnmounted(() => {
            clearInterval(timer);
        });
        const logs=reactive({
          changeLog:{} as logs,
        })
        return {
          parseTime,
            renew,
            searchTime,
            logs,
            currentTime,
            pageInfo,
            contextOwnerList,
            signIn1,
            currentTimeT,
            checkTimeDifference,
            signIn2,
            search,
            filter,
            filterType,
            options,
        };
    },
})

</script>


