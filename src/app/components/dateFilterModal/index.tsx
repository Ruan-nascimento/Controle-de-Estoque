'use client';

import { useEffect, useState } from 'react';
import CalendarComponent from '../calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { API_URL, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DateFilterModalProps {
  setMouseInModal: (val: boolean) => void;
  setDateFilterModal: (val: boolean) => void;
  setHasFilter: (val: boolean) => void;
  dataInicio: string | undefined
  setDataInicio: (val:string | undefined) => void
  dataFim: string | undefined
  setDataFim: (val:string | undefined) => void
}

export interface ApiResponse {
  message?: string;
  filter?: {
    id: string;
    start: string;
    end: string;
  };
  error?: string;
  details?: string;
}

export const DateFilterModal = ({
  setHasFilter,
  setMouseInModal,
  setDateFilterModal,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim
}: DateFilterModalProps) => {

  const [addFinalDate, setAddFinalDate] = useState<boolean>(false);

  useEffect(() => {
    const fetchFilter = async () => {
      try {
        const response = await fetch(`${API_URL}/api/filters/historic`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if(response) {
          setHasFilter(true)
        } else {
          setHasFilter(false)
        }

        const data: ApiResponse = await response.json();

        if (response.ok) {

          setDataInicio(data.filter?.start);
          setDataFim(data.filter?.end);
        }
      } catch (error) {
        console.error('Erro ao buscar filtros:', error);
        toast.error('Não foi possível carregar os filtros salvos.');
      }
    };

    fetchFilter();
  }, []);

  const handleCleanFilter = async () => {
    try {
        const deletFilter = await fetch(`${API_URL}/api/filters/historic`, {
            method: 'DELETE',
        })

        if(deletFilter.ok){
            setHasFilter(false);
            setDataInicio(new Date().toLocaleDateString());
            setDataFim(new Date().toLocaleDateString());
            setAddFinalDate(false);
            setDateFilterModal(false);
        }
    } catch {
        throw new Error('Filtro não pode ser deletado')
    }
  };

  const handleAddFilter = async () => {
    try {

      const start = dataInicio?.toString();
      const end = addFinalDate ? dataFim?.toString() : dataInicio?.toString();


      const response = await fetch(`${API_URL}/api/filters/historic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start,
          end,
        }),
      });

      const data: ApiResponse = await response.json();

      if (response.ok) {
        setDateFilterModal(false);
        toast.success('Filtro adicionado com sucesso!');
      } else {
        throw new Error(data.error || 'Erro ao adicionar o filtro');
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Não conseguimos adicionar o filtro';
      console.error('Erro:', errorMessage);
      toast.error(errorMessage);
    }
  };


  return (
    <div
      onMouseEnter={() => setMouseInModal(true)}
      onMouseLeave={() => setMouseInModal(false)}
      id="date-modal"
      className={`absolute bg-zinc-800 rounded-md top-[23%] flex p-4 border border-cyan-600 ${
        !addFinalDate && 'translate-x-1/2'
      }`}
    >
      <div className="flex flex-col items-center justify-between max-w-[350px]">
        <span>{addFinalDate ? 'Selecione a Data de Início: ' : 'Selecione a Data: '}</span>
        <CalendarComponent setData={setDataInicio} kind={0} />
        {dataInicio && (
          <span className="flex items-center justify-center rounded-md w-[60%] p-2 bg-zinc-900">
            {dataInicio}
          </span>
        )}
      </div>

      {addFinalDate && dataInicio && (
        <div className="flex flex-col items-center justify-between max-w-[350px]">
          <span>Selecione a Data Final: </span>
          <CalendarComponent setData={setDataFim} kind={1} />
          {dataFim && (
            <span className="flex items-center justify-center rounded-md w-[60%] p-2 bg-zinc-900">
              {dataFim}
            </span>
          )}
        </div>
      )}

      {dataInicio && (
        <div className="flex flex-col gap-2">
          <div>
            <span>{addFinalDate ? 'Remover Data Final: ' : 'Adicionar uma Data Final: '}</span>
            <Checkbox
              checked={addFinalDate}
              onCheckedChange={() => setAddFinalDate(!addFinalDate)}
              className={cn(
                'border-blue-500',
                'focus:ring-2',
                'data-[state=checked]:text-white',
                'data-[state=checked]:bg-cyan-600'
              )}
            />
          </div>

          <Button
            onClick={handleCleanFilter}
            className="p-3 bg-cyan-600 duration-200 ease-in-out hover:bg-cyan-700/80 cursor-pointer"
          >
            Limpar Filtro
          </Button>

          <Button
            onClick={handleAddFilter}
            className="p-3 bg-cyan-600 duration-200 ease-in-out hover:bg-cyan-700/80 cursor-pointer"
          >
            Adicionar Filtro
          </Button>
        </div>
      )}
    </div>
  );
};