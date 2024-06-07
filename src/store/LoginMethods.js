import jwtDecode from "jwt-decode"
const TOKEN_KEY = "token"

/**
 * Checks if there is a token in session storage
 * @returns
 */
export const hasTokenInSession = () => {
  return sessionStorage.getItem(TOKEN_KEY) !== null
}

/**
 * Fetch token form session storage
 * @returns token string if present or null
 */
export const fetchTokenFromSession = () => {
  return sessionStorage.getItem(TOKEN_KEY)
}

/**
 * Checks if there is a token in local storage
 * @returns
 */
export const hasTokenInLocalStorage = () => {
  return localStorage.getItem(TOKEN_KEY) !== null
}

/**
 * Fetch token form session storage
 * @returns token string if present or null
 */
export const fetchTokenFromLocalStorage = () => {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Sets token in sessionStorage and localStorage at once
 * @param {String} token
 */
export const setToken = (token) => {
  sessionStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * Decodes a jwt token
 * @param {String} token
 * @returns decoded token
 */
export const decodeToken = (token) => {
  return jwtDecode(token)
}

/**
 * Checks the expiry  of token
 * @param {String} decodedToken
 * @returns null if no expired key found, true or false for token expiry
 */
export const checkTokenExpiry = (decodedToken) => {
  if (!decodedToken.exp) {
    return null
  }
  const expDate = new Date(decodedToken.exp * 1000) // Multiply by 1000 to convert seconds to milliseconds
  const now = new Date()
  // check if the token will expire in next minute
  return expDate < new Date(now.getTime() + 1 * 60000)
}

// reducer for login
export const LoginReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      // TODO: add logic for setting roles , working role, multiRole
      setToken(action.payload.token)
      return {
        ...state,
        isLogged: true,
        token: action.payload.token,
        decodedToken: decodeToken(action.payload.token),
      }

    case "LOGOUT":
      // add snackbar for saying that user session has expired or smth similar
      sessionStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(TOKEN_KEY)
      return {
        ...state,
        isLogged: false,
        token: null,
        decodedToken: null,
      }
    default:
      return state
  }
}
