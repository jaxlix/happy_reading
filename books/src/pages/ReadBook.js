import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import Tool from '../components/Tool';
import axios from 'axios';

export default class ReadBook extends Component{
    constructor(props){
        super(props);
        this.state = {
            bookInfoId: this.props.match.params.bookID,
            userInfoId: this.props.match.params.userID,
            location: parseInt(this.props.match.params.location),
            dataSource: "",
            bookMsg: {}
        }
    }

    componentDidMount(){
        window.scrollTo(0,0)
        this.getMsg()
        this.getBook()
    }

    // 获取书籍信息
    getMsg(){
        axios({
            method: "POST",
            url: Tool.IP+"/webphone/bookPhone/findBookById",
            data: {
                bookInfoId: this.state.bookInfoId
            }
        }).then((res) => {
            res = res.data;
            if(res.code === 1){
                let data = res.content;
                this.setState({
                    bookMsg: data
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

    // 获取书籍
    getBook(){
        axios({
            method: "POST",
            url: Tool.IP+"/webphone/bookPhone/findBookOfPage",
            data: {
                userInfoId: this.state.userInfoId,
                bookInfoId: this.state.bookInfoId,
                location: this.state.location
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

    // 下一页
    next(){
        axios({
            method: "POST",
            url: Tool.IP+"/webphone/bookPhone/findBookOfPage",
            data: {
                userInfoId: this.state.userInfoId,
                bookInfoId: this.state.bookInfoId,
                location: parseInt(this.state.location)+2048
            }
        }).then((res) => {
            res = res.data;
            if(res.code === 1){
                let data = res.content;
                data = data.replace(/。/g, "。\n\n    ");
                window.scrollTo(0,0);
                this.setState({
                    dataSource: data,
                    location: parseInt(this.state.location)+2048
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

    // 上一页
    prev(){
        if(this.state.location<2048){
            Tool.msg("已经是第一页");
            return false
        }
        axios({
            method: "POST",
            url: Tool.IP+"/webphone/bookPhone/findBookOfPage",
            data: {
                userInfoId: this.state.userInfoId,
                bookInfoId: this.state.bookInfoId,
                location: parseInt(this.state.location)-2048
            }
        }).then((res) => {
            res = res.data;
            if(res.code === 1){
                let data = res.content;
                data = data.replace(/。/g, "。\n\n    ");
                window.scrollTo(0,0);
                this.setState({
                    dataSource: data,
                    location: parseInt(this.state.location)-2048
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

    render(){
        return (
            <div style={{backgroundColor:"#D5EFD2"}}>
                <NavBar
                    style={{backgroundColor:"#D5EFD2",color:"#7EA088"}}
                    leftButtonclick={() => this.props.history.goBack()}
                    title={<span style={{textAlign:"center"}}>{this.state.bookMsg.bookName}</span>}
                    rightButton={<span style={{width:"40px"}}></span>}
                />
                <pre className="rb-pre" style={{paddingTop:"48px"}}>
                    {this.state.dataSource}
                </pre>
                <div style={{textAlign: "center"}}>
                    <button className="btn btn-blue" style={{backgroundColor:"#0A6227"}} onClick={()=>this.prev()}>上一页</button>
                    <button className="btn btn-blue" style={{backgroundColor:"#0A6227"}} onClick={()=>this.next()}>下一页</button>
                </div>
            </div>
        )
    }
}