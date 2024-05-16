import React from 'react';
import { ItemService } from '@/services/itemService';
import {
  Divider, Flex, Tag,
} from 'antd';
import ListItems from './components/ListItems';

async function Page() {
  const itemService = new ItemService();
  const items = await itemService.get();

  return (
    <>
      <Flex justify="space-evenly" align="center">
        <h1>
          Upload Arquivos
          <Tag color="green">.CSV</Tag>
        </h1>
      </Flex>
      <Divider />
      <ListItems items={items} />
    </>
  );
}

export default Page;
