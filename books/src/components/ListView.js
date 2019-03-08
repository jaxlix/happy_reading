import React, { Component } from 'react'

export default class ListView extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource: this.props.dataSource
        }
    }
    row(){
            return (
                <div>
                123
                </div>
            )
       
    }
    render(){
        return(
            <div>
                <div>下拉加载更多</div>
                <div>{this.row()}</div>
                {this.props.renderFooter}
            </div>
        )
    }
}