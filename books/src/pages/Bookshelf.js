import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import Tool from '../components/Tool';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default class Bookshelf extends Component{
    constructor(props){
        super(props);
        this.state = {
            userInfoId: this.props.match.params.userID,
            dataSource: [], // 数据源
            dataNumber: 0,  // 数据条数
            hasMore: true,
            isLoading: true,
            layerShow: false,
            isDelete: false
        }
    }

    componentDidMount(){
        this.getList()
    }

    // 获取列表
    getList(){
        axios({
            method: "POST",
            url: Tool.IP+"/webphone/bookPhone/findBookshelfOfPage",
            data: {
                userInfoId: this.state.userInfoId,
                dataNumber: 0
            }
        }).then((res) => {
            res = res.data;
            if(res.code === 1){
                let data = res.content;
                this.setState({
                    dataSource: data,
                    dataNumber: data.length,
                    isLoading: false,
                    hasMore: data.length<10?false:true
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

    // 加载更多
    onEndReached(){
        if(this.state.isLoading || !this.state.hasMore){
            return false
        }else{
            this.setState({
                isLoading: true
            })
        }
        axios({
            method: "POST",
            url: Tool.IP+"/webphone/bookPhone/findBookshelfOfPage",
            data: {
                userInfoId: this.state.userInfoId,
                dataNumber: this.state.dataNumber
            }
        }).then((res) => {
            res = res.data;
            if(res.code === 1){
                let data = res.content;
                this.setState({
                    dataSource: this.state.dataSource.concat(data),
                    dataNumber: parseInt(this.state.dataNumber)+data.length,
                    isLoading: false,
                    hasMore: data.length<10?false:true
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

    // 底部提示语
    footer(){
        if(this.state.hasMore){
            return(
                <div style={{ padding: 10, textAlign: 'center' }}>
                    <button className="loadmore-btn" onClick={()=>this.onEndReached()}>
                        {this.state.isLoading ? '加载中...' : '加载更多'}
                    </button>
                </div>
            )
        }else{
            return(
                <div style={{ padding: 10, textAlign: 'center' }}>
                    别拉了，我也是有底线的
                </div>
            )
        }
    }

    // 从书架删除
    delete(e,bookInfoId){
        if(window.confirm("确认删除？")){
            axios({
                method: "POST",
                url: Tool.IP+"/webphone/bookPhone/delBookshelf",
                data: {
                    userInfoId: this.state.userInfoId,
                    bookInfoId: bookInfoId
                }
            }).then((res) => {
                res = res.data;
                if(res.code === 1){
                    let data = this.state.dataSource;
                    for(let i = 0; i < data.length; i++){
                        if(data[i].bookInfoId === bookInfoId){
                            data.splice(i,1);
                            this.setState({
                                dataSource: data,
                                dataNumber: data.length
                            });
                            break
                        }
                    }
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
        e.preventDefault();
    }

    // 操作删除
    caozuo(){
        this.setState({
            isDelete: !this.state.isDelete
        })
    }

    render(){
        return (
            <div>
                <NavBar
                    style={{backgroundColor:"#028ce5",color:"#fff"}}
                    leftButtonclick={() => this.props.history.goBack()}
                    title={<span style={{textAlign: "center"}}>我的书架</span>}
                    rightButton={<span className={this.state.isDelete?"iconfont icon-shanchu":"iconfont icon-shanchu1"} onClick={()=>this.caozuo()} style={{width:"40px"}}></span>}
                />
                {/* 列表 */}
                <div style={{paddingTop:"48px"}}>
                    {this.state.dataSource.map((item,index)=>{
                        return (
                            <div key={index} className="book-item">
                                <Link to={`/readBook/${item.bookInfoId}/${this.state.userInfoId}/${item.location}`}>
                                    <img className="book-img" src={`${Tool.IP}/webphone/bookPhone/downloadImg?fileName=${item.bookImg}`} alt="" />
                                    <div className="book-rightbox" flex="dir:top main:center">
                                        <p className="book-name" style={{fontSize:"1.8rem"}} flex="box:last">
                                            <span style={{overflow: "hidden",textOverflow:"ellipsis",whiteSpace: "nowrap"}}>{item.bookName || ""}</span>
                                            <span style={{fontSize:"1.4rem",color:"#999"}}>{(item.location/item.bookSize)*100>1?'已读'+Math.round(item.location/item.bookSize*100)+'%':'少于1%'}</span>
                                        </p>
                                        <p className="book-author">{item.author || ""}</p>
                                        <p style={{height:"30px",textAlign:"right",color:"#028ce5"}}>
                                            {this.state.isDelete?<span className="iconfont icon-shanchu" onClick={(e)=>this.delete(e,item.bookInfoId)} style={{display:"block"}}></span>:""}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        )
                    })}
                    {this.footer()}
                </div>
            </div>
        )
    }
}