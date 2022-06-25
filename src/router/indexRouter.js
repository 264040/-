
// import React from 'react'

import Login from '../views/login'
import Front from '../views/Front'

const HeadRouteS = [
  {
    path: '/',
    exact: true,
    component: Front
  },
  {
    path: '/front',
    component: Front
  },
  {
    path: '/login',
    component: Login
  }
]
export { HeadRouteS }
