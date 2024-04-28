<template>
<Head></Head>
    <el-container>
        <el-aside width="200px">
            <Sidebar></Sidebar>
        </el-aside>
        <el-main>
            <h1>Home</h1>
        </el-main>
    </el-container>
</template>

<script  lang="ts">



import Head from "../Head.vue";
import {defineComponent} from "vue";
import Sidebar from "../Sidebar.vue";
export  default  defineComponent({
    name: "Home",
    components: {
        Sidebar,
        Head
    },

    setup() {

        return {
            Head
        }
    }
})
</script>

<style scoped>
#registerButton{
position: absolute;
width: 6%;
top: 67%;
left: 52%;
}
</style>
