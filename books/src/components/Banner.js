import React, { Component } from 'react'

export default class Banner extends Component{
    constructor(props){
        super(props);
        this.state = {
            imgNum: this.props.imgNum,
            imgWidth: this.props.imgWidth,
            imgIndex: 0 // 正在显示的图片下标
        }
    }
    componentDidMount(){
        if(this.state.imgNum>1){
            this.move()
        }
    }

    move(){
        setInterval(()=>{
            this.setState({
                imgIndex: this.state.imgIndex+1===this.state.imgNum?0:this.state.imgIndex+1
            })
        },2000)
    }

    moveStyle(){
        return{
            position:"relative",
            width:this.state.imgNum*100+"%",
            right: this.state.imgIndex*this.state.imgWidth+"px",
            transition: "right 600ms"
        }
    }
    render(){
        return(
            <div style={{width:"100%",overflow:"hidden"}}>
                <div className="clear" style={this.moveStyle()}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}