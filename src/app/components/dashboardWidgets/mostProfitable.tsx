import { useEffect, useState } from "react";
import { Spinner } from "../spinner";
import { items } from "../historicTable/table";
import { API_URL } from "@/lib/utils";

export const MostProfitableSale = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<items[]>([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/historic`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const salesData = await response.json();
          setData(salesData);
        } else {
          console.error("Erro ao buscar dados:", response.status);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const maxTotalItem = data
    .filter(d => typeof d.total === 'number' && !isNaN(d.total))
    .reduce((max, item) => (max.total > item.total ? max : item), { total: -Infinity, codeOfSell: "", createdAt: "" });

  const formattedDate = maxTotalItem.createdAt
    ? new Date(maxTotalItem.createdAt).toLocaleDateString("pt-BR")
    : "N/A";
  const formattedTotal = maxTotalItem.total !== -Infinity
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(maxTotalItem.total)
    : "N/A";

  return (
    <div className="bg-zinc-800 p-4 rounded-md w-full flex flex-col items-center shadow-xl relative border-b border-cyan-600">
      <span className="text-lg font-semibold">Venda Mais Lucrativa</span>

      {
        !loading && (
            <div className="w-full rounded-md overflow-clip mt-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="bg-zinc-950 h-10" scope="col">Código</th>
              <th className="bg-zinc-950 h-10" scope="col">Data</th>
              <th className="bg-zinc-950 h-10" scope="col">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center bg-zinc-700 h-10">
                {maxTotalItem.codeOfSell || "N/A"}
              </td>
              <td className="text-center bg-zinc-700 h-10">
                {formattedDate}
              </td>
              <td className="text-center bg-zinc-700 h-10">
                {formattedTotal}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
        )
      }

      {loading && <Spinner className="absolute right-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />}
    </div>
  );
};