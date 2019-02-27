import React, { Component } from 'react'
import NavBar from '../components/NavBar';
import axios from 'axios';
import Tool from '../components/Tool';
import man from '../res/images/man.jpg';
import woman from '../res/images/woman.jpg';
import erweima from '../res/images/erweima.png';

export default class Mine extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource: {},
            userInfoId: this.props.match.params.userID,
            showErweima: false
        }
    }

    componentDidMount(){
        this.getUsermsg()
    }

    // 获取用户信息
    getUsermsg(){
        axios({
            method: "POST",
            url: Tool.IP+"/webphone/bookPhone/findUserById",
            data: {
                userInfoId: this.state.userInfoId
            }
        }).then((res) => {
            res = res.data;
            if(res.code === 1){
                let data = res.content;
                this.setState({
                    dataSource: data
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

    // 分享
    fenxiang(){
        this.setState({
            showErweima: true
        })
    }

    // 关闭弹框
    close(){
        this.setState({
            showErweima: false
        })
    }

    // 注销
    zhuxiao(){
        localStorage.removeItem("lix_logining");
        this.props.history.push('/')
    }

    render(){
        return(
            <div>
                <NavBar
                    style={{backgroundColor:"transparent",color:"#fff"}}
                    leftButtonclick={() => this.props.history.goBack()}
                    rightButton={<span className="iconfont icon-erweima" onClick={()=>this.fenxiang()} style={{width:"40px",textAlign:"center"}}></span>}
                    title={<span style={{textAlign: "center"}}>我的</span>}
                />
                <div className="m-msg">
                    <div className="m-imgbox">
                        <img src={this.state.dataSource.sex === "1" ? man : woman} alt="" />
                    </div>
                    <p className="m-name">{this.state.dataSource.userName}</p>
                </div>
                <div>
                    {/* <div className="m-item">
                        <span className="iconfont icon-theme"></span>
                        <span>主题颜色</span>
                        <span className="iconfont icon-xialaicon-copy-copy"></span>
                    </div>
                    <div className="m-item">
                        <span className="iconfont icon-zitiyangshi"></span>
                        <span>字体大小</span>
                        <span className="iconfont icon-xialaicon-copy-copy"></span>
                    </div> */}
                    <div className="m-item" onClick={()=>this.zhuxiao()}>
                        <span className="iconfont icon-zhuxiaologout9"></span>
                        <span>注销</span>
                        <span className="iconfont icon-xialaicon-copy-copy"></span>
                    </div>
                </div>
                {/* 二维码 */}
                {this.state.showErweima?
                <div className="layer-model" style={{backgroundColor:"rgba(0,0,0,.5)"}} onClick={()=>this.close()} flex="main:center cross:center">
                    <img style={{width:"60%"}} src={erweima} alt="" />
                </div>:
                ""}
            </div>
        )
    }
}