
import React, { useEffect, useState } from 'react';
import { Descriptions, PageHeader, message } from 'antd';
import { HeartTwoTone } from '@ant-design/icons'
import axios from 'axios';
import moment from 'moment'

export default function Detail(props) {
  const [newsInfo, setNewsInfo] = useState(null)
  const [starColor, setStarColor] = useState(null)
  const { id } = props.match.params
  useEffect(() => {
    localStorage.removeItem('stars')
    axios({ url: `news/${id}?_expand=category&_expand=role` }).then(data => {
      setNewsInfo({ ...data.data, view: data.data.view + 1 })
      return data
    }).then(res => {
      axios.patch(`/news/${id}`, {
        view: res.data.view + 1
      })
    })
  }, [id])

  let stars = false;
  const handleStar = () => {
    stars = true
    if (localStorage.getItem('stars')) {
      message.error('你已经点过赞了，不能再点了！')
    } else { 
      localStorage.setItem('stars', stars)
      setNewsInfo({ ...newsInfo, star: newsInfo.star + 1 }) 
      axios.patch(`/news/${id}`, {
        star: newsInfo.star + 1
      })

      setStarColor('hotpink')
    }
    console.log(newsInfo);
  }
  return (
    <div>
      {
        newsInfo && <div>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={
              <div>
                {newsInfo.category.title}
                <HeartTwoTone twoToneColor={starColor} onClick={() => handleStar()} />
              </div>
            }
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">
                {newsInfo.author}
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">
                {newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
              </Descriptions.Item>
              <Descriptions.Item label="区域">
                {newsInfo.region}
              </Descriptions.Item>
              <Descriptions.Item label="访问数量">
                {
                  newsInfo.view
                }
              </Descriptions.Item>
              <Descriptions.Item label="点赞数量">
                {
                  newsInfo.star
                }
              </Descriptions.Item>
              <Descriptions.Item label="评论数量">
                0
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <PageHeader
            style={{ background: '#f7f7f8', margin: "0 24px" }}
          >
            <div dangerouslySetInnerHTML={{
              __html: newsInfo.content
            }}>
            </div>
          </PageHeader>
        </div>
      }
    </div>
  )
}
