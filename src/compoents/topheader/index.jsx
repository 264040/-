import React from 'react'

import { withRouter } from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';

import { Layout, Dropdown, Menu, message, Avatar } from 'antd';

import { connect } from 'react-redux'

import './index.css'



function TopHeader(props) {
 
  const { Header } = Layout;
  const onClick = ({ key }) => {
    key = Number(key)
    if (key === 2) {
      message.info(`退出成功`);
      localStorage.removeItem('token')
      props.history.replace('/login')
    }
  };
  const { role: { roleName = [] }, username = [] } = JSON.parse(localStorage.getItem("token"))
  const menu = (
    <Menu
      onClick={onClick}
      items={[
        {
          key: '1',
          label: roleName
        },
        {
          key: '2',
          label: '退出登录',
          danger: true,
        },
      ]}
    />
  ); 

  const changeCollapsed = () => { 
    props.changeCollapsed()
  }

  return (
    <Header className="site-layout-background site-layout-background-flex" style={{ padding: '0 16px' }}>
      {
        props.collapsed ? <MenuUnfoldOutlined onClick={() => changeCollapsed()} /> : <MenuFoldOutlined onClick={() => changeCollapsed()} />
      }
      <div>
        <span>欢迎<span style = {{color:"#1890ff"}}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
const mapStateToProps = ({ CollApsedReducer: { collapsed } }) => {
  return { collapsed }	// data会传到props
}
const mapDispatchToProps = {
  changeCollapsed(){
    return {
      type: "change_collapsed"
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))