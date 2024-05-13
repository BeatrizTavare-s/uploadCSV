
import prisma from '../../lib/prisma'
import toObject from '../../utils/toObject'
import { NextRequest } from 'next/server';


async function getItemById(id:string){
    const item = await prisma.item.findUnique({
        where:{
            id: Number(id)
        },
        select:{
            id: true,
            code: true,
            description: true,
            quantity: true,
            price: true,
            total_price: true,
        }
    });

    return item
}

export async function GET(request: NextRequest){
    const id =  request.nextUrl.searchParams.get('id');
    let itemById = []
    if(id) {
        itemById = await getItemById(id as string)
        return Response.json(toObject(itemById))
    }

    
    const items = await prisma.item.findMany({
        select:{
          id: true,
          code: true,
          description: true,
          quantity: true,
          price: true,
          total_price: true,
        }
    });
    
    const itemsFormat = items.map((item)=>toObject(item)) 
    return Response.json({items: itemsFormat})
}


export async function POST(request: Request){
    const item = await request.json();
    await prisma.item.create({data:item});
    return Response.json({
         "success": true,
     })
 }
 
 
 export async function PUT(request: NextRequest){
    const id =  request.nextUrl.searchParams.get('id');
    const item = await request.json();

   const editedItem = await prisma.item.update({
        where:{
            id: Number(id)
        },
        data:{
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            total_price: item.quantity * item.price,
        }
    });
    
    return Response.json(toObject(editedItem))
 }
 

 export async function DELETE(request: NextRequest){
    const id =  request.nextUrl.searchParams.get('id');

     await prisma.item.delete({
        where:{
            id: Number(id)
        }
    }); 
    
    return Response.json({
         "success": true,
     })
 }
