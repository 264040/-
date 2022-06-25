import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import Home from '../../views/home'
import UserList from '../../views/userlist'
import RoleList from '../../views/rolelist'
import RightList from '../../views/rightlist'
import Nopermission from '../../views/nopermission'
import NewsAdd from '../../views/news-manage/NewsAdd'
import NewsDraft from '../../views/news-manage/NewsDraft'
import NewsCategory from '../../views/news-manage/NewsCategory'
import NewsPreview from '../../views/news-manage/NewsPreview'
import NewsUpdate from '../../views/news-manage/NewsUpdate'
import Audit from '../../views/audit-manage/Audit'
import AuditList from '../../views/audit-manage/AuditList'
import Unpublished from '../../views/publish-manage/Unpublished'
import Published from '../../views/publish-manage/Published'
import Sunset from '../../views/publish-manage/Sunset'

import axios from 'axios'
import { Spin } from 'antd'

const LocalRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/news-manage/preview/:id": NewsPreview,
  "/news-manage/update/:id": NewsUpdate,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset
}



function NewRoute(props) { 
  const [BackRouteList, setBackRouteList] = useState([])
  useEffect(() => {
    Promise.all([
      axios({ url: `http://localhost:8000/rights` }),
      axios({ url: `http://localhost:8000/children` })
    ]).then(data => {
      setBackRouteList([...data[0].data, ...data[1].data])
    })
  }, [])

  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }
  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }
  return ( 
    <Spin size="large"  spinning={props.loading}>
      <Switch>
        {BackRouteList?.map(item => {
          if (checkRoute(item) && checkUserPermission(item)) {
            return (
              <Route exact path={item.key} key={item.key} component={LocalRouterMap[item.key]} />
            )
          }
          return null
        })}
        <Redirect from='/' exact to='/home' />
        {BackRouteList.length > 0 && <Route path='*' component={Nopermission} />}
      </Switch>
    </Spin>
  )
}

const mapStateToProps = ({ LoadingReducer: { loading } }) => {
  return { loading }	// data会传到props
}
export default connect(mapStateToProps)(NewRoute)