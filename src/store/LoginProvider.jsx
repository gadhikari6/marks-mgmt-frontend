/**
 * Context to store login state related information globally.
 */

import { createContext } from "react"
import { LoginReducer } from "./LoginMethods"
import { useReducer } from "react"

const LoginContext = createContext(null)

const initialLoginState = {
  isLogged: false,
  token: null,
  decodedToken: null,
}

const LoginProvider = ({ children }) => {
  const [loginState, dispatchLoginState] = useReducer(
    LoginReducer,
    initialLoginState
  )

  return (
    <LoginContext.Provider value={{ loginState, dispatchLoginState }}>
      {children}
    </LoginContext.Provider>
  )
}

export { LoginContext, LoginProvider }
