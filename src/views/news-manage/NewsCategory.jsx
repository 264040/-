import React, { useState, useEffect, useRef, memo, useContext } from 'react'
import { Space, Table, Button, Spin, Modal, Form, Input } from 'antd';
import { DeleteFilled } from '@ant-design/icons'
import axios from 'axios'
 
import './index.css'



export default memo(function NewsCategory(props) {

  const [data, setdata] = useState([]) 
  const [isModalVisibletwo, setIsModalVisibletwo] = useState(false)
  const [handle, seHandle] = useState([]) 
  useEffect(() => { 
    axios({ url: '/categories' }).then(datas => {
      setdata(datas.data)
    }).catch(err => console.log(err))
  }, []) 

  const handleSavea = item => { 
    setdata(data.map(data => {
      if (data.id === item.id) {
        return {
          id: data.id,
          title: item.title,
          value: item.value
        }
      }
      return data
    }))
    axios.patch(`/categories/${item.id}`, {
      title: item.title,
      value: item.value
    }).then(res => {
      console.log(res, 'resres');
    })
  }
  const columns = [
    {
      title: <b>ID</b>,
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: <b>栏目名称</b>,
      key: 'id',
      align: 'center',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave: handleSavea,
      }),
    },
    {
      title: <b>操作</b>,
      key: 'id',
      align: 'center',
      dataIndex: 'roleId',
      render: (_, record) => (
        <Space size="middle">
          <Button
            disabled={record.default}
            onClick={e => showModaltwo(record)}
            danger shape="circle"
            icon={<DeleteFilled />}
          />
        </Space>
      ),
    },
  ];
  const axiosViews = (res) => {
    if (res?.length === 0) {
      return (
        <div className="example">
          <Spin />
        </div>
      )
    } else {
      return (
        <Table rowKey={e => e.id} columns={columns} dataSource={data} pagination={{
          pageSize: 6
        }}
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            }
          }}
        />
      )
    }
  }


  const showModaltwo = (e) => {  //? 打开遮罩层
    seHandle(e)
    setIsModalVisibletwo(true);
  };

  const handleOktwo = (e) => {   //? 点击确定后的回调
    setIsModalVisibletwo(false);
    let newdatas = data.filter(item => {
      return item.id !== e.id
    })
    setdata([...newdatas])
    // axios({
    //   url: `/categories/${e.id}`,
    //   method: 'delete',
    // })
  };

  const handleCanceltwo = () => {  //? 取消后的回调
    setIsModalVisibletwo(false);
  };


  const EditableContext = React.createContext(null);
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };


  return (
    <>
      {axiosViews(data)}
      <Modal
        title="删除"
        visible={isModalVisibletwo}
        onOk={() => handleOktwo(handle)}
        onCancel={handleCanceltwo}
      >
        <p>你确定要删除吗？</p>
      </Modal>
    </>
  )
}
)

