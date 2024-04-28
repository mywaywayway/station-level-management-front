<template>
  <Head></Head>
    <el-container>
        <el-aside width="200px">
            <Sidebar></Sidebar>
        </el-aside>
        <el-main>
            <h1>BillManagement</h1>
        </el-main>
    </el-container>
</template>

<script  lang="ts">



import {defineComponent} from "vue";
import Head from "../Head.vue";
import Sidebar from "../Sidebar.vue";

export default defineComponent({
    name: "BillManagement",
    components: {
        Head,
        Sidebar,
    },
})
</script>


<style>


</style>