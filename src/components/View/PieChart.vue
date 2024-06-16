<script setup  lang="ts">

import {defineComponent, onMounted, reactive, ref, watch} from "vue";
import Head from "@/components/Head.vue";
import Sidebar from "@/components/Sidebar.vue";
import VChart, { THEME_KEY } from "vue-echarts";
import * as echarts from "echarts";
import request from "@/utils/request.ts";
import {material, ticketsMoney, ticketsNumber} from "@/utils/interface.ts";

const data = reactive<ticketsNumber[]>([])
const moneyData = reactive<ticketsMoney[]>([])
const materialData= reactive<material[]>([])
const materialYear = ref("2024")
const materialMonth=ref("5")
const yearAndMonth=ref("2024-5")
const materialLoading=ref(true)
const materialOption = reactive<any>({})
const Year = ref("2024")
const MoneyYear = ref("2024")
const option = reactive<any>({})
const MoneyOption = reactive<any>({})
const loading = ref(true)
const moneyLoading = ref(true)
const fetchDataMaterial= async ()=>{
  materialLoading.value = true
  materialYear.value=new Date(yearAndMonth.value).getFullYear().toString()
  materialMonth.value=(new Date(yearAndMonth.value).getMonth()+1).toString()
  const res = await request.get("/outboundrecords-entity/getMaterialsNumberByYearAndMonth/" + materialYear.value + "/" + materialMonth.value)
  materialData.splice(0, materialData.length)
  materialData.push(...res.data.data)
  console.log(materialData)
  // materialOption.xAxis = {
  //   type: 'category',
  //   data: materialData.map((item: any) => item.day)
  // }
  materialOption.tooltip= {
    trigger: 'item'
  }

  materialOption.legend={
    top: '5%',
        left: 'center'
  }
  materialOption.series = [
    {
      name: '无数据',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: materialData.map((item: any) => {
        return {
          value: item.number,
          name: item.name,
        }
      })
    }
  ]
  materialLoading.value = false

}

const fetchDataMoney= async ()=>{
  moneyLoading.value = true
  MoneyYear.value=new Date(MoneyYear.value).getFullYear().toString()
  const res = await request.get("/ticket-entity/getTicketMoneyByYear/" + MoneyYear.value)
  moneyData.splice(0, moneyData.length)
  moneyData.push(...res.data.data)
  MoneyOption.xAxis = {
    type: 'category',
    data: moneyData.map((item: any) => item.month)
  }
  MoneyOption.title = {
    text: '每月收入'
  }
  MoneyOption.yAxis = {
    type: 'value'
  }
  MoneyOption.series = [
    {
      data: moneyData.map((item: any) => item.total_income),
      type: 'bar'
    }
  ]
  moneyLoading.value = false

}


const fetchData = async () => {
  loading.value = true
  Year.value=new Date(Year.value).getFullYear().toString()
  const res = await request.get("/ticket-entity/getTicketNumberByYear/" + Year.value)
  data.splice(0, data.length)
  data.push(...res.data.data)
  option.xAxis = {
    type: 'category',
    data: data.map((item: any) => item.month)
  }
  option.title = {
    text: '每月通行量'
  }
  option.yAxis = {
    type: 'value'
  }
  option.series = [
    {
      data: data.map((item: any) => item.count),
      type: 'line'
    }
  ]
  loading.value = false
}

onMounted(fetchData)
onMounted(fetchDataMoney)
onMounted(fetchDataMaterial)
watch(MoneyYear, fetchDataMoney)
watch(Year, fetchData)
watch(yearAndMonth, fetchDataMaterial)

</script>

<template>
  <Head></Head>
  <el-container>
    <el-aside width="200px">
      <Sidebar style="height: 500px"></Sidebar>
    </el-aside>
    <el-main>
      <div style="display: flex">
        <el-card style="width: 35%">
          <el-date-picker v-model="Year" type="year" placeholder="选择年份" style="margin-bottom: 20px"></el-date-picker>
          <v-chart class="chart" :option="option" v-if="!loading" />
        </el-card>
        <el-card style="width: 35%;margin-left: 1%">
          <el-date-picker v-model="MoneyYear" type="year" placeholder="选择年份" style="margin-bottom: 20px"></el-date-picker>
          <v-chart class="chart" :option="MoneyOption" v-if="!moneyLoading" />
        </el-card>
        <el-card style="width: 35%;margin-left: 1%">
          <el-date-picker v-model="yearAndMonth" type="month" placeholder="选择月份" style="margin-bottom: 20px"></el-date-picker>
          <v-chart class="chart" :option="materialOption" v-if="!materialLoading" />

        </el-card>
      </div>

    </el-main>
  </el-container>
</template>

<style scoped>
.chart {
  height: 250px;
  width: 350px;
}
</style>