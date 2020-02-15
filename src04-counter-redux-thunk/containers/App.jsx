import React from 'react';
import {connect} from 'react-redux'
import Counter from "../components/Counter";
import {increment, decrement, incrementAsync} from "../redux/actions";



const mapStateToProps = (state) => ({count:state})
const mapDispatchToProps = {increment, decrement, incrementAsync}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter)