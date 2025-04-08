import { useState } from "react"
import axios from "axios"
import { API_URL } from "../utils"

interface ItemData {
  name: string
  type: string
  qtd: number
  value: number
  flavor: string
}

export const useAddItem = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const addItem = async (data: ItemData) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await axios.post(`${API_URL}/api/items`, data)
      setSuccess(true)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar item")
      throw err
    } finally {
      setLoading(false)
    }
  };

  return { addItem, loading, error, success }
};