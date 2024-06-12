import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useContext } from "react"
import { LoginContext } from "../store/LoginProvider"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const useMarks = (params) => {
  const { loginState } = useContext(LoginContext)
  const token = loginState.token

  const { isLoading, error, data } = useQuery({
    queryKey: ["marks", params], // Include the params in the query key to trigger a re-fetch when the params change
    queryFn: async () => {
      const response = await axios.get(`${VITE_BACKEND_URL}/students/marks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params, // Pass the params object as query parameters in the API call
      })
      return response.data
    },
  })

  return { isLoading, error, data, useMarks }
}

export default useMarks
