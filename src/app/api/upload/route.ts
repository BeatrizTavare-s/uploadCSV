import csv from 'csv-parser';
import fs from 'fs'
import prisma from '../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { put, list, del  } from "@vercel/blob";
const request = require('request');
interface CsvData {
  code: string;
  description: string;
  quantity: string;
  price: string;
  total_price: string;
}

type FormDataEntryValueArrayBuffer  = {
  arrayBuffer: () => Promise<ArrayBuffer>;
}  

export async function POST(nextRequest: NextRequest) {
      const rootPath = process.cwd();
      const formData  = await nextRequest.formData()
      const file = formData.get("file") as FormDataEntryValueArrayBuffer & globalThis.FormDataEntryValue | null ;

      if (!file) {
        return NextResponse.json(
          { error: "File blob is required." },
          { status: 400 }
        );
      }

      await put('uploads/data.csv', file, { access: 'public' });

      const baixar = (url: string) => {
        return new Promise((resolver) => {
          const results: CsvData[] = [];
          request(url).on('response', (resposta: any) => {
            const stream = resposta.pipe(csv())
            .on('data', (data: CsvData) => results.push(data))
            .on('end',async () => {
                for (const result of results) {
                await prisma.item.create({
                    data: {
                      code: result.code,
                      description: result.description,
                      quantity: Number(result.quantity),
                      price:  Number(result.price),
                      total_price: Number(result.total_price),
                      updated_at: new Date(),
                      created_at: new Date(),
                    }
                  });
              }
            });
            stream.on('finish', resolver);
          });
        });
      };
  

    const response = await list();
    response.blobs.map(async(blob) => {
      await baixar(blob.url);
      await del(blob.url);
    })

    return Response.json({success: true});
    
}
