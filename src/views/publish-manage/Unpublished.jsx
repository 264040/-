
import { Button } from 'antd';
import NewsPublish from '../../compoents/publish-manage/NewsPublish'
import usePublish from '../../compoents/publish-manage/usePublish'

export default function Unpublished(props) {
  // 1===待发布
  const { dataSource, handlePublish } = usePublish(1)

  return (
    <NewsPublish
      dataSource={dataSource}
      history={props}
      button={
        id => ( 
          <Button
            onClick={() => handlePublish(id)}
            type="primary"
          >
            发布
          </Button>
        )
      }
    />
  )
}
