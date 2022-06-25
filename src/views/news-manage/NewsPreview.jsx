import React, { useEffect, useState } from 'react';
import { Descriptions, PageHeader } from 'antd';
import './index.css'
import axios from 'axios';
import moment from 'moment'

export default function NewsPreview(props) {
  const [newsInfo, setNewsInfo] = useState(null)
  const { id } = props.match.params
  useEffect(() => {
    axios({ url: `news/${id}?_expand=category&_expand=role` }).then(data => {
      setNewsInfo(data.data)
    })
  }, [id])
 

  const auditList = ["未审核", "审核中", "已通过", "未通过"]
  const publishList = ["未发布", "待发布", "已上线", "已下线"]
  const colorList = ["black", "orange", "green", "red"]
  return (
    <div>
      {
        newsInfo && <div>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={newsInfo.category.title}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">
                {newsInfo.author}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">
                {newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
              </Descriptions.Item>
              <Descriptions.Item label="区域">
                {newsInfo.region}
              </Descriptions.Item>
              <Descriptions.Item label="审核状态">
                <span style = {{color:colorList[newsInfo.auditState]}} >
                  {auditList[newsInfo.auditState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="发布状态">
                <span style = {{color:colorList[newsInfo.publishState]}}>
                  {publishList[newsInfo.publishState]}
                </span>
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
            style = {{background:'#f7f7f8',margin:"0 24px"}}
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
