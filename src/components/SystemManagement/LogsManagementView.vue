<script  lang="ts">

import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import Head from "../Head.vue";
import Sidebar from "../Sidebar.vue";
import request from "../../utils/request.ts";
import router from "../../router";
import {logs} from "../../utils/interface.ts";

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
        if (search==='')
          return item

        if(searchType.value==='2') return item.type.includes(search.value)
        if(searchType.value==='4') return item.creatDate.includes(search.value)
      })
    })
    const reNew=()=>{
      search.value=''

    }
    return {
      pageInfo,
      logViewList,
      search,
      searchType,
      filter,
      reNew,
    }
  }

})
</script>

<template>
<Head></Head>
  <el-container>
    <el-aside width="200px">
      <Sidebar></Sidebar>
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

        <el-button @click="reNew">重置</el-button>
      </div>
      <el-table
        :data="filter"
        style="width: 100%;height: 450px">
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
</template>

<style scoped>

</style>