/**
 * Created by Lenovo on 2019/8/7.
 */
import axios from "axios";
import Config from './envConfig';
import {Toast} from 'antd-mobile';
//调ajax，获取后端接口数据
export function getData(obj){
    var token = localStorage.getItem("token")||"";
    //调接口时页面是否开启loading，参数0表示loading不会自动消失
    if(obj.isShowLoad){
        Toast.loading('加载中...', 0);
    }
    //需要传给后端的参数对象
    var options =  {
        method: obj.method,
        url: Config.serverUrl+obj.url,
        headers:obj.headers||{
            token:token,
        }
    };
    //如果是get请求，key值为params
    if(obj.method === "get"){
        options.params = obj.data;
    }else {
    //否则key值为data
        options.data = obj.data;
    }
    axios(options).then(function (res) {
        let result = res.data;
        //后端返回999表示未登录或者token过期，需要跳转到登录页面
        if(result.code === 999){
            window.location.href=Config.serverIp+"login";
            return;
        }
        //如果定义了成功回调，处理逻辑
        if(obj.successCB){
            Toast.hide();
            if(result.code === 0){
                obj.successCB(result);
            }else {
                Toast.fail(result.message);
            }
        }
    }).catch(function (err) {
        if(obj.failCB){
            obj.failCB(err);
        }
    });
}
//判断变量是true还是false
export function isDefine(str) {
     if(str === null || str === '' || str === undefined || str === NaN){
         return false
     };
     return true;
}
//跳转页面
export function goNext(that,pathname,state) {
    if(state ||state===0){
        that.props.history.push({pathname:pathname,state:state});
    }else {
        that.props.history.push(pathname);
    }
}
//prompt、verify、doNext、checkParam方法的结合做参数非空校验
export function prompt(value,msg) {
    if(typeof value =="boolean"){
        if(value){
            Toast.info(msg, 1);
            return false
        }else {
            return true;
        }
    }else if(!isDefine(value)){
        Toast.info(msg, 1);
        return false
    }else {
        return true
    }
}
export function  *verify(arr){
    for(var i=0;i<arr.length;i++){
        yield prompt(arr[i].value,arr[i].msg);
    }
    //Generator 函数需要return之后才算真正结束
    return;
}
//通过递归执行分段函数
export function doNext(bool,cb){
    //先执行第一个分段函数
    var x= bool.next();
    if(x.value){
        //当 value 值为 true 时（也就是非空的时候），再执行下一个分段函数
        doNext(bool,cb);
    }else {
        if(x.done && cb){
            //分段函数执行完毕之后执行回调
            cb();
        }
    }
}
export function checkParam(arr,cb){
    //Generator 函数需要调用一次才能执行（后面通过 next 执行）。
    var bool = verify(arr);
    doNext(bool,cb);
}
//时间戳改成202-10-10 09:20形式
export function getTime(value) {
    var b = new Date(value);
    var year = b.getFullYear()+'-';
    var month = (b.getMonth()+1);
    var date = b.getDate();
    var hour = b.getHours();
    var min = b.getMinutes();
    if(month<10){
        month = '0'+ (b.getMonth()+1)+'-';
    }else {
        month = (b.getMonth()+1)+'-';
    }
    if(date<10){
        date = '0'+ (b.getDate());
    }
    if(hour<10){
        hour = '0'+ (b.getHours())+':';
    }else {
        hour = (b.getHours())+':';
    }
    if(min<10){
        min = '0'+ (b.getMinutes());
    }else {
        min = (b.getMinutes());
    }
    var str = String(year)+String(month)+String(date)+ ' '+String(hour)+String(min);
    return str;
}
//时间戳改成202年10月10日 09:20形式
export function getTimeFormat(value) {
    var b = new Date(value);
    var year = b.getFullYear()+'年';
    var month = (b.getMonth()+1);
    var date = b.getDate();
    var hour = b.getHours();
    var min = b.getMinutes();
    if(month<10){
        month = '0'+ (b.getMonth()+1)+'月';
    }else {
        month = (b.getMonth()+1)+'月';
    }
    if(date<10){
        date = '0'+ (b.getDate())+'日';
    }else {
        date = (b.getDate())+'日';
    }
    if(hour<10){
        hour = '0'+ (b.getHours())+':';
    }else {
        hour = (b.getHours())+':';
    }
    if(min<10){
        min = '0'+ (b.getMinutes());
    }else {
        min = (b.getMinutes());
    }
    var str = String(year)+String(month)+String(date)+ ' '+String(hour)+String(min);
    return str;
}
//时间戳改成09:20形式
export function getTimeHour(value) {
    var b = new Date(value);
    var hour = b.getHours();
    var min = b.getMinutes();
    if(hour<10){
        hour = '0'+ (b.getHours());
    }else {
        hour = (b.getHours());
    }
    if(min<10){
        min = '0'+ (b.getMinutes());
    }else {
        min = (b.getMinutes());
    }
    var str = String(hour)+":"+String(min)
    return str;
}
//textarea多行文本框高度自适应
export function autoTextarea(){
    var textarea = document.getElementsByTagName("textarea");
    for (var i = 0; i < textarea.length; i++) {
        textarea[i].style.height = '0.6rem';
        textarea[i].scrollTop = 0; //防抖动
        textarea[i].style.height = textarea[i].scrollHeight + 'px';
        textarea[i].addEventListener('input', function (e) {
            e.target.style.height = 'auto';
            e.target.scrollTop = 0; //防抖动
            if (e.target.scrollHeight < 30) {
                e.target.style.height = '30px';
            } else {
                e.target.style.height = e.target.scrollHeight + 'px';
            }
        })
    }
}