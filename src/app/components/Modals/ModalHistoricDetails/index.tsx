"use client";

import { Button } from "@/components/ui/button";
import { useHistoric } from "@/lib/contexts/historicContext";
import { PrinterIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ModalHistoricDetailsProps {
  setMouseInModal: (val: boolean) => void;
}

export const ModalHistoricDetails = ({ setMouseInModal }: ModalHistoricDetailsProps) => {
  const { setModalPrintOpen, item } = useHistoric();

  const getHourToDay = () => {
    if (item?.createdAt) {
      const hour = new Date(item.createdAt).getHours();
      if (hour >= 5 && hour < 12) {
        return "da Manhã";
      } else if (hour >= 12 && hour < 18) {
        return "da Tarde";
      } else {
        return "da Noite";
      }
    }
    return "";
  };

  const generatePDF = () => {
    if (!item) return;

    // Criar um novo documento PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 297], // 80mm de largura, 297mm de altura (A4, ajustável)
    });

    // Configurar fonte
    doc.setFont("Helvetica");

    // Adicionar cabeçalho
    doc.setFontSize(12);
    doc.text("NOTA", 40, 10, { align: "center" });
    doc.setFontSize(8);
    doc.text(`Código da Venda: ${item.codeOfSell}`, 40, 15, { align: "center" });
    doc.text(
      `Data: ${new Date(item.createdAt).toLocaleDateString()} ${new Date(item.createdAt).getHours()}:${new Date(
        item.createdAt
      )
        .getMinutes()
        .toString()
        .padStart(2, "0")} ${getHourToDay()}`,
      40,
      20,
      { align: "center" }
    );

    // Linha divisória
    doc.setLineWidth(0.5);
    doc.line(5, 25, 75, 25);

    // Criar tabela com autoTable
    autoTable(doc, {
      startY: 30,
      head: [["Nome", "Sabor", "Qtd", "Unit.", "Total"]],
      body: item.items.map((item) => [
        item.name.charAt(0).toUpperCase() + item.name.slice(1),
        item.flavor.charAt(0).toUpperCase() + item.flavor.slice(1),
        `${item.quantity} x`,
        `R$ ${item.unitPrice.toFixed(2).replace(".", ",")}`,
        `R$ ${(item.quantity * item.unitPrice).toFixed(2).replace(".", ",")}`,
      ]),
      theme: "grid",
      styles: {
        fontSize: 7,
        cellPadding: 1,
        overflow: "linebreak",
        minCellHeight: 4,
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontSize: 8,
      },
      columnStyles: {
        0: { cellWidth: 15 }, // Nome
        1: { cellWidth: 15 }, // Sabor
        2: { cellWidth: 10 }, // Quantidade
        3: { cellWidth: 15 }, // Preço Unitário
        4: { cellWidth: 15 }, // Preço Total
      },
      margin: { left: 5, right: 5 },
    });

    // Linha divisória final
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.line(5, finalY + 5, 75, finalY + 5);

    // Calcular e adicionar o valor total geral
    const total = item.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    doc.setFontSize(8);
    doc.text(`Total Geral: R$ ${total.toFixed(2).replace(".", ",")}`, 75, finalY + 10, { align: "right" });

    // Salvar o PDF
    doc.save(`nota_${item.codeOfSell}.pdf`);
  };

  return (
    <main
      onMouseEnter={() => setMouseInModal(true)}
      onMouseLeave={() => setMouseInModal(false)}
      className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute w-[50%] min-h-[450px] max-h-[600px] rounded-md bg-zinc-900 border p-3 flex flex-col items-center justify-between z-20"
    >
      <div className="w-full flex flex-col items-center flex-1">
        <div className="relative bg-amber-50 w-full">
          <button
            onClick={() => setModalPrintOpen(false)}
            className="absolute right-0 font-bold bg-zinc-700 p-2 px-4 rounded-lg duration-200 ease-in-out hover:bg-red-700 cursor-pointer active:bg-red-600"
          >
            X
          </button>
        </div>

        <h2 className="font-bold text-2xl">{item?.codeOfSell || "N/A"}</h2>
        <p>
          Recibo do dia <b>{item ? new Date(item.createdAt).toLocaleDateString() : "N/A"}</b> às{" "}
          <b>
            {item
              ? `${new Date(item.createdAt).getHours()}:${new Date(item.createdAt)
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`
              : "N/A"}
          </b>{" "}
          {getHourToDay()}
        </p>

        <span className="w-full border border-dashed mt-4 mb-4"></span>

        <div className="border rounded-md w-full border-zinc-700 flex-1 overflow-hidden">
          <div className="max-h-[400px] overflow-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-zinc-700 z-10">
                <tr className="h-10">
                  <th className="text-center">Nome do Item</th>
                  <th className="text-center">Sabor</th>
                  <th className="text-center">Quantidade</th>
                  <th className="text-center">Preço Unidade</th>
                  <th className="text-center">Preço Total</th>
                </tr>
              </thead>
              <tbody>
                {item ? (
                  item.items.map((item) => (
                    <tr className="h-10" key={item.id}>
                      <TableLine>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</TableLine>
                      <TableLine>{item.flavor.charAt(0).toUpperCase() + item.flavor.slice(1)}</TableLine>
                      <TableLine>{item.quantity} x</TableLine>
                      <TableLine>R$ {item.unitPrice.toFixed(2).replace(".", ",")}</TableLine>
                      <TableLine>R$ {(item.quantity * item.unitPrice).toFixed(2).replace(".", ",")}</TableLine>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center bg-zinc-800 p-4">
                      Nenhum Item Encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-center">
        <Button
          onClick={generatePDF}
          className="w-[30%] bg-zinc-200 text-black ease-in-out duration-200 hover:bg-zinc-300 cursor-pointer active:bg-zinc-400 mt-2"
          aria-label="Imprimir nota fiscal"
        >
          <PrinterIcon />
          Salvar Nota
        </Button>
      </div>
    </main>
  );
};

export const TableLine = ({ children }: { children: ReactNode }) => {
  const [mouseHoverTable, setMouseHoverTable] = useState<boolean>(false);
  return (
    <td
      onMouseEnter={() => setMouseHoverTable(true)}
      onMouseLeave={() => setMouseHoverTable(false)}
      className={`text-center border-b border-zinc-900 ${
        mouseHoverTable ? "duration-200 ease-in-out bg-zinc-700/80" : "bg-zinc-800"
      }`}
    >
      {children}
    </td>
  );
};
