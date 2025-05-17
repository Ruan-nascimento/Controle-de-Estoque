import { useState } from "react"
import { HistoricTable } from "../../historicTable"
import { DateFilterModal } from "../../dateFilterModal"

export const HistoricPage = () => {

    const [dateFilterModal, setDateFilterModal] = useState<boolean>(false)
    const [mouseInModal, setMouseInModal] = useState<boolean>(false)

    const handleCloseDateFilterModal = () => {
        if(dateFilterModal && !mouseInModal) {
            setDateFilterModal(false)
        }
    }

    return(

    <section 
    onClick={handleCloseDateFilterModal}
    className="w-full h-full relative">
        <HistoricTable setDateFilterModal={setDateFilterModal} dateFilter={dateFilterModal}/>

        {dateFilterModal && <DateFilterModal setMouseInModal={setMouseInModal}/>}
    </section>
    )
}