import React from 'react';
import ListItems from './components/ListItems';
import { ItemService } from '@/services/itemService';

async function Page() {
  const itemService = new ItemService();
  const items = await itemService.get();

  return (
    <ListItems items={items} />
  );
}

export default Page;
