import { useFormik } from "formik"
import { useState } from "react"
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { toast } from "react-toastify"
import usePrograms from "../../../hooks/count/usePrograms"
import { useContext } from "react"
import { LoginContext } from "../../../store/LoginProvider"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const AddStudentForm = () => {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const { loginState } = useContext(LoginContext)
  const token = loginState.token
  const { data } = usePrograms()
  console.log(data)

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      programId: "",
      syllabusId: "",
      semester: "",
      name: "",
      address: "",
      contactNo: "",
      symbolNo: "",
      puRegNo: "",
    },
    onSubmit: (values) => {
      fetch(`${VITE_BACKEND_URL}/admin/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          setDialogOpen(true) // Open the dialog
          formik.resetForm()
          toast.success("The user has been created successfully")
        })
        .catch((error) => {
          console.error(error)
          toast.error(error)
        })
    },
  })
  const handleDialogClose = () => {
    setDialogOpen(false)
  }
  //detele later
  //Helper function to get the label for Program ID
  // const getProgramLabel = (programId) => {
  //   switch (programId) {
  //     case 1:
  //       return "Computer Engineering"
  //     case 2:
  //       return "Software Engineering"
  //     default:
  //       return ""
  //   }
  // }

  // // Helper function to get the label for Syllabus ID
  // const getSyllabusLabel = (syllabusId) => {
  //   switch (syllabusId) {
  //     case 1:
  //       return "Old Syllabus"
  //     case 2:
  //       return "New Syllabus"
  //     default:
  //       return ""
  //   }
  // }
  const handleSubmit = () => {
    formik.submitForm()
    setDialogOpen(false)
  }

  // TODO: Add fetching academic division from network(hooks) and submission logic
  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add Student
        </Typography>

        {/* <form onSubmit={formik.handleSubmit}> */}
        <form>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Email field */}
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

              {/* Password field */}
              <Grid item xs={6}>
                <TextField
                  id="password"
                  name="password"
                  label="Password *"
                  variant="outlined"
                  type="password"
                  {...formik.getFieldProps("password")}
                  error={formik.touched.password && formik.errors.password}
                  helperText={formik.touched.password && formik.errors.password}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={formik.touched.programId && formik.errors.programId}
                >
                  <InputLabel id="programId-label">Program *</InputLabel>
                  <Select
                    labelId="programId-label"
                    id="programId"
                    name="programId"
                    value={formik.values.programId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Program ID *"
                  >
                    {/* <MenuItem value="">Select a program</MenuItem> */}
                    {/* Loop through programData to generate options */}
                    {data.map((program) => (
                      <MenuItem key={program.id} value={program.id}>
                        {program.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.programId && formik.errors.programId && (
                    <FormHelperText>{formik.errors.programId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Syllabus ID field */}
              <Grid item xs={6}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={formik.touched.syllabusId && formik.errors.syllabusId}
                >
                  <InputLabel id="syllabusId-label">Syllabus ID *</InputLabel>
                  <Select
                    labelId="syllabusId-label"
                    id="syllabusId"
                    name="syllabusId"
                    value={formik.values.syllabusId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Syllabus ID *"
                  >
                    <MenuItem value={1}>Old Syllabus</MenuItem>
                    <MenuItem value={2}>New Syllabus</MenuItem>
                  </Select>
                  {formik.touched.syllabusId && formik.errors.syllabusId && (
                    <FormHelperText>{formik.errors.syllabusId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={formik.touched.syllabusId && formik.errors.syllabusId}
                >
                  <InputLabel id="syllabusId-label">Syllabus ID *</InputLabel>
                  <Select
                    labelId="syllabusId-label"
                    id="syllabusId"
                    name="syllabusId"
                    value={formik.values.syllabusId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Syllabus ID *"
                  >
                    <MenuItem value="">Select a syllabus</MenuItem>
                    {/* Loop through syllabusOptions to generate options */}
                    {data.map((syllabus) => (
                      <MenuItem key={syllabus.Syllabus.id} value={syllabus.id}>
                        {syllabus.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.syllabusId && formik.errors.syllabusId && (
                    <FormHelperText>{formik.errors.syllabusId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Semester field */}
              <Grid item xs={6}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={formik.touched.semester && formik.errors.semester}
                >
                  <InputLabel id="semester-label">Semester *</InputLabel>
                  <Select
                    id="semester"
                    name="semester"
                    labelId="semester-label"
                    value={formik.values.semester}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Semester *"
                  >
                    <MenuItem value={1}>1st Semester</MenuItem>
                    <MenuItem value={2}>2nd Semester</MenuItem>
                    <MenuItem value={3}>3rd Semester</MenuItem>
                    <MenuItem value={4}>4th Semester</MenuItem>
                    <MenuItem value={5}>5th Semester</MenuItem>
                    <MenuItem value={6}>6th Semester</MenuItem>
                    <MenuItem value={7}>7th Semester</MenuItem>
                    <MenuItem value={8}>8th Semester</MenuItem>
                  </Select>
                  {formik.touched.semester && formik.errors.semester && (
                    <FormHelperText>{formik.errors.semester}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Name field */}
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

              {/* Address field */}
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

              {/* Contact Number field */}
              <Grid item xs={6}>
                <TextField
                  id="contactNo"
                  name="contactNo"
                  label="Contact Number *"
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

              {/* Symbol Number field */}
              <Grid item xs={6}>
                <TextField
                  id="symbolNo"
                  name="symbolNo"
                  label="Symbol Number *"
                  variant="outlined"
                  {...formik.getFieldProps("symbolNo")}
                  error={formik.touched.symbolNo && formik.errors.symbolNo}
                  helperText={formik.touched.symbolNo && formik.errors.symbolNo}
                  fullWidth
                  margin="normal"
                />
              </Grid>

              {/* PU Registration Number field */}
              <Grid item xs={6}>
                <TextField
                  id="puRegNo"
                  name="puRegNo"
                  label="PU Registration Number *"
                  variant="outlined"
                  {...formik.getFieldProps("puRegNo")}
                  error={formik.touched.puRegNo && formik.errors.puRegNo}
                  helperText={formik.touched.puRegNo && formik.errors.puRegNo}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Button
              type="button"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => setDialogOpen(true)}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
      {/* Dialog to display filled data */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Entered Data</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Email: {formik.values.email}</Typography>
          {/* <Typography variant="body1">
            Program: {getProgramLabel(formik.values.programId)}
          </Typography>
          <Typography variant="body1">
            Syllabus: {getSyllabusLabel(formik.values.syllabusId)}
          </Typography> */}

          <Typography variant="body1">
            Semester: {formik.values.semester}
          </Typography>
          <Typography variant="body1">Name: {formik.values.name}</Typography>
          <Typography variant="body1">
            Address: {formik.values.address}
          </Typography>
          <Typography variant="body1">
            Contact Number: {formik.values.contactNo}
          </Typography>
          <Typography variant="body1">
            Symbol Number: {formik.values.symbolNo}
          </Typography>
          <Typography variant="body1">
            PU Registration Number: {formik.values.puRegNo}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Edit</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AddStudentForm
