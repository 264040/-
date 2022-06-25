import React, { useEffect } from 'react'
import SideMenu from '../../compoents/sidemenu'
import TopHeader from '../../compoents/topheader'

import { Layout } from 'antd'
import NewRoute from '../../compoents/newRoute';
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'


export default function Front(porps) {
  const { Content } = Layout;
  Nprogress.start()
  useEffect(() => {
    Nprogress.done()
  })
  return (
    <Layout>
      <SideMenu />
      <Layout className="site-layout">
        <TopHeader />
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            overflow: "auto",
            minHeight: 280,
          }}
        >
          <NewRoute />
        </Content>
      </Layout>
    </Layout>
  )
}
