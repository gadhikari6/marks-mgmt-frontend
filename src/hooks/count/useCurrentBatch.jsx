import axios from "axios"
import { useQuery } from "@tanstack/react-query"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const useCurrentBatch = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["current-batch"],
    queryFn: async () => {
      const response = await axios.get(
        `${VITE_BACKEND_URL}/public/batch/current`
      )
      return response.data
    },
  })

  return { isLoading, error, data }
}
export default useCurrentBatch
