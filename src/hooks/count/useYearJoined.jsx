import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { LoginContext } from "../../store/LoginProvider"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const useYearJoined = () => {
  // get admin token
  const { loginState } = useContext(LoginContext)

  const { isLoading, error, data } = useQuery({
    queryKey: ["year-joined"],
    queryFn: async () => {
      const response = await axios.get(
        `${VITE_BACKEND_URL}/admin/students/years`,
        {
          headers: {
            Authorization: `Bearer ${loginState.token}`,
          },
        }
      )
      return response.data
    },
  })

  return { isLoading, error, data }
}
export default useYearJoined
