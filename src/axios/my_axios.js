/**
 *@作者 : 小Z同学
 *@TheFileFunction ：
 *@CreatedDate : 2019/4/6
 **/
import Vue from "vue"
import axios from 'axios'
axios.defaults.baseURL = 'https://elm.cangdu.org';
axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


Vue.prototype.$axios = axios