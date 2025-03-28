'use client'


import { API_URL } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {

  const router = useRouter();
  const [checkingToken, setCheckingToken] = useState<boolean>(true);

    useEffect(() => {
        setCheckingToken(true)
        const verifyToken = async () => {
            try {
                const response = await fetch(`${API_URL}/api/verify`, {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    router.push(`${API_URL}/`);
                }
            } catch (err) {
                console.error('Erro ao verificar token:', err);
                toast.error('Nenhum token válido encontrado...');
            } finally {
                setCheckingToken(false);
            }
        };

        verifyToken();
    }, [router]);


  return (

    <section>
      Pagina prinico
    </section>
  );
}
