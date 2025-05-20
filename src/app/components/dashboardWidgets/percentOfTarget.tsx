import { API_URL } from "@/lib/utils";
import { useEffect, useState } from "react";
import { items } from "../historicTable/table";

export const PercentOfTarget = ({ meta }: { meta: number }) => {
  const [data, setData] = useState<items[]>([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
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
      }
    };

    fetchSales();
  }, []);


  const earnToday = data
    .filter((d) => new Date(d.createdAt).getDate() === new Date().getDate())
    .reduce((acc, item) => acc + (item.total || 0), 0);

  const percent = meta > 0 ? (earnToday * 100) / meta : 0;


  const displayPercent = Math.min(percent, 100);
  const formattedPercent = percent.toFixed(1) + "%";

  return (
    <div
      className="w-full h-8 mt-3 bg-zinc-950 rounded-xl relative"
      role="progressbar"
      aria-valuenow={displayPercent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Porcentagem da Meta Atingida: ${formattedPercent}`}
    >
      <div
        className={`${
          percent < 100 ? "bg-cyan-500" : "bg-green-500"
        } h-8 rounded-xl transition-all duration-300`}
        style={{ width: `${displayPercent}%` }}
      ></div>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-100 text-sm">
        {formattedPercent}
      </span>
    </div>
  );
};