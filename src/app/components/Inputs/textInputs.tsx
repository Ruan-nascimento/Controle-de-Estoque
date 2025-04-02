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
        <div className="w-full relative">
            <label htmlFor="input" className={`${onFocus ? 'text-cyan-600' : 'text-zinc-200'} text-md font-semibold`}>{label ? label : 'Label'}</label>
            <input
            {...rest}
            value={inputValue === '' && !isEditable ? valueInput : inputValue}
            disabled={disabled}
            onFocus={e => setOnFocus(true)}
            onBlur={e => setOnFocus(false)}
            onChange={handleChangeInput}
            placeholder={isEditable ? placeholder : 'Bloqueado'}
            id="input"
            className={`w-full h-10 outline-none pr-12 text-zinc-200 px-4 border-2 rounded-lg 
                ${isEditable ? 'bg-zinc-700/50' : 'bg-zinc-900/50 border-zinc-200/30'}`}
            />

            <span
            onClick={() => setIsEditable(!isEditable)}
            ><Edit className="top-1/2 right-4 duration-200 ease-in-out hover:text-cyan-600 cursor-pointer absolute"/></span>
        </div>
    )
}