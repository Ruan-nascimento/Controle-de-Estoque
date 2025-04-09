import { prisma } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cartItems = await prisma.cartItem.findMany();
    return NextResponse.json({ cart: cartItems }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar o carrinho" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newItem = await request.json();

    // Verifica se o item já existe no carrinho
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        itemId: newItem.id,
      },
    });

    if (existingItem) {
      // Se o item já existe, atualiza a quantidade
      const newQuantity = existingItem.quantity + 1;
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });

      const updatedCart = await prisma.cartItem.findMany();
      return NextResponse.json({ cart: updatedCart }, { status: 200 });
    }

    // Adiciona o novo item ao carrinho
    const cartItem = await prisma.cartItem.create({
      data: {
        itemId: newItem.id,
        name: newItem.name,
        flavor: newItem.flavor,
        value: newItem.value,
        quantity: newItem.quantity || 1,
        qtd: newItem.qtd,
        createdAt: new Date(),
      },
    });

    const updatedCart = await prisma.cartItem.findMany();
    return NextResponse.json({ cart: updatedCart }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao adicionar item ao carrinho" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, quantity } = await request.json();

    const updatedItem = await prisma.cartItem.updateMany({
      where: { id },
      data: { quantity },
    });

    if (updatedItem.count === 0) {
      return NextResponse.json(
        { error: "Item não encontrado no carrinho" },
        { status: 404 }
      );
    }

    const updatedCart = await prisma.cartItem.findMany();
    return NextResponse.json({ cart: updatedCart }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar a quantidade do item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    await prisma.cartItem.deleteMany({
      where: { id },
    });

    const updatedCart = await prisma.cartItem.findMany();
    return NextResponse.json({ cart: updatedCart }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao remover item do carrinho" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await prisma.cartItem.deleteMany();

    return NextResponse.json({ cart: [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao esvaziar o carrinho" },
      { status: 500 }
    );
  }
}