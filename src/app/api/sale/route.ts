import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/utils";

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

export async function POST(request: Request) {
  try {
    const { cartItems } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "O carrinho está vazio. Adicione itens antes de confirmar a venda." },
        { status: 400 }
      );
    }

    // Calcula o valor total da venda
    const totalValue = cartItems.reduce(
      (sum: number, item: any) => sum + item.value * item.quantity,
      0
    );

    // Inicia uma transação para garantir consistência
    await prisma.$transaction(async (tx) => {
      // 1. Atualiza a quantidade (qtd) dos itens em estoque
      for (const cartItem of cartItems) {
        const item = await tx.item.findUnique({
          where: { id: cartItem.id },
        });

        if (!item) {
          throw new Error(`Item ${cartItem.name} não encontrado no estoque.`);
        }

        const newQtd = item.qtd - cartItem.quantity;
        if (newQtd < 0) {
          throw new Error(
            `Estoque insuficiente para ${cartItem.name}. Disponível: ${item.qtd}, Solicitado: ${cartItem.quantity}`
          );
        }

        await tx.item.update({
          where: { id: cartItem.id },
          data: { qtd: newQtd },
        });
      }

      // 2. Cria a venda na tabela Sale
      const sale = await tx.sale.create({
        data: {
          total: totalValue,
          createdAt: new Date(),
        },
      });

      // 3. Cria os registros na tabela SaleItem com os dados completos do item
      await tx.saleItem.createMany({
        data: cartItems.map((cartItem: any) => ({
          saleId: sale.id,
          name: cartItem.name,
          flavor: cartItem.flavor,
          unitPrice: cartItem.value,
          quantity: cartItem.quantity,
          createdAt: new Date(),
        })),
      });
    });

    // 4. Limpa o carrinho (cartTemp.json)
    await writeCart({ cart: [] });

    return NextResponse.json(
      { message: "Venda confirmada com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao confirmar a venda";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}