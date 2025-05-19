import { ReactNode, useContext, createContext, useState, useEffect } from "react";
import { API_URL } from "../utils";

// Interface ajustada para meta como string
interface DashboardContextProps {
  meta: string; // Sempre string, já que é formatada como "1500,00"
  loading: boolean;
  setLoading: (val: boolean) => void;
  setMeta: (meta: string) => void; // Função para atualizar a meta
  error: string | null; // Estado para erros
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [meta, setMeta] = useState<string>(""); // Valor inicial seguro
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        setLoading(true);
        setError(null); // Limpar erro anterior
        const response = await fetch(`${API_URL}/api/stats`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar a meta");
        }

        const data = await response.json();
        if (data.meta != null && !isNaN(Number(data.meta))) {
            console.log('Erro')
          setMeta(Number(data.meta).toFixed(2).replace(".", ","));
        } else {
          setMeta("0,00"); // Valor padrão se a meta não for válida
        }
      } catch (error) {
        console.log(error);
        setError("Não foi possível carregar a meta. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeta();
  }, []);

  return (
    <DashboardContext.Provider value={{ meta, loading, setLoading, setMeta, error }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextProps => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard deve ser usado dentro de um DashboardProvider");
  }
  return context;
};