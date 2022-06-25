
import { Button } from 'antd';
import NewsPublish from '../../compoents/publish-manage/NewsPublish'
import usePublish from '../../compoents/publish-manage/usePublish';

export default function Published(props) {
  // 2===已发布
  const { dataSource, handleSunset } = usePublish(2) 
  return (
    <NewsPublish
      dataSource={dataSource}
      button={
        id => ( 
          <Button
            onClick={() => handleSunset(id)}
            type="primary"
          >
            下线
          </Button>
        )
      }
      history={props}
    />
  )
}
