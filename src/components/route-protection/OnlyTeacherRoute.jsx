import { useContext } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LoginContext } from "../../store/LoginProvider"

/**
 * Route for teacher only
 */
export default function OnlyTeacherRoute({ children }) {
  const { loginState } = useContext(LoginContext)
  const navigate = useNavigate()

  useEffect(() => {
    const role = loginState.roles.currentRole

    if (role === undefined || role === null) {
      return
    }

    if (role !== "teacher") {
      navigate("/")
    }
  }, [loginState.roles.currentRole])

  return <>{children}</>
}
