import { Button } from "@/components/ui/button"
import { HTMLAttributes, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface GeneralButtonProps extends HTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    className?: string
    type: "button" | "submit" | "reset"
    disabled: any
}

export const GeneralButton = ({disabled, type, children, ...rest}: GeneralButtonProps) => {
    return(
        <Button
        {...rest}
        disabled={disabled}
        type={type}
        className={twMerge(`bg-cyan-600 text-zinc-200 duration-200 ease-in-out hover:bg-cyan-600/60  hover:text-zinc-200 cursor-pointer`, rest.className)}
        >
            {children}
        </Button>
    )
}