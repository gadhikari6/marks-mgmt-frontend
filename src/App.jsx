import { useContext } from "react"
import "./App.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { LoginContext } from "./store/LoginProvider"
import { useEffect } from "react"
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
import Profile from "./components/pages/Profile/Profile"
import Marks from "./components/pages/marks/Marks"
import Settings from "./components/pages/settings/Settings"
import Dashboard from "./components/pages/dashboard/Dashboard"
import Syllabus from "./components/pages/Syllabus/Syllabus"
import AddTeacher from "./components/pages/addTeacher/AddTeacherForm"

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

    const response = await fetch(tokenValidationUrl, {
      method: "POST",
      headers: headers,
    }).catch((error) => {
      toast.warn(
        "Your session could not be validated. Please refresh the page."
      )
      console.log(error)
      dispatchLoginState({ type: "LOGOUT_NETWORK_ISSUE" })
      return
    })

    // status code of response
    const status = await response.status

    if (status === 200) {
      const decodedToken = decodeToken(token)
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
    } else if (status >= 400 && status <= 599) {
      toast.warn("Your session has expired!")
      dispatchLoginState({ type: "LOGOUT" })
    }
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
        validateToken(fetchTokenFromLocalStorage())
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
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ResponsiveDrawer>
                  <Dashboard />
                </ResponsiveDrawer>
              </ProtectedRoute>
            }
          />
          <Route
            path="/syllabus"
            element={
              <ProtectedRoute>
                <ResponsiveDrawer>
                  <Syllabus />
                </ResponsiveDrawer>
              </ProtectedRoute>
            }
          />
          <Route
            path="/addTeacher"
            element={
              <ProtectedRoute>
                <ResponsiveDrawer>
                  <AddTeacher />
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
