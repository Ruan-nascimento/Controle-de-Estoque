'use client';

import { API_URL } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { format, isWithinInterval, parse } from 'date-fns';
import { useEffect, useState } from "react";
import { Spinner } from "../../spinner";
import { useHistoric } from "@/lib/contexts/historicContext";

interface HistoricTableComponentProps {
    founded?: string;
    dataFim?: string;
    dataInicio?: string;
}

interface saleItems {
  id: string;
  name: string;
  flavor: string;
  unitPrice: number;
  quantity: number;
  createdAt: string;
}

export interface items {
    id: string;
    codeOfSell: string;
    total: number;
    createdAt: string;
    items: saleItems[];
}

export const HistoricTableComponent = ({ founded, dataFim, dataInicio }: HistoricTableComponentProps) => {
    const [sell, setSell] = useState<items[]>([]);
    const [itemsFiltered, setItemsFiltered] = useState<items[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const {setModalPrintOpen, setItem} = useHistoric()


    const handleClickItem = (s:items) => {
        setModalPrintOpen(true)
        setItem(s)
    }

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/historic`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    console.log('Erro ao Encontrar Itens');
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error('Resposta da API não é um array');
                }

                setSell(data);
            } catch (error: any) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [dataFim?.toString(), dataInicio?.toString()]);

    useEffect(() => {
        const filtered = sell.filter(s => {
            let matches = true;

            if (founded) {
                const search = founded.toLowerCase();
                matches = matches && 
                    (s.codeOfSell.toLowerCase().includes(search) ||
                    s.total.toString().includes(search));
            }

            if (dataInicio && dataFim) {
                try {

                    const startDate = parse(dataInicio, 'dd/MM/yyyy', new Date());
                    const endDate = parse(dataFim, 'dd/MM/yyyy', new Date());

 
                    const saleDate = new Date(s.createdAt);


                    matches = matches && isWithinInterval(saleDate, {
                        start: startDate,
                        end: endDate,
                    });
                } catch (error) {
                    console.error('Erro ao filtrar por datas:', error);
                    matches = false;
                }
            }

            return matches;
        });

        setItemsFiltered(filtered);
        console.log('Founded:', founded);
        console.log('Items Filtered:', itemsFiltered);
        console.log('All Sales:', sell);
    }, [sell, founded, dataInicio, dataFim]);

    const displaySales = founded || dataInicio || dataFim ? itemsFiltered : sell;

    return (
        <div className={`relative max-h-[500px] overflow-auto custom-scrollbar`}>
            <table className="w-full border-collapse rounded-md shadow-sm">
                <thead className="sticky top-0 z-10">
                    <tr className="bg-zinc-800 text-white">
                        <th className="p-3 text-left text-sm font-semibold border-b border-zinc-700">Código da Venda</th>
                        <th className="p-3 text-left text-sm font-semibold border-b border-zinc-700">Data</th>
                        <th className="p-3 text-left text-sm font-semibold border-b border-zinc-700">Valor Total</th>
                        <th className="p-3 text-left text-sm font-semibold border-b border-zinc-700">Descrição dos Itens</th>
                    </tr>
                </thead>
                {loading ? (
                    <Spinner className="absolute top-20 left-1/2" />
                ) : (
                    <tbody>
                        {displaySales.map(s => (
                            <tr
                                onClick={() => handleClickItem(s)}
                                key={s.id}
                                className="duration-200 ease-in-out hover:bg-zinc-900/80 cursor-pointer"
                            >
                                <td className="p-3 text-cyan-600 border-b border-zinc-200">{s.codeOfSell}</td>
                                <td className="p-3 border-b border-zinc-200">
                                    {format(new Date(s.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                                </td>
                                <td className="p-3 text-green-500 border-b border-zinc-200">
                                    R$ {s.total.toFixed(2).replace('.', ',')}
                                </td>
                                <td className="p-3 border-b border-zinc-200">
                                    {s.items.length > 0 ? 
                                        s.items.slice(0, 2)
                                            .map(item => `${item.name} [${item.quantity}x]`)
                                            .join(', ') + (s.items.length > 2 ? '...' : '')
                                        : 'Nenhum Item'
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>
        </div>
    );
};