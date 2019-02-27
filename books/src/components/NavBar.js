import React, { Component } from 'react'
import Tool from './Tool';

export default class NavBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            alpha: 0
        }
    }

    // 主题为默认透明色时，向上滚动调整背景透明度
    handleScroll() {
        let t = document.documentElement.scrollTop||document.body.scrollTop;
        if(t<=48){
            this.setState({
                alpha: t/48
            })
        }else{
            if(this.state.alpha !== 1){
                this.setState({
                    alpha: 1
                })
            }
        }
    }

    back(){
        if(this.props.leftButtonclick){
            this.props.leftButtonclick()
        }else{
            Tool.returnPage()
        }
    }

    render(){
        return(
            <header className="head" style={this.props.style} flex="box:justify">
                {this.props.leftButton || <span style={styles.back} className="iconfont icon-fanhuiicon" onClick={()=>this.back()}></span>}
                {this.props.title}
                {this.props.rightButton || <span></span>}
            </header>
        )
    }
}

const styles = {
    back:{
        width: "40px",
        lineHeight: "48px",
        textAlign: "center"
    }
}