/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-06-21 16:11:30
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-06-25 10:52:58
 * @FilePath: \全球新闻管理系统\全球新闻管理系统\reactapp\newssytem\src\compoents\publish-manage\NewsPublish.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import React from 'react'
import { Space, Table } from 'antd';
export default function NewsPublish(props) {

  const columns = [
    {
      title: <b>新闻标题</b>,
      dataIndex: 'title',
      align: 'center',
      render: (title, item, index) => <a key={index} href={`/#/news-manage/preview/${item.id}`}>{title}</a>
    },
    {
      title: <b>作者</b>,
      align: 'center',
      dataIndex: 'author'
    },
    {
      title: <b>新闻分类</b>,
      align: 'center',
      dataIndex: 'category',
      render: ((category) => <div>{category.title}</div>)
    },
    {
      title: <b>操作</b>,
      key: 'id',
      align: 'center',
      render: (item) => (
        <Space size="middle">
          {props.button(item)}
          {props.buttonOnline && props.buttonOnline(item)}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table rowKey={it => it.id} columns={columns} dataSource={props.dataSource} pagination={{
        pageSize: 10
      }} />
    </>
  )
}
