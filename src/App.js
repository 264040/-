import React from 'react'
import './App.css';
import { withRouter } from 'react-router-dom'

import Routers from './router/Routers'

import { Provider } from 'react-redux'
import { store, persistor } from './redux/redux';
import { PersistGate } from 'redux-persist/integration/react'

function App(props) {
  return (
    <Provider store={store}>
      <PersistGate loading = {null} persistor = {persistor}>
        <Routers />
      </PersistGate>
    </Provider>
  );
}
export default withRouter(App);
