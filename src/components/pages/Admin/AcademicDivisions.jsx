import * as yup from "yup"
import * as React from "react"
import PropTypes from "prop-types"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useEffect } from "react"
import { useContext } from "react"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // Fetching from .env file
import { LoginContext } from "../../../store/LoginProvider"
import { useFormik } from "formik"

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

export default function AcademicDivisions() {
  // state to keep track of current tab
  const [value, setValue] = React.useState(0)

  // to change tab
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="divisions"
          centered
        >
          <Tab
            label={<b>Programs</b>}
            {...a11yProps(0)}
            sx={{ paddingLeft: 5, paddingRight: 5 }}
          />

          <Tab
            label={<b>Faculties AND Departments</b>}
            {...a11yProps(2)}
            sx={{ paddingLeft: 5, paddingRight: 5 }}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Programs />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Faculties />
      </TabPanel>
    </Box>
  )
}

function Programs() {
  return <Box>show and add program here . Also syllabus</Box>
}

function Faculties() {
  const facultyValidationSchema = yup.object({
    name: yup.string().required("Name is required"),
    head: yup.string().optional(),
  })

  const facultyInitialValues = {
    name: "",
    head: "",
  }

  const deptValidationSchema = yup.object({
    facultyId: yup.number().positive().required("Faculty is required."),
    name: yup.string().required("Name is required"),
    head: yup.string().optional(),
  })

  const deptInitialValues = {
    facultyId: "",
    name: "",
    head: "",
  }

  // add new faculty
  const addFaculty = async (name, head = "") => {
    await axios
      .post(
        `${VITE_BACKEND_URL}/admin/divisions/faculty`,
        {
          name: name,
          head: head,
        },
        { headers: { Authorization: `Bearer ${loginState.token}` } }
      )
      .then((response) => {
        if (response.status === 201) {
          facultyFormik.resetForm()
          toast.success("Faculty created successfully!")
          // update faculty list
          fetchFaculties()
        }
      })
      .catch((err) => {
        if (err.response.status === 409) {
          toast.warn("A faculty with provided details already exists!")
        } else {
          toast.warn("Something wrong went with request")
          console.log(err) // remove later
        }
      })
  }

  // add new faculty
  const addDepartment = async (facultyId, name, head = "") => {
    await axios
      .post(
        `${VITE_BACKEND_URL}/admin/divisions/department`,
        {
          facultyId: facultyId,
          name: name,
          head: head,
        },
        { headers: { Authorization: `Bearer ${loginState.token}` } }
      )
      .then((response) => {
        if (response.status === 201) {
          facultyFormik.resetForm()
          toast.success("Department created successfully!")
          // update faculty list
          fetchFaculties()
        }
      })
      .catch((err) => {
        if (err.response.status === 409) {
          toast.warn("A Department with provided details already exists!")
        } else {
          toast.warn("Something wrong went with request")
          console.log(err) // remove later
        }
      })
  }
  // formik for faculty
  const facultyFormik = useFormik({
    initialValues: facultyInitialValues,
    validationSchema: facultyValidationSchema,
    onSubmit: async (values) => {
      await addFaculty(values.name, values.head)
    },
  })

  // formik for department
  const deptFormik = useFormik({
    initialValues: deptInitialValues,
    validationSchema: deptValidationSchema,
    onSubmit: async (values) => {
      await addDepartment(values.facultyId, values.name, values.head)
    },
  })

  const { loginState } = useContext(LoginContext)

  const url = `${VITE_BACKEND_URL}/public/faculties`

  // state to keep all faculties
  const [allFaculties, setAllFaculties] = useState([])

  // fetch faculties
  const fetchFaculties = async () => {
    try {
      const response = await axios.get(url)
      if (response.status === 200) {
        setAllFaculties(response.data)
      }
    } catch (error) {
      console.log(error) // for logging
      toast.warn(`Error while fetching faculties data: ${error.message}`)
    }
  }

  // auto fetch faculties at start
  useEffect(() => {
    fetchFaculties()
  }, [])

  return (
    <Box>
      <Stack direction="column" gap={1}>
        <Paper variant="outlined" sx={{ p: 2 }} collapse>
          <Typography variant="h6">Add New Faculty</Typography>
          <form onSubmit={facultyFormik.handleSubmit}>
            <Stack direction="row" gap={1}>
              <TextField
                label="Faculty Name"
                fullWidth
                id="faculty-name"
                margin="normal"
                required
                {...facultyFormik.getFieldProps("name")}
                error={
                  facultyFormik.touched.name &&
                  Boolean(facultyFormik.errors.name)
                }
                helperText={
                  facultyFormik.touched.name && facultyFormik.errors.name
                }
              />
              <TextField
                label="Faculty Head"
                fullWidth
                id="faculty-head"
                margin="normal"
                {...facultyFormik.getFieldProps("head")}
                error={
                  facultyFormik.touched.head &&
                  Boolean(facultyFormik.errors.head)
                }
                helperText={
                  facultyFormik.touched.head && facultyFormik.errors.head
                }
              />
            </Stack>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              sx={{ marginTop: 1 }}
              type="submit"
            >
              Add Faculty
            </Button>
          </form>
          <Paper variant="outlined" sx={{ marginTop: 2, p: 1 }}>
            <Typography variant="h6">Add New Department</Typography>
            <form onSubmit={deptFormik.handleSubmit}>
              <Stack direction="row" gap={1}>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="dept-label">Select Department*</InputLabel>
                  <Select
                    id="dept"
                    required
                    labelId="dept-label"
                    label="Select Faculty*"
                    fullWidth
                    {...deptFormik.getFieldProps("facultyId")}
                    error={
                      deptFormik.touched.facultyId &&
                      Boolean(deptFormik.errors.facultyId)
                    }
                  >
                    {allFaculties.length > 0 &&
                      allFaculties.map((faculty) => (
                        <MenuItem
                          key={faculty.id}
                          id={faculty.id}
                          value={faculty.id}
                        >
                          {faculty.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Department Name"
                  fullWidth
                  id="dept-name"
                  margin="normal"
                  required
                  {...deptFormik.getFieldProps("name")}
                  error={
                    deptFormik.touched.facultyId &&
                    Boolean(deptFormik.errors.facultyId)
                  }
                  helperText={deptFormik.touched.name && deptFormik.errors.name}
                />
                <TextField
                  label="Department Head"
                  fullWidth
                  id="dept-head"
                  margin="normal"
                  {...deptFormik.getFieldProps("head")}
                  error={
                    deptFormik.touched.head && Boolean(deptFormik.errors.head)
                  }
                  helperText={deptFormik.touched.head && deptFormik.errors.head}
                />
              </Stack>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                sx={{ marginTop: 1 }}
                type="submit"
              >
                Add Department
              </Button>
            </form>
          </Paper>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack direction="column" gap={2}>
            {allFaculties.length > 0 &&
              allFaculties.map((faculty, index) => (
                <Card variant="outlined" key={faculty.id}>
                  <CardHeader title={index + 1 + ". " + faculty.name} />
                  <Divider />
                  <CardContent>
                    <Typography variant="body2">
                      Head: {faculty.head}
                    </Typography>
                    <ol>
                      {faculty.Department.length > 0 &&
                        faculty.Department.map((dept) => (
                          <li key={dept.id}>
                            {dept.name}
                            {dept.Program.length > 0 && (
                              <ol>
                                {dept.Program.map((prog) => (
                                  <li key={prog.id}>{prog.name}</li>
                                ))}
                              </ol>
                            )}
                          </li>
                        ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}
