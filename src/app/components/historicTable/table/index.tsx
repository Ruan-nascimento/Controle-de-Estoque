'use client';

import { API_URL } from "@/lib/utils";
import { ptBR, tr } from "date-fns/locale";
import {format, isWithinInterval } from 'date-fns'
import { useEffect, useState } from "react";
import { Spinner } from "../../spinner";

interface HistoricTableComponentProps {
    founded?: string
    dataFim?: string
    dataInicio?: string
}

interface saleItems {
  id: string
  name: string
  flavor: string
  unitPrice: number
  quantity: number   
  createdAt: string
}

interface items {
    id: string
    codeOfSell: string
    total: number
    createdAt: string
    items: saleItems[]
}

export const HistoricTableComponent = ({founded, dataFim, dataInicio}:HistoricTableComponentProps) => {

    const [sell, setSell] = useState<items[]>([])
    const [itemsFiltered, setItemsFiltered] = useState<items[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {

        const fetchItems = async () => {

            try{
                setLoading(true)
                const response = await fetch(`${API_URL}/api/historic`, {
                    method: 'GET',
                    credentials: 'include'
                })

                if(!response.ok) {
                    console.log('Erro ao Encontrar Itens')
                } 

                const data = await response.json()

                if(!Array.isArray(data)) {
                    throw new Error('Resposta da API não é um array')
                }

                setSell(data)

            } catch (error: any) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchItems()
    }, [])


    useEffect(() => {
        const filtered = sell.filter(s => {
            let matches = true

            if (founded) {
                const search = founded.toLowerCase()

                matches = matches && 
                (s.codeOfSell.toLowerCase().includes(search) ||
            s.total.toString().includes(search))
            }

            if (dataInicio && !dataFim){
                try{
                    const saleDate = new Date(s.createdAt)
                    const start = new Date(dataInicio)
                    const end = new Date(dataInicio)
                    matches = matches && isWithinInterval(saleDate, {start, end})
                } catch(error){
                    console.log('Erro ao filtrar por data')
                }
            }

            if (dataInicio && dataFim){
                try{
                    const saleDate = new Date(s.createdAt)
                    const start = new Date(dataInicio)
                    const end = new Date(dataFim)
                    matches = matches && isWithinInterval(saleDate, {start, end})
                } catch(error){
                    console.log('Erro ao filtrar por data')
                }
            }

            return matches
        })

        setItemsFiltered(filtered)
        console.log(founded)
        console.log(itemsFiltered)
        console.log(sell)

    }, [sell, founded, dataInicio, dataFim])


    const displaySales = founded || dataInicio || dataFim ? itemsFiltered : sell

  return (
    <div className="relative">
      <table className="w-full border-collapse rounded-md shadow-sm">
        <thead>
          <tr className="bg-zinc-800 text-white">
            <th className="p-3 text-left text-sm font-semibold border-b border-zinc-700">Código da Venda</th>
            <th className="p-3 text-left text-sm font-semibold border-b border-zinc-700">Data</th>
            <th className="p-3 text-left text-sm font-semibold border-b border-zinc-700">Valor Total</th>
            <th className="p-3 text-left text-sm font-semibold border-b border-zinc-700">Descrição dos Itens</th>
          </tr>
        </thead>
        {
        loading ? <Spinner className="absolute top-20 left-1/2"/>
        :
        <tbody>
                {
                displaySales.map(s => {
                        return(
                            <tr
                                key={s.id}
                                className="duration-200 ease-in-out hover:bg-zinc-900/80 cursor-pointer">
                                <td className="p-3 text-cyan-600 border-b border-zinc-200">{s.codeOfSell}</td>
                                <td className="p-3 border-b border-zinc-200">{format(new Date(s.createdAt), 'dd/MM/yyyy', {locale:ptBR})}</td>
                                <td className="p-3 text-green-500 border-b border-zinc-200">R$ {s.total.toFixed(2).replace('.', ',')}</td>
                                <td className="p-3 border-b border-zinc-200">{
                                s.items.length > 0 ? 
                                s.items.slice(0, 2)
                                .map(item => `${item.name} [${item.quantity}x]`)
                                .join(', ') + (s.items.length > 2 ? '...' : '')
                                :
                                'Nenhum Item'
                                
                                }</td>
                            </tr>
                        )
                    })
                }
        </tbody>
            }
      </table>
    </div>
  );
}