import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { NavProps } from "../layouts/navigationBar"

interface ButtonNavigateBarProps extends React.HTMLAttributes<HTMLButtonElement> {
    children:ReactNode
    className?: string
    typed: NavProps
    current_page: string
}

export const ButtonNavigateBar = ({children, typed, current_page, ...rest}: ButtonNavigateBarProps)=> {
    return(
        <button
        {...rest}
            className={twMerge(`rounded-full p-2 pl-8 mb-4 border-b w-full py-2 cursor-pointer flex justify-baseline text-md ${typed === current_page ? "border-l-4 border-zinc-200 text-zinc-200 bg-zinc-700/50" : "border-0 text-zinc-200/60"} duration-200 ease-in-out hover:bg-zinc-700/50`,rest.className)}
            >
                {children}
            </button>
    )
}