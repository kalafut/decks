import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import decksApp from './reducers'
import App from './components/App'
import { requestDecks } from './reducers'

let store = createStore(decksApp)

requestDecks(store)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
