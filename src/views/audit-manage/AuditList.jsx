
import React, { useEffect, useState } from 'react'

import axios from 'axios'

import { Space, Table, Tag, Button, notification } from 'antd';


export default function AuditList(props) {
  const [dataSounrce, setDataSounrce] = useState([])
  const { username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios({
      url: `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
    }).then(data => { 
      setDataSounrce(data.data)
    })
  }, [username])

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
      title: <b>审核状态</b>,
      key: 'key',
      align: 'center',
      dataIndex: 'auditState',
      render: ((auditState) => {
        const colorList = ['', 'orange', 'green', 'red']
        const auditList = ["", "审核中", "已通过", "未通过"]
        return <Tag style={{ fontSize: '12px' }} color={colorList[auditState]} >{auditList[auditState]}</Tag>
      })
    },
    {
      title: <b>操作</b>,
      key: 'id',
      align: 'center',
      render: (_, item) => (
        <Space size="middle">
          {
            item.auditState === 1 && <Button onClick={() => handleRervert(item)} type="primary">撤销</Button>
          }
          {
            item.auditState === 2 && <Button onClick={() => handlePublish(item)} type="primary">发布</Button>
          }
          {
            item.auditState === 3 && <Button onClick={() => handleUpdate(item)} type="primary">修改</Button>
          }
        </Space>
      ),
    },
  ];
  const handleRervert = (item) => {
    setDataSounrce(dataSounrce.filter(data => data.id !== item.id))
    axios({
      url: `/news/${item.id}`,
      method: 'patch',
      data: {
        auditState: 0
      }
    }).then(res => {
      notification.info({
        message: `通知`,
        maxCount: 1,
        description: `您可以到草稿箱中查看您的新闻`,
        placement: 'bottoRight',
      });
    })
  }

  const handleUpdate = item => {
    props.history.push(`/news-manage/update/${item.id}`) 
  }

  const handlePublish = item => { 
    // console.log(item,'发布');
    axios.patch(`/news/${item.id}`, {
      publishState: 2,
      publishTime:Date.now()
    }).then(res => {
      props.history.push('/publish-manage/published') 
      notification.info({
        message: `通知`,
        description: `您可以到【发布管理/已发布】中查看您的新闻`,
        placement: 'bottoRight',
      });
    })
  }
  return (
    <div>
      <Table columns={columns} dataSource={dataSounrce} pagination={{
        pageSize: 5
      }}
        rowKey={item => item.id}
      />
    </div>
  )
}
