import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Login from './pages/login/Login'
import Todos from './pages/todos/Todos'
import './App.css';

function App() {
  return (
    <div className="appContainer">
      <Switch>
        <Route exact path='/' component={Login} />
        <Route path='/todos' component={Todos} />
      </Switch>
    </div>
  );
}

export default App;
