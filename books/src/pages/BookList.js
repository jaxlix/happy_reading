import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';
import Tool from '../components/Tool';
import axios from 'axios';

export default class BookList extends Component{
    constructor(props){
        super(props);
        this.state = {
            userInfoId: this.props.match.params.userID,
            classes: '0',     // 分类
            keyWord: "",    // 搜索关键词
            dataSource: [], // 数据源
            dataNumber: 0,  // 数据条数
            hasMore: true,
            isLoading: true
        }
        this.bookListState = global.bookListState;
    }

    componentDidMount(){
        if(this.bookListState){
            this.setState({
                classes: this.bookListState.classes,     // 分类
                keyWord: this.bookListState.keyWord,    // 搜索关键词
                dataSource: this.bookListState.dataSource, // 数据源
                dataNumber: this.bookListState.dataNumber,  // 数据条数
                hasMore: this.bookListState.hasMore,
                isLoading: this.bookListState.isLoading
            },()=>{window.scrollTo(0,this.bookListState.scrollTop)})
        }else{
            this.getList()
        }
    }

    // 获取列表
    getList(){
        axios({
            method: "POST",
            url: Tool.IP+"/webphone/bookPhone/findBooksOfPage",
            data: {
                classes: this.state.classes,
                keyWord: this.state.keyWord,
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
                },()=>this.saveState())
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
            url: Tool.IP+"/webphone/bookPhone/findBooksOfPage",
            data: {
                classes: this.state.classes,
                keyWord: this.state.keyWord,
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
                },()=>this.saveState())
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

    // 绑定搜索
    search(){
        this.setState({
            keyWord: this.input.value,
            dataSource: [],
            dataNumber: 0,
            hasMore: true,
            isLoading: true
        },()=>{
            this.getList()
        })
    }

    // 分类筛选
    classes(e){
        this.setState({
            classes: e.target.getAttribute('data-type'),
            dataSource: [],
            dataNumber: 0,
            hasMore: true,
            isLoading: true
        },()=>{
            this.getList()
        })
    }

    // 跳转之前将state保存在全局对象
    saveState(){
        let t = document.documentElement.scrollTop;
        let data = this.state;
        data.scrollTop = t;
        global.bookListState = data
    }

    render(){
        return (
            <div>
                <NavBar
                    style={{backgroundColor:"#028ce5",color:"#fff"}}
                    leftButtonclick={() => this.props.history.goBack()}
                    title={<input ref={input => this.input = input} className="search-input" type="text" placeholder="搜索书名、作者名" />}
                    rightButton={<span className="search-btn" onClick={()=>this.search()}>搜索</span>}
                />
                {/* 分类 */}
                <nav id="nav-scroll" className="nav-scroll">
                    <div className="nav-scroll-box">
                        <span className={this.state.classes === '0' ? "nav-this" : ""} data-type="0" onClick={(e)=>this.classes(e)}>全部</span>
                        <span className={this.state.classes === '1' ? "nav-this" : ""} data-type="1" onClick={(e)=>this.classes(e)}>小说</span>
                        <span className={this.state.classes === '2' ? "nav-this" : ""} data-type="2" onClick={(e)=>this.classes(e)}>名著</span>
                        <span className={this.state.classes === '3' ? "nav-this" : ""} data-type="3" onClick={(e)=>this.classes(e)}>随笔</span>
                        <span className={this.state.classes === '4' ? "nav-this" : ""} data-type="4" onClick={(e)=>this.classes(e)}>散文</span>
                        <span className={this.state.classes === '5' ? "nav-this" : ""} data-type="5" onClick={(e)=>this.classes(e)}>历史</span>
                        <span className={this.state.classes === '6' ? "nav-this" : ""} data-type="6" onClick={(e)=>this.classes(e)}>哲学</span>
                        <span className={this.state.classes === '7' ? "nav-this" : ""} data-type="7" onClick={(e)=>this.classes(e)}>传记</span>
                        <span className={this.state.classes === '8' ? "nav-this" : ""} data-type="8" onClick={(e)=>this.classes(e)}>经济</span>
                        <span className={this.state.classes === '9' ? "nav-this" : ""} data-type="9" onClick={(e)=>this.classes(e)}>科技</span>
                    </div>
                </nav>
                {/* 列表 */}
                <div style={{paddingTop:"88px"}}>
                    {this.state.dataSource.map((item,index)=>{
                        return (
                            <div key={index} className="book-item">
                                <Link onClick={()=>this.saveState()} to={`/bookDetail/${item._id}/${this.state.userInfoId}`}>
                                    <img className="book-img" src={`${Tool.IP}/webphone/bookPhone/downloadImg?fileName=${item.bookImg}`} alt="" />
                                    <div className="book-rightbox">
                                        <p className="book-name">{item.bookName || ""}</p>
                                        <p className="book-author">{item.author || ""}</p>
                                        <p className="book-abstract">{item.abstract || ""}</p>
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