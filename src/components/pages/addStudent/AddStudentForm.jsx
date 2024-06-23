import { useFormik } from "formik"
import { useState, useEffect } from "react"
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
  Divider,
} from "@mui/material"
import { toast } from "react-toastify"
import usePrograms from "../../../hooks/count/usePrograms"
import { useContext } from "react"
import { LoginContext } from "../../../store/LoginProvider"
import axios from "axios"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file
import * as yup from "yup"

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  address: yup.string().required("Address is required"),
  contactNo: yup.string().min(6).max(20).required("Contact number is required"),
  symbolNo: yup.string().min(6).max(20).required("Symbol number is required"),
  programId: yup.number().positive().required("Program is required"),
  syllabusId: yup.number().positive().required("Syllabus is required"),
  semester: yup.number().positive().required("Semester is required"),

  puRegNo: yup
    .string()
    .min(6)
    .max(20)
    .required("Registration number is required"),

  password: yup
    .string()
    .min(5, "The minimum length of Password is 5 characters")
    .required("Password field is required"),
})
const AddStudentForm = () => {
  const { data } = usePrograms()

  const [isDialogOpen, setDialogOpen] = useState(false)
  const { loginState } = useContext(LoginContext)
  const token = loginState.token
  const [programs, setPrograms] = useState(null)
  const [selectedProgaram, setSelectedProgram] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setPrograms(data)
  }, [data])

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
    onSubmit: () => {
      setDialogOpen(true)
    },
    validationSchema,
  })
  const createStudent = async () => {
    const contactNo = Number(formik.values.contactNo)
    if (isNaN(contactNo)) {
      toast.warn("Please provide a valid contact number")
      setLoading(false)
      setDialogOpen(false)

      return
    }

    const symbolNo = Number(formik.values.symbolNo)
    if (isNaN(symbolNo)) {
      toast.warn("Please provide a valid symbol number")
      setLoading(false)
      setDialogOpen(false)

      return
    }
    const {
      email,
      password,
      programId,
      syllabusId,
      semester,
      name,
      address,
      puRegNo,
    } = formik.values
    const data = {
      email: email,
      password: password,
      programId: programId,
      syllabusId: syllabusId,
      semester: semester,
      name: name,
      address: address,
      puRegNo: puRegNo,
      contactNo: String(contactNo),
      symbolNo: String(symbolNo),
    }

    await axios
      .post(
        `${VITE_BACKEND_URL}/admin/students`,
        {
          ...data,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        if (response.status === 201) {
          toast.success("Student created successfully!")
          formik.resetForm()
        }
      })
      .catch((err) => {
        if (err.response.status === 409) {
          toast.warn("A Student with provided details already exists!")
        } else {
          toast.warn("Something wrong went with request")
          console.log(err) // see error on console
        }
      })
    setLoading(false)
    setDialogOpen(false)
  }
  const handleDialogClose = () => {
    setDialogOpen(false)
  }
  const handleProgramChange = (event) => {
    const id = event.target.value
    programs.length > 0
      ? setSelectedProgram(programs.filter((item) => id === item.id)[0])
      : setSelectedProgram(null)
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
          style={{ marginBottom: "5px", textAlign: "center" }}
        >
          Add Student Details
        </Typography>
        <Divider
          style={{ marginBottom: "10px", textAlign: "center" }}
        ></Divider>

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
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
                    onChange={(e) => {
                      formik.handleChange(e)
                      handleProgramChange(e)
                    }}
                    onBlur={formik.handleBlur}
                    label="Program ID *"
                  >
                    {/* Loop through programData to generate options */}
                    {programs !== null &&
                      Array.isArray(programs) &&
                      programs.length > 0 &&
                      programs.map((program) => (
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

              <Grid item xs={6}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={formik.touched.syllabusId && formik.errors.syllabusId}
                >
                  <InputLabel id="syllabusId-label">Syllabus *</InputLabel>
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
                    {selectedProgaram !== null &&
                      selectedProgaram.Syllabus.map((syllabus) => (
                        <MenuItem key={syllabus.id} value={syllabus.id}>
                          {syllabus.name}
                        </MenuItem>
                      ))}
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
                    {selectedProgaram !== null &&
                      Array.from(
                        Array(
                          selectedProgaram.ProgramSemesters[0].semesterId
                        ).keys()
                      ).map((index) => (
                        <MenuItem key={index + 1} value={index + 1}>
                          {`${index + 1}${
                            index === 0
                              ? "st"
                              : index === 1
                              ? "nd"
                              : index === 2
                              ? "rd"
                              : "th"
                          } Semester`}
                        </MenuItem>
                      ))}
                  </Select>
                  {formik.touched.semester && formik.errors.semester && (
                    <FormHelperText>{formik.errors.semester}</FormHelperText>
                  )}
                </FormControl>
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
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? "Adding Student..." : "Add Student"}
            </Button>
          </Box>
        </form>
      </Paper>
      {/* Dialog to display filled data */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Entered Data</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Name: {formik.values.name}</Typography>

          <Typography variant="body1">Email: {formik.values.email}</Typography>
          <Typography variant="body1">
            Program: {formik.values.programId}
          </Typography>
          <Typography variant="body1">
            Syllabus: {formik.values.syllabusId}
          </Typography>

          <Typography variant="body1">
            Semester: {formik.values.semester}
          </Typography>
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
          <Button onClick={createStudent}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AddStudentForm
