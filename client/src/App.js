import React, {Component} from 'react';
import './App.css';
import ListsContainer from "./components/ListsContainer";


class App extends Component {
  render(){
    return(
      <div className="App">
          <h1 className="App-title">Simple ReactJS with RoR backend</h1>
        <ListsContainer />
      </div>
    )
  }
}

export default App;
