import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { startProcess } from './action';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  clickHandler = () => {
    console.log('startProcess');
    this.props.startProcess();
  }
  render() {
    // console.log(this.props);
    return (
      <div className="App">
        <p><b>Pid: </b>{this.props.pid}</p>
        <p><b>Endpoint: </b>{this.props.endpoint}</p>
        <p><b>Token: </b>{this.props.token}</p>
        <h3>trackStage: </h3>
          {
            this.props.trackStage.map((stage, i) => (<p key={i}>{stage}</p>))
          }
        <button name="root" onClick={this.clickHandler}>click me</button>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state,
  };
}

export default connect(mapStateToProps, { startProcess })(App);
