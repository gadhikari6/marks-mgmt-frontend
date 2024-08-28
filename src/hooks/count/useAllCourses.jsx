import axios from "axios"
import { useQuery } from "@tanstack/react-query"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const useAllCourses = (programId = 0, syllabusId = 0) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      const response = await axios.get(
        `${VITE_BACKEND_URL}/public/courses?program_id=${programId}&syllabus_id=${syllabusId}`
      )
      return response.data
    },
  })

  return { isLoading, error, data }
}
export default useAllCourses
