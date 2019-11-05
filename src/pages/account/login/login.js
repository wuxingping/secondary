/**
 * Created by Lenovo on 2019/8/10.
 */
import React from 'react';
import account from '../../../images/account/account.png';
import password from '../../../images/account/password.png';
import defaultAvatar from '../../../images/account/avatar.jpg';
import {Title, List, Input,Button} from '../../../share';
import {getData, goNext, checkParam} from '../../../utils';
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',//初始化账号
            password: '',//初始化密码
        }
    }
    //渲染页面
    render() {
        return <div>
            <Title that={this} title="登录" onLeftClick={()=>goNext(this,"index")}/>
            <div className="cm-mlr-02">
                <div className="cm-tx-c cm-mtb-04"><img src={defaultAvatar} alt="" className="cm-img-16 cm-border-radius-half"/></div>
                <List>
                    <Input
                        src={account}
                        placeholder="请输入昵称或手机号"
                        value={this.state.mobile}
                        onChange={(val) => this.change({mobile: val})}
                    />
                </List>
                <List>
                    <Input
                        type="password"
                        src={password}
                        placeholder="请输入密码"
                        value={this.state.password}
                        onChange={(val) => this.change({password: val})}
                    />
                </List>
                <Button type="fill"  className="cm-mt-080" onClick={() => this.login()}>登录</Button>
                <div className="cm-flex cm-jc-c cm-mlr-auto cm-mt-04 cm-c-main">
                    <span onClick={() => this.goRegister()}>快速注册</span>
                    <span className="cm-mlr-02">|</span>
                    <span onClick={()=>goNext(this,"forgotPwd")}>忘记密码?</span>
                </div>
            </div>
        </div>
    }
    //进入注册页面
    goRegister() {
        goNext(this, 'register');
    }
    //登录
    login() {
        var arr = [
            {value: this.state.mobile, msg: "请输入手机号"},
            {value: this.state.password, msg: "请输入密码"},
        ];
        //参数非空校验
        checkParam(arr, () => {
            getData({
                method: 'post',
                url: 'login',
                data: {
                    mobile: this.state.mobile,
                    password: this.state.password,
                },
                successCB: (res) => {
                    var token = res.result.token;
                    //登录成功之后将个人信息缓存到本地，并进入首页
                    localStorage.setItem("userInfo", JSON.stringify(res.result));
                    localStorage.setItem("token", token);
                    goNext(this, 'index')
                }
            })
        })
    }
    //更新state
    change(state) {
        this.setState(state)
    }
}