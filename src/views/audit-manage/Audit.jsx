import React, { useEffect, useState } from 'react'

import { Table, Button, Space, notification } from "antd"

import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import axios from 'axios'

export default function Audit(props) { 
  const [dataSource, setDataSource] = useState([])
  const { region, roleId, username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }
    axios({ url: `/news?auditState=1&_expand=category` }).then(res => { 
      let list = res.data
      setDataSource(roleObj[roleId] === 'superadmin' ? list : [
        ...list.filter(item => item.author === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
      ])
    })
  }, [region, roleId, username])
  const columns = [
    {
      title: <b>新闻标题</b>,
      dataIndex: 'title',
      key: 'key',
      align: 'center',
      render: (title, item) => <a href = {`/#/news-manage/preview/${item.id}`}>{title}</a>
    },
    {
      title: <b>作者</b>,
      key: 'key',
      align: 'center',
      dataIndex: 'author'
    },
    {
      title: <b>新闻分类</b>,
      key: 'key',
      align: 'center',
      dataIndex: 'category',
      render: ((category) => <div>{category.title}</div>)
    },
    {
      title: <b>操作</b>,
      key: 'key',
      align: 'center',
      render: (_, item) => (
        <Space size="middle">
          <Button onClick={() => handleAudit(item, 2, 1)} shape="circle" type="primary"><CheckOutlined /></Button>
          <Button onClick={() => handleAudit(item, 3, 0)} shape="circle" danger type="primary"><CloseOutlined /></Button>
        </Space>
      ),
    },
  ];
  const handleAudit = (item, auditState, publishState) => { 
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(res => {
      notification.info({
        message: `通知`, 
        maxCount:2,
        description: `您可以到[审核管理/审核列表]中查看您的新闻`,
        placement: 'bottoRight',
      });
    })
  }
  return (
    <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 5 }}
      rowKey={item => item.id}
    />
  )
}
