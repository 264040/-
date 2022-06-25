import React, { useEffect, useState, useRef } from 'react'
import {
  PageHeader,
  Steps,
  Button,
  message,
  Form,
  Input,
  Select,
  notification
} from 'antd';

import axios from 'axios'
import './index.css'
import NewsEdito from '../../compoents/news-manage/NewsEdito';
const { Step } = Steps;

const { Option } = Select;
const steps = [
  {
    title: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
  {
    title: 'Last',
    content: 'Last-content',
  },
];


export default function NewsAdd(props) {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryLists] = useState([])
  const NewsForm = useRef(null)
  const [formInof, setFormInof] = useState({})
  const [content, setContent] = useState('')
  useEffect(() => {
    axios({ url: `/categories` })
      .then(res => { 
        setCategoryLists(res.data)
      })

  }, [])

  const user = JSON.parse(localStorage.getItem("token"))
  
  const next = () => {
    if (current === 0) {
      NewsForm.current.validateFields()
        .then(values => {
          setFormInof(values)
          setCurrent(current + 1);
        }).catch(err => {
          console.log(err);
        })
    } else {
      let res = /<([a-z]+?)(?:\s+?[^>]*?)?>\s*?<\/\1>/ig  
      if (res.test(content) || content === '') {
        message.error('内容不能为空') 
      } else { 
        setCurrent(current + 1)
      }
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const [form] = Form.useForm();

  const onGenderChange = (value) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({
          note: 'Hi, man!',
        });
        return;

      case 'female':
        form.setFieldsValue({
          note: 'Hi, lady!',
        });
        return;

      case 'other':
        form.setFieldsValue({
          note: 'Hi there!',
        });  
        return;
    }
  };

  const onFinish = (values) => {
    console.log(values);
  };
   
  const layout = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 20,
    },
  }; 
  const handleSave = (auditState) => {
    axios({
      url: `http://localhost:8000/news`,
      method: 'post',
      data: {
        ...formInof,
        "content": content,
        "region": user.region || '全球',
        "author": user.username,
        "roleId": user.roleId,
        "auditState": auditState,
        "publishState": 0,
        "createTime": Date.now(),
        "star": 0,
        "view": 0, 
        // "publishTime": 0
      }
    }).then( res => {
      props.history.push(auditState === 0 ? '/news-manage/draft':'/audit-manage/list') ;

      notification.info({
        message: `通知`,
        description: `您可以到${auditState === 0 ?'草稿箱':'审核列表'}中查看您的新闻`,
        placement:'bottoRight',
      });
    }).catch( err => {
      console.log(err,'err');
    })
  }
  return (
    <div>
      <PageHeader
        style={{ margin: '15px 20px 0 20px' }}
        className="site-page-header"
        title="撰写新闻"
        subTitle="This is a subtitle"
      />
      <Steps style={{ padding: "0 43px" }} current={current}>
        <Step title="基本信息" />
        <Step title="新闻内容" />
        <Step title="新闻提交" />
      </Steps>

      <div className="steps-content">
        <div className={current === 0 ? "" : "hidden"}>
          <Form ref={NewsForm} {...layout} form={form} name="control-hooks" onFinish={onFinish}>
            <Form.Item
              name="title"
              label="新闻标题"
              rules={[
                {
                  required: true,
                  message: '"标题"不能为空'
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="categoryId"
              label="新闻分类" 
              rules={[
                {
                  required: true,
                  message: '"新闻类别"不能为空'
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onGenderChange}
                allowClear
              >
                {
                  categoryList.map(item => (
                    <Option key={item.id} value={item.id}>{item.title}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
            >
              {({ getFieldValue }) =>
                getFieldValue('gender') === 'other' ? (
                  <Form.Item
                    name="customizeGender"
                    label="Customize Gender"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                ) : null
              }
            </Form.Item> 
          </Form>
        </div>

        <div className={current === 1 ? "" : "hidden"}>
          <NewsEdito getContent={(e) => {
            setContent(e)
          }} />
        </div> 
      </div>

      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => next()}
          >
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <>
            <Button
              type="primary"
              onClick={() => handleSave(1)}
            >
              提交
          </Button>
            <Button
              danger
              onClick={() => handleSave(0)}
              type="dashed">
              保存草稿箱
            </Button>
          </>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: '0 8px',
            }}
            onClick={() => prev()}
          >
            上一步
          </Button>
        )}
      </div>
    </div>
  )
}
