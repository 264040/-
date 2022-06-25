import React, { useEffect, useState } from 'react'

import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './index.css'

import axios from 'axios'

function Login(props) {
  console.log(props);
  const onFinish = (values) => {
    const { password, username } = values
    axios({
      url: `users?username=${username}&password=${password}&roleState=true&_expand=role`
    }).then(data => {

      if (data.data.length > 0) {
        localStorage.setItem("token", JSON.stringify(data.data[0]))
        props.history.push('/')
        props.history.go()
        return message.success('登录成功')
      } else {
        return message.error("账号或密码错误")
      }
    }).catch(err => {
      console.log(err);
    })
  };

  return (
    <>
      <div className='view_login'>
        <div className='view_login_form'>
          <h1 className='view_login_form_title'>全球新闻发布管理系统</h1>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your Username!',
                },
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your Password!',
                },
              ]}
            >
              <Input
                autoComplete="off"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}

export default Login