'use client';

import { API_URL } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SessionExpiredModal from "./components/Error/SessionExpiredModal";
import { Spinner } from "./components/spinner";
import { NavigationBar, NavProps } from "./components/layouts/navigationBar";
import { DashboardPage } from "./components/pages/dashboard";
import { StockPage } from "./components/pages/stock";
import { AddNewItemModal } from "./components/Modals/AddNewItemModal";
import { SellPage } from "./components/pages/sell";
import { HistoricPage } from "./components/pages/historic";
import { HistoricProvider } from "@/lib/contexts/historicContext";


export default function Home() {
  const router = useRouter();
  const [checkingToken, setCheckingToken] = useState<boolean>(true);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<NavProps>("sell")
  const [openEditModal, setOpenEditModal] = useState<boolean>(false)
  const [openAddModal, setOpenAddModal] = useState<boolean>(false)
  const [tokenType, setTokenType] = useState<"auth_token" | "user_token" | null>(null)

  useEffect(() => {
    setCheckingToken(true);
    const verifyToken = async () => {
      try {
        const response = await fetch(`${API_URL}/api/verify`, {
          method: "GET",
          credentials: "include",
        });


        if (!response.ok) {
          setSessionExpired(true)
          toast.error("Sessão expirada. Faça login novamente.")
        } else {

          const data = await response.json()
          setTokenType(data.name)

          toast.success("Bem-vindo de volta!");
        }
      } catch (err) {
        console.error("Erro ao verificar token:", err)
        setSessionExpired(true)
        toast.error("Erro ao verificar sessão.")
      } finally {
        setCheckingToken(false)
      }
    };

    verifyToken()
  }, [router]);

  if (checkingToken) {
    return (
      <Spinner className="absolute top-1/2 left-1/2"/>
    );
  }

  return (
    <div className="relative">
      <section className="flex items-center justify-center h-screen">
        <NavigationBar currentPage={currentPage} setCurrentPage={setCurrentPage} tokenType={tokenType}/>
       

        <main className="flex-1 py-4 px-8 h-full">
          {currentPage === 'dashboard' && <DashboardPage/>}
          {currentPage === 'sell' && <SellPage/>}
          {currentPage === 'stock' && <StockPage setOpenEditModal={setOpenEditModal} openAddModal={openAddModal} setOpenAddModal={setOpenAddModal}/>}
          {currentPage === 'historic' && <HistoricProvider><HistoricPage/></HistoricProvider>}
        </main>

      </section>

      <SessionExpiredModal isOpen={sessionExpired} />
      {openAddModal && <AddNewItemModal openAddModal={openAddModal} setOpenAddModal={setOpenAddModal}/>}
    </div>
  );
}