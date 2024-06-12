import { useContext } from "react"
import "./App.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { LoginContext } from "./store/LoginProvider"
import { useEffect } from "react"
import axios from "axios"
import {
  checkTokenExpiry,
  decodeToken,
  fetchTokenFromLocalStorage,
  hasTokenInLocalStorage,
} from "./store/LoginMethods"
import { Routes } from "react-router-dom"
import LoginForm from "./components/pages/Login/LoginForm"
import ProtectedRoute from "./components/ProtectedRoute"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file
const tokenValidationUrl = VITE_BACKEND_URL + "/tokens/validate"
import Demo from "./components/pages/Home/Demo"
import { Link, Route } from "react-router-dom"
import ResponsiveDrawer from "./components/sidebar/ResponsiveDrawer"
import DashboardPage from "./components/pages/dashboard/DashboardPage"
import Profile from "./components/pages/Profile/Profile"
import Marks from "./components/pages/marks/Marks"
import Settings from "./components/pages/settings/Settings"

export default function App() {
  const { loginState, dispatchLoginState } = useContext(LoginContext)

  /**
   * Check if the token is valid and does not expire within the next minute
   * @param {String} token
   * @returns boolean
   */
  async function validateToken(token) {
    const headers = {
      Authorization: `Bearer ${token}`,
    }
    axios
      .post(tokenValidationUrl, null, {
        headers: headers,
      })
      .then((resp) => {
        const decodedToken = decodeToken(token)
        // 200 OK = token is valid
        if (resp.status === 200) {
          // check if expiry time is within next few mins
          // if so then remove it and ask for fresh login
          if (!checkTokenExpiry(decodedToken)) {
            // loop through roles
            const roles = decodedToken.UserRoles.map((item) => {
              return item.role.name
            })
            dispatchLoginState({
              type: "LOGIN",
              payload: {
                token: token,
                roles: {
                  hasMultiRoles: roles.length > 1,
                  allRoles: roles,
                  currentRole: roles[0],
                },
              },
            })
            return
          }
        } else {
          console.log("Unexpected response code: ", resp.status)
          dispatchLoginState({ type: "LOGOUT" })
        }
      })
      .catch((error) => {
        // incase of error, user is logged out but token is kept in localStorage
        // such that when user refreshes the user maybe logged back with the token alone

        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status >= 400 && error.response.status <= 599) {
            toast.warn("Your session has expired!")
            dispatchLoginState({ type: "LOGOUT" })
          } else {
            toast.warn(
              "Your session could not be validated. Please refresh the page."
            )
            dispatchLoginState({ type: "LOGOUT_NETWORK_ISSUE" })
          }
        } else {
          toast.warn(
            "Your session could not be validated. Please refresh the page."
          )
          dispatchLoginState({ type: "LOGOUT_NETWORK_ISSUE" })
        }
      })
  }

  useEffect(() => {
    // if not logged in and there is a token in local storage
    // check for validity
    if (!loginState.isLogged && hasTokenInLocalStorage()) {
      validateToken(fetchTokenFromLocalStorage())
    }

    // Set up interval to check token validation every 5 minutes
    const intervalId = setInterval(() => {
      if (hasTokenInLocalStorage()) {
        validateToken(fetchTokenFromLocalStorage)
      }
    }, 5 * 60 * 1000) // 5 minutes in milliseconds

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <>
      <Routes>
        <Route path="">
          <Route path="/" index element={<LoginForm />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <ResponsiveDrawer>
                  <Demo />
                </ResponsiveDrawer>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ResponsiveDrawer>
                  <Profile />
                </ResponsiveDrawer>
              </ProtectedRoute>
            }
          />
          <Route
            path="/marks"
            element={
              <ProtectedRoute>
                <ResponsiveDrawer>
                  <Marks />
                </ResponsiveDrawer>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ResponsiveDrawer>
                  <Settings />
                </ResponsiveDrawer>
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <>
                <h3>You are lost!!</h3>
                <Link to="/">Go to login page!</Link>
              </>
            }
          />
        </Route>
      </Routes>

      {/* Global toast element*/}
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}
