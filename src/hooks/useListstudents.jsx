import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { LoginContext } from "../store/LoginProvider"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // Fetching from .env file

const useListStudents = (programId = 0) => {
  const { loginState } = useContext(LoginContext)
  const url =
    programId === 0
      ? `${VITE_BACKEND_URL}/admin/students`
      : `${VITE_BACKEND_URL}/admin/students?program_id=${programId}`

  const { isLoading, error, data } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${loginState.token}`,
        },
      })
      return response.data
    },
  })

  return { isLoading, error, data }
}

export default useListStudents
