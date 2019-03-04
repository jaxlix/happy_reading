import React, { Component } from 'react'
import Tool from './Tool';

export default class Link extends Component{
    jump(url,type){
        if(type === "native"){
            Tool.isIos() ? window.webkit.messageHandlers.pushToNewController.postMessage(url) : window.app.pushToNewController(url);
        }else{
            window.location.href = url;
        }
    }
    render(){
        return(
            <div onClick={this.jump(this.props.url,this.props.type)}>

            </div>
        )
    }
}