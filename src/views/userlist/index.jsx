import React, { useState, useEffect, useRef, memo } from 'react'
import { Space, Table, Button, Modal, Switch } from 'antd';
import { DeleteFilled, EditOutlined, PlusCircleTwoTone } from '@ant-design/icons'
import axios from 'axios'

import { UserForm } from '../../compoents/user-manage'
import './index.css'



export default memo(function UsertList(props) {

  const [data, setdata] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalVisibletwo, setIsModalVisibletwo] = useState(false)
  const [updataUser, setUpdataUser] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegion] = useState([])
  const [handle, seHandle] = useState([])
  const [initialValues, setInitialValues] = useState(null)
  const [current, setCurrent] = useState(null)

  const forwardref = useRef(null)
  const updataFrom = useRef(null)
  const { region, roleId, username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {

    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }
    axios({ url: '/users?_expand=role' }).then(datas => {
      setTimeout(() => {
        let list = datas.data
        setdata(roleObj[roleId] === 'superadmin' ? list : [
          ...list.filter(item => item.username === username),
          ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
        ])
      }, 300)
    }).catch(err => console.log(err))

  }, [region, roleId, username])
  useEffect(() => {

    axios({ url: `/regions` }).then(datas => {
      setTimeout(() => {
        setRegion(datas.data)
      }, 300)
    }).catch(err => console.log(err))

  }, [])

  useEffect(() => {
    axios({ url: `/roles` }).then(datas => {
      setTimeout(() => {
        setRoleList(datas.data)
      }, 300)
    }).catch(err => console.log(err))
  }, [])


  const columns = [
    {
      title: <b>区域</b>,
      dataIndex: 'region',
      key: 'id',
      filters: [
        ...regionList?.map(item => ({
          text: item.title,
          value: item.value
        })),
        { text: '全球', value: '全球' }
      ],
      onFilter: (value, item) => {
        console.log(item, 'item');
        if (value === '全球') {
          return item.region === ''
        }
        return item.region === value
      },
      align: 'center',
      render: (text) => <b>{text ? text : '全球(超管)'}</b>
    },
    {
      title: <b>角色名称</b>,
      key: 'id',
      align: 'center',
      dataIndex: 'role',
      filters: [
        ...roleList?.map(item => ({
          text: item.roleName,
          value: item.roleType
        }))
      ],
      onFilter: (value, item) => {
        return item.role.roleType === value
      },
      render: (role => <span>{role?.roleName}</span>)
    },
    {
      title: <b>用户名</b>,
      key: 'id',
      align: 'center',
      dataIndex: 'username',
      render: ((name, item) => {
        return <p>{name === username ? <span style={{ color: '#1890ff' }}>{name}(我)</span> : name}</p>
      })
    },
    {
      title: <b>用户状态</b>,
      key: 'id',
      align: 'center',
      dataIndex: 'roleState',
      render: ((roleState, obj) => (
        <Switch
          disabled={obj.default}
          checked={roleState}
          onChange={() => handleChange(obj)}
        >
          {roleState}
        </Switch>)
      )
    },
    {
      title: <b>操作</b>,
      key: 'id',
      align: 'center',
      dataIndex: 'roleId',
      render: (_, record) => (
        <Space size="middle">
          <Button
            disabled={record.default}
            onClick={e => showModaltwo(record)}
            danger shape="circle"
            icon={<DeleteFilled />}
          />
          <Button
            disabled={record.default}
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              showUpdataForm(record)
            }}
          />
        </Space>
      ),
    },
  ];

  const showModal = (e) => {  //? 打开遮罩层
    setIsModalVisible(true);
    // console.log('add', forwardref.current?.getFieldsValue({})); 

  };

  const handleOk = (e) => {   //? 点击确定后的回调

    forwardref.current.validateFields().then(value => {
      setIsModalVisible(false);
      axios({
        url: `/users`,
        method: 'post',
        data: {
          ...value,
          "roleState": true,
          "default": false
        }
      }).then(datas => {
        setdata([
          ...data,
          {
            ...datas.data,
            role: roleList.filter(item => {
              return item.roleType === datas.data.roleId
            })[0]
          }
        ])
        forwardref.current.resetFields()
      }).catch(err => {
        console.log(err, '请求失败')
      })
    }).catch(err => {
      console.log(err)
    })
  };

  const handleCancel = () => {  //? 取消后的回调
    setIsModalVisible(false);
  };

  const showModaltwo = (e) => {  //? 打开遮罩层
    seHandle(e)
    setIsModalVisibletwo(true);
  };

  const handleOktwo = (e) => {   //? 点击确定后的回调
    setIsModalVisibletwo(false);
    let newdatas = data.filter(item => {
      return item.id !== e.id
    })
    setdata([...newdatas])
    axios({
      url: `/users/${e.id}`,
      method: 'delete',
    })
  };

  const handleCanceltwo = () => {  //? 取消后的回调
    setIsModalVisibletwo(false);
  };

  const handleChange = (item) => {
    item.roleState = !item.roleState
    setdata([...data])

    axios({
      url: `/users/${item.id}`,
      method: 'patch',
      data: {
        roleState: item.roleState
      }
    })
  }

  const showUpdataForm = (e) => {
    setUpdataUser(true)
    setInitialValues(e)
    setCurrent(e)
    console.log(e, 'eee');
    console.log(data, 'data');
  }

  const handleUpdataOk = (t) => {
    // updataFrom.current.onFinish()
    // const values = await updataFrom.curren.validateFields();

    // updataFrom.current.resetFields('')
    // setInitialValues(null)
    updataFrom.current.validateFields().then(res => {
      console.log(res, 'res')

      setdata(data.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...res,
            role: roleList.filter(items => {
              return items.roleType === res.roleId
            })[0]
          }
        }
        return item
      }))

      axios({
        url: `/users/${current.id}`,
        method: 'patch',
        data: {
          ...res
        }
      })
      setUpdataUser(false)
    })
    // updataFrom.current.resetFields() 
  }

  const handleUpdataCancel = () => {
    setUpdataUser(false)
  }

  return (
    <>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ margin: "1.5vw 0 0 1.5vw" }}
      >
        <PlusCircleTwoTone />新增用户
      </Button>

      <Table rowKey={e => e.id} columns={columns} dataSource={data} pagination={{
        pageSize: 5
      }} />
      
      <Modal
        title="删除"
        visible={isModalVisibletwo}
        onOk={() => handleOktwo(handle)}
        onCancel={handleCanceltwo}
      >
        <p>你确定要删除吗？</p>
      </Modal>

      <Modal
        visible={isModalVisible}
        title="New users"
        okText="Create"
        cancelText="取消"
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <UserForm ref={forwardref} region={regionList} roleList={roleList} />
      </Modal>

      <Modal
        visible={updataUser}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={handleUpdataCancel}
        onOk={() => handleUpdataOk()}
        destroyOnClose={true}
      >
        <UserForm ref={updataFrom}
          region={regionList}
          roleList={roleList}
          initialValues={initialValues}
          isupdata={true}
        />

      </Modal>
    </>
  )
}
)

