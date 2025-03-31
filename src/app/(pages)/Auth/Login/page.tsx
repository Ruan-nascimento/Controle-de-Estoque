'use client'

import { Spinner } from "@/app/components/spinner";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [checkingToken, setCheckingToken] = useState<boolean>(true);
    const router = useRouter();

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

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro desconhecido');
            }

            toast.success("Login Realizado Com Sucesso! 🎉");
            router.push(`${API_URL}/`);

        } catch (err: any) {
            toast.error(`Erro: ${err.message}`);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return checkingToken ? <Spinner className="absolute top-1/2 left-1/2"/> :
        (<section className="w-screen h-dvh flex items-center justify-center">
            <form
                onSubmit={onSubmit}
                className="w-[90%] max-w-[450px] bg-zinc-800 shadow rounded-md p-4 flex flex-col gap-4 items-center justify-center"
            >
                <h1 className="font-bold text-2xl">Senha de Acesso</h1>

                <div className="w-full relative">
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite Sua Senha"
                        className="w-full rounded p-2 px-4 border border-transparent bg-zinc-700 mt-6 outline-0 duration-200 ease-in-out hover:bg-zinc-700/80 focus:bg-zinc-700/60 focus:border-zinc-200"
                    />

                    <div
                        className="absolute right-2 top-[25px] flex items-center justify-center cursor-pointer w-10 h-10"
                        onClick={e => {
                            e.preventDefault();
                            setShowPassword(!showPassword);
                        }}
                    >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </div>
                </div>

                {error && <p className="text-red-500">{error}</p>}

                {loading ? <Spinner /> :
                    <Button
                        className="bg-zinc-200 text-zinc-950 w-full duration-200 ease-in-out hover:bg-zinc-200/80 active:bg-zinc-200/60 cursor-pointer"
                        type="submit"
                    >
                        Entrar
                    </Button>
                }
            </form>
        </section>);
}