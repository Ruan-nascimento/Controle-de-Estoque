import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartData } from "chart.js";
import { API_URL } from "@/lib/utils";
import { Spinner } from "../spinner";
import { items, saleItems } from "../historicTable/table";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);


export const LastSevenDays = () => {
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/api/historic`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.status}`);
        }

        const salesData: items[] = await response.json();


        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);


        const filteredSales = salesData.filter((sale) => {
          const saleDate = new Date(sale.createdAt);
          return saleDate >= sevenDaysAgo && saleDate <= today;
        });

        const dailyRevenue: { [key: string]: number } = {};
        filteredSales.forEach((sale) => {
          const date = new Date(sale.createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          });
          dailyRevenue[date] = (dailyRevenue[date] || 0) + sale.total;
        });

        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
          return {
            date: dateStr,
            revenue: dailyRevenue[dateStr] || 0,
          };
        }).reverse(); 


        setChartData({
          labels: last7Days.map((d) => d.date),
          datasets: [
            {
              label: "Renda (R$)",
              data: last7Days.map((d) => d.revenue),
              backgroundColor: "#0891b2",
              borderColor: "#164e63",
              borderWidth: 1,
            },
          ],
          
        });
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError("Erro ao carregar os dados da API");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  return (
    <div className="bg-zinc-800 p-4 rounded-md w-[700px]">
      {loading && (
        <Spinner className="absolute right-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}
      {error && !loading && (
        <div className="text-center text-red-500">{error}</div>
      )}
      {!loading && !error && chartData.labels!.length === 0 && (
        <div className="text-center text-gray-500">Nenhum dado disponível</div>
      )}
      {!loading && !error && chartData.labels!.length > 0 && (
        <Bar
          data={chartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Renda (R$)",
                  color: '#ffffff'
                },
                grid: {
                    color: '#ffffff60'
                },
                ticks: {
                    color: '#ffffff'
                }
              },
              x: {
                title: {
                  display: true,
                  text: "Data",
                  color: '#ffffff'
                },
                grid: {
                    color: '#ffffff60'
                },
                ticks: {
                    color: '#ffffff'
                }

              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              title: {
                display: true,
                text: "Renda dos Últimos 7 Dias",
                color: '#ffffff'
              },
            },
          }}
        />
      )}
    </div>
  );
};