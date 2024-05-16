import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';
import toObject from '../../utils/toObject';

async function getItemById(id: string) {
  const item = await prisma.item.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      code: true,
      description: true,
      quantity: true,
      price: true,
      total_price: true,
      created_at: true,
      updated_at: true,
    },
  });

  return item;
}

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (id) {
      const itemById = await getItemById(id as string);
      if (itemById) {
        return Response.json(toObject(itemById));
      }

      return Response.json({
        success: false,
        error: 'No record found.',
      }, { status: 404 });
    }

    const items = await prisma.item.findMany({
      select: {
        id: true,
        code: true,
        description: true,
        quantity: true,
        price: true,
        total_price: true,
        created_at: true,
        updated_at: true,
      },
    });

    const itemsFormat = items.map((item) => toObject(item));
    return Response.json({ items: itemsFormat }, { status: 200 });
  } catch (error: any) {
    return Response.json({
      error: error.message,
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const item = await request.json();

    const editedItem = await prisma.item.update({
      where: {
        id: Number(id),
      },
      data: {
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        total_price: item.quantity * item.price,
        updated_at: new Date(),
      },
    });

    return Response.json({ item: toObject(editedItem) }, { status: 201 });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    await prisma.item.delete({
      where: {
        id: Number(id),
      },
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return Response.json({
          error: 'No records found to delete for this id.',
        }, { status: 404 });
      }
    }
    return Response.json({
      error: error.message,
    }, { status: 500 });
  }
}
