import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const cartFilePath = path.join(process.cwd(), "src/app/services/cartTemp.json");

const readCart = async () => {
  try {
    const fileContent = await fs.readFile(cartFilePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    const initialData = { cart: [] };
    await fs.writeFile(cartFilePath, JSON.stringify(initialData, null, 2));
    return initialData;
  }
};

const writeCart = async (data: { cart: any[] }) => {
  await fs.writeFile(cartFilePath, JSON.stringify(data, null, 2));
};

export async function GET() {
  try {
    const cartData = await readCart();
    return NextResponse.json(cartData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao ler o carrinho" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newItem = await request.json();
    const cartData = await readCart();

    const existingItemIndex = cartData.cart.findIndex(
      (item: any) => item.id === newItem.id
    );

    if (existingItemIndex !== -1) {
      cartData.cart[existingItemIndex].quantity += 1;
    } else {
      cartData.cart.push({ ...newItem, quantity: newItem.quantity || 1 });
    }

    await writeCart(cartData);
    return NextResponse.json(cartData, { status: 201 });
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
    const cartData = await readCart();

    const updatedCart = cartData.cart.map((item: any) =>
      item.id === id ? { ...item, quantity } : item
    );

    await writeCart({ cart: updatedCart });
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
    const cartData = await readCart();

    const updatedCart = cartData.cart.filter((item: any) => item.id !== id);

    await writeCart({ cart: updatedCart });
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
    const { cart } = await request.json();
    await writeCart({ cart }); 
    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar o carrinho" },
      { status: 500 }
    );
  }
}