import { prisma } from "@/lib/utils";
import { NextResponse } from "next/server";

const getStatusFromQuantity = (qtd: number): string => {
  if (qtd === 0) return "Em Falta";
  if (qtd < 10) return "Pouco";
  if (qtd <= 25) return "Suficiente";
  return "Completo";
};

export async function POST() {
  try {
    // Busca os itens do carrinho global no banco de dados
    const cartItems = await prisma.cartItem.findMany();

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
          where: { id: cartItem.itemId },
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

        const status = getStatusFromQuantity(newQtd)

        await tx.item.update({
          where: { id: cartItem.itemId },
          data: { qtd: newQtd, status: status },

        });
      }

      // 2. Cria a venda na tabela Sale
      const sale = await tx.sale.create({
        data: {
          codeOfSell: "VEN" + (Math.floor(Math.random() * (10000 - 100 + 1))+100),
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

      // 4. Limpa o carrinho global no banco de dados
      await tx.cartItem.deleteMany();
    });

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