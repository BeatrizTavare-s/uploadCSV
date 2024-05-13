import csv from 'csv-parser';
import fs from 'fs'
import prisma from '../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
      const formData  = await request.formData()
      const file = formData.get("file") 

      if (!file) {
        return NextResponse.json(
          { error: "File blob is required." },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(`uploads/data.csv`, buffer);

    
       const results = []
       fs.createReadStream('uploads/data.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end',async () => {
            for (const result of results) {
                console.log(result);
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
    
      } catch (err) {
          console.error(err);
          return;
      }


    return Response.json({success: true});
    
}