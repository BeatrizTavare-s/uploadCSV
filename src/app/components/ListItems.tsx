'use client';

import React, { useState } from 'react';
import {
  Table, Button, TableColumnsType, Popconfirm, notification,
  Tag,
} from 'antd';
import { QuestionCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { ItemService } from '@/services/itemService';
import { ModalEdit } from './ModalEdit';
import UpdateFile from './UploadFile';
import { currencyBRL } from '../utils/currencyBRL';

export interface Item {
    id: bigint;
    code: string;
    description: string;
    quantity: number ;
    price: number;
    total_price: number;
    created_at: Date;
    updated_at: Date;
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
      openNotificationEditSave('success');
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
      {
        title: 'Código', dataIndex: 'code', key: 'code', align: 'center',
      },
      { title: 'Descrição', dataIndex: 'description', key: 'description' },
      {
        title: 'Quantidade', dataIndex: 'quantity', key: 'quantity', align: 'center',
      },
      {
        title: 'Preço',
        dataIndex: 'price',
        key: 'price',
        render: (e, record) => (
          <p>
            {' '}
            {currencyBRL(Number(record.price))}
          </p>
        ),
      },
      {
        title: 'Total',
        dataIndex: 'total_price',
        key: 'total_price',
        render: (e, record) => (
          <p>
            {' '}
            {currencyBRL(Number(record.total_price))}
          </p>
        ),
      },
      {
        title: 'Criado em',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (e, record) => (
          <div style={{ display: 'block' }}>
            <Tag>{new Date(record.created_at).toLocaleDateString()}</Tag>
            <Tag bordered={false}>
              {new Date(record.created_at).toLocaleTimeString()}
            </Tag>
          </div>
        ),
      },
      {
        title: 'Alterado em',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (e, record) => (
          <div>
            <Tag>{new Date(record.updated_at).toLocaleDateString()}</Tag>
            <Tag bordered={false}>
              {new Date(record.updated_at).toLocaleTimeString()}
            </Tag>
          </div>
        ),
      },
      {
        title: 'Edição',
        dataIndex: '',
        key: 'edit',
        render: (e, record) => (
          <a onClick={() => handleRowClick(record)}>Editar </a>
        ),
      },
      {
        title: 'Deletar',
        dataIndex: '',
        key: 'delete',
        render: (e, record) => (
          <Popconfirm
            title="Deletar Item"
            description="Confirmar a exclusão?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDeleteItem(record.id)}
          >
            <Button danger>Deletar</Button>
          </Popconfirm>
        ),
      },
    ];

    const handleCloseModal = () => {
      setModalVisible(false);
    };

    const synchronousTimeout = (milliseconds: number) => new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });

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
        <br />
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={listItems}
          caption={lodding ? (
            <Tag color="processing">
              <LoadingOutlined />
              {' '}
              {'  '}
              Buscando Itens
            </Tag>
          ) : ''}
        />
      </>

    );
};

export default ListItems;
