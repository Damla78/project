import React, { Component } from 'react';
import HousesList from './components/HousesList';
import HouseDetails from './components/HouseDetails';
import AddHouses from './components/AddHouses';


import { Link, Route, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/houses">Houses</Link></li>
          <li><Link to="/contribute">Contribute</Link> </li>
        </ul>
        <Switch>
          <Route exact path="/" render={() => <div>home</div>}></Route>
          <Route exact path="/houses" component={HousesList}></Route>
          <Route exact path="/houses/:id" component={HouseDetails}></Route>
          <Route exact path="/contribute" component={AddHouses}></Route>
          <Route render={() => <div>404</div>} />
        </Switch>
      </div >
    );
  }
}

export default App;
