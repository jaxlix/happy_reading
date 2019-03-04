import React, { Component } from 'react'

export default class List extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: this.props.data || []
        }
    }
    // componentWillReceiveProps(nextProps) {
    //     this.setState({
    //       A: nextProps.A
    //     });
    // }
    render(){
        return(
            <ul>
                {this.state.data.map((d,i)=>{
                    return <Item item={i} />
                })}
            </ul>
        )
    }
}

class Item extends Component{
    render(){
        return(
            <li>
                {this.props.item}
            </li>
        )
    }
}