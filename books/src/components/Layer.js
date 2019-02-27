import React, { Component } from 'react'


export default class Layer extends Component{
    constructor(props){
        super(props);
        this.state = {
            show: false
        }
    }

    //
    hideLayer(){

    }
    
    render(){
        const style = {
            position:"fixed",
            left: 0,
            top: 0,
            display: this.props.show?"flex":"none",
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            backgroundColor: this.props.backgroundColor||"rgba(0,0,0,.1)",
            zIndex: 999
        }
        return(
            <div onClick={()=>this.hideLayer()} style={style} flex="main:center cross:center">
                <div style={this.props.style}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}