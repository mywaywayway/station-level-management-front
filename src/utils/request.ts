import axios from "axios";
// 创建axios实例 封装axios

const request = axios.create({
    baseURL:'http://localhost:9090',

})

request.interceptors.request.use((config) => {
    // console.log("intercepting request");
    const token = localStorage.getItem("token"); // use getState() in zustand, not hooks
    // console.log("added token", token);
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    // console.log(config)
    return config;
});
export default request