import axios from "axios"
import { useQuery } from "@tanstack/react-query"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const useAllSyllabus = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["all-syllabus"],
    queryFn: async () => {
      const response = await axios.get(`${VITE_BACKEND_URL}/public/syllabus`)
      return response.data
    },
  })

  return { isLoading, error, data }
}
export default useAllSyllabus
