import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'



export default class App extends Component{

    state = {
        count:0
    }

    constructor(props) {
        super(props);
        this.number = React.createRef()
    }


    increment = () =>{
        const number = this.number.current.value * 1
        this.setState({count:this.state.count + number})
    }
    decrement = () =>{
        const number = this.number.current.value * 1
        this.setState({count:this.state.count - number})
    }
    incrementIfOdd = () =>{
        const number = this.number.current.value * 1
        if(this.state.count%2===1){
            this.setState({count:this.state.count + number})
        }
    }
    incrementIfAsyn = () =>{
        const number = this.number.current.value * 1
        setTimeout(()=>{
            this.setState({count: this.state.count + number})
        }, 1000)
    }


    render(){

        const {count} = this.state

        return(
            <div>
                <p>Click {count} times</p>
                <div>
                    <select name="" id="" ref={this.number}>
                        <option value='1'>1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                    <button onClick={this.increment}>+</button>
                    <button onClick={this.decrement}>-</button>
                    <button onClick={this.incrementIfOdd}>increment if odd</button>
                    <button onClick={this.incrementIfAsyn}>increment if asyn</button>
                </div>
            </div>
        )
    }
}