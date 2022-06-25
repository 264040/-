import React, { forwardRef, useState ,useEffect} from 'react'

import { Form, Input, Select } from 'antd'
// import { Op } from '@ant-design/icons'

export const UserForm = forwardRef((props, ref) => {
  const { initialValues } = props

  const { Option } = Select;
  const [disable, setisDisbale] = useState(false)   
  
  useEffect(()=>{
    if(initialValues?.roleId === 1){
      setisDisbale(true)
    }else{
      setisDisbale(false)
    }
  },[initialValues])
  
  const {roleId, region} = JSON.parse(localStorage.getItem("token"))
  const roleObj = {
    "1":"superadmin",
    "2":"admin",
    "3":"editor"
  }
  const checkRegionDisabled = (item)=>{
    if(props.isupdata){
      if(roleObj[roleId] === 'superadmin'){
        return false
      }else{
        return true
      }
    }else{
      if(roleObj[roleId] === 'superadmin'){
        return false
      }else{
        return item.value !== region
      }
    }
  }

  const checkRoleDisabled = (item)=> {
    if(props.isupdata){
      if(roleObj[roleId] === 'superadmin'){
        return false
      }else{
        return true
      }
    }else{
      if(roleObj[roleId] === 'superadmin'){
        return false
      }else{
        return roleObj[item.id] !== 'editor'
      }
    }
  }
  return (

    <Form
      ref={ref}
      layout="vertical"
      initialValues={initialValues}
    
    >
      <Form.Item
        name="username"
        label='用户名'
        rules={[{
          required: true,
          message: 'Please input the title of collection!',
        }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label='密码'
        rules={[{
          required: true,
          message: 'Please input the title of collection!',
        }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label='区域'
        rules={disable ? [] : [{
          required: true,
          message: 'Please input the title of collection!',
        }]}
      >
        <Select disabled={disable} placement={"topRight"}>
          {
            props.region?.map(item => {
              return <Option disabled = {checkRegionDisabled(item)} value={item.value} key={item.id} >{item.title}</Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label='角色'
        rules={[{
          required: true,
          message: 'Please input the title of collection!',
        }]}
      >
        <Select onChange={
          vla => {
            console.log(vla,'vla');
              console.log(initialValues?.roleId);
            if (vla === 1 ) {
              setisDisbale(true)
              ref.current.setFieldsValue({ region: '' })
            } else {
              setisDisbale(false)
            }
          }
        }
          placement={"topRight"}
        >
          {
            props.roleList?.map(item => {
              return <Option disabled = {checkRoleDisabled(item)} value={item.id} key={item.id} >{item.roleName}</Option>
            })
          }
        </Select>
      </Form.Item>
  
    </Form>
  )
})
