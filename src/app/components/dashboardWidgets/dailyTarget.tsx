import { API_URL } from "@/lib/utils";
import { CheckCheckIcon, Edit2Icon } from "lucide-react";
import { ChangeEvent, useState, useEffect } from "react";
import { Spinner } from "../spinner";
import { useDashboard } from "@/lib/contexts/dashboardContext";

export const DailyTarget = () => {
  const [value, setValue] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        setLoading(true)
        const meta = await fetch(`${API_URL}/api/stats`, {
          method: "GET",
          credentials: "include",
        });

        if (!meta.ok) {
          console.log("Erro ao achar arquivo");
          return;
        }

        const data = await meta.json();
        if (data.meta) {
          setValue(Number(data.meta).toFixed(2).replace(".", ",")); 
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    };

    fetchMeta();
  }, []); 

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setValue("");
      return;
    }

    if (/^\d+$/.test(inputValue)) {
      setValue(inputValue);
    }
  };

  const handlePressButton = async () => {
    try {
      if (value && !disabled) {
        const formattedValue = Number(value).toFixed(2).replace(".", ",");
        setValue(formattedValue);

        const meta = await fetch(`${API_URL}/api/stats`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            value: Number(value),
          }),
        });

        if (!meta.ok) {
          console.log("algo deu errado ao colocar o item");
        }
      }
      setDisabled(true);
    } catch (erro) {
      console.log(erro);
    }
  };

  return (
    <div className="p-4 bg-zinc-800 rounded-md shadow-2xl max-w-[350px] border-b border-cyan-600">
      <span className="block text-lg font-semibold mb-2 text-white">Meta Diária</span>

      <div className="flex items-center relative rounded-md">
        <button
          onClick={handlePressButton}
          className={`p-2 bg-green-600 rounded-md border-b shadow-xl absolute z-10 top-1/2 -translate-y-1/2 right-14 ease-in-out duration-200 hover:bg-green-600/80 cursor-pointer ${
            disabled ? "hidden" : "flex"
          }`}
        >
          <CheckCheckIcon />
        </button>
        <button
          onClick={() => setValue("")}
          className={`p-2 bg-zinc-600 w-10 font-extrabold rounded-md border-b border-cyan-600 shadow-xl absolute z-10 top-1/2 -translate-y-1/2 right-2 ease-in-out duration-200 hover:bg-zinc-600/80 cursor-pointer ${
            disabled ? "hidden" : "flex justify-center items-center"
          }`}
        >
          X
        </button>

        <button
          onClick={() => setDisabled(false)}
          className={`p-2 bg-zinc-600 rounded-md border-b border-cyan-600 shadow-xl absolute z-10 top-1/2 -translate-y-1/2 right-2 ease-in-out duration-200 hover:bg-zinc-600/80 cursor-pointer ${
            disabled ? "flex" : "hidden"
          }`}
        >
          <Edit2Icon />
        </button>

        {loading && <Spinner className="absolute left-1/2"/>}

        <span className="absolute left-2 top-1/2 -translate-y-1/2 font-bold text-white text-3xl">
          R$
        </span>
        <input
          autoFocus={!disabled} 
          value={value}
          onChange={handleChangeInput}
          disabled={disabled}
          type="text"
          className="w-full p-4 pl-14 pr-16 text-3xl outline-none border-b border-cyan-600 rounded-md text-white bg-zinc-700 disabled:bg-zinc-900 placeholder:text-xl"
        />
      </div>
    </div>
  );
};