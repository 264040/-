import React, { useState, useEffect } from 'react'
import { Space, Table, Tag, Button, Modal, Popover, Switch } from 'antd';
import { DeleteFilled, EditOutlined } from '@ant-design/icons'
import axios from 'axios'

import './index.css'

export default function RightList() {
  const [data, setdata] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [list, setList] = useState([]);

  const newPromiseAxios = () => {

    new Promise((resolve, reject) => {
      axios({ url: 'http://localhost:8000/rights?_embed=children' }).then(datas => {
        setTimeout(() => {
          resolve(datas)
        }, 300)
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
  }
  useEffect(() => {
    newPromiseAxios()
  }, [])
  const columns = [
    {
      title: <b>ID</b>,
      dataIndex: 'id',
      key: 'key',
      align: 'center',
      render: (text) => <b>{text}</b>
    },
    {
      title: <b>权限名称</b>,
      key: 'key',
      align: 'center',
      dataIndex: 'title'
    },
    {
      title: <b>权限路径</b>,
      key: 'key',
      align: 'center',
      render: ((tags) => <Tag style={{ fontSize: '18px' }} color="magenta" >{tags.key}</Tag>)
    },
    {
      title: <b>操作</b>,
      key: 'id',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={e => showModal(record)}
            danger shape="circle"
            icon={<DeleteFilled />}
          />
          <Popover
            content={
              <div style={{ textAlign: 'center' }}>
                <Switch
                  checked={record.pagepermisson}
                  onChange={() => onChange(record)} />
              </div>
            }
            placement="left"
            title={'配置'}
            trigger={record.pagepermisson === undefined ? '' : 'click'}
            showModal={false}
          >
            <Button
              disabled={record.pagepermisson === undefined}
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
            />
          </Popover>
        </Space>
      ),
    },
  ];

  const confirmBtn = d => {
    console.log(list, 'data');
    if (d.grade === 1) {
      console.log(d, 'axios');
      axios({
        url: `http://localhost:8000/rights/${d.id}`,
        method: 'delete'
      }).then(e => {
        newPromiseAxios()
        console.log(e, '55');
      }).catch(err => {
        console.log(err, '修改失败');
      })
    } else {
      console.log(d);
      let list = data.filter(data => data.id === d.rightId)

      setdata([...data])
      list[0].children = list[0].children.filter(child => child.id !== d.id)
      axios({ url: `http://localhost:8000/children/${d.id}`, method: 'delete' }).then(e => {
        // newPromiseAxios()
        console.log(e, '二级');
      }).catch(err => {
        console.log(err, '修改失败');
      })
    }

  }
  const showModal = (e) => {  //? 打开遮罩层
    setIsModalVisible(true);
    setList(e)
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
      <Table columns={columns} dataSource={data} pagination={{
        pageSize: 5
      }} />
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
