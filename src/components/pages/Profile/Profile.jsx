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
  Box,
  Divider,
  Grid,
  Stack,
  Container,
  Alert,
  Tabs,
} from "@mui/material"
import useProfile from "../../../hooks/useProfile"
import AdminProfile from "./card/Admin"
import StudentProfile from "./card/Student"
import TeacherProfile from "./card/Teacher"
import EditIcon from "@mui/icons-material/Edit"
import CloseIcon from "@mui/icons-material/Close"
import SaveIcon from "@mui/icons-material/Save"
import { useFormik } from "formik"
import * as yup from "yup"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const Profile = () => {
  const { data, isLoading, error, token } = useProfile()

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const userRoles = data.UserRoles.map((userRole) => userRole.role.name)

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true)
  }

  const handleEditDialogClose = () => {
    setEditDialogOpen(false)
  }

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    address: yup.string().required("Address is required"),
    contactNo: yup.string().required("Contact No is required"),
  })

  const formik = useFormik({
    initialValues: {
      name: data.name,
      email: data.email,
      address: data.address,
      contactNo: data.contactNo,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          `${VITE_BACKEND_URL}/profile`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (response.status === 200) {
          toast.success("Profile updated successfully!")
          // Update profile data or perform necessary actions after successful update
        } else {
          toast.error(error.message)
        }
      } catch (error) {
        console.error(error)
      }
      handleEditDialogClose()
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const { name, address, contactNo, email, activated, UserRoles } = data

  return (
    <>
      <Container maxWidth>
        <Stack spacing={3}>
          <Typography variant="h4">Profile</Typography>

          <Box>
            <Card>
              <CardContent>
                <Box>
                  <Typography
                    variant="body1"
                    margin={1}
                    color="text.secondary"
                    gutterBottom
                  >
                    <strong style={{ marginRight: "200px" }}>Name</strong>
                    {name}
                  </Typography>
                  <Divider />
                  <Typography
                    variant="body1"
                    margin={1}
                    color="text.secondary"
                    gutterBottom
                  >
                    <strong style={{ marginRight: "180px" }}>Address</strong>
                    {address}
                  </Typography>
                  <Divider />
                  <Typography
                    variant="body1"
                    margin={1}
                    color="text.secondary"
                    gutterBottom
                  >
                    <strong style={{ marginRight: "200px" }}>Email</strong>
                    {email}
                  </Typography>
                  <Divider />
                  <Typography
                    variant="body1"
                    margin={1}
                    color="text.secondary"
                    gutterBottom
                  >
                    <strong style={{ marginRight: "118px" }}>
                      Contact Number
                    </strong>
                    {contactNo}
                  </Typography>
                  <Divider />
                  <Box style={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="body1"
                      margin={1}
                      color="text.secondary"
                      gutterBottom
                    >
                      <strong style={{ marginRight: "185px" }}>Roles</strong>
                    </Typography>
                    <Tabs>
                      {userRoles.map((roleName) => (
                        <Button key={roleName}>{roleName}</Button>
                      ))}
                    </Tabs>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between" margin={1}>
                    <Typography style={{ display: "inline-block" }}>
                      <Alert>{activated ? "Active" : "Inactive"}</Alert>
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleEditDialogOpen}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Grid>
              <Card sx={{ margin: "10px", padding: "20px" }}>
                {UserRoles.map((role) => {
                  return (
                    <Box
                      key={role.roleId}
                      display="flex"
                      flexDirection="column"
                      fontFamily={{
                        fontFamily: [
                          "-apple-system",
                          "BlinkMacSystemFont",
                          '"Segoe UI"',
                          "Roboto",
                          '"Helvetica Neue"',
                          "Arial",
                          "sans-serif",
                          "Apple Color Emoji",
                          "Segoe UI Emoji",
                          "Segoe UI Symbol",
                        ].join(","),
                      }}
                    >
                      {role.role.name === "admin" && (
                        <AdminProfile data={data} />
                      )}
                      {role.role.name === "student" && (
                        <StudentProfile data={data} />
                      )}
                      {role.role.name === "teacher" && (
                        <TeacherProfile data={data} />
                      )}
                    </Box>
                  )
                })}
              </Card>
            </Grid>
          </Box>
        </Stack>
      </Container>

      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <Divider />
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              id="name"
              name="name"
              label="Name"
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              id="email"
              name="email"
              label="Email"
              fullWidth
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
            />
            <TextField
              id="address"
              name="address"
              label="Address"
              fullWidth
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && formik.errors.address}
              helperText={formik.touched.address && formik.errors.address}
              margin="normal"
            />
            <TextField
              id="contactNo"
              name="contactNo"
              label="Contact No"
              fullWidth
              value={formik.values.contactNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.contactNo && formik.errors.contactNo}
              helperText={formik.touched.contactNo && formik.errors.contactNo}
              margin="normal"
            />
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
            <Button
              onClick={handleEditDialogClose}
              variant="contained"
              color="secondary"
              startIcon={<CloseIcon />}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default Profile
