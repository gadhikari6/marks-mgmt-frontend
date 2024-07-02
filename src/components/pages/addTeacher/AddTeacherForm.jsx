import { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  DialogActions,
  Stack,
} from "@mui/material"
import { toast } from "react-toastify"
import axios from "axios"
import { useContext } from "react"
import { LoginContext } from "../../../store/LoginProvider"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  address: yup.string().required("Address is required"),
  contactNo: yup.string().min(6).max(20).required("Contact number is required"),
  password: yup
    .string()
    .min(5, "The minimum length of Password is 5 characters")
    .required("Password field is required"),
})

const AddTeacherForm = () => {
  const initialValues = {
    name: "",
    email: "",
    address: "",
    contactNo: "",
    password: "",
  }
  const { loginState } = useContext(LoginContext)
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  // dialog close
  const closeDialog = () => {
    setOpenDialog(false)
  }

  const onSubmit = (values) => {
    setOpenDialog(true)
  }

  // api call to create teacher
  const createTeacher = async () => {
    setLoading(true)
    const contactNo = Number(formik.values.contactNo)
    if (isNaN(contactNo)) {
      toast.warn("Please provide a valid contact number")
      setLoading(false)
      setOpenDialog(false)

      return
    }

    // network call to create teacher

    await axios
      .post(
        `${VITE_BACKEND_URL}/admin/teachers`,
        {
          ...formik.values,
          contactNo: String(contactNo),
        },
        { headers: { Authorization: `Bearer ${loginState.token}` } }
      )
      .then((response) => {
        if (response.status === 201) {
          toast.success("Techer created successfully!")
          formik.resetForm()
        }
      })
      .catch((err) => {
        if (err.response.status === 409) {
          toast.warn("A teacher with provided already exists!")
        } else {
          toast.warn("Something wrong went with request")
          console.log(err) // remove later
        }
      })

    setLoading(false)
    setOpenDialog(false)
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  return (
    <Box
      display="flex"
      flexDirection="column"
      // justifyContent="flex-start"
      // alignItems="flex-start"
      fontFamily={{
        fontFamily: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(","),
      }}
      sx={{ padding: 2 }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField
            id="name"
            name="name"
            label="Name *"
            variant="outlined"
            {...formik.getFieldProps("name")}
            error={formik.touched.name && formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
            fullWidth
            margin="normal"
          />

          <TextField
            id="email"
            name="email"
            label="Email *"
            variant="outlined"
            {...formik.getFieldProps("email")}
            error={formik.touched.email && formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
            fullWidth
            margin="normal"
          />
          <TextField
            id="password"
            name="password"
            label="Password *"
            type="password"
            variant="outlined"
            {...formik.getFieldProps("password")}
            error={formik.touched.password && formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
            margin="normal"
          />

          <TextField
            id="address"
            name="address"
            label="Address *"
            variant="outlined"
            {...formik.getFieldProps("address")}
            error={formik.touched.address && formik.errors.address}
            helperText={formik.touched.address && formik.errors.address}
            fullWidth
            margin="normal"
          />

          <TextField
            id="contactNo"
            name="contactNo"
            label="Contact No. *"
            variant="outlined"
            {...formik.getFieldProps("contactNo")}
            error={formik.touched.contactNo && formik.errors.contactNo}
            helperText={formik.touched.contactNo && formik.errors.contactNo}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            {loading ? "Adding Teacher..." : "Add Teacher"}
          </Button>
        </Box>
      </form>
      {/* Dialog to display filled data */}
      <Dialog open={openDialog} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Entered Data</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack gap={2} sx={{ padding: 1 }}>
            {Object.entries(formik.values).map((value) => {
              return (
                <Typography key={value[0]} variant="body1">
                  {value[0]}: {value[1]}
                </Typography>
              )
            })}
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false)
            }}
            color="primary"
            variant="outlined"
          >
            Edit
          </Button>
          <Button onClick={createTeacher} color="secondary" variant="outlined">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AddTeacherForm
