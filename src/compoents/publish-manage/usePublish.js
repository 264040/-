/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-06-21 16:52:35
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-06-25 14:23:20
 * @FilePath: \全球新闻管理系统\全球新闻管理系统\reactapp\newssytem\src\compoents\publish-manage\usePublish.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


import { useEffect, useState } from 'react'
import axios from 'axios'
import { notification } from 'antd'

function usePublish(publishState) {
  const [dataSource, setDataSource] = useState([])
  const { username, region, roleId } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios(`/news?publishState=${publishState}&_expand=category`).then(res => {
      if (publishState === 1) {
        setDataSource(res.data.filter(item => item.author === username))

      } else if (publishState === 2) {
        if (roleId === 1) {
          setDataSource(res.data)

        } else if (roleId === 2) {
          setDataSource(res.data.filter(item => item.region === region))

        } else if (roleId === 3) {
          setDataSource(res.data.filter(item => item.author === username))

        }
      } else {
        setDataSource(res.data.filter(item => item.author === username))

      }
    })
  }, [username, publishState, roleId, region])

  const handlePublish = item => {
    // console.log(item, '发布');
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then(res => {
      notification.info({
        message: `通知`,
        description: `您可以到【发布管理/已发布】中查看您的新闻`,
        placement: 'bottoRight',
      });
    })
  }

  const handleSunset = item => {
    // console.log(item, '下线');
    setDataSource(dataSource.filter(data => data.id !== item.id))

    axios.patch(`/news/${item.id}`, {
      publishState: 3
    }).then(res => {
      notification.info({
        message: `通知`,
        description: `您可以到【发布管理/已下线】中查看您的新闻`,
        placement: 'bottoRight',
      });
    })
  }

  const handleDelete = item => {
    // console.log(item, '删除');
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`).then(res => {
      notification.info({
        message: `通知`,
        description: `新闻已删除`,
        placement: 'bottoRight',
      });
    })
  }
  const handleOnline = item => {
    // console.log(item,'上线');
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then(res => {
      notification.info({
        message: `通知`,
        description: `您可以到【发布管理/已发布】中查看您的新闻`,
        placement: 'bottoRight',
      });
    })
  }
  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete,
    handleOnline
  }
}

export default usePublish