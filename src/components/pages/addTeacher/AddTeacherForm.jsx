import { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"

//import { toast } from "react-toastify"

const validationSchema = yup.object({
  syllabus: yup.string().required("Syllabus is required"),
  department: yup.string().required("Department is required"),
  name: yup.string().required("Name is required"),
  program: yup.string().required("Program is required"),
  semester: yup.string().required("Semester is required"),
  faculty: yup.string().required("Faculty is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  address: yup.string().required("Address is required"),
  contactNo: yup.string().required("Contact number is required"),
  courses: yup.string().required("Course is required"),
  level: yup.string().required("Level is required"),
})

const AddTeacherForm = () => {
  const initialValues = {
    syllabus: "",
    department: "",
    name: "",
    program: "",
    semester: "",
    faculty: "",
    email: "",
    address: "",
    contactNo: "",
    courses: "",
    level: "",
  }

  const [loading, setLoading] = useState(false)

  const onSubmit = async (values) => {
    // Form submission logic can be added here
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
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        elevation={2}
        sx={{ padding: 5, borderRadius: 1, maxwidth: "100%" }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h4" align="center" gutterBottom>
              Add New Teacher
            </Typography>

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
              Add Teacher
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}

export default AddTeacherForm
