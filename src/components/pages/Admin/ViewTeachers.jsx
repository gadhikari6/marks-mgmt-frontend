import { useEffect } from "react"
import { useState } from "react"
import {
  Box,
  Button,
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
  Typography,
} from "@mui/material"
import InfoIcon from "@mui/icons-material/Info"
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
import { Update } from "@mui/icons-material"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // Fetching from .env file

export default function ViewTeachers() {
  const { loginState } = useContext(LoginContext)

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

  // open teacher detail editing dialog
  const [openEditDialog, setOpenEditDialog] = useState(false)

  // open teacher deletion dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  // open teacher add dialog
  const [openAddDialog, setAddDialog] = useState(false)

  // state to keep selected teacher detail for dialog
  const [selectedTeacher, setSelectedTeacher] = useState(null)

  // state to keep teacher's fetched details
  const [teacherDetails, setTeacherDetails] = useState(null)

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
            startIcon={<InfoIcon />}
            onClick={() => {
              setCurrentTeacher(params.row.id)
              fetchTeacherDetails(params.row.id)
              setOpenDetailsDialog(true)
            }}
          >
            Details
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => {
              setCurrentTeacher(params.row.id)
              // assign and remove courses to teacher
              // setOpenDetailsDialog(true)
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            sx={{ color: "red" }}
            startIcon={<DeleteForeverIcon />}
            onClick={() => {
              setCurrentTeacher(params.row.id)
              setOpenDeleteDialog(true)
            }}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ]

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

  // fetch list of students based on program selected
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

  // fetch students whenever program is changed
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
          pageSize={100}
          rowsPerPageOptions={[100]}
          resizable={true}
          components={{
            Toolbar: GridToolbar,
          }}
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
        <DialogTitle>Teacher Details</DialogTitle>
        <Divider />
        <DialogContent sx={{ margin: 1, padding: 1 }}>
          {selectedTeacher !== null && (
            <>
              <Stack gap={2} sx={{ padding: 1 }}>
                <Typography variant="body1">
                  Name: {selectedTeacher.name}
                </Typography>
                <Typography variant="body1">
                  Email: {selectedTeacher.email}
                </Typography>
                {teacherDetails !== null && (
                  <>
                    <Divider />
                    <Typography variant="h6">Teacher Courses</Typography>
                    <TableContainer component={Paper}>
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
                                          // setCurrentTeacher(params.row.id)
                                          // setOpenDeleteDialog(true)
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

                    <Typography variant="h6">Teacher Courses</Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      color="primary"
                      onClick={() => {
                        // setCurrentTeacher(params.row.id)
                        // setOpenDeleteDialog(true)
                      }}
                    >
                      Add Course
                    </Button>
                  </>
                )}
              </Stack>
            </>
          )}
        </DialogContent>
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
                Are you sure you want to delete this student?
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
              deleteStudent(selectedStudent.id)
            }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            color="secondary"
            onClick={(e) => {
              setOpenDeleteDialog(false)
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog to add teacher  */}
      <Dialog
        maxWidth={"max-content"}
        fullWidth
        open={openAddDialog}
        onClose={() => {
          setAddDialog(false)
          fetchTeachersList(selectedProgram.id)
        }}
      >
        <DialogTitle>Add new student</DialogTitle>
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
