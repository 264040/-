

import { Button } from 'antd';
import NewsPublish from '../../compoents/publish-manage/NewsPublish'
import usePublish from '../../compoents/publish-manage/usePublish'

export default function Sunset(props) {
  // 3===已下线
  const { dataSource, handleDelete, handleOnline } = usePublish(3)

  return (
    <NewsPublish
      dataSource={dataSource}
      history={props}
      button={
        id => ( 
          <Button
            onClick={() => handleDelete(id)}
            type="primary"
            danger
          >
            删除
          </Button>
        )
      }
      buttonOnline={
        id => ( 
          <Button
            onClick={() => handleOnline(id)}
            type="primary"
          >
            上线
          </Button>
        )
      }
    />
  )
}
