import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Paper,
  Dialog,
  Box,
  DialogTitle,
  Divider,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import useMarkWt from "../../../../hooks/count/useMarkWt"
import axios from "axios"
import { useContext } from "react"
import { LoginContext } from "../../../../store/LoginProvider"
import { toast } from "react-toastify"
import useAllCourses from "../../../../hooks/count/useAllCourses"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import InfoIcon from "@mui/icons-material/Info"
import CloseIcon from "@mui/icons-material/Close"
import EditIcon from "@mui/icons-material/Edit"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { QueryClient } from "react-query"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import ManageSearchIcon from "@mui/icons-material/ManageSearch"
import usePrograms from "../../../../hooks/count/usePrograms"
import GetAppIcon from "@mui/icons-material/GetApp"
import ClearIcon from "@mui/icons-material/Clear"
import ImportDialog from "../../ImportDialog/ImportDialog"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const Courses = () => {
  const { loginState } = useContext(LoginContext)

  // query client
  const queryClient = new QueryClient()

  // url to upload course to
  const uploadUrl = `${VITE_BACKEND_URL}/admin/courses`

  // list of program in system
  const { data: programs } = usePrograms()

  // currently selected program
  const [selectedProgram, setSelectedProgram] = useState({
    id: 0,
    name: "All Programs",
  })

  // selected syllabus
  const [selectedSyllabus, setSelectedSyllabus] = useState(0)

  // method to fetch all courses
  const fetchCourses = async (programId = 0, syllabusId = 0) => {
    try {
      const url = `${VITE_BACKEND_URL}/public/courses?program_id=${programId}&syllabus_id=${syllabusId}`
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${loginState.token}`,
        },
      })
      if (response.status === 200) {
        setRows(
          response.data.map((course) => ({
            taughtBy: course.TeacherCourses?.length || 0,
            taughtIn: course.ProgramCourses?.length || 0,
            ...course,
          }))
        )
      } else {
        toast.warn("Something went wrong. Please try again.")
        console.log(response)
      }
    } catch (err) {
      toast.warn("Something went wrong. Please try again.")
      console.log(err)
    }
  }

  // run once when page is opened
  useEffect(() => {
    fetchCourses()
  }, [])

  // change selected program from dropdown
  const handleProgramChange = (event) => {
    const programId = parseInt(event.target.value)
    if (programId === 0) {
      setSelectedProgram({ id: 0, name: "All Programs" })
    } else {
      const selected = programs.find((program) => program.id === programId)
      setSelectedProgram(selected)
    }
  }

  // change selected syllabus from dropdown
  const handleSyllabusChange = (event) => {
    const id = Number(event.target.value) || 0
    setSelectedSyllabus(id)
  }

  // rows for datagrid
  const [rows, setRows] = useState(null)

  // for adding a single course
  const [addDialog, setAddDialog] = useState(false)

  // details dialog toggle
  const [detailsDialog, setDetailsDialog] = useState(false)
  const [details, setDetails] = useState(null)

  // set edit dialog toggle
  const [editDialogToggle, setEditDialogToggle] = useState(false)

  // used while assiging course to a program
  const [assignProgram, setAssignProgram] = useState({
    id: 0,
    name: "Select a program",
  })

  const [assignSyllabus, setAssignSyllabus] = useState(0)
  const [assignSemester, setAssignSemester] = useState(0)

  // handle program change on course assignment form
  const handleAssignProgramChangle = (event) => {
    const programId = Number(event.target.value) || 0
    if (programId === 0) {
      setAssignProgram({ id: 0, name: "All Programs" })
    } else {
      const selected = programs.find((program) => program.id === programId)
      setAssignProgram(selected)
    }
  }

  // handle syllabus change on course assignment form
  const handleAssignSyllabusChange = (event) => {
    const id = Number(event.target.value) || 0
    setAssignSyllabus(id)
  }

  // handle semester change on course assignment form
  const handleAssignSemesterChange = (event) => {
    const id = Number(event.target.value) || 0
    setAssignSemester(id)
  }

  // delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  // columns for data grid
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
      field: "code",
      headerName: "Code",
      width: 100,
    },

    { field: "name", headerName: "Name", width: 200 },
    { field: "credit", headerName: "Credit", width: 100 },
    { field: "elective", headerName: "Elective", width: 100, type: "boolean" },
    { field: "project", headerName: "Project", width: 100, type: "boolean" },
    { field: "taughtIn", headerName: "Programs", width: 120 },
    { field: "taughtBy", headerName: "Teachers", width: 120 },

    {
      field: "actions",
      headerName: "Actions",
      type: "action",
      width: 400,

      renderCell: (params) => (
        <Stack direction="row" gap={1}>
          <Button
            variant="outlined"
            startIcon={<InfoIcon />}
            onClick={() => {
              setDetails(params.row)
              setDetailsDialog(true)
            }}
          >
            Details
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<EditIcon />}
            onClick={() => {
              setDetails(params.row)
              setEditDialogToggle(true)
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteForeverIcon />}
            color="error"
            onClick={() => {
              setDetails(params.row)
              setOpenDeleteDialog(true)
            }}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ]

  // state to keep list of supported mark weightages
  const [markWtList, setMarkWtList] = useState([])

  const { data: markWtData } = useMarkWt()

  // set markWtList
  useEffect(() => {
    if (markWtData !== undefined && markWtData !== null) {
      setMarkWtList(markWtData)
    }
  }, [markWtData])

  // mark weightage dialog
  const [markWtDialog, setMarkWtDialog] = useState(false)

  // validation schema for adding new course into db
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Course Name is required"),
    code: Yup.string().required("Course Code is required"),
    credit: Yup.number()
      .required("Course Credit is required")
      .min(1)
      .max(20)
      .positive("Course Credit must be a positive number"),
    elective: Yup.boolean().default(false).required("Elective is required"),
    project: Yup.boolean().default(false).required("Project is required"),
    markWeightageId: Yup.number()
      .required("Mark Weightage Id is required")
      .positive(),
  })

  // validation schema for adding new mark wt
  const markWtSchema = Yup.object().shape({
    theory: Yup.number()
      .required("Theory is required")
      .positive("Theory must be a positive number")
      .min(1)
      .max(50),
    practical: Yup.number()
      .required("Practical is required")
      .positive("Practical must be a positive number")
      .min(1)
      .max(50),
  })

  // formik
  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      credit: "",
      elective: "",
      project: "",
      markWeightageId: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const data = { ...values, credit: Number(values.credit) || 0 }
      try {
        await axios
          .post(uploadUrl, data, {
            headers: {
              Authorization: `Bearer ${loginState.token}`,
            },
          })
          .then(() => {
            // for success
            toast.success("Course was added successfully.")
            formik.resetForm()
          })
          .catch((err) => {
            if (err.response.status === 409) {
              toast.warn("Course with provided details exists already.")
            } else {
              toast.warn("Course with provided details exists already.")
            }
          })
      } catch (err) {
        console.log(err) // logging
        toast.warn("Something went wrong. Please try again.")
      }
    },
  })

  // mark wt formik
  const markWtFormik = useFormik({
    initialValues: {
      theory: "",
      practical: "",
    },
    validationSchema: markWtSchema,
    onSubmit: async (values) => {
      try {
        const data = {
          theory: Number(values.theory),
          practical: Number(values.practical),
        }
        await axios
          .post(`${VITE_BACKEND_URL}/admin/courses/markweightage`, data, {
            headers: {
              Authorization: `Bearer ${loginState.token}`,
            },
          })
          .then(() => {
            // for success
            queryClient.invalidateQueries(["mark-wt"])
            markWtFormik.resetForm()
            toast.success("Mark Weightage added successfully.")
          })
          .catch((err) => {
            if (err.response.status === 409) {
              toast.warn("Mark Weightage with provided details exists already.")
            } else {
              toast.warn("Something went wrong. Please try again.")
            }
          })
      } catch (err) {
        console.log(err) // logging
        toast.warn("Something went wrong. Please try again.")
      }
    },
  })

  // delete course method call
  const deleteCourse = async (courseId) => {
    try {
      await axios
        .delete(`${VITE_BACKEND_URL}/admin/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${loginState.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            fetchCourses(
              selectedProgram?.id ? selectedProgram.id : 0,
              selectedSyllabus ? selectedSyllabus : 0
            )
            toast.success("Course deleted successfully!")
            // update courses list
          }
        })
        .catch((err) => {
          toast.warn("Something wrong went with request")
          console.log(err) // remove later
        })
    } catch (err) {
      toast.warn("Something wrong went with request")
      console.log(err) // remove later
    }
  }

  // delete mark Wt method call
  const deleteMarkWt = async (markWtId) => {
    try {
      await axios
        .delete(`${VITE_BACKEND_URL}/admin/courses/markweightage/${markWtId}`, {
          headers: { Authorization: `Bearer ${loginState.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            queryClient.invalidateQueries(["mark-wt"])
            toast.success("Mark Weightage deleted successfully!")
          }
        })
        .catch((err) => {
          toast.warn("Something wrong went with request")
          console.log(err) // remove later
        })
    } catch (err) {
      toast.warn("Something wrong went with request")
      console.log(err) // remove later
    }
  }

  // remove course association
  const removeCourseAssign = async (
    courseId,
    programId,
    syllabusId,
    semesterId
  ) => {
    try {
      if (
        courseId === 0 ||
        programId === 0 ||
        syllabusId === 0 ||
        semesterId === 0
      ) {
        return
      }

      const body = {
        programId: programId,
        syllabusId: syllabusId,
        semesterId: semesterId,
      }

      console.log(body)
      await axios
        .delete(`${VITE_BACKEND_URL}/admin/courses/${courseId}/remove`, {
          headers: { Authorization: `Bearer ${loginState.token}` },
          data: body,
        })
        .then((response) => {
          if (response.status === 200) {
            queryClient.invalidateQueries(["all-courses"])
            toast.success("Course assignment removed successfully!")
          }
        })
        .catch((err) => {
          toast.warn("Something wrong went with request")
          console.log(err) // remove later
        })
    } catch (err) {
      toast.warn("Something wrong went with request")
      console.log(err) // remove later
    }
  }

  // add course association
  const addCourseAssign = async (
    courseId,
    programId,
    syllabusId,
    semesterId
  ) => {
    try {
      if (
        courseId === 0 ||
        programId === 0 ||
        syllabusId === 0 ||
        semesterId === 0
      ) {
        return
      }
      await axios
        .post(
          `${VITE_BACKEND_URL}/admin/courses/${courseId}/assign`,
          {
            programId: programId,
            syllabusId: syllabusId,
            semesterId: semesterId,
          },
          {
            headers: { Authorization: `Bearer ${loginState.token}` },
          }
        )
        .then((response) => {
          if (response.status === 201) {
            fetchCourses(
              selectedProgram?.id ? selectedProgram.id : 0,
              selectedSyllabus ? selectedSyllabus : 0
            )
            queryClient.invalidateQueries(["all-courses"])
            toast.success("Course assignment successfull!")
          }
        })
        .catch((err) => {
          if (err.response.status === 409) {
            toast.success("Conflict. Course is already assigned")
          }
          toast.warn("Something wrong went with request")
          console.log(err.response) // remove later
        })
    } catch (err) {
      toast.warn("Something wrong went with request")
      console.log(err) // remove later
    }
  }

  // import dialog toggle
  const [importToggle, setImportToggle] = useState(false)

  // method to upload csv
  const uploadCourseCSV = async (file) => {
    try {
      await axios
        .post(
          `${VITE_BACKEND_URL}/admin/courses/import`,
          {
            file: file,
          },
          {
            headers: {
              Authorization: `Bearer ${loginState.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          if (response.status === 201) {
            const valid = response.data?.validQueries?.length || 0
            const invalid = response.data?.invalidQueries?.length || 0

            toast.success(
              `Request resulted in ${valid} valid queries and ${invalid} invalid queries.`
            )
            queryClient.invalidateQueries(["all-courses"])
          }
        })
        .catch((err) => {
          console.log(err.response) // remove later
          toast.warn(err.response.data.error.message)
        })
    } catch (err) {
      toast.warn("Something wrong went with request")
      console.log(err) // remove later
    }
  }

  return (
    <Box>
      <Stack direction={"row"} gap={2}>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={() => {
            setAddDialog(true)
          }}
          sx={{
            alignSelf: "center",
            padding: 1,
            margin: 1,
            // marginLeft: "auto",
          }}
        >
          Add Single Course
        </Button>
        <Button
          variant="contained"
          startIcon={<ManageSearchIcon />}
          onClick={() => {
            setMarkWtDialog(true)
          }}
          sx={{
            alignSelf: "center",
            padding: 1,
            margin: 1,
          }}
        >
          Manage Mark Weightages
        </Button>

        {/* 
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          disabled={!multiAddToggle}
          onClick={() => {
            // setAddDialog(true)
          }}
          sx={{
            alignSelf: "center",
            padding: 1,
            margin: 1,
            // marginLeft: "auto",
          }}
        >
          Add to Syllabus
        </Button> */}

        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={() => {
            setImportToggle(true)
          }}
          sx={{
            alignSelf: "center",
            padding: 1,
            margin: 1,
            // marginLeft: "auto",
          }}
        >
          Import Courses
        </Button>
      </Stack>
      <Divider sx={{ margin: 2 }} />
      <Stack direction={"row"} gap={2}>
        <FormControl sx={{ m: 1, minWidth: "25rem" }}>
          <InputLabel>Select a Program</InputLabel>
          <Select
            value={selectedProgram ? selectedProgram.id : ""}
            onChange={handleProgramChange}
            label="Select a Program"
          >
            <MenuItem key={0} value={0}>
              All Programs
            </MenuItem>
            {programs !== undefined &&
              programs !== null &&
              programs.map((program) => (
                <MenuItem key={program.id} value={program.id}>
                  {program.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: "25rem" }}>
          <InputLabel>Select a Syllabus</InputLabel>
          <Select
            value={selectedSyllabus ? selectedSyllabus : ""}
            onChange={handleSyllabusChange}
            label="Select a Syallbus"
          >
            <MenuItem key={0} value={0}>
              All Syllabus
            </MenuItem>
            {selectedProgram !== undefined &&
              selectedProgram !== null &&
              selectedProgram.id > 0 &&
              selectedProgram.Syllabus.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<GetAppIcon />}
          onClick={() => {
            fetchCourses(
              selectedProgram?.id ? selectedProgram.id : 0,
              selectedSyllabus ? selectedSyllabus : 0
            )
          }}
          sx={{
            alignSelf: "center",
            padding: 1,
            margin: 1,
            // marginLeft: "auto",
          }}
        >
          Fetch Courses
        </Button>
        <Button
          variant="contained"
          startIcon={<ClearIcon />}
          onClick={() => {
            setSelectedProgram({ id: 0, name: "All Programs" })
            setSelectedSyllabus(0)
          }}
          sx={{
            alignSelf: "center",
            padding: 1,
            margin: 1,
            // marginLeft: "auto",
          }}
        >
          Clear Filters
        </Button>
      </Stack>

      {/* mark wt dialog */}
      <Dialog
        open={markWtDialog}
        onClose={() => {
          setMarkWtDialog(false)
        }}
        maxWidth={"sm"}
        fullWidth
      >
        <DialogTitle>Manage Mark weightages</DialogTitle>
        <Divider />
        <DialogContent>
          {markWtList !== undefined && markWtList !== null && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Theory</TableCell>
                    <TableCell>Practical</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {markWtList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.theory}</TableCell>
                      <TableCell>{item.practical}</TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          variant="outlined"
                          startIcon={<DeleteForeverIcon />}
                          color="error"
                          onClick={() => {
                            deleteMarkWt(item.id)
                            toast.info("Request has been submitted.", {
                              autoClose: 300,
                            })
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Paper sx={{ margin: 1, padding: 1 }}>
            <Typography variant="h5">Add Mark Weightage</Typography>
            <form onSubmit={markWtFormik.handleSubmit}>
              <Stack direction="row" gap={1}>
                <TextField
                  label="Theory"
                  id="theory"
                  margin="normal"
                  defaultValue={markWtFormik.values.theory}
                  error={
                    markWtFormik.touched.theory && markWtFormik.errors.theory
                  }
                  {...markWtFormik.getFieldProps("theory")}
                  helperText={
                    markWtFormik.touched.theory && markWtFormik.errors.theory
                  }
                  required
                />

                <TextField
                  label="Practical"
                  id="practical"
                  margin="normal"
                  defaultValue={markWtFormik.values.practical}
                  error={
                    markWtFormik.touched.practical &&
                    markWtFormik.errors.practical
                  }
                  {...markWtFormik.getFieldProps("practical")}
                  helperText={
                    markWtFormik.touched.practical &&
                    markWtFormik.errors.practical
                  }
                  required
                />
              </Stack>

              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                color="primary"
                sx={{ maxHeight: "content" }}
                type="submit"
              >
                Add
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
              setMarkWtDialog(false)
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add course dialog */}
      <Dialog
        open={addDialog}
        onClose={() => {
          setAddDialog(false)
        }}
        maxWidth={"md"}
        fullWidth
      >
        <DialogTitle>Add Course</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="Course Name"
              fullWidth
              id="name"
              margin="normal"
              defaultValue={formik.values.name}
              error={formik.touched.name && formik.errors.name}
              {...formik.getFieldProps("name")}
              helperText={formik.touched.name && formik.errors.name}
              required
            />
            <Stack direction="row" gap={1}>
              <TextField
                fullWidth
                label="Course Code"
                margin="normal"
                defaultValue={formik.values.code}
                error={formik.touched.code && formik.errors.code}
                {...formik.getFieldProps("code")}
                helperText={formik.touched.code && formik.errors.code}
                required
              />
              <TextField
                fullWidth
                label="Course Credit"
                margin="normal"
                {...formik.getFieldProps("credit")}
                defaultValue={formik.values.credit}
                error={formik.touched.credit && formik.errors.credit}
                helperText={formik.touched.credit && formik.errors.credit}
                required
              />
            </Stack>
            <Stack direction="row" gap={1}>
              <TextField
                label="Elective ?"
                id="elective"
                defaultValue={formik.values.elective}
                error={formik.touched.elective && formik.errors.elective}
                helperText={formik.touched.elective && formik.errors.elective}
                required
                select
                fullWidth
                margin="normal"
                {...formik.getFieldProps("elective")}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </TextField>
              <TextField
                label="Project ?"
                margin="normal"
                id="project"
                defaultValue={formik.values.project}
                error={formik.touched.project && formik.errors.project}
                helperText={formik.touched.project && formik.errors.project}
                required
                select
                fullWidth
                {...formik.getFieldProps("project")}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </TextField>
            </Stack>

            <Stack direction={"column"} gap={2} mt={1}>
              <TextField
                label="Select Mark Weightage"
                defaultValue={formik.values.markWeightageId}
                error={
                  formik.touched.markWeightageId &&
                  formik.errors.markWeightageId
                }
                required
                select
                fullWidth
                {...formik.getFieldProps("markWeightageId")}
                helperText={
                  formik.touched.markWeightageId &&
                  formik.errors.markWeightageId
                }
              >
                {markWtList.length > 0 &&
                  markWtList.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      Theory: {item.theory}, Practical: {item.practical}
                    </MenuItem>
                  ))}
              </TextField>

              <Button
                variant="contained"
                type="submit"
                color="primary"
                sx={{ maxWidth: "max-content" }}
              >
                Add Course
              </Button>
            </Stack>
          </form>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            color="secondary"
            onClick={() => {
              setAddDialog(false)
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Paper>
        {rows !== undefined && rows !== null && (
          <DataGrid
            sx={{ marginTop: 1 }}
            rows={rows}
            columns={columns}
            pageSize={100}
            pageSizeOptions={[5, 10, 20, 25, 50, 100]}
            rowsPerPageOptions={[100]}
            resizable={true}
            components={{
              Toolbar: GridToolbar,
            }}
            checkboxSelection
          />
        )}
      </Paper>

      {/* Dialog for details */}
      <Dialog
        open={detailsDialog}
        onClose={() => {
          setDetailsDialog(false)
        }}
        maxWidth={"md"}
        fullWidth
      >
        <DialogTitle>Course Details</DialogTitle>
        <Divider />
        {details !== null && (
          <DialogContent>
            <Typography variant="body1">Name: {details?.name}</Typography>
            <Typography variant="body1">Code: {details?.code}</Typography>
            <Typography variant="body1">Id: {details?.id}</Typography>
            <Typography variant="body1">Credit: {details?.credit}</Typography>
            <Typography variant="body1">
              Elective: {details?.elective ? "Yes" : "No"}
            </Typography>
            <Typography variant="body1">
              Project: {details?.project ? "Yes" : "No"}
            </Typography>
            <Typography variant="body1">
              Mark Weightage: [ Theory : {details?.markWeightage?.theory} ,
              Practical: {details?.markWeightage?.practical} ]
            </Typography>

            <Divider sx={{ m: 1 }}>Programs Associated</Divider>
            <TableContainer component={Paper} sx={{ margin: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Program</TableCell>
                    <TableCell>Syllabus</TableCell>
                    <TableCell>Semester</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.ProgramCourses?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item?.syllabus?.program?.name || "..."}
                      </TableCell>
                      <TableCell> {item?.syllabus?.name || "..."}</TableCell>
                      <TableCell> {item?.semesterId || "..."}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ m: 1 }}>Teachers Associated</Divider>

            <TableContainer component={Paper} sx={{ margin: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Teacher Name</TableCell>
                    <TableCell>Teacher Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.TeacherCourses?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item?.teacher?.user?.name || "..."}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {item?.teacher?.user?.email || "..."}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        )}

        <Divider />
        <DialogActions>
          <Button
            startIcon={<CloseIcon />}
            variant="outlined"
            onClick={() => {
              setDetailsDialog(false)
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Edit */}
      <Dialog
        open={editDialogToggle}
        onClose={() => {
          setEditDialogToggle(false)
        }}
        maxWidth={"md"}
        fullWidth
      >
        <DialogTitle>Edit Course</DialogTitle>
        <Divider />
        {details !== null && (
          <DialogContent>
            <Typography variant="body1">
              Name: {details?.name}, Code: {details?.code}
            </Typography>
            <Typography variant="body1">
              Id: {details?.id}, Credit: {details?.credit}
            </Typography>
            <Typography variant="body1">
              Elective: {details?.elective ? "Yes" : "No"}, Project:{" "}
              {details?.project ? "Yes" : "No"}
            </Typography>
            <Typography variant="body1">
              Mark Weightage: [ Theory : {details?.markWeightage?.theory} ,
              Practical: {details?.markWeightage?.practical} ]
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Program</TableCell>
                    <TableCell>Syllabus</TableCell>
                    <TableCell>Semester</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.ProgramCourses?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item?.syllabus?.program?.name || "..."}
                      </TableCell>
                      <TableCell> {item?.syllabus?.name || "..."}</TableCell>
                      <TableCell> {item?.semesterId || "..."}</TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          variant="outlined"
                          startIcon={<DeleteForeverIcon />}
                          color="error"
                          onClick={() => {
                            removeCourseAssign(
                              item.courseId,
                              item.programId,
                              item.syllabusId,
                              item.semesterId
                            )
                            toast.info("Request has been submitted.", {
                              autoClose: 300,
                            })
                          }}
                        >
                          Remove
                        </Button>{" "}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Paper sx={{ padding: 1 }}>
              <Typography variant="h6" sx={{ margin: 1 }}>
                Assign Course
              </Typography>
              <Divider sx={{ margin: 1 }} />
              <Stack direction={"row"} gap={1}>
                <FormControl sx={{ m: 1, minWidth: "15rem" }}>
                  <InputLabel>Select a Program</InputLabel>
                  <Select
                    value={assignProgram ? assignProgram.id : ""}
                    onChange={handleAssignProgramChangle}
                    label="Select a Program"
                  >
                    <MenuItem key={0} value={0}>
                      Select a Program
                    </MenuItem>
                    {programs !== undefined &&
                      programs !== null &&
                      programs.map((program) => (
                        <MenuItem key={program.id} value={program.id}>
                          {program.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: "15rem" }}>
                  <InputLabel>Select a Syllabus</InputLabel>
                  <Select
                    value={assignSyllabus ? assignSyllabus : ""}
                    onChange={handleAssignSyllabusChange}
                    label="Select a Syallbus"
                  >
                    <MenuItem key={0} value={0}>
                      Select a Syallbus
                    </MenuItem>
                    {assignProgram !== undefined &&
                      assignProgram !== null &&
                      assignProgram.id > 0 &&
                      assignProgram.Syllabus.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ m: 1, minWidth: "15rem" }}>
                  <InputLabel>Select a Semester</InputLabel>
                  <Select
                    value={assignSemester ? assignSemester : ""}
                    onChange={handleAssignSemesterChange}
                    label="Select a Semester"
                  >
                    <MenuItem key={0} value={0}>
                      Select a Semester
                    </MenuItem>
                    {assignProgram !== undefined &&
                      assignProgram !== null &&
                      assignProgram.id > 0 &&
                      Array.from(
                        Array(
                          assignProgram.ProgramSemesters !== undefined
                            ? assignProgram.ProgramSemesters[0].semesterId
                            : 8
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
                </FormControl>
              </Stack>
              <Stack direction="row" gap={1}>
                <Button
                  variant="contained"
                  startIcon={<AddCircleIcon />}
                  onClick={() => {
                    addCourseAssign(
                      details.id,
                      assignProgram.id,
                      assignSyllabus,
                      assignSemester
                    )
                    toast.info("Request has been submitted. Please wait.", {
                      autoClose: 300,
                    })
                  }}
                  sx={{
                    padding: 1,
                    margin: 1,
                    minWidth: "15rem",
                  }}
                >
                  Assign Course
                </Button>
              </Stack>
            </Paper>
          </DialogContent>
        )}

        <Divider />
        <DialogActions>
          <Button
            startIcon={<CloseIcon />}
            variant="outlined"
            onClick={() => {
              setEditDialogToggle(false)
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for deletion */}

      <Dialog
        fullWidth
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false)
        }}
      >
        <DialogTitle>Confirm Course Deletion</DialogTitle>
        <Divider />
        <DialogContent sx={{ margin: 1, padding: 1 }}>
          {details !== null && (
            <>
              <Typography variant="body1">Name: {details?.name}</Typography>
              <Typography variant="body1">Code: {details?.code}</Typography>
              <Typography variant="body1">Id: {details?.id}</Typography>
              <Typography variant="body1">Credit: {details?.credit}</Typography>
              <Typography variant="body1">
                Elective: {details?.elective ? "Yes" : "No"}
              </Typography>
              <Typography variant="body1">
                Project: {details?.project ? "Yes" : "No"}
              </Typography>
              <Typography variant="body1">
                Mark Weightage: [ Theory : {details?.markWeightage?.theory} ,
                Practical: {details?.markWeightage?.practical} ]
              </Typography>
              <Typography variant="body1">
                Programs:
                <ol>
                  {details.ProgramCourses?.map((item, index) => (
                    <li key={index}>
                      {" "}
                      {item?.syllabus?.program?.name} ( {item?.syllabus?.name} )
                    </li>
                  ))}
                </ol>
              </Typography>
              <Typography variant="body1">
                Teachers:
                <ol>
                  {details.TeacherCourses?.map((item, index) => (
                    <li key={index}>
                      {" "}
                      {item?.teacher?.user?.name} ( {item?.teacher?.user?.email}{" "}
                      )
                    </li>
                  ))}
                </ol>
              </Typography>
              <Divider />
              <Typography variant="h5" sx={{ margin: 2 }}>
                Are you sure you want to delete this Course?
              </Typography>
            </>
          )}
        </DialogContent>
        <Divider />

        <DialogActions>
          <Button
            variant="outlined"
            sx={{ color: "red" }}
            startIcon={<DeleteForeverIcon />}
            onClick={() => {
              setOpenDeleteDialog(false)
              deleteCourse(details.id)
            }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            color="secondary"
            onClick={() => {
              setOpenDeleteDialog(false)
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <ImportDialog
        openToggle={importToggle}
        closeToggleFunc={() => {
          setImportToggle(false)
        }}
        dialogTitle={"Courses"}
        downloadLink={"/courses-sample.csv"}
        uploadFunc={uploadCourseCSV}
      />
    </Box>
  )
}

export default Courses
