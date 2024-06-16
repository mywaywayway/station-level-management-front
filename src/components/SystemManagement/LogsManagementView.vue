<script  lang="ts">

import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import Head from "../Head.vue";
import Sidebar from "../Sidebar.vue";
import request from "../../utils/request.ts";
import router from "../../router";
import {logs} from "../../utils/interface.ts";
import * as XLSX from 'xlsx';

export default defineComponent({
  components: {Sidebar, Head},

  setup() {
    const pageInfo=reactive({
      userId:'',
      userType:'',
    })
      const logViewList:logs[]=reactive([])
    onMounted(() => {
      pageInfo.userId = <string>router.currentRoute.value.params.userid;
      request.post("/logs-user-view-entity/getAllLogsUserView").then(res => {
        logViewList.splice(0,logViewList.length)
        logViewList.push(...res.data.data)
      })
    })
    const search=ref('')
    const searchType=reactive({
      value:'2',
      options:[

        {
          value: '2',
          label: '操作类型'
        },
        {
          value: '4',
          label: '操作时间'
        },
      ]
    })
    const filter=computed(()=>{

      return logViewList.filter((item)=>{
        if (search.value==='')
          return item

        if(searchType.value==='2') return item.type.includes(search.value)
        if(searchType.value==='4') return item.creatDate.includes(search.value)
      })
    })
    const reNew=()=>{
      search.value=''

    }
    const exportDialogVisible=ref(false)

    const onExport=()=>{
      exportDialogVisible.value=true
    }
    const exportTime=reactive({
      startTime:'',
      endTime:''
    })
    const exportList:logs[]=reactive([])
    function parseTime (str:string,flag :Number) {

      if ((str + '').indexOf('-') != -1) {
        str = str.replace(new RegExp(/-/gm), '/')
      }
      let d = new Date(str)
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      if (flag==1)
        return `${year}-${month}-${day} 00:00:00`
      else
        return `${year}-${month}-${day} 23:59:59`


    }
    const confirmExport=()=>{
      exportTime.startTime=parseTime(exportTime.startTime,1)
      exportTime.endTime=parseTime(exportTime.endTime,2)
      exportList.splice(0,exportList.length)
      logViewList.forEach((item)=>{
        if (item.creatDate>=exportTime.startTime&&item.creatDate<=exportTime.endTime){
          exportList.push(item)
        }
      })
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportList);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, exportTime.startTime+"-"+exportTime.endTime+"日志.xlsx");
      exportDialogVisible.value=false
      exportTime.startTime=''
      exportTime.endTime=''
    }
    return {
      pageInfo,
      logViewList,
      search,
      searchType,
      filter,
      reNew,
      exportDialogVisible,
      onExport,
      exportTime,
      confirmExport,
      exportList,
    }
  }

})
</script>

<template>
<Head></Head>
  <el-container>
    <el-aside width="200px">
      <Sidebar style="height: 500px"></Sidebar>
    </el-aside>
    <el-main>
      <h1 style="margin-left: 40%">日志管理</h1>
      <div style="display: flex">
        <el-select v-model="searchType.value" placeholder="请选择" style="width: 100px">
          <el-option
            v-for="item in searchType.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input placeholder="请输入关键字" style="width: 200px;margin-left: 1%" v-model="search"></el-input>

        <el-button @click="reNew" type="primary">重置</el-button>

        <el-button type="primary" @click="onExport">导出</el-button>
      </div>
      <el-table
        :data="filter"
        style="width: 100%;height: 400px">
<!--        <el-table-column-->
<!--          prop="userId"-->
<!--          label="用户ID"-->
<!--          width="auto">-->
<!--        </el-table-column>-->
        <el-table-column
          prop="userName"
          label="用户名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="type"
          label="操作类型"
          width="100">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          width="550">
        </el-table-column>
        <el-table-column
          prop="creatDate"
          label="操作时间"
          width="auto">
        </el-table-column>
<!--        <el-table-column prop="right" label="操作" width="auto">-->
<!--          <template #default="scope">-->
<!--            <el-button type="primary" size="small">查看</el-button>-->

<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
    </el-main>
  </el-container>
  <el-dialog
  title="导出日志"
  v-model="exportDialogVisible"
  width="30%"
  center
  >
   <el-form-item label="开始时间">
     <el-date-picker v-model="exportTime.startTime" placeholder="输入导出起始时间"></el-date-picker>
   </el-form-item>
    <el-form-item label="结束时间">
      <el-date-picker v-model="exportTime.endTime" placeholder="输入导出结束时间"></el-date-picker>
    </el-form-item>
    <template #footer>
      <el-button @click="exportDialogVisible=false">取消</el-button>
      <el-button type="primary" @click="confirmExport">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>