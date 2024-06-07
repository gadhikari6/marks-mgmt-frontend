import { useContext } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LoginContext } from "../store/LoginProvider"

/**
 * Wrapper Components which requires logged state to render child elements
 */
export default function ProtectedRoute({ children }) {
  const { loginState } = useContext(LoginContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!loginState.isLogged) {
      navigate("/")
    }
  }, [loginState])

  return <>{loginState.isLogged && children}</>
}
