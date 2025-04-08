import { Input } from "@/components/ui/input"
import { Edit } from "lucide-react"
import { ChangeEvent, Dispatch, HTMLAttributes, SetStateAction, useState } from "react"

interface TextInputProps extends HTMLAttributes<HTMLInputElement> {
    func?: (val: any ) => void
    label?: string
    placeholder?: string
    valueInput: string | number 
    disabled: any
}

export const TextInput = ({disabled, func, label, placeholder, valueInput, ...rest}: TextInputProps) => {

    const [onFocus, setOnFocus] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>('')
    const [isEditable, setIsEditable] = useState<boolean>(false)

    const handleChangeInput = (e:ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value)
        if(func) {
            func(value)
        }

    }

    return(
        <div className="w-full relative flex flex-col gap-2">
            <label htmlFor="input" className={`${onFocus ? 'text-cyan-600' : 'text-zinc-200'} text-md font-semibold`}>{label ? label : 'Label'}</label>
            <Input
            {...rest}
            value={inputValue === '' && !isEditable ? valueInput : inputValue}
            disabled={disabled}
            onFocus={e => setOnFocus(true)}
            onBlur={e => setOnFocus(false)}
            onChange={handleChangeInput}
            placeholder={isEditable ? placeholder : 'Bloqueado'}
            id="input"
            />

            <span
            onClick={() => setIsEditable(!isEditable)}
            ><Edit className="top-1/2 right-4 duration-200 ease-in-out hover:text-cyan-600 cursor-pointer absolute"/></span>
        </div>
    )
}