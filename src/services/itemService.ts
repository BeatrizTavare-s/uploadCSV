import { Item } from "@/app/components/ListItems";

export class ItemService {

  async get() {
    console.log('env get:  ', process.env.URL_API)
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/item`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return data.items;
  }


  async edit(id:bigint, item: Item) {
    console.log('env edit:  ', process.env.NEXT_PUBLIC_URL_API)
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/item/${id}`, { method: 'PUT', body: JSON.stringify(item) });
    const data = await res.json();
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return data;
  }

  async delete(id: bigint) {
    console.log('env delete:  ', process.env.NEXT_PUBLIC_URL_API)
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/item?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return 
  }
}
