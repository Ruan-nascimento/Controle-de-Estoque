import { useState } from "react"
import { HistoricTable } from "../../historicTable"
import { DateFilterModal } from "../../dateFilterModal"
import { useHistoric } from "@/lib/contexts/historicContext"
import { ModalHistoricDetails } from "../../Modals/ModalHistoricDetails"

export const HistoricPage = () => {

    const [dateFilterModal, setDateFilterModal] = useState<boolean>(false)
    const [mouseInModal, setMouseInModal] = useState<boolean>(false)
    const [hasFilter, setHasFilter] = useState<boolean>(false)
    const [dataInicio, setDataInicio] = useState<string | undefined>(undefined);
    const [dataFim, setDataFim] = useState<string | undefined>(undefined);
    const {modalPrintOpen, setModalPrintOpen} = useHistoric()
    const [mouseInModalHistoric, setMouseInModalHistoric] = useState<boolean>(false)

    const handleCloseDateFilterModal = () => {
        if(dateFilterModal && !mouseInModal) {
            setDateFilterModal(false)
        }
        if (modalPrintOpen && !mouseInModalHistoric) {
            setModalPrintOpen(false)
        }
    }

    return(
    <section 
    onClick={handleCloseDateFilterModal}
    className="w-full h-full relative">
        <HistoricTable dataFim={dataFim} dataInicio={dataInicio} setDateFilterModal={setDateFilterModal} dateFilter={dateFilterModal} hasFilter={hasFilter}/>

        {dateFilterModal && <DateFilterModal dataFim={dataFim} dataInicio={dataInicio} setDataFim={setDataFim} setDataInicio={setDataInicio} setMouseInModal={setMouseInModal} setDateFilterModal={setDateFilterModal} setHasFilter={setHasFilter}/>}

        {modalPrintOpen && <ModalHistoricDetails setMouseInModal={setMouseInModalHistoric}/>}
    </section>
    )
}