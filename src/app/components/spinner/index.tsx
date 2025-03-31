import { twMerge } from "tailwind-merge"

export const Spinner = ({...rest}: {className?:string}) => {
    return (
      <div {...rest} className={twMerge("flex justify-center items-center", rest.className)}>
        <div className="w-6 h-6 border-4 border-zinc-200 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  };