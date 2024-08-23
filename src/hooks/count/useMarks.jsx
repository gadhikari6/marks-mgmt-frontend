import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { LoginContext } from "../../store/LoginProvider"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const useMarks = (
  batchId = 0,
  yearJoined = 0,
  programId = 0,
  semesterId = 0
) => {
  const batch = batchId <= 0 ? 0 : batchId
  const year = yearJoined <= 0 ? 0 : yearJoined
  const program = programId <= 0 ? 0 : programId
  const semester = semesterId <= 0 ? 0 : semesterId

  // get admin token
  const { loginState } = useContext(LoginContext)

  const { isLoading, error, data } = useQuery({
    queryKey: ["admin-marks"],
    queryFn: async () => {
      const response = await axios.get(
        `${VITE_BACKEND_URL}/admin/marks?year_joined=${year}&program_id=${program}&semester=${semester}&batch_id=${batch}`,
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
export default useMarks
