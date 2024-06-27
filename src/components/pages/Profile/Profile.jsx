import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material"
import useProfile from "../../../hooks/useProfile"
import AdminProfile from "./card/Admin"
import StudentProfile from "./card/Student"
import TeacherProfile from "./card/Teacher"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const Profile = () => {
  const { data, isLoading, error, token } = useProfile()

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editedData, setEditedData] = useState({
    name: "",
    address: "",
    contactNo: "",
    email: "",
  })

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true)
  }

  const handleEditDialogClose = () => {
    setEditDialogOpen(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${VITE_BACKEND_URL}/profile`,
        editedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.status === 200) {
        toast.success("Profile updated successfully!")
        useProfile
      } else {
        toast.error(error.message)
      }
    } catch (error) {
      console.error(error)
    }
    handleEditDialogClose()
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const { name, address, contactNo, email, UserRoles } = data

  return (
    <Card>
      <CardContent>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <Typography variant="body1">Name: {name}</Typography>
            <Typography variant="body1">Email: {email}</Typography>
            <Typography variant="body1">Address: {address}</Typography>
            <Typography variant="body1">Contact No: {contactNo}</Typography>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditDialogOpen}
            style={{
              fontSize: "0.9rem",
              margin: "0.5rem",
              padding: "0.5rem 1rem",
            }}
          >
            Edit
          </Button>
        </div>
      </CardContent>

      {UserRoles.map((role) => {
        return (
          <div key={role.userId}>
            <Card variant="outlined" sx={{ marginTop: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Role: {role.role.name}
                </Typography>
                <Typography variant="body1">
                  Description: {role.role.description}
                </Typography>
              </CardContent>
            </Card>
            {/* Render additional role-specific information here */}
            {role.role.name === "admin" && <AdminProfile data={data} />}
            {role.role.name === "student" && <StudentProfile data={data} />}
            {role.role.name === "teacher" && <TeacherProfile data={data} />}
          </div>
        )
      })}

      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={editedData.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={editedData.email}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Address"
            name="address"
            value={editedData.address}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Contact No"
            name="contactNo"
            value={editedData.contactNo}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default Profile
