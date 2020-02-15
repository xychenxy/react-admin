import React, {Component} from 'react';
import PropTypes from 'prop-types'



export default class App extends Component{

    static propTypes = {
        store : PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.number = React.createRef()
    }


    increment = () =>{
        const number = this.number.current.value * 1
        this.props.store.dispatch({type:'INCREMENT', data:number})
    }
    decrement = () =>{
        const number = this.number.current.value * 1
        this.props.store.dispatch({type:'DECREMENT', data:number})
    }
    incrementIfOdd = () =>{
        const number = this.number.current.value * 1
        if(this.props.store.getState()%2===1){
            this.props.store.dispatch({type:'INCREMENT', data:number})
        }
    }
    incrementIfAsyn = () =>{
        const number = this.number.current.value * 1
        setTimeout(()=>{
            this.props.store.dispatch({type:'INCREMENT', data:number})
        }, 1000)
    }


    render(){

        const count = this.props.store.getState()

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