import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import Tool from '../components/Tool';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default class BookDetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            bookInfoId: this.props.match.params.bookID,
            userInfoId: this.props.match.params.userID,
            bookMsg: {},
            location: 0
        }
    }

    componentDidMount(){
        this.getMsg()
        this.findBookshelfById()
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

    // 获取书架书籍信息
    findBookshelfById(){
        axios({
            method: "POST",
            url: Tool.IP+"/webphone/bookPhone/findBookshelfById",
            data: {
                bookInfoId: this.state.bookInfoId,
                userInfoId: this.state.userInfoId
            }
        }).then((res) => {
            res = res.data;
            if(res.code === 1){
                let data = res.content;
                if(data.length>0){
                    this.setState({
                        location: parseInt(data[0].location)||0
                    })
                }
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

    // 加入书架
    addToBookshelf(){
        axios({
            method: "POST",
            url: Tool.IP+"/webphone/bookPhone/addToBookshelf",
            data: {
                userInfoId: this.state.userInfoId,
                bookInfoId: this.state.bookInfoId,
                bookName: this.state.bookMsg.bookName,
                author: this.state.bookMsg.author,
                bookImg: this.state.bookMsg.bookImg,
                bookSize: this.state.bookMsg.bookSize
            }
        }).then((res) => {
            res = res.data;
            if(res.code === 1){
                Tool.msg(res.content);
                
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
            <div>
                <NavBar
                    style={{backgroundColor:"#028ce5",color:"#fff"}}
                    leftButtonclick={() => this.props.history.goBack()}
                    title={<span style={{textAlign:"center"}}>书籍详情</span>}
                />
                <div className="bd-msgbox" flex="box:first" style={{paddingTop:"68px"}}>
                    <div className="bd-imgbox">
                        {this.state.bookMsg.bookImg ? 
                        <img className="bd-img" src={`${Tool.IP}/webphone/bookPhone/downloadImg?fileName=${this.state.bookMsg.bookImg}`} alt="" />:
                        ""
                        }
                    </div>
                    <div>
                        <p className="bd-name">{this.state.bookMsg.bookName}</p>
                        <p className="bd-author"><span>作者：</span><span>{this.state.bookMsg.author}</span></p>
                        <p className="bd-classes"><span>分类：</span><span>{Tool.classes(this.state.bookMsg.classes)}</span></p>
                    </div>
                </div>
                <div className="bd-abstract">
                    {this.state.bookMsg.abstract}
                </div>
                <div className="bd-btnbox">
                    <button className="btn btn-blue">
                        <Link to={`/readBook/${this.state.bookInfoId}/${this.state.userInfoId}/${this.state.location}`}>开始阅读</Link>
                    </button>
                    <button className="btn btn-blue" onClick={()=>this.addToBookshelf()}>加入书架</button>
                </div>
            </div>
        )
    }
}