'use client';
import React, {  useState } from 'react';
import {
  Table,  Button, TableColumnsType, Popconfirm, notification,
} from 'antd';
import { QuestionCircleOutlined,LoadingOutlined } from '@ant-design/icons';
import { ModalEdit } from './ModalEdit';
import UpdateFile from './UploadFile';
import { ItemService } from '@/services/itemService';

export interface Item {
    id: bigint;
    code: string;
    description: string;
    quantity: number ;
    price: number;
    total_price: number;
  }


  interface ListItemsProps {
    items: Item[];
  }

  
const ListItems: React.FC<ListItemsProps> = ({ items }) => {
  const [listItems, setListItems] = useState<Item[]>(items);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [lodding, setLodding] = useState(false);

  const itemService = new ItemService();

  const handleRowClick = (item:Item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleSavEdit = async (editedItem: Item) => {
    if (editedItem) {
      const itemEdited = await itemService.edit(editedItem?.id, editedItem);
      setListItems(listItems.map((item) => (itemEdited.id === item.id ? itemEdited : item)));
      openNotificationEditSave('success')
    }
  };

  const handleDeleteItem = async (id: bigint) => {
    if (id) {
      await itemService.delete(id);
      setListItems(listItems.filter((item) => id !== item.id));
      openNotificationWithIcon('success');
    }
  };

  const [api, contextHolder] = notification.useNotification();
    type NotificationType = 'success' | 'info' | 'warning' | 'error';
    const openNotificationWithIcon = (type: NotificationType) => {
      api[type]({
        duration: 1,
        message: 'Item deletado com sucesso',
      });
    };

    const openNotificationEditSave = (type: NotificationType) => {
      api[type]({
        duration: 1,
        message: 'Item editado com sucesso',
      });
    };

    const columns: TableColumnsType<Item> = [
      { title: 'Código', dataIndex: 'code', key: 'code' },
      { title: 'Descrição', dataIndex: 'description', key: 'description' },
      { title: 'Quantidade', dataIndex: 'quantity', key: 'quantity' },
      { title: 'Preço', dataIndex: 'price', key: 'price' },
      { title: 'Total', dataIndex: 'total_price', key: 'total_price' },
      {
        title: 'Edição',
        dataIndex: '',
        key: 'x',
        render: (e, record) => (
          <a onClick={() => handleRowClick(record)}>Editar </a>
        ),
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (e, record) => (
          <Popconfirm
            title="Deletar Item"
            description="Confirma apagar item?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDeleteItem(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        ),
      },
    ];

    const handleCloseModal = () => {
      setModalVisible(false);
    };


    const synchronousTimeout = (milliseconds: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
      });
    };
    

    const handleFechItems = async () => {
      setLodding(true);
      await synchronousTimeout(2000);
      const itensFech = await itemService.get();
      setListItems(itensFech);
      setLodding(false);
    };

return (
      <>
        {contextHolder}

        <UpdateFile onFechItems={handleFechItems} />

        {modalVisible && selectedItem
     && (
     <ModalEdit
       selectedItem={selectedItem}
       visible={modalVisible}
       onCloseModal={handleCloseModal}
       onSaveEdit={handleSavEdit}
     />
     )}
        <Table
          columns={columns}
          dataSource={listItems}
          caption={lodding ? <span><LoadingOutlined  />Buscando Itens</span> : ''}
        />
      </>

    );
};

export default ListItems;
