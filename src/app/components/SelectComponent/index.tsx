import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SelectProps = {
    value: string
    name: string
}

export const SelectComponent = ({item}: {item: SelectProps}) => { 
    return(
        <Select
            value={item.value}
        >
            <SelectTrigger
            id="filter-items"
            className="h-full w-30 bg-zinc-700/50 rounded-md border border-zinc-500/60 outline-0 text-zinc-200 px-2 duration-200 ease-in-out hover:bg-zinc-700/80 focus:border-zinc-200"
            >
            <SelectValue placeholder="Procurar..."  />
            </SelectTrigger>
            <SelectContent className="bg-zinc-700/50 border-gray-300 rounded-md shadow-lg">
                <SelectItem value={item.name}>
                    {item.name}
                </SelectItem>
            </SelectContent>
        </Select>
    )
}