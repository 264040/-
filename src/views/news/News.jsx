import axios from 'axios'
import React, { memo, useEffect, useState } from 'react'
import { PageHeader, Card, Col, Row, List } from 'antd';
import _ from 'lodash'

export default memo(function News() {
  const [list, setlist] = useState([])
  useEffect(() => {
    axios({ url: `/news?publishState=2&_expand=category` })
      .then(res => {
        setlist(Object.entries(_.groupBy(res.data, item => item.category.title)))
      })
  }, [])
 
  return (
    <div style={{ width: "95%", margin: "0 auto" }}>
      <PageHeader
        className="site-page-header"  
        title="全球IT新闻"
        subTitle="新闻资讯"
      />
      <div className="site-card-wrapper">
        <Row gutter={[12, 12]}>
          {
            list.map(items => {
              return (
                <Col span={6} key={items[0]}>
                  <Card hoverable title={<b>{items[0]}</b>} bordered={true}  >
                    <List
                      style={{ height: "150px"}}
                      dataSource={items[1]}
                      pagination={{ pageSize: 2 }}
                      renderItem={item => (
                        <List.Item>
                          <a href={`/#/detail/${item.id}`}>{item.title}</a>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              )
            })
          }
        </Row>
      </div>
    </div>
  )
})
