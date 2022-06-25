import React, { useEffect, useRef, useState } from 'react'
import { Avatar, Card, Col, Row, List, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, PieChartOutlined } from '@ant-design/icons';
import axios from 'axios'

import * as echarts from 'echarts';
import _ from 'lodash'

const { Meta } = Card;

export default function Hoem() {
  const [ViewList, setViewList] = useState([])
  const [StarList, setStarList] = useState([])
  const [allList, setAllList] = useState([])
  const { region, role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))
  const barRef = useRef()
  const pieRef = useRef()
  const [visible, setVisible] = useState(false);
  const [pieChart, setPieChart] = useState(null);

  useEffect(() => {
    axios({ url: `/news?publish=2&_expand=category&_sort=view&_order=desc&_limit=6` })
      .then(res => {
        setViewList(res.data)
      })
  }, [])

  useEffect(() => {
    axios({ url: `/news?publish=2&_expand=category&_sort=star&_order=desc&_limit=6` })
      .then(res => {
        setStarList(res.data)
      })
  }, [])


  useEffect(() => {
    axios({ url: `/news?publish=2&_expand=category` }).then(res => {
      console.log(res.data, '图示');
      const { username } = JSON.parse(localStorage.getItem('token'))
      setAllList(res.data.filter(item => item.author === username))

      const groupBys = _.groupBy(res.data, item => item.category.title)
      renderBarView(groupBys)
    })
    return () => {
      window.onresize = null
    }
  }, [])

  const renderBarView = (groupBys) => {
    var myChart = echarts.init(barRef.current);
    // 绘制图表
    myChart.setOption({
      title: {
        text: '新闻分类图示',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#283b56'
          }
        }
      },
      legend: {},
      xAxis: {
        data: Object.keys(groupBys),
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(groupBys).map(item => item.length)
        }
      ]
    });

    window.onresize = () => {
      myChart.resize()
    }
  }

  const renderPieView = () => {
    var myChart;
    const groupObj = _.groupBy(allList, item => item.category.title)
    console.log(groupObj, 'groupObj');
    let list = []
    for (let item in groupObj) {
      list.push({
        name: item,
        value: groupObj[item].length
      })
    }

    if (!pieChart) {
      myChart = echarts.init(pieRef.current);
      setPieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option;
    option = {
      title: {
        text: `${username}-新闻分类饼状图`,
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {

              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }

  const showDrawer = () => {
    setVisible(true);
    console.log(allList, '显示');
    setTimeout(() => {
      renderPieView()
    }, 0)
  };

  const onClose = () => {
    setVisible(false);
  };
  return (
    <div className="site-card-wrapper" style={{ padding: '0 20px' }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card title={<b style={{ color: '#615e65' }}>用户最常浏览</b>} bordered={true}>
            <List
              dataSource={ViewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`/#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<b style={{ color: '#615e65' }}>用户最多点赞</b>} bordered={true}>
            <List
              dataSource={StarList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`/#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable={true}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <PieChartOutlined key="setting" onClick={() => showDrawer()} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={`${region ? region : '全球'} - ${roleName}`}
            />
          </Card>
        </Col>
      </Row>

      <div ref={barRef} style={{ height: "400px", width: "100%", margin: '30px 0 0 0' }}></div>

      <Drawer width={'500px'} title="个人新闻" placement="right" onClose={onClose} visible={visible}>
        <div ref={pieRef} style={{ height: "600px", width: "100%", margin: '30px 0 0 0' }}></div>
      </Drawer>
    </div>
  )
}
