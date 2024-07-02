import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { LoginContext } from "../store/LoginProvider"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const useSyllabus = () => {
  const { loginState } = useContext(LoginContext)
  const token = loginState.token

  const { isLoading, error, data } = useQuery({
    queryKey: ["student-syllabus"],
    queryFn: async () => {
      const response = await axios.get(
        `${VITE_BACKEND_URL}/students/syllabus`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    },
  })

  return { isLoading, error, data }
}
export default useSyllabus
