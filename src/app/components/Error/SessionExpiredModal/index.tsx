'use client';

import { API_URL } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SessionExpiredModalProps {
  isOpen: boolean
}

export default function SessionExpiredModal({ isOpen }: SessionExpiredModalProps) {
  const router = useRouter()


  const handleLoginRedirect = () => {
    router.push(`${API_URL}/Auth/Login`)
  }


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-zinc-800 text-zinc-200 rounded-lg shadow-lg p-6 w-full max-w-md mx-4">

        <div className="flex items-center justify-center mb-4">
          <span className="text-red-500 text-4xl mr-2">⚠️</span>
          <h2 className="text-xl font-bold text-zinc-100">Sessão Expirada</h2>
        </div>


        <p className="text-zinc-200 text-center mb-6">
          ⏰ Sua sessão expirou. Por favor, faça login novamente para continuar.
        </p>

        <button
          onClick={handleLoginRedirect}
          className="w-full bg-zinc-200 text-zinc-900 py-2 px-4 rounded-md hover:bg-zinc-300 cursor-pointer transition-colors flex items-center justify-center"
        >
          <span className="mr-2">🔑</span>
          Fazer Login
        </button>
      </div>
    </div>
  );
}