import { useState } from "react"
import { HistoricTable } from "../../historicTable"
import { DateFilterModal } from "../../dateFilterModal"

export const HistoricPage = () => {

    const [dateFilterModal, setDateFilterModal] = useState<boolean>(false)
    const [mouseInModal, setMouseInModal] = useState<boolean>(false)
    const [hasFilter, setHasFilter] = useState<boolean>(false)
    const [dataInicio, setDataInicio] = useState<string | undefined>(undefined);
    const [dataFim, setDataFim] = useState<string | undefined>(undefined);

    const handleCloseDateFilterModal = () => {
        if(dateFilterModal && !mouseInModal) {
            setDateFilterModal(false)
        }
    }

    return(

    <section 
    onClick={handleCloseDateFilterModal}
    className="w-full h-full relative">
        <HistoricTable dataFim={dataFim} dataInicio={dataInicio} setDateFilterModal={setDateFilterModal} dateFilter={dateFilterModal} hasFilter={hasFilter}/>

        {dateFilterModal && <DateFilterModal dataFim={dataFim} dataInicio={dataInicio} setDataFim={setDataFim} setDataInicio={setDataInicio} setMouseInModal={setMouseInModal} setDateFilterModal={setDateFilterModal} setHasFilter={setHasFilter}/>}
    </section>
    )
}