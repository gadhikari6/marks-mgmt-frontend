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
 * Check if the roles array has a specific role
 */
export const hasRole = (role, rolesArr) => {
  for (const r of rolesArr) {
    if (r === role) {
      return true
    }
  }
  return false
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
      setToken(action.payload.token)
      return {
        ...state,
        isLogged: true,
        token: action.payload.token,
        decodedToken: decodeToken(action.payload.token),
        roles: action.payload.roles,
      }

    case "LOGOUT":
      sessionStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(TOKEN_KEY)
      return {
        ...state,
        isLogged: false,
        token: null,
        decodedToken: null,
        roles: {
          hasMultiRoles: false,
          currentRole: null,
          allRoles: [],
        },
      }

    case "LOGOUT_NETWORK_ISSUE":
      // this logs out user but does not remove the token.
      return {
        ...state,
        isLogged: false,
        token: null,
        decodedToken: null,
        roles: {
          hasMultiRoles: false,
          currentRole: null,
          allRoles: [],
        },
      }

    case "CHANGE_ROLE":
      if (hasRole(action.payload.role, state.roles.allRoles)) {
        return {
          ...state,
          roles: { ...state.roles, currentRole: action.payload.role },
        }
      }
      return { ...state }

    default:
      return state
  }
}
