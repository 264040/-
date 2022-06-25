import React, { useState } from 'react'
// import { HeadRouteS } from '../router/indexRouter.js'
// import { renderRoutes } from 'react-router-config';
import { Redirect, Switch, Route } from 'react-router-dom'
import Front from '../views/Front';
import Login from '../views/login';
import Detail from '../views/news/Detail';
import News from '../views/news/News';


export default function Routers(props) {

  const [state] = useState(
    { storage: localStorage.getItem("token") }
  )

  return (
    <> 
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/news' component={News} />
        <Route path='/detail/:id' component={Detail} />
        <Route
          path='/'
          render={() =>
            state.storage ? (
              <Front />) : (
              <Redirect to='/login' />)
          }
        /> 
      </Switch>
    </>
  )
}
