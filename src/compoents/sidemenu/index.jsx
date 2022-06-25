import React, { useEffect, useState } from 'react'

import { withRouter } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import {
  MailOutlined,
  CalendarOutlined,
  SettingOutlined,
  ApartmentOutlined,
  AuditOutlined,
  SendOutlined 
} from '@ant-design/icons';
import axios from 'axios'

import { connect } from 'react-redux'
import './index.css'

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const iconArr = {
  "/home": <MailOutlined />,
  "/user-manage": <SettingOutlined />,
  "/right-manage": <CalendarOutlined />,
  "/news-manage": <ApartmentOutlined />,
  "/audit-manage": <AuditOutlined />,
  "/publish-manage": <SendOutlined />
}

function SideMenu(props) { 
  const [meu, setMeu] = useState([]) 
  const his = props.location.pathname
  const openkey = '/' + props.location.pathname.split('/')[1]

  // console.log(checkPagePermission);

  useEffect(() => { 
    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
    const checkPagePermission = items => {
      return items.pagepermisson && rights.includes(items.key)
    }
    axios({
      url: '/rights?_embed=children'
    }).then(data => {
      const sideMenu = (list) => {
        let arr = []
        if (list.length > 0) {
          arr = list.map((item) => {
            if (item.children && checkPagePermission(item)) {
              return getItem(
                item.title,
                item.key,
                iconArr[item.key],
                item.children?.length > 0 ? sideMenu(item.children) : null)
            }
            return checkPagePermission(item) && getItem(item.title, item.key)
          })
        }
        return arr
      }
      const list = sideMenu(data.data)

      setMeu(list)
    }).catch(e => {
      console.error(e)
    })
  }, [])

  const { Sider } = Layout;
  // const renderMenu = (menulist) => { 
  //   return menulist.map(item => {
  //     if (item.children) {
  //       return (
  //         <SubMenu key={item.key} icon={item.icon} title={item.label}> {renderMenu(item.children)}</SubMenu>
  //       )
  //     }
  //     return <Menu.Item onClick={e => props.history.push(e.key)} key={item.key} icon={item.icon}>{item.label}</Menu.Item>
  //   })
  // }
  return (
    <Sider className="Sider_nodes" trigger={null} collapsible collapsed={props.collapsed}>
      <div className="logo" >新闻发布管理系统</div>
      <div className="Sider_nodes_children_scroll">
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[his]}
          defaultOpenKeys={[openkey]}
          items={meu}
          onClick={(e) => {
            props.history.push(e.key)
          }}
        />
      </div>
    </Sider>
  )
}
const mapStateToProps = ({ CollApsedReducer: { collapsed } }) => {
  return { collapsed }	// data会传到props
}
export default connect(mapStateToProps, null)(withRouter(SideMenu))