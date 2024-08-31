import { useContext } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LoginContext } from "../store/LoginProvider"
import { useLocation } from "react-router-dom"

/**
 * Wrapper Components which requires logged state to render child elements
 */
export default function ProtectedRoute({ children }) {
  const { loginState } = useContext(LoginContext)
  const navigate = useNavigate()

  const location = useLocation() // location
  useEffect(() => {
    sessionStorage.setItem("path", location.pathname) // set the pathname in session storage

    if (!loginState.isLogged) {
      navigate("/")
    }
  }, [loginState])

  return <>{loginState.isLogged && children}</>
}
