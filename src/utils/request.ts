import axios from "axios";
// 创建axios实例 封装axios

const request = axios.create({
    baseURL:'http://localhost:9090',

})
//
// request.interceptors.request.use((config) => {
//     // console.log("intercepting request");
//     const token = localStorage.getItem("access"); // use getState() in zustand, not hooks
//     // console.log("added token", token);
//     if (token) {
//         config.headers.common['Authorization']  = `Bearer ${token}`;
//     }
//     return config;
// });
export default request