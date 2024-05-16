import { Item } from '@/app/components/ListItems';

export class ItemService {
  async get() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/item`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return data.items;
  }

  async edit(id:bigint, item: Item) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/item?id=${id}`, { method: 'PUT', body: JSON.stringify(item) });
    const data = await res.json();
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return data.item;
  }

  async delete(id: bigint) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/item?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
  }
}
