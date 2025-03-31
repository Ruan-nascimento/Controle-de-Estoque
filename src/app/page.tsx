'use client';

import { API_URL } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SessionExpiredModal from "./components/Error/SessionExpiredModal";
import { Spinner } from "./components/spinner";


export default function Home() {
  const router = useRouter();
  const [checkingToken, setCheckingToken] = useState<boolean>(true);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);

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
    <>
      <section className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Página Principal</h1>
      </section>
      <SessionExpiredModal isOpen={sessionExpired} />
    </>
  );
}