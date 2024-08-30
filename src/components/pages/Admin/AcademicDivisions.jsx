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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import CloseIcon from "@mui/icons-material/Close"

import { DeleteForever } from "@mui/icons-material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import useDepartments from "../../../hooks/count/useDepartments"
import useLevels from "../../../hooks/count/useLevels"

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

// Programs panel
function Programs() {
  const { loginState } = useContext(LoginContext)

  // list of departments
  const { data: departments } = useDepartments()

  // list all levels
  const { data: levels } = useLevels()

  // for adding dialog
  const [openAddDialog, setOpenAddDialog] = useState(false)

  // for deleting dialog
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogDetails, setDialogDetails] = useState({
    id: 0,
    item: "None",
    name: "",
    deleteFunc: () => {},
  })

  // columns for datagrid
  const columns = [
    {
      field: "sn",
      headerName: "S.N.",
      width: 70,
    },
    {
      field: "name",
      headerName: "Program",
      width: 450,

      renderCell: (params) => (
        <CardContent sx={{ p: 1 }}>
          <Typography sx={{ fontSize: 16 }}>{params.row.name}</Typography>
          <Typography sx={{ fontSize: 12 }}>
            Department: {params.row.department.name || ""}
          </Typography>
          <Typography sx={{ fontSize: 12 }}>
            Faculty: {params.row.department.faculty.name || ""}
          </Typography>
        </CardContent>
      ),
    },
    {
      field: "syllabus",
      headerName: "Syllabus",
      width: 450,
      renderCell: (params) => (
        <CardContent sx={{ p: 1 }}>
          <Table>
            <TableBody>
              {params.row.Syllabus.map((syllabus) => (
                <TableRow key={syllabus.id}>
                  <TableCell>{syllabus.name}</TableCell>
                  <TableCell>
                    <Button
                      startIcon={<DeleteForever />}
                      variant="outlined"
                      onClick={() => {
                        // delete faculty
                        setDialogDetails((prev) => ({
                          id: syllabus.id,
                          item: "SYLLABUS",
                          name: syllabus.name,
                          deleteFunc: deleteSyllabus,
                        }))
                        setOpenDialog(true)
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 140,
      renderCell: (params) => (
        <Button
          variant="outlined"
          startIcon={<DeleteForever />}
          onClick={() => {
            // delete faculty
            setDialogDetails((prev) => ({
              id: params.row.id,
              item: "PROGRAM",
              name: params.row.name,
              deleteFunc: deleteProgram,
            }))
            setOpenDialog(true)
          }}
        >
          Delete Program
        </Button>
      ),
    },
  ]

  // delete program
  const deleteProgram = async () => {
    await axios
      .delete(
        `${VITE_BACKEND_URL}/admin/divisions/program/${dialogDetails.id}`,
        {
          headers: { Authorization: `Bearer ${loginState.token}` },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          toast.success("Program deleted successfully!")
          // update program list
          fetchPrograms()
        }
      })
      .catch((err) => {
        toast.warn("Something wrong went with request")
        console.log(err) // remove later
      })
  }

  // delete syllabus
  const deleteSyllabus = async () => {
    await axios
      .delete(
        `${VITE_BACKEND_URL}/admin/divisions/syllabus/${dialogDetails.id}`,
        {
          headers: { Authorization: `Bearer ${loginState.token}` },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          toast.success("Syllabus deleted successfully!")
          // update program list
          fetchPrograms()
        }
      })
      .catch((err) => {
        toast.warn("Something wrong went with request")
        console.log(err) // remove later
      })
  }

  const url = `${VITE_BACKEND_URL}/public/programs`

  // state to keep all programs
  const [allPrograms, setAllPrograms] = useState([])

  // for datagrid rows
  const [rows, setRows] = useState([])

  // fetch programs
  const fetchPrograms = async () => {
    try {
      const response = await axios.get(url)
      if (response.status === 200) {
        setAllPrograms(response.data)
        const data = response.data.map((program, index) => ({
          ...program,
          sn: index + 1,
        }))
        setRows(data)
      }
    } catch (error) {
      console.log(error) // for logging
      toast.warn(`Error while fetching programs data: ${error.message}`)
    }
  }

  // auto fetch programs at start
  useEffect(() => {
    fetchPrograms()
  }, [])

  // add new program
  const addProgram = async (departmentId, levelId, programName) => {
    await axios
      .post(
        `${VITE_BACKEND_URL}/admin/divisions/program`,
        {
          departmentId: departmentId,
          levelId: levelId,
          name: programName,
          head: "",
        },
        { headers: { Authorization: `Bearer ${loginState.token}` } }
      )
      .then((response) => {
        if (response.status === 201) {
          programFormik.resetForm()
          toast.success("Program created successfully!")
          // update faculty list
          fetchPrograms()
        }
      })
      .catch((err) => {
        if (err.response.status === 409) {
          toast.warn("A program with provided details already exists!")
        } else {
          toast.warn("Something wrong went with request")
          console.log(err) // remove later
        }
      })
  }

  // add new syllabus
  const addSyllabus = async (programId, syllabusName) => {
    await axios
      .post(
        `${VITE_BACKEND_URL}/admin/divisions/syllabus`,
        {
          programId: programId,
          name: syllabusName,
        },
        { headers: { Authorization: `Bearer ${loginState.token}` } }
      )
      .then((response) => {
        if (response.status === 201) {
          syllabusFormik.resetForm()
          toast.success("Syllabus created successfully!")
          // update faculty list
          fetchPrograms()
        }
      })
      .catch((err) => {
        if (err.response.status === 409) {
          toast.warn("A syllabus with provided details already exists!")
        } else {
          toast.warn("Something wrong went with request")
          console.log(err) // remove later
        }
      })
  }

  const programValidationSchema = yup.object({
    name: yup.string().required("Name is required"),
    departmentId: yup.number().positive().required("Department is required."),
    levelId: yup.number().positive().required("Level is required."),
  })

  const programInitialValues = {
    name: "",
    departmentId: "",
    levelId: "",
  }

  const syllabusValidationSchema = yup.object({
    programId: yup.number().positive().required("Program is required."),
    name: yup.string().required("Name is required"),
  })

  const syllabusInitialValues = {
    programId: "",
    name: "",
  }

  // formik for program
  const programFormik = useFormik({
    initialValues: programInitialValues,
    validationSchema: programValidationSchema,
    onSubmit: async (values) => {
      await addProgram(values.departmentId, values.levelId, values.name)
    },
  })

  // formik for syllabus
  const syllabusFormik = useFormik({
    initialValues: syllabusInitialValues,
    validationSchema: syllabusValidationSchema,
    onSubmit: async (values) => {
      await addSyllabus(values.programId, values.name)
    },
  })

  return (
    <Box>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        sx={{
          width: "max-content",
          marginLeft: "auto",
          marginBottom: 1,
        }}
        onClick={() => {
          setOpenAddDialog(true)
        }}
      >
        Add New Program / Syllabus
      </Button>
      {rows.length > 0 && (
        <DataGrid
          rows={rows}
          getRowHeight={() => "auto"}
          columns={columns}
          pageSize={100}
          editMode="row"
          disableRowSelectionOnClick
          rowsPerPageOptions={[100]}
          resizable={true}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      )}

      {/* Dialog to delete item  */}
      <Dialog
        maxWidth={"md"}
        fullWidth
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
          fetchPrograms()
        }}
      >
        <DialogTitle>Delete {dialogDetails.item}</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="h6">
            Are you sure you want to delete {dialogDetails.item} : `
            {dialogDetails.name}`
          </Typography>
          <Typography variant="subtitle">
            The sub-divisions and components associated with it will also be
            deleted.
          </Typography>
        </DialogContent>
        <Divider />

        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<DeleteForever />}
            color="primary"
            onClick={async () => {
              setOpenDialog(false)
              // perform delete operation
              dialogDetails.deleteFunc()
              fetchPrograms()
            }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            color="secondary"
            onClick={() => {
              setOpenDialog(false)
              fetchPrograms()
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog to add program and syllabus  */}
      <Dialog
        maxWidth={"lg"}
        fullWidth
        open={openAddDialog}
        onClose={() => {
          setOpenAddDialog(false)
          fetchPrograms()
        }}
      >
        <DialogTitle>Add Program and Syllabus</DialogTitle>
        <Divider />
        <DialogContent>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6">Add New Program</Typography>

            <form onSubmit={programFormik.handleSubmit}>
              <Stack direction="row" gap={1}>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="dept-label">Select Department*</InputLabel>
                  <Select
                    id="dept"
                    required
                    labelId="dept-label"
                    label="Select Department*"
                    fullWidth
                    {...programFormik.getFieldProps("departmentId")}
                    error={
                      programFormik.touched.departmentId &&
                      Boolean(programFormik.errors.departmentId)
                    }
                  >
                    {departments !== undefined &&
                      departments.length > 0 &&
                      departments.map((dept) => (
                        <MenuItem key={dept.id} id={dept.id} value={dept.id}>
                          <Card
                            variant="outlined"
                            sx={{ width: "100%", height: "4rem" }}
                          >
                            <CardContent>
                              <Typography>{dept.name}</Typography>
                              <Typography variant="subtile">
                                Faculty: {dept.faculty.name || ""}
                              </Typography>
                            </CardContent>
                          </Card>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="dept-label">Select Level*</InputLabel>
                  <Select
                    id="level"
                    required
                    labelId="level-label"
                    label="Select Level*"
                    fullWidth
                    {...programFormik.getFieldProps("levelId")}
                    error={
                      programFormik.touched.levelId &&
                      Boolean(programFormik.errors.levelId)
                    }
                  >
                    {levels !== undefined &&
                      levels.length > 0 &&
                      levels.map((level) => (
                        <MenuItem key={level.id} id={level.id} value={level.id}>
                          <Card
                            variant="outlined"
                            sx={{ width: "100%", height: "4rem" }}
                          >
                            <CardContent>
                              <Typography>{level.name}</Typography>
                            </CardContent>
                          </Card>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction="row" gap={1}>
                <TextField
                  label="Program Name"
                  fullWidth
                  id="name"
                  margin="normal"
                  required
                  {...programFormik.getFieldProps("name")}
                  error={
                    programFormik.touched.name &&
                    Boolean(programFormik.errors.name)
                  }
                  helperText={
                    programFormik.touched.name && programFormik.errors.name
                  }
                />
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  type="submit"
                  sx={{ m: 2, marginLeft: 0, width: "60%" }}
                >
                  Add Program
                </Button>
              </Stack>
            </form>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Typography variant="h6">Add New Syllabus</Typography>
            <form onSubmit={syllabusFormik.handleSubmit}>
              <Stack direction="row" gap={1}>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="prog-label">Select Program*</InputLabel>
                  <Select
                    id="program"
                    required
                    labelId="prog-label"
                    label="Select Program*"
                    fullWidth
                    {...syllabusFormik.getFieldProps("programId")}
                    error={
                      syllabusFormik.touched.programId &&
                      Boolean(syllabusFormik.errors.programId)
                    }
                  >
                    {allPrograms.length > 0 &&
                      allPrograms.map((program) => (
                        <MenuItem
                          key={program.id}
                          id={program.id}
                          value={program.id}
                        >
                          {program.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Syllabus Name"
                  fullWidth
                  id="syllabus-name"
                  margin="normal"
                  required
                  {...syllabusFormik.getFieldProps("name")}
                  error={
                    syllabusFormik.touched.name &&
                    Boolean(syllabusFormik.errors.name)
                  }
                  helperText={
                    syllabusFormik.touched.name && syllabusFormik.errors.name
                  }
                />
              </Stack>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                type="submit"
                sx={{ m: 1, marginLeft: 0, maxWidth: "max-content" }}
              >
                Add Syllabus
              </Button>
            </form>
          </Paper>
        </DialogContent>
        <Divider />

        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            color="secondary"
            onClick={() => {
              setOpenAddDialog(false)
              fetchPrograms()
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

// Faculties panel
function Faculties() {
  // for adding dialog
  const [openAddDialog, setOpenAddDialog] = useState(false)

  // for dialog
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogDetails, setDialogDetails] = useState({
    id: 0,
    item: "None",
    name: "",
    deleteFunc: () => {},
  })

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

  // delete faculty
  const deleteFaculty = async () => {
    await axios
      .delete(
        `${VITE_BACKEND_URL}/admin/divisions/faculty/${dialogDetails.id}`,
        {
          headers: { Authorization: `Bearer ${loginState.token}` },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          toast.success("Faculty deleted successfully!")
          // update faculty list
          fetchFaculties()
        }
      })
      .catch((err) => {
        toast.warn("Something wrong went with request")
        console.log(err) // remove later
      })
  }

  // delete department
  const deleteDept = async () => {
    await axios
      .delete(
        `${VITE_BACKEND_URL}/admin/divisions/department/${dialogDetails.id}`,
        {
          headers: { Authorization: `Bearer ${loginState.token}` },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          toast.success("Department deleted successfully!")
          // update faculty list
          fetchFaculties()
        }
      })
      .catch((err) => {
        toast.warn("Something wrong went with request")
        console.log(err) // remove later
      })
  }

  // delete program
  const deleteProgram = async () => {
    await axios
      .delete(
        `${VITE_BACKEND_URL}/admin/divisions/program/${dialogDetails.id}`,
        {
          headers: { Authorization: `Bearer ${loginState.token}` },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          toast.success("Faculty deleted successfully!")
          // update faculty list
          fetchFaculties()
        }
      })
      .catch((err) => {
        toast.warn("Something wrong went with request")
        console.log(err) // remove later
      })
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
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        sx={{
          width: "max-content",
          marginLeft: "auto",
          padding: 1,
          marginBottom: 1,
        }}
        onClick={() => {
          setOpenAddDialog(true)
        }}
      >
        Add New Faculty And Department
      </Button>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction="column" gap={2}>
          {allFaculties.length > 0 &&
            allFaculties.map((faculty, index) => (
              <Card variant="outlined" key={faculty.id}>
                <CardHeader
                  title={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="h6">
                        {index + 1 + ". " + faculty.name}
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<DeleteForever />}
                        sx={{ marginLeft: "auto" }}
                        onClick={() => {
                          // delete faculty
                          setDialogDetails((prev) => ({
                            ...prev,
                            id: faculty.id,
                            item: "FACULTY",
                            name: faculty.name,
                            deleteFunc: deleteFaculty,
                          }))
                          setOpenDialog(true)
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  }
                />
                <Divider />
                <CardContent>
                  <Typography variant="body2">Head: {faculty.head}</Typography>
                  <ol>
                    <Stack direction="column" gap={2}>
                      {faculty.Department.length > 0 &&
                        faculty.Department.map((dept) => (
                          <li key={dept.id}>
                            <Stack direction="row">
                              <Typography variant="h7">{dept.name}</Typography>
                              <Button
                                variant="outlined"
                                startIcon={<DeleteForever />}
                                sx={{ marginLeft: "auto" }}
                                onClick={() => {
                                  // delete department
                                  setDialogDetails((prev) => ({
                                    ...prev,
                                    id: dept.id,
                                    item: "DEPARTMENT",
                                    name: dept.name,
                                    deleteFunc: deleteDept,
                                  }))
                                  setOpenDialog(true)
                                }}
                              >
                                Delete Dept
                              </Button>
                            </Stack>
                            {dept.Program.length > 0 && (
                              <ol>
                                <Stack
                                  direction="column"
                                  gap={2}
                                  sx={{ marginTop: 2 }}
                                >
                                  {dept.Program.map((prog) => (
                                    <li key={prog.id}>
                                      <Stack
                                        direction="row"
                                        sx={{ width: "30rem" }}
                                      >
                                        <Typography>{prog.name}</Typography>

                                        <Button
                                          variant="outlined"
                                          startIcon={<DeleteForever />}
                                          sx={{
                                            marginLeft: "auto",
                                          }}
                                          onClick={() => {
                                            // delete program
                                            setDialogDetails((prev) => ({
                                              ...prev,
                                              id: prog.id,
                                              item: "PROGRAM",
                                              name: prog.name,
                                              deleteFunc: deleteProgram,
                                            }))
                                            setOpenDialog(true)
                                          }}
                                        >
                                          Delete
                                        </Button>
                                      </Stack>
                                    </li>
                                  ))}
                                </Stack>
                              </ol>
                            )}
                            <Divider sx={{ marginTop: 2 }} />
                          </li>
                        ))}
                    </Stack>
                  </ol>
                </CardContent>
              </Card>
            ))}
        </Stack>
      </Paper>

      {/* Dialog to delete item  */}
      <Dialog
        maxWidth={"md"}
        fullWidth
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
          fetchFaculties()
        }}
      >
        <DialogTitle>Delete {dialogDetails.item}</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="h6">
            Are you sure you want to delete {dialogDetails.item} : `
            {dialogDetails.name}`
          </Typography>
          <Typography variant="subtitle">
            The sub-divisions and components associated with it will also be
            deleted.
          </Typography>
        </DialogContent>
        <Divider />

        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<DeleteForever />}
            color="primary"
            onClick={async () => {
              setOpenDialog(false)
              // perform delete operation
              dialogDetails.deleteFunc()
              fetchFaculties()
            }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            color="secondary"
            onClick={() => {
              setOpenDialog(false)
              fetchFaculties()
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog to add program and department  */}
      <Dialog
        maxWidth={"md"}
        fullWidth
        open={openAddDialog}
        onClose={() => {
          setOpenAddDialog(false)
          fetchFaculties()
        }}
      >
        <DialogTitle>Add Faculty and Department</DialogTitle>
        <Divider />
        <DialogContent>
          <Paper variant="outlined" sx={{ p: 2 }}>
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
            <Divider sx={{ margin: 2 }} />
            <Typography variant="h6">Add New Department</Typography>
            <form onSubmit={deptFormik.handleSubmit}>
              <Stack direction="row" gap={1}>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="dept-label">Select Faculty*</InputLabel>
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
        </DialogContent>
        <Divider />

        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            color="secondary"
            onClick={() => {
              setOpenAddDialog(false)
              fetchFaculties()
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
