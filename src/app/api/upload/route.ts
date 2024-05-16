import csv from 'csv-parser';
import { NextRequest, NextResponse } from 'next/server';
import { put, list, del, ListBlobResult } from '@vercel/blob';
import axios from 'axios';
import { Item } from '@/app/components/ListItems';
import prisma from '../../lib/prisma';

interface CsvData {
  code: string;
  description: string;
  quantity: string;
  price: string;
  total_price: string;
}

type ListItems = Omit<Item, 'id'>;

function getListItems(results: CsvData[]) {
  const listItems:ListItems[] = results.map((result) => ({
    code: result.code,
    description: result.description,
    quantity: Number(result.quantity),
    price: Number(result.price),
    total_price: Number(result.total_price),
    updated_at: new Date(),
    created_at: new Date(),
  }));

  return listItems;
}

export async function POST(nextRequest: NextRequest) {
  let listBlobResult: ListBlobResult = {
    blobs: [], 
    hasMore: false, 
  };
  try {
    const formData = await nextRequest.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'File blob is required.' },
        { status: 400 },
      );
    }

    await put('uploads/data.csv', file, { access: 'public' });

    const downloadFile = (url: string) => new Promise((resolver) => {
      const results: CsvData[] = [];
      axios({
        url,
        responseType: 'stream',
      }).then((response: any) => {
        const stream = response.data.pipe(csv())
          .on('data', (data: CsvData) => results.push(data))
          .on('end', async () => {
            const listItems = getListItems(results);
            await prisma.item.createMany({
              data: listItems,
            });
          });
        stream.on('finish', resolver);
      });
    });

    listBlobResult = await list();
    await Promise.all(listBlobResult.blobs.map(async (blob) => {
        await downloadFile(blob.url);
    }));

    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }finally{
    const listBlobToDelete = listBlobResult.blobs.map((blob) => blob.url)
    await del(listBlobToDelete);
  }
}
