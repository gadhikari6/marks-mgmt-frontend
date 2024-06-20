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
  symbolNo: yup.string().required("Symbol number is required"),
  PuRegNo: yup.string().required("PU Registration number is required"),
  level: yup.string().required("Level is required"),
})

const AddStudentForm = () => {
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
    symbolNo: "",
    PuRegNo: "",
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

  // TODO: Add fetching academic division from network(hooks) and submission logic
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Paper elevation={2} sx={{ padding: 5, borderRadius: 1, width: "80%" }}>
        <form onSubmit={formik.handleSubmit}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h4" align="center" gutterBottom>
              Add New Student
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
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
              </Grid>

              <Grid item xs={6}>
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
              </Grid>

              <Grid item xs={6}>
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
              </Grid>

              <Grid item xs={6}>
                <TextField
                  id="contactNo"
                  name="contactNo"
                  label="Contact No. *"
                  variant="outlined"
                  {...formik.getFieldProps("contactNo")}
                  error={formik.touched.contactNo && formik.errors.contactNo}
                  helperText={
                    formik.touched.contactNo && formik.errors.contactNo
                  }
                  fullWidth
                  margin="normal"
                />
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="faculty-label">Faculty *</InputLabel>
                  <Select
                    id="faculty"
                    name="faculty"
                    label="Faculty *"
                    {...formik.getFieldProps("faculty")}
                    error={formik.touched.faculty && formik.errors.faculty}
                  >
                    <MenuItem value="Faculty of Science and Technology">
                      Faculty of Science and Technology
                    </MenuItem>
                    <MenuItem value="Faculty of Management">
                      Faculty of Management
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="department-label">Department *</InputLabel>
                  <Select
                    id="department"
                    name="department"
                    label="Department *"
                    {...formik.getFieldProps("department")}
                    error={
                      formik.touched.department && formik.errors.department
                    }
                  >
                    <MenuItem value="Department of Computer and Software Engineering">
                      Department of Computer and Software Engineering
                    </MenuItem>
                    <MenuItem value="Department of Civil Engineering">
                      Department of Civil Engineering
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="level-label">Level *</InputLabel>
                  <Select
                    id="level"
                    name="level"
                    label="Level *"
                    {...formik.getFieldProps("level")}
                    error={formik.touched.level && formik.errors.level}
                  >
                    <MenuItem value="Bachelor">Bachelor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="program-label">Program *</InputLabel>
                  <Select
                    id="program"
                    name="program"
                    label="Program *"
                    {...formik.getFieldProps("program")}
                    error={formik.touched.program && formik.errors.program}
                  >
                    <MenuItem value="Computer Engineering">
                      Computer Engineering
                    </MenuItem>
                    <MenuItem value="Software Engineering">
                      Software Engineering
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="semester-label">Semester *</InputLabel>
                  <Select
                    id="semester"
                    name="semester"
                    label="Semester *"
                    {...formik.getFieldProps("semester")}
                    error={formik.touched.semester && formik.errors.semester}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                    <MenuItem value="5">5</MenuItem>
                    <MenuItem value="6">6</MenuItem>
                    <MenuItem value="7">7</MenuItem>
                    <MenuItem value="8">8</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="syllabus-label">Syllabus *</InputLabel>
                  <Select
                    id="syllabus"
                    name="syllabus"
                    label="Syllabus *"
                    {...formik.getFieldProps("syllabus")}
                    error={formik.touched.syllabus && formik.errors.syllabus}
                  >
                    <MenuItem value="Computer old syllabus">
                      Computer old syllabus
                    </MenuItem>
                    <MenuItem value="Computer new syllabus">
                      Computer new syllabus
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  id="PuRegNo"
                  name="PuRegNo"
                  label="PU Regd No. *"
                  variant="outlined"
                  {...formik.getFieldProps("PuRegNo")}
                  error={formik.touched.PuRegNo && formik.errors.PuRegNo}
                  helperText={formik.touched.PuRegNo && formik.errors.PuRegNo}
                  fullWidth
                  margin="normal"
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  id="symbolNo"
                  name="symbolNo"
                  label="Symbol No. *"
                  variant="outlined"
                  {...formik.getFieldProps("symbolNo")}
                  error={formik.touched.symbolNo && formik.errors.symbolNo}
                  helperText={formik.touched.symbolNo && formik.errors.symbolNo}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ marginTop: 2 }}
            >
              Add Student
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}

export default AddStudentForm
