import axios from "axios"
import { useQuery } from "@tanstack/react-query"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const usePrograms = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const response = await axios.get(`${VITE_BACKEND_URL}/public/programs`)
      return response.data
    },
  })

  return { isLoading, error, data }
}
export default usePrograms
