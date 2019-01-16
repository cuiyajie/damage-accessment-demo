import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from '../Home/Home';
import PartSelect from '../PartSelect/PartSelect';
import PartUpload from '../PartUpload/PartUpload';
import Result from '../Result/Result';

import './App.css';

export class App extends React.Component<any, any> {

  render() {
    return <div className="content">
      <Switch>
        <Route path="/home" component={ Home }></Route>
        <Route path="/select" component={ PartSelect }></Route>
        <Route path="/upload" component={ PartUpload }></Route>
        <Route path="/result" component={ Result }></Route>
        <Redirect to="/home"></Redirect>
      </Switch>
    </div>
  }
}