import { useContext } from "react"
import { LoginContext } from "../../store/LoginProvider"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import Select from "@mui/material/Select"
import Box from "@mui/material/Box"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import { useState } from "react"
import { useEffect } from "react"
/**
 * Demo Component
 */
const Demo = () => {
  const { loginState, dispatchLoginState } = useContext(LoginContext)

  const [role, setRole] = useState("")

  const handleLogout = () => {
    dispatchLoginState({ type: "LOGOUT" })
    toast.warn("You have been logged out!")
  }

  useEffect(() => {
    setRole(loginState.roles.currentRole)
  }, [loginState])

  const handleRoleChange = (event) => {
    dispatchLoginState({
      type: "CHANGE_ROLE",
      payload: {
        role: event.target.value,
      },
    })
  }

  return (
    <>
      <p>You are logged as {loginState.roles.currentRole} !!!</p>
      {loginState.roles.hasMultiRoles ? (
        <>
          <p>You can select between following roles</p>
          <ol>
            {loginState.roles.allRoles.map((role) => {
              return <li key={role}>{role}</li>
            })}
          </ol>
        </>
      ) : null}
      <div>
        <p>Change role by selecting preferred one.</p>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={role}
          label="Role"
          onChange={handleRoleChange}
        >
          {loginState.roles.allRoles.map((role) => {
            return (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            )
          })}
        </Select>
      </div>
      <button onClick={handleLogout}>Click to logout</button>
      <p>
        <Link to="/">Go to login page</Link>
      </p>
    </>
  )
}

export default Demo
