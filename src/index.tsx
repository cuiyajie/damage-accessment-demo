import * as React from 'react';
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { routerReducer, syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { createHashHistory } from 'history'

import { App } from './views/App/App'
import reducer from './store/reducer'
import './style/index.css';

const middleware = []
if (process.env.NODE_ENV === 'development') {
  const { logger } = require(`redux-logger`);
  middleware.push(logger)
}

const hashHistory = createHashHistory()
middleware.push(routerMiddleware(hashHistory))

const store = compose(applyMiddleware(...middleware))(createStore)(
  combineReducers({
    global: reducer,
    routing: routerReducer
  })
)

const history = syncHistoryWithStore(hashHistory, store)

const renderApp = () => render(
  <Provider store={ store }>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)

renderApp()