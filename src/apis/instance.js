import axios from 'axios';

// 自定义配置
// 新建一个 axios 实例
const instance = axios.create({
    // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
    // 如果请求话费了超过 `timeout` 的时间，请求将被中断
    timeout: 1000 * 60,
    // `withCredentials` 表示跨域请求时是否需要使用凭证
    withCredentials: true,
    // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。
    // 如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
    validateStatus: status => {
        return status >= 200 && status < 600; // default
    },
    baseURL: 'https://api.trtst.com'
});

// 拦截器
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 未登录，需要重新登录
    if (response.status == 301) {
    }
    
    // 对响应数据做点什么
    return response;
}, function (error) {
    console.log(error);
    // 对响应错误做点什么
    return Promise.reject(error);
});

// 请求时使用的方法
const ajaxMethod = ['get', 'post']
const api = {}
ajaxMethod.forEach(method => {
    api[method] = function (uri, data, config) {
        return new Promise(function (resolve, reject) {
            instance[method](uri, data, config)
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    }
});

export default api;