// hooks for fetching courses taught by a teacher
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { LoginContext } from "../store/LoginProvider"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const useTeacherCourses = () => {
  const { loginState } = useContext(LoginContext)

  const { isLoading, error, data } = useQuery({
    queryKey: ["teacher-courses"],
    queryFn: async () => {
      const response = await axios.get(`${VITE_BACKEND_URL}/teachers/courses`, {
        headers: {
          Authorization: `Bearer ${loginState.token}`,
        },
      })
      return response.data
    },
  })

  return { isLoading, error, data }
}
export default useTeacherCourses
