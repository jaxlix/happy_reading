import React, { Component } from 'react';
import './index.css';
import axios from 'axios';
import Tool from './components/Tool';
import md5 from 'md5';

export default class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            loginOrEnroll: 1,   // 1：登录  2： 注册
            formData: {sex:1}
        }
        let d = localStorage.getItem("lix_logining");
        let t = new Date().getTime();
        if(d && t>d.split("@#")[1] && t-d.split("@#")[1]<2678400000){
            this.props.history.replace(`/app/${d.split("@#")[0]}/bookList/${d.split("@#")[0]}`);
        }
    }

    // 登录
    login(){
        let data = {
            userPhone: this.userPhone.value,
            password: md5(this.password.value)
        }
        if(!(/^1[34578]\d{9}$/.test(data.userPhone))){
            Tool.msg("请输入正确的手机号");
            return
        }
        if(!data.password){
            Tool.msg("请输入密码");
            return
        }
        axios({
            method: "POST",
            url: Tool.IP+"/webphone/bookPhone/login",
            data: data
        }).then((res) => {
            res = res.data;
            if(res.code === 1){
                Tool.msg("登录成功！");
                localStorage.setItem("lix_logining", res.content+"@#"+new Date().getTime());
                this.props.history.replace(`/app/${res.content}/bookList/${res.content}`);
            }else if(res.code === 2){
                Tool.msg(res.content);
                if(res.content === "该手机号暂未注册"){
                    this.setState({
                        loginOrEnroll: 2
                    })
                }
            }else if(res.code === 3){
                Tool.msg(res.content);
                Tool.loginOut();
            }else if(res.code === 4){
                Tool.msg(res.content);
            }
        }).catch(() => {
            Tool.msg('链接服务器失败，请检查网络');
        })
    }

    // 注册
    enroll(){
        let data = this.state.formData;
        if(!data.userName){
            Tool.msg("请输入用户名");
            return
        }
        if(!(/^1[34578]\d{9}$/.test(data.userPhone))){
            Tool.msg("请输入正确的手机号");
            return
        }
        if(!data.userEmail){
            Tool.msg("请输入邮箱");
            return
        }
        if(!data.password){
            Tool.msg("请输入密码");
            return
        }
        axios({
            method: "POST",
            url: Tool.IP+"/webphone/bookPhone/enroll",
            data: data
        }).then((res) => {
            res = res.data;
            if(res.code === 1){
                Tool.msg("注册成功！");
                this.setState({
                    loginOrEnroll: 1
                })
            }else if(res.code === 2){
                Tool.msg(res.content);
            }else if(res.code === 3){
                Tool.msg(res.content);
                Tool.loginOut();
            }else if(res.code === 4){
                Tool.msg(res.content);
            }
        }).catch(() => {
            Tool.msg('链接服务器失败，请检查网络');
        })
    }

    change(event){
        let obj = this.state.formData;
        if(event.target.name === "password"){
            obj.password = md5(event.target.value)
        }else{
            obj[event.target.name] = event.target.value
        }
        this.setState({
            formData: obj
        })
    }

    render(){
        return(
            <div className="container login-content">
                {this.state.loginOrEnroll === 1 ? 
                // 登录
                <div className="login-box">
                    <div className="login-item">
                        <input className="login-input" type="text" placeholder="请输入手机号码" ref={userPhone => this.userPhone = userPhone} />
                    </div>
                    <div className="login-item">
                        <input className="login-input" type="password" placeholder="请输入密码" ref={password => this.password = password} />
                    </div>
                    <div className="login-item">
                        <button className="btn-block btn-blue" onClick={()=>this.login()}>登录</button>
                        <button onClick={()=>{this.setState({loginOrEnroll: 2})}} style={{float: "right",padding:"10px 20px",backgroundColor:"transparent",color:"#fff"}}>注册</button>
                    </div>
                </div>:
                // 注册
                <div className="enroll-box">
                    <div className="login-item" flex="box:first">
                        <label className="enroll-label">用户名:</label>
                        <input className="login-input" name="userName" type="text" placeholder="请输入用户名" onChange={(e)=>{this.change(e)}} />
                    </div>
                    <div className="login-item" flex="box:first">
                        <label className="enroll-label">手机号:</label>
                        <input className="login-input" name="userPhone" type="text" placeholder="请输入手机号" onChange={(e)=>{this.change(e)}} />
                    </div>
                    <div className="login-item" flex="box:first">
                        <label className="enroll-label">邮箱:</label>
                        <input className="login-input" name="userEmail" type="text" placeholder="请输入邮箱" onChange={(e)=>{this.change(e)}} />
                    </div>
                    <div className="login-item" flex="box:first">
                        <label className="enroll-label">性别:</label>
                        <select className="login-input" name="sex" onChange={(e)=>{this.change(e)}}>
                            <option value="1">男</option>
                            <option value="2">女</option>
                        </select>
                    </div>
                    <div className="login-item" flex="box:first">
                        <label className="enroll-label">密码:</label>
                        <input className="login-input" name="password" type="password" placeholder="请输入密码" onChange={(e)=>{this.change(e)}} />
                    </div>
                    <div className="login-item">
                        <button className="btn-block btn-blue" onClick={()=>this.enroll()}>注册</button>
                    </div>
                </div>
                }
            </div>
        )
    }
}