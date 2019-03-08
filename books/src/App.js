import React, { Component } from 'react';
import './index.css';
import { Route, NavLink } from 'react-router-dom';
import BookList from './pages/BookList';
import Bookshelf from './pages/Bookshelf';
import Mine from './pages/Mine';

export default class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            userInfoId: this.props.match.params.userID
        }
    }

    render(){
        return(
            <div className="container app">
                <div className="content-hasfoot">
                    <Route path="/app/:userID/bookList/:userID" exact component={BookList} />
                    <Route path="/app/:userID/bookshelf/:userID" exact component={Bookshelf} />
                    <Route path="/app/:userID/mine/:userID" exact component={Mine} />
                </div>
                {/* 底部导航 */}
                <div className="foot" flex="box:mean">
                    <NavLink to={`/app/${this.state.userInfoId}/bookList/${this.state.userInfoId}`} activeClassName={"foot-this"}>
                        <div className="foot-div" flex="dir:top main:center cross:center">
                            <span className="foot-icon iconfont icon-shouyeweidianjizhuangtai"></span>
                            <span className="foot-text">首页</span>
                        </div>
                    </NavLink>

                    <NavLink to={`/app/${this.state.userInfoId}/bookshelf/${this.state.userInfoId}`} activeClassName={"foot-this"}>
                        <div className="foot-div" flex="dir:top main:center cross:center">
                            <span className="foot-icon iconfont icon-fenleiweidianjizhuangtai"></span>
                            <span className="foot-text">书架</span>
                        </div>
                    </NavLink>

                    <NavLink to={`/app/${this.state.userInfoId}/mine/${this.state.userInfoId}`} activeClassName={"foot-this"}>
                        <div className="foot-div" flex="dir:top main:center cross:center">
                            <span className="foot-icon iconfont icon-wodeweidianjizhuangtai"></span>
                            <span className="foot-text">我的</span>
                        </div>
                    </NavLink>
                </div>
            </div>
        )
    }
}