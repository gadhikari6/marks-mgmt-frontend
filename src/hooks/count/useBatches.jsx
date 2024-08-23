import axios from "axios"
import { useQuery } from "@tanstack/react-query"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const useBatches = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["batches"],
    queryFn: async () => {
      const response = await axios.get(`${VITE_BACKEND_URL}/public/batch`)
      return response.data
    },
  })

  return { isLoading, error, data }
}
export default useBatches
