/**
 * Created by Lenovo on 2019/8/10.
 */
import React from 'react';
import './register.css';
import {Title,List,Input,Button} from '../../../share';
import {getData, goNext,isDefine,checkParam} from '../../../utils';
import {Toast} from 'antd-mobile';
import verifyCode from '../../../images/account/verify-code.png';
export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userAvatar:[],//初始化头像
            getCode:'获取验证码',//初始化获取验证码文本
            userName: '',//初始化用户名
            mobile: '',//初始化手机号
            verifyCode:"",//初始化验证码
            password:'',//初始化密码
            confirmPwd:'',//初始化确认密码
        }
    }
    //获取手机验证码
    getVerify(){
        if(!isDefine(this.state.mobile)){
            Toast.info("请输入手机号");
            return;
        }
        getData({
            method:'post',
            url:'getVerifyCode',
            data:{
                mobile:this.state.mobile,
                type:1 //获取验证码类型 type 为1表示注册
            },
            successCB:()=> {
                this.setState({
                    getCode:60
                },()=>{
                    this.timer = setInterval(()=>{
                        //验证码过了60秒，消除定时器
                        if(this.state.getCode === 1){
                            clearInterval(this.timer);
                            this.setState({
                                getCode:"获取验证码"
                            })
                        }else {
                            //验证码60秒倒计时
                            this.setState({
                                getCode:--this.state.getCode
                            })
                        }
                    },1000)
                })
            }
        })
    }
    componentWillUnmount(){
        //组件销毁时，比如关掉页面，消除定时器
        clearTimeout(this.timer);
    }
    //获取验证码
    renderRight(){
        return(
            <div className="cm-flex cm-ai-c"><img src={verifyCode} alt="" className="cm-img-04"/><span className="cm-c-main" onClick={()=>this.getVerify()}> {this.state.getCode==="获取验证码"?"获取验证码":this.state.getCode+"秒后重新获取"}</span></div>
        )
    }
    //注册
    register(){
        //判断参数是否为空
        var arr = [
            {value:this.state.userAvatar.length === 0,msg:"请选择头像"},
            {value:this.state.userName,msg:"请输入用户名"},
            {value:this.state.mobile,msg:"请输入手机号"},
            {value:this.state.verifyCode,msg:"请输入验证码"},
            {value:this.state.password,msg:"请输入密码"},
            {value:this.state.confirmPwd,msg:"请输入确认密码"},
            {value:this.state.password !== this.state.confirmPwd,msg:"密码与确认密码不一致"},
        ];
        //参数非空校验
        checkParam(arr,()=> {
            let params = new FormData(); //创建form对象,通过append向form对象添加数据
            params.append('userAvatar',this.state.userAvatar[0]);
            params.append('userName',this.state.userName);
            params.append('mobile',this.state.mobile);
            params.append('verifyCode',this.state.verifyCode);
            params.append('password',this.state.password);
            params.append('confirmPwd',this.state.confirmPwd);
            getData({
                method: 'post',
                url: 'register',
                data: params,
                successCB: () => {
                    //注册成功之后调登录接口
                    getData({
                        method:'post',
                        url:'login',
                        data:{
                            mobile:this.state.mobile,
                            password:this.state.password
                        },
                        successCB:(res)=> {
                            //登录成功之后将个人信息缓存本地
                            localStorage.setItem("userInfo",JSON.stringify(res.result));
                            localStorage.setItem("token",res.result.token);
                            //进入首页
                            goNext(this,'index')
                        }
                    })
                }
            })
        })
    }
    //获取头像
    getAvatar(event){
        var files = event.target.files;
        this.setState({
            userAvatar:files
        });
        if(window.FileReader) {
            var file = files[0];
            var fr = new FileReader();
            fr.onloadend = (e)=> {
                this.refs.avatar.style.backgroundImage  = "url("+e.target.result+")";
                this.refs.avatar.style.backgroundRepeat = "no";
                this.refs.avatar.style.backgroundSize = "100%";
            };
            //将图片作为url读出
            fr.readAsDataURL(file);
        }
        //添加完头像后将伪元素:before和:after去掉，也就是图片中的+去掉
        this.refs.avatar.setAttribute("class","register-again");
    }
    //更新state
    change(state){
        this.setState(state)
    }
    //渲染页面
    render() {
        return<div>
            <Title that={this}  title="注册"/>
            <div className="cm-mt-04 register-relative">
            <div className="register-input-box" ref="avatar">
                <input type="file" className="register-input" onChange={(e)=>this.getAvatar(e)}/>
            </div>
            </div>
            <div className="cm-mlr-02 cm-mt-04">
               <List>
                   <Input
                       placeholder="请输入昵称"
                       value={this.state.userName}
                       onChange={(val)=>this.change({userName:val})}
                       maxLength={16}
                   />
               </List>
                <List>
                    <Input
                        placeholder="请输入手机号码"
                        value={this.state.mobile}
                        onChange={(val)=>this.change({mobile:val})}
                        maxLength={11}
                    />
                </List>
                <List>
                    <Input
                        placeholder="请输入验证码"
                        value={this.state.verifyCode}
                        onChange={(val)=>this.change({verifyCode:val})}
                        renderRight = {this.renderRight()}
                        maxLength={6}
                    />
                </List>
                <List>
                    <Input
                        type="password"
                        placeholder="请输入密码"
                        value={this.state.password}
                        onChange={(val)=>this.change({password:val})}
                        maxLength={16}
                    />
                </List>
                <List>
                    <Input
                        type="password"
                        placeholder="请输入确认密码"
                        value={this.state.confirmPwd}
                        onChange={(val)=>this.change({confirmPwd:val})}
                        maxLength={16}
                    />
                </List>
                <Button type="fill" className="cm-mt-080" onClick={() => this.register()}>注册</Button>
                <div className="cm-tx-c cm-mt-02 cm-c-main" onClick={()=>goNext(this,"login")}>
                   已有账户？登录
                </div>
            </div>
        </div>
    }
}