import { useEffect } from "react"
import { useState } from "react"
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"

import DeleteForeverIcon from "@mui/icons-material/DeleteForever"

import AddCircleIcon from "@mui/icons-material/AddCircle"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { useContext } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import AddTeacherForm from "../addTeacher/AddTeacherForm"
import usePrograms from "../../../hooks/count/usePrograms"
import { LoginContext } from "../../../store/LoginProvider"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // Fetching from .env file

export default function ViewTeachers() {
  const { loginState } = useContext(LoginContext)

  // check if user is admin or not
  const [isAdmin, setIsAdmin] = useState(false)

  // check for role change
  useEffect(() => {
    const role = loginState.roles.currentRole
    if (role === undefined) return
    if (role === "examHead") {
      setIsAdmin(false)
    } else if (role === "admin") {
      setIsAdmin(true)
    }
  }, [loginState])

  // list of program in system
  const { data: programs } = usePrograms()

  // currently selected program
  const [selectedProgram, setSelectedProgram] = useState({
    id: 0,
    name: "All Programs",
  })

  const [allTeachers, setAllTeachers] = useState(null)

  // open teacher detail dialog
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)

  // open teacher deletion dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  // open teacher add dialog
  const [openAddDialog, setAddDialog] = useState(false)

  // state to keep selected teacher detail for dialog
  const [selectedTeacher, setSelectedTeacher] = useState(null)

  // state to keep teacher's fetched details
  const [teacherDetails, setTeacherDetails] = useState(null)

  // used when assigning course to a teacher
  const [selectedCourseProgram, setSelectedCourseProgram] = useState(0)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(0)

  // fetch courses for a program
  useEffect(() => {
    if (selectedCourseProgram > 0) {
      fetchCourses(selectedCourseProgram)
    }
  }, [selectedCourseProgram])

  // set selected teacher for viewing, editing and deleting teacher
  const setCurrentTeacher = (id) => {
    // set selected teacher for viewing details
    setSelectedTeacher(allTeachers.find((teacher) => teacher.id === id))
  }
  // columns for teacher data-grid
  const columns = [
    { field: "sn", headerName: "S.N.", width: 100 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      width: 350,
      renderCell: (params) => (
        <Stack direction="row" gap={1}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => {
              setCurrentTeacher(params.row.id)
              fetchTeacherDetails(params.row.id)
              setOpenDetailsDialog(true)
            }}
          >
            Courses
          </Button>

          <Button
            variant="outlined"
            sx={{ color: "red" }}
            startIcon={<DeleteForeverIcon />}
            onClick={() => {
              setCurrentTeacher(params.row.id)
              setOpenDeleteDialog(true)
            }}
            disabled={!isAdmin}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ]

  // change selected program from dropdown for fetching teacher list
  const handleProgramChange = (event) => {
    const programId = parseInt(event.target.value)
    if (programId === 0) {
      setSelectedProgram({ id: 0, name: "All Programs" })
    } else {
      const selected = programs.find((program) => program.id === programId)
      setSelectedProgram(selected)
    }
  }

  // fetch courses from the system
  const fetchCourses = async (programId = 0) => {
    let url = `${VITE_BACKEND_URL}/public/courses`

    if (programId > 0) {
      url += `?program_id=${programId}`
    }

    try {
      const response = await axios.get(url)
      if ((response.status === 200) & (response.data.length > 0)) {
        // set courses for listing
        setCourses(response.data)
      }
    } catch (error) {
      console.log(error) // for logging
      toast.warn(`Error while fetching program courses: ${error.message}`)
    }
  }

  // fetch list of teacherss based on program selected
  const fetchTeachersList = async (programId) => {
    const url =
      programId === 0
        ? `${VITE_BACKEND_URL}/admin/teachers`
        : `${VITE_BACKEND_URL}/admin/teachers?program_id=${programId}`
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${loginState.token}`,
        },
      })
      if (response.status === 200) {
        console.log(response.data.teachers)
        const teachers = response.data.teachers.map((teacher, index) => ({
          id: teacher.id,
          sn: index + 1,
          name: teacher.user.name,
          email: teacher.user.email,
        }))
        setAllTeachers(teachers)
      }
    } catch (error) {
      console.log(error) // for logging
      toast.warn(`Error while fetching data: ${error.message}`)
    }
  }

  // get a teacher's details
  const fetchTeacherDetails = async (teacherId) => {
    const url = `${VITE_BACKEND_URL}/admin/teachers/${teacherId}`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${loginState.token}`,
        },
      })
      if (response.status === 200) {
        setTeacherDetails(response.data.teacher)
      }
    } catch (error) {
      setTeacherDetails(null)
      console.log(error) // for logging
      toast.warn(`Error while fetching teacher data: ${error.message}`)
    }
  }

  // fetch teachers whenever program is changed
  useEffect(() => {
    fetchTeachersList(selectedProgram.id)
  }, [selectedProgram])

  // delete a teacher
  const deleteTeacher = async (teacherId) => {
    try {
      await axios
        .delete(`${VITE_BACKEND_URL}/admin/teachers/${teacherId}`, {
          headers: { Authorization: `Bearer ${loginState.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            toast.success(`Teacher was deleted successfully.`)
            fetchTeachersList(selectedProgram.id)
          }
        })
        .catch((err) => {
          console.log(err) // for logging
          if (err.response.status === 400 || err.response.status === 404) {
            toast.warn("Please check values and try again.")
          } else {
            toast.warn("Something went wrong. Please try again later.")
          }
        })
    } catch (err) {
      console.log(err) // for logging
      toast.warn("Something went wrong. Please try again later.")
    }
  }

  // remove a course from teacher
  const removeCourseFromTeacher = async (teacherId, courseId, programId) => {
    try {
      const body = {
        teacherId: teacherId,
        programId: programId,
      }
      await axios
        .delete(`${VITE_BACKEND_URL}/admin/courses/${courseId}/teacher`, {
          headers: { Authorization: `Bearer ${loginState.token}` },
          data: { ...body },
        })
        .then((response) => {
          if (response.status === 200) {
            toast.success(`Course was removed successfully.`)
            fetchTeacherDetails(selectedTeacher.id)
          }
        })
        .catch((err) => {
          console.log(err) // for logging
          if (err.response.status === 400 || err.response.status === 404) {
            toast.warn("Please check values and try again.")
          } else {
            toast.warn("Something went wrong. Please try again later.")
          }
        })
    } catch (err) {
      console.log(err) // for logging
      toast.warn("Something went wrong. Please try again later.")
    }
  }

  // asign course to a teacher
  const assignCourseToTeacher = async (teacherId, courseId, programId) => {
    try {
      const body = {
        teacherId: teacherId,
        programId: programId,
      }
      await axios
        .post(`${VITE_BACKEND_URL}/admin/courses/${courseId}/teacher`, body, {
          headers: { Authorization: `Bearer ${loginState.token}` },
        })
        .then((response) => {
          if (response.status === 201) {
            toast.success(`Course was added successfully.`)
            fetchTeacherDetails(selectedTeacher.id)
          }
        })
        .catch((err) => {
          console.log(err) // for logging
          if (err.response.status === 409) {
            toast.warn("Teacher is already assigned with the course.")
          } else if (
            err.response.status === 400 ||
            err.response.status === 404
          ) {
            toast.warn("Please check values and try again.")
          } else {
            toast.warn("Something went wrong. Please try again later.")
          }
        })
    } catch (err) {
      console.log(err) // for logging
      toast.warn("Something went wrong. Please try again later.")
    }
  }

  return (
    <Box
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
          "gothammedium-webfont",
        ].join(","),
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <FormControl sx={{ m: 1, minWidth: "35rem" }}>
          <InputLabel>Select a Program</InputLabel>
          <Select
            value={selectedProgram ? selectedProgram.id : ""}
            onChange={handleProgramChange}
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
            marginLeft: "auto",
          }}
        >
          Add Teacher
        </Button>
      </Box>

      {allTeachers !== null && (
        <DataGrid
          sx={{ marginTop: 1 }}
          rows={allTeachers}
          columns={columns}
          resizable={true}
          components={{
            Toolbar: GridToolbar,
          }}
          checkboxSelection
        />
      )}

      {/* Dialog to view teacher details */}
      <Dialog
        maxWidth={"lg"}
        fullWidth
        open={openDetailsDialog}
        onClose={() => {
          setOpenDetailsDialog(false)
        }}
      >
        {selectedTeacher !== null && (
          <>
            <DialogTitle>
              Edit Teacher Courses [ Name: {selectedTeacher.name}, Email:{"  "}
              {selectedTeacher.email} ]
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ margin: 1, padding: 1 }}>
              <Stack gap={2} sx={{ padding: 1 }}>
                {teacherDetails !== null && (
                  <>
                    <Typography variant="h6">Teacher Courses</Typography>
                    <TableContainer sx={{ marginTop: -2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Course Name</TableCell>
                            <TableCell>Credit</TableCell>
                            <TableCell>Program</TableCell>
                            <TableCell>Semester</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {teacherDetails.TeacherCourses.length > 0 &&
                            teacherDetails.TeacherCourses.map(
                              (course, index) => (
                                <>
                                  <TableRow key={index}>
                                    <TableCell>{course.course.name}</TableCell>
                                    <TableCell>
                                      {course.course.credit}
                                    </TableCell>

                                    <TableCell key={course.program.name}>
                                      {course.program.name} (
                                      {course.syllabus.name})
                                    </TableCell>

                                    <TableCell key={course.semester.id + index}>
                                      {course.semester.id}
                                    </TableCell>

                                    <TableCell key={course.id + "a"}>
                                      <Button
                                        variant="outlined"
                                        sx={{ color: "red" }}
                                        startIcon={<DeleteForeverIcon />}
                                        onClick={() => {
                                          // remove course
                                          removeCourseFromTeacher(
                                            teacherDetails.id,
                                            course.courseId,
                                            course.programId
                                          )
                                        }}
                                      >
                                        Remove
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                </>
                              )
                            )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Divider />
                    <Typography variant="h6">Assign Course</Typography>
                    <Stack direction="row" gap={1} sx={{ marginTop: -2 }}>
                      <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel id="program-label">
                          Select Program*
                        </InputLabel>
                        <Select
                          required
                          label="Select Program*"
                          id="program"
                          fullWidth
                          labelId="program-label"
                          onChange={(e) => {
                            setSelectedCourseProgram(e.target.value)
                          }}
                        >
                          {programs !== null &&
                            programs.length > 0 &&
                            programs.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                <Card
                                  variant="outlined"
                                  sx={{ width: "100%", padding: 1 }}
                                >
                                  <Typography
                                    sx={{ fontSize: 15 }}
                                    color="text.primary"
                                    gutterBottom
                                  >
                                    {item.name}
                                  </Typography>
                                  <Typography
                                    sx={{ fontSize: 13 }}
                                    color="text.primary"
                                    variant="body1"
                                  >
                                    {item?.level?.name}
                                    {", "}
                                    {item?.department?.name}
                                  </Typography>
                                </Card>
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel id="course-label">
                          Select Course*
                        </InputLabel>
                        <Select
                          required
                          label="Select Course*"
                          id="syllabus"
                          fullWidth
                          labelId="course-label"
                          onChange={(e) => {
                            // set the course
                            setSelectedCourse(e.target.value)
                          }}
                        >
                          {courses !== null &&
                            courses.length > 0 &&
                            courses.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                <Card
                                  variant="outlined"
                                  sx={{ width: "100%", padding: 1 }}
                                >
                                  <Typography
                                    sx={{ fontSize: 15 }}
                                    color="text.primary"
                                    gutterBottom
                                  >
                                    {item.name}
                                  </Typography>
                                  <Typography
                                    sx={{ fontSize: 13 }}
                                    color="text.primary"
                                    variant="body1"
                                  >
                                    Code: {item.code}, Credit: {item.credit},
                                    Elective: {item.elective ? "Yes" : "No"},
                                    Project: {item.project ? "Yes" : "No"}
                                  </Typography>
                                </Card>
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    <Button
                      sx={{ maxWidth: "max-content", padding: 1 }}
                      variant="contained"
                      startIcon={<AddIcon />}
                      color="primary"
                      onClick={async () => {
                        toast.info(
                          "Request for assigning course has been sent.",
                          { autoClose: 1000 }
                        )
                        // assign course to a teacher
                        await assignCourseToTeacher(
                          selectedTeacher.id,
                          selectedCourse,
                          selectedCourseProgram
                        )
                      }}
                    >
                      Add Course
                    </Button>
                  </>
                )}
              </Stack>
            </DialogContent>
          </>
        )}

        <Divider />

        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={() => {
              setOpenDetailsDialog(false)
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog to delete teacher  */}
      <Dialog
        fullWidth
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false)
        }}
      >
        <DialogTitle>Confirm Teacher Deletion</DialogTitle>
        <Divider />
        <DialogContent sx={{ margin: 1, padding: 1 }}>
          {selectedTeacher !== null && (
            <>
              <Typography variant="body1">
                Name: {selectedTeacher.name}
              </Typography>
              <Typography variant="body1">
                Email: {selectedTeacher.email}
              </Typography>
              <Typography variant="h5" sx={{ margin: 2 }}>
                Are you sure you want to delete this teacher?
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
              deleteTeacher(selectedTeacher.id)
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

      {/* Dialog to add teacher  */}
      <Dialog
        maxWidth={"md"}
        fullWidth
        open={openAddDialog}
        onClose={() => {
          setAddDialog(false)
          fetchTeachersList(selectedProgram.id)
        }}
      >
        <DialogTitle>Add new teacher</DialogTitle>
        <Divider />
        <DialogContent sx={{ marginTop: -3 }}>
          <AddTeacherForm />
        </DialogContent>
        <Divider />

        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            color="secondary"
            onClick={() => {
              setAddDialog(false)
              fetchTeachersList(selectedProgram.id)
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
