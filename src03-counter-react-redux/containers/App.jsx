import React from 'react';
import {connect} from 'react-redux'
import Counter from "../components/Counter";
import {increment, decrement} from "../redux/actions";


const mapStateToProps = (state) => ({count:state})
const mapDispatchToProps = {increment, decrement}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter)