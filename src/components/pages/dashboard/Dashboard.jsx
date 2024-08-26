import { useContext } from "react"
import { LoginContext } from "../../../store/LoginProvider"
import AdminDashboard from "./AdminDashboard"
import StudentDashboard from "./StudentDashboard"

// TODO: add skeleton for dashboard

export default function Dashboard() {
  const { loginState } = useContext(LoginContext)

  return (
    <>
      {loginState.roles.currentRole === "admin" && <AdminDashboard />}
      {loginState.roles.currentRole === "student" && <StudentDashboard />}
    </>
  )
}
