import { items } from "@/app/components/historicTable/table";
import { createContext, ReactNode, useContext, useState } from "react";

interface HistoricContextProps {
    modalPrintOpen: boolean
    setModalPrintOpen: (val:boolean) => void
    item: items | undefined
    setItem: (val:items) => void
}

const HistoricContext = createContext<HistoricContextProps | undefined>(undefined)

export const HistoricProvider = ({children}: {children:ReactNode}) => {

    const [modalPrintOpen, setModalPrintOpen] = useState<boolean>(false)
    const [item, setItem] = useState<items | undefined>(undefined)

    return(
        <HistoricContext.Provider value={{modalPrintOpen, setModalPrintOpen, item, setItem}}>
            {children}
        </HistoricContext.Provider>
    )
}

export const useHistoric = (): HistoricContextProps => {
  const context = useContext(HistoricContext);
  if (!context) {
    throw new Error("useHistoric deve ser usado dentro de um HistoricProvider");
  }
  return context;
};