import { useEffect, useState } from "react"
import CalendarComponent from "../calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DateFilterModalProps {
    setMouseInModal: (val:boolean) => void
}

export const DateFilterModal = ({setMouseInModal}:DateFilterModalProps) => {

    const [dataInicio, setDataInicio] = useState<Date | undefined>(new Date())
    const [dataFim, setDataFim] = useState<Date | undefined>(new Date())
    const [addFinalDate, setAddFinalDate] = useState<boolean>(false)

    const handleCleanFilter = () => {
        setDataFim(undefined)
        setDataInicio(undefined)
    }

    return(
        <div 
        onMouseEnter={() => setMouseInModal(true)}
        onMouseLeave={() => setMouseInModal(false)}
        id="date-modal" 
        className={`absolute bg-zinc-800 rounded-md top-[23%] flex p-4 border border-cyan-600 ${!addFinalDate && 'translate-x-1/2'}`}>
            

            <div className="flex flex-col items-center justify-between max-w-[350px]">
                <span>{
                    addFinalDate ? 'Selecione a Data de Inicio: ' : 'Selecione a Data: '
                    } </span>

                <CalendarComponent setData={setDataInicio}/>

                {
                    dataInicio && (
                        <span
                            className="flex items-center justify-center rounded-md w-[60%] p-2 bg-zinc-900"
                            >{dataInicio?.toLocaleDateString()}
                        </span>
                    )
                }

            </div>

            {addFinalDate && dataInicio && (
                <div className="flex flex-col items-center justify-between max-w-[350px]">
                    <span>Selecione a Data Final: </span>

                    <CalendarComponent setData={setDataFim}/>

                    <span
                    className="flex items-center justify-center rounded-md w-[60%] p-2 bg-zinc-900"
                    >{dataFim?.toLocaleDateString()}</span>

            
                </div>
            )}

            {
                dataInicio && (
                <div className="flex flex-col gap-2">

                    <div>
                        <span>{addFinalDate ? 'Remover Data Final: ' : 'Adicionar uma Data Final: '}</span>
                        <Checkbox
                        checked={addFinalDate}
                        onCheckedChange={() => setAddFinalDate(!addFinalDate)} 
                        className={cn('border-blue-500', 'focus:ring-2', 'data-[state=checked]:text-white', 'data-[state=checked]:bg-cyan-600')}/>
                    </div>

                    <Button
                    onClick={handleCleanFilter}
                    className="p-3 bg-cyan-600 duration-200 ease-in-out hover:bg-cyan-700/80 cursor-pointer"
                    >
                        Limpar Filtro
                    </Button>
                </div>
                )
            }


        </div>
    )
}