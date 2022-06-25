import React, { useState, useEffect } from 'react'
import { Space, Table, Button, notification, Modal, Popover, Switch } from 'antd';
import { DeleteFilled, EditOutlined, UploadOutlined } from '@ant-design/icons'
import axios from 'axios'

import './index.css'

export default function NewsDraft(props) {
  const [data, setdata] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [list, setList] = useState([]);
  const { username } = JSON.parse(localStorage.getItem('token')) 

  useEffect(() => {
    new Promise((resolve, reject) => {
      axios({ url: `/news?author=${username}&auditState=0&_expand=category` }).then(datas => {
        setTimeout(() => {
          resolve(datas)
        }, 200)
      }).catch(err => reject(err))
    }).then((item) => {
      const list = item.data.filter((item) => {
        if (item.children?.length === 0) {
          item.children = null
        }
        // item.children?.length === 0 ? item.children = null : item.children = item.children
        return item
      })
      setdata(list)
      // console.log('promise', list);
    }).catch(e => {
      console.log('promise', e);
    })
  }, [username])

  const columns = [
    {
      title: <b>ID</b>,
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (text,item,index) => {
        // <b>{text}</b>
        return <b>{index + 1}</b>
      }
    },
    {
      title: <b>新闻标题</b>,
      key: 'id',
      align: 'center',
      dataIndex: 'title',
      render: (title, arr) => {
        return <a href={`/#/news-manage/preview/${arr.id}`}>{title}</a>
      }
    },
    {
      title: <b>作者</b>,
      key: 'id',
      align: 'center',
      dataIndex: 'author'
    },
    {
      title: <b>新闻分类</b>,
      key: 'id',
      align: 'center',
      dataIndex: 'category',
      render: ((category) => <span key={category.id}>{category.title}</span>)
    },
    {
      title: <b>操作</b>,
      key: 'id',
      align: 'center',
      render: (_, item) => (
        <Space size="middle">
          <Button
            onClick={e => showModal(item)}
            danger shape="circle"
            icon={<DeleteFilled />}
          />
          <Popover
            content={
              <div style={{ textAlign: 'center' }}>
                <Switch
                  checked={item.pagepermisson}
                  onChange={() => onChange(item)} />
              </div>
            }
            placement="left"
            title={'配置'}
            trigger={item.pagepermisson === undefined ? '' : 'click'}
            showModal={false}
          >
            <Button
              // disabled={record.pagepermisson === undefined} 
              type="default"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                props.history.push(`/news-manage/update/${item.id}`)
              }}
            />
          </Popover>

          <Button
            // disabled={record.pagepermisson === undefined} 
            type="primary"
            shape="circle"
            icon={<UploadOutlined />}
            onClick={() => handleCheck(item.id)}
          />
        </Space>
      ),
    },
  ];
  const handleCheck = id => {
    console.log(id, 'ididid');
    axios.patch(`/news/${id}`, {
      auditState: 1
    }).then(res => {
      props.history.push('/audit-manage/list')
      console.log(res, '审核');

      notification.info({
        message: `通知`,
        description: `您可以到${'审核列表'}中查看您的新闻`,
        placement: 'bottoRight',
      });
    })
  }
  const axiosViews = (res) => {

    return (
      <Table rowKey={item => item.id} columns={columns} dataSource={data} pagination={{
        pageSize: 5
      }} />
    )
  }

  const confirmBtn = d => {
    setdata(data.filter(item => item.id !== d.id))
    axios.delete(`/news/${d.id}`)
  }
  const showModal = (e) => {  //? 打开遮罩层
    setIsModalVisible(true);
    setList(e)
    console.log(data, 'eeee');
  };
  const handleOk = (e) => {   //? 点击确定后的回调
    setIsModalVisible(false);
    confirmBtn(list)
    console.log('ok');
  };
  const handleCancel = () => {  //? 取消后的回调
    setIsModalVisible(false);
    console.log('no');
  };
  const onChange = (checked) => {
    console.log(checked, `switch to `);
    checked.pagepermisson = checked.pagepermisson === 1 ? 0 : 1;
    setdata([...data])

    if (checked.grade === 1) {
      axios({
        url: `http://localhost:8000/rights/${checked.id}`,
        method: "patch",
        data: {
          pagepermisson: checked.pagepermisson
        }
      })
    } else {
      axios({
        url: `http://localhost:8000/children/${checked.id}`,
        method: "patch",
        data: {
          pagepermisson: checked.pagepermisson
        }
      })
    }

  };
  return (
    <>
      {axiosViews(data)}
      <Modal
        title="删除"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>确定要删除吗？</p>
      </Modal>
    </>
  )
}
