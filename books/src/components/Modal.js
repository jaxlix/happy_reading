import React, { Component } from 'react'

export default class Modal extends Component{
    constructor(props){
        super(props);
        this.state = {
            showType: this.props.showType,
            visible: this.props.visible
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        });
    }

    makeStyle(){
        // let type = this.props.showType || "up";

        let s = {
            position:"fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            display: "none",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,.5)",
            overflow: "hidden"
        }
        let ps = this.props.style;
        for(let k in ps){
            s[k] = ps[k]
        }
        this.state.visible?s.display="block":s.display="none";
        return s
    }

    render(){
        return(
            <div style={this.makeStyle()} onClick={()=>this.props.modalClose()}>
                <div style={{height:"100%",overflowY:"auto"}}>{this.props.content}</div>
            </div>
        )
    }
}
