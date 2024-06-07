import { useContext } from "react"
import { LoginContext } from "../../store/LoginProvider"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

/**
 * Demo Component
 */
const Demo = () => {
  const { dispatchLoginState } = useContext(LoginContext)

  const handleLogout = () => {
    dispatchLoginState({ type: "LOGOUT" })
    toast.warn("You have been logged out!")
  }

  return (
    <>
      <p>You are logged !!!</p>
      <button onClick={handleLogout}>Click to logout</button>
      <p>
        <Link to="/">Go to login page</Link>
      </p>
    </>
  )
}

export default Demo
