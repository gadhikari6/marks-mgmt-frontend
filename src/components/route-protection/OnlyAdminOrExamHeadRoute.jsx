import { useContext } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LoginContext } from "../../store/LoginProvider"

/**
 * Route for admin or examHead only
 */
export default function OnlyAdminOrExamHeadRoute({ children }) {
  const { loginState } = useContext(LoginContext)
  const navigate = useNavigate()

  useEffect(() => {
    const role = loginState.roles.currentRole

    if (role === undefined || role === null) {
      return
    }

    if (role !== "admin" && role !== "examHead") {
      navigate("/")
    }
  }, [loginState.roles.currentRole])

  return <>{children}</>
}
