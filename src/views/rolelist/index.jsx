import React, { useState, useEffect } from 'react'

import { Table, Space, Button, Tree, Modal } from 'antd'

import { UnorderedListOutlined, DeleteFilled } from '@ant-design/icons'

import axios from 'axios'

export default function RoleList() {

  const [dataSourc, setDataSourc] = useState([])
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [rigthList, setRigthList] = useState([])
  const [rigList, setRigList] = useState([])
  const [rigListID, setRigListID] = useState([])
  const [isModalAlert, setIsModalAlert] = useState(false);

  const columns = [
    {
      title: 'ID',
      key: 'roleType',
      align: 'center',
      render: (text) => <b>{text.id}</b>
    }, {
      title: <b>角色名称</b>,
      key: 'roleType',
      align: 'center',
      render: (text) => <span>{text.roleName}</span>
    }, {
      title: <b>操作</b>,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={e => showModal(record)}
            danger shape="circle"
            icon={<DeleteFilled />}
          />

          <Button
            onClick={e => theeAlert(record)}
            type="primary"
            shape="circle"
            icon={<UnorderedListOutlined />}
          />
        </Space>
      ),
    },
  ]


  const confirmBtn = d => { //? 删除
    console.log(d, 'axios');
    setDataSourc(dataSourc.filter(arr => arr.id !== d.id))
    axios({
      url: `http://localhost:8000/roles/${d.id}`,
      method: 'delete'
    }).then(e => {
      console.log(e, '删除成功');
    })
  }
  const showModal = (d) => {
    setIsModalVisible(true)
    setList(d)
  }

  const handleOk = (e) => {   //? 点击确定后的回调
    setIsModalVisible(false);
    confirmBtn(list)
  };

  const handleCancel = () => {  //? 取消后的回调
    setIsModalVisible(false);
  };

  // ? 
  const theeAlert = (d) => { 
    setIsModalAlert(true)   
    // console.log(dataSourc,'setRigthList');
    // console.log(d,'d');
    setRigList(d.rights) 
    setRigListID(d.id)
    // return ArrList(d)
  }
  const theeAlertOk = e => {
    // console.log(e, 'Ok');
    setIsModalAlert(false)
    setRigthList()
    setDataSourc(dataSourc.map( list => {
      if(list.id === rigListID){
        return {
          ...list,
          rights:rigList
        }
      }else {
        return list
      }
    })) 

    axios({
      url: `http://localhost:8000/roles/${rigListID}`,
      method: "PATCH",
      data: {
        rights:rigList
      }
    }).then(res => {
      console.log(res,'patch');
    }).catch(err => {
      console.log(err,'patch');
    })
  }
  const theeAlertCancel = e => {
    setIsModalAlert(false)
  }
  useEffect(() => {
    axios({
      url: `http://localhost:8000/roles`,
    }).then(res => {
      setDataSourc(res.data)
    }).catch(err => {
      console.log(err);
    })
  }, [])

  useEffect(() => {
    axios({
      url: `http://localhost:8000/rights?_embed=children`,
    }).then(res => {
      setRigthList(res.data)
    }).catch(err => {
      console.log(err);
    })
  }, [])

  const onCheck = (e) => {  
    setRigList(e.checked) 
    console.log(rigList,'riglist');
  } 
  return (
    <div>
      <Table
        dataSource={dataSourc}
        columns={columns}
        rowKey={item => item.id}
      />
      <Modal
        title="删除"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>确定要删除吗？</p>
      </Modal>

      <Modal
        title="权限分配"
        visible={isModalAlert}
        onOk={theeAlertOk}
        onCancel={theeAlertCancel}
      >
        <Tree
          className="draggable-tree" 
          blockNode 
          checkedKeys={rigList}
          checkable={true}
          checkStrictly = {true}
          onCheck = {onCheck}
          treeData={rigthList}
        />
      </Modal>
    </div>
  )
}
