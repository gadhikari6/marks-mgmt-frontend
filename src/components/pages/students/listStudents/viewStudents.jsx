import { useEffect } from "react"
import { useState } from "react"
import AddStudentForm from "../../addStudent/AddStudentForm"
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
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import InfoIcon from "@mui/icons-material/Info"
import CloseIcon from "@mui/icons-material/Close"
import EditIcon from "@mui/icons-material/Edit"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"

import AddCircleIcon from "@mui/icons-material/AddCircle"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import usePrograms from "../../../../hooks/count/usePrograms"
import { useContext } from "react"
import { LoginContext } from "../../../../store/LoginProvider"
import axios from "axios"
import { toast } from "react-toastify"
import * as yup from "yup"
import { useFormik } from "formik"
import useYearJoined from "../../../../hooks/count/useYearJoined"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // Fetching from .env file

export default function ViewStudents() {
  const { loginState } = useContext(LoginContext)

  // list of program in system
  const { data: programs } = usePrograms()

  // fetch distinct list of years of studetn joining
  const { data: years } = useYearJoined()

  //  keep track of year selection
  const [yearSelected, setYearSelected] = useState(0)

  //  keep track of semester selection
  const [semesterSelected, setSemesterSelected] = useState(0)

  // currently selected program
  const [selectedProgram, setSelectedProgram] = useState({
    id: 0,
    name: "All Programs",
  })

  const [responseData, setResponseData] = useState([])
  const [allStudents, setAllStudents] = useState(null)

  // open student detail dialog
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)

  // open student detail editing dialog
  const [openEditDialog, setOpenEditDialog] = useState(false)

  // open student deletion dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  // open student add dialog
  const [openAddDialog, setAddDialog] = useState(false)

  // state to keep selected student detail for dialog
  const [selectedStudent, setSelectedStudent] = useState(null)

  // state to keep student details for editing
  const [editStudentDetails, setEditStudentDetails] = useState({})

  // set selected student for viewing, editing and deleting student
  const setCurrentStudent = (id) => {
    // set selected student for viewing details
    setSelectedStudent(responseData.find((student) => student.id === id))
  }

  // handler for year selector
  const yearSelectHandler = (e) => {
    setYearSelected(Number(e.target.value) || 0)
  }

  // handler for semester selector
  const semesterSelectHandler = (e) => {
    setSemesterSelected(Number(e.target.value) || 0)
  }

  // columns for students data-grid
  const columns = [
    { field: "sn", headerName: "S.N.", width: 50 },

    { field: "name", headerName: "Name", width: 170 },
    { field: "symbolNo", headerName: "Symbol", width: 120 },
    { field: "puRegNo", headerName: "PU Reg No", width: 160 },
    { field: "program", headerName: "Program", width: 180 },
    { field: "semesterId", headerName: "Semester", width: 100 },
    { field: "status", headerName: "Status", width: 110 },
    { field: "dateOfBirth", headerName: "DOB", width: 110 },
    { field: "yearJoined", headerName: "Joined", width: 70 },

    {
      field: "actions",
      headerName: "Actions",
      width: 350,
      renderCell: (params) => (
        <Stack direction="row" gap={1}>
          {/* Fix this later using stack maybe */}
          <Button
            variant="outlined"
            startIcon={<InfoIcon />}
            onClick={() => {
              setCurrentStudent(params.row.id)
              setOpenDetailsDialog(true)
            }}
          >
            Details
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<EditIcon />}
            onClick={() => {
              setCurrentStudent(params.row.id)
              setEditStudentDetails({
                symbolNo: selectedStudent.symbolNo || "",
                puRegNo: selectedStudent.puRegNo || "",
                semester: selectedStudent.semesterId || 0,
                status: selectedStudent.StudentStatus[0].status || "ACTIVE",
              })
              setOpenEditDialog(true)
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            sx={{ color: "red" }}
            startIcon={<DeleteForeverIcon />}
            onClick={() => {
              setCurrentStudent(params.row.id)
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
  const fetchStudentList = async (
    programId = 0,
    semester = 0,
    yearJoined = 0
  ) => {
    const url = `${VITE_BACKEND_URL}/admin/students?program_id=${programId}&semester=${semester}&year_joined=${yearJoined}`
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${loginState.token}`,
        },
      })
      if (response.status === 200) {
        const students = response.data.students.map((student, index) => {
          return {
            sn: index + 1,
            id: student.id,
            name: student.user.name,
            email: student.user.email,
            symbolNo: student.symbolNo,
            puRegNo: student.puRegNo,
            semesterId: student.semesterId,
            program: student.program.name,
            programId: student.programId,
            syllabusId: student.syllabusId,
            status: student.StudentStatus[0].status || "",
            syllabus: student.syllabus.name,
            yearJoined: student.yearJoined,
            dateOfBirth: student.dateOfBirth,
          }
        })
        // set students data
        setAllStudents(students)
        setResponseData(response.data.students)
      }
    } catch (error) {
      console.log(error) // for logging
      toast.warn(`Error while fetching data: ${error.message}`)
    }
  }

  // fetch students whenever program is changed
  useEffect(() => {
    fetchStudentList(selectedProgram.id, semesterSelected, yearSelected)
  }, [selectedProgram, semesterSelected, yearSelected])

  // schema for edit dialog
  const editStudentSchema = yup.object({
    symbolNo: yup.string().min(6).max(20).required("Symbol number is required"),
    semester: yup.number().positive().required("Semester is required"),
    puRegNo: yup
      .string()
      .min(6)
      .max(20)
      .required("Registration number is required"),
  })

  // form for edit dialog
  const editForm = useFormik({ validationSchema: editStudentSchema })

  // update single student details
  const updateStudentDetails = async (studentId, details) => {
    try {
      await axios
        .put(
          `${VITE_BACKEND_URL}/admin/students/${studentId}`,
          { ...details },
          { headers: { Authorization: `Bearer ${loginState.token}` } }
        )
        .then((response) => {
          toast.success(`Marks was updated successfully.`)
          fetchStudentList(selectedProgram.id)
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

  // update single student details
  const deleteStudent = async (studentId) => {
    try {
      await axios
        .delete(`${VITE_BACKEND_URL}/admin/students/${studentId}`, {
          headers: { Authorization: `Bearer ${loginState.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            toast.success(`Student was deleted successfully.`)
            fetchStudentList(selectedProgram.id)
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
        <FormControl sx={{ m: 1, minWidth: "15rem" }}>
          <InputLabel label="year-joined">Select a Year-Joined</InputLabel>
          <Select
            value={yearSelected ? yearSelected : 0}
            onChange={yearSelectHandler}
            labelId="year-joined"
            label="Select a Year-Joined"
            id="yearJoined"
          >
            <MenuItem key={0} value={0}>
              All Years
            </MenuItem>
            {years !== undefined &&
              years !== null &&
              years.map((year) => (
                <MenuItem key={year.yearJoined} value={year.yearJoined}>
                  {year.yearJoined}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: "15rem" }}>
          <InputLabel label="sem-label">Select a semester</InputLabel>
          <Select
            id="semester"
            value={semesterSelected ? semesterSelected : 0}
            onChange={semesterSelectHandler}
            label="Select a semester"
          >
            <MenuItem key={0} value={0}>
              All Semesters
            </MenuItem>
            {selectedProgram !== null &&
              Array.from(
                Array(
                  selectedProgram.ProgramSemesters !== undefined
                    ? selectedProgram.ProgramSemesters[0].semesterId
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
          Add Student
        </Button>
      </Box>

      {allStudents !== null && (
        <DataGrid
          sx={{ marginTop: 1 }}
          rows={allStudents}
          columns={columns}
          pageSize={100}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          rowsPerPageOptions={[100]}
          resizable={true}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      )}

      {/* Dialog to view student details */}
      <Dialog
        fullWidth
        open={openDetailsDialog}
        onClose={() => {
          setOpenDetailsDialog(false)
        }}
      >
        <DialogTitle>Student Details</DialogTitle>
        <Divider />
        <DialogContent sx={{ margin: 1, padding: 1 }}>
          {selectedStudent !== null && (
            <>
              <Stack gap={2} sx={{ padding: 1 }}>
                <Typography variant="body1">
                  Name: {selectedStudent.user.name}
                </Typography>
                <Typography variant="body1">
                  Email: {selectedStudent.user.email}
                </Typography>
                <Typography variant="body1">
                  Joined Year: {selectedStudent.yearJoined}, Date Of Birth:{" "}
                  {selectedStudent.dateOfBirth}
                </Typography>
                <Typography variant="body1">
                  Contact No:
                  {selectedStudent.user.contactNo}, Address :{" "}
                  {selectedStudent.user.address}
                </Typography>
                <Typography variant="body1">
                  Symbol Number: {selectedStudent.symbolNo}
                </Typography>
                <Typography variant="body1">
                  PU Registration Number: {selectedStudent.puRegNo}
                </Typography>
                <Typography variant="body1">
                  Program: {selectedStudent.program?.name}
                </Typography>{" "}
                <Typography variant="body1">
                  Syllabus: {selectedStudent?.syllabus.name}
                </Typography>
                <Typography variant="body1">
                  Semester: {selectedStudent.semesterId}, Level:{" "}
                  {selectedStudent.program.level.name || ""}
                </Typography>
                <Typography variant="body1">
                  Student Status: {selectedStudent?.StudentStatus[0]?.status}
                </Typography>
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

      {/* Dialog to edit student details */}
      <Dialog
        fullWidth
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false)
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setOpenEditDialog(false)
            toast.info("Request for update has been sent.", { autoClose: 500 })

            updateStudentDetails(selectedStudent.id, editStudentDetails)
          }}
        >
          <DialogTitle>Edit Student Details</DialogTitle>
          <Divider />
          <DialogContent sx={{ margin: 1, padding: 1 }}>
            {selectedStudent !== null && (
              <>
                <DialogContent>
                  <Typography variant="body1">
                    Name: {selectedStudent.user.name}
                  </Typography>
                  <Stack direction="row" gap={2}>
                    <TextField
                      id="symbolNo"
                      name="symbolNo"
                      label="Symbol No"
                      fullWidth
                      margin="normal"
                      {...editForm.getFieldProps("symbolNo")}
                      error={
                        editForm.touched.symbolNo && editForm.errors.symbolNo
                      }
                      helperText={
                        editForm.touched.symbolNo && editForm.errors.symbolNo
                      }
                      defaultValue={selectedStudent.symbolNo}
                      onChange={(e) => {
                        setEditStudentDetails((prev) => ({
                          ...prev,
                          symbolNo: e.target.value,
                        }))
                      }}
                    />
                    <TextField
                      id="puRegNo"
                      label="PU Registration No"
                      fullWidth
                      margin="normal"
                      {...editForm.getFieldProps("puRegNo")}
                      error={
                        editForm.touched.puRegNo && editForm.errors.puRegNo
                      }
                      helperText={
                        editForm.touched.puRegNo && editForm.errors.puRegNo
                      }
                      defaultValue={selectedStudent.puRegNo}
                      onChange={(e) => {
                        setEditStudentDetails((prev) => ({
                          ...prev,
                          puRegNo: e.target.value,
                        }))
                      }}
                    />
                  </Stack>
                  <Stack direction="row" gap={2}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={editForm.touched.status && editForm.errors.status}
                    >
                      {/* <InputLabel id="status-label">Status *</InputLabel> */}
                      <TextField
                        id="status"
                        name="status"
                        label="Status"
                        fullWidth
                        margin="normal"
                        defaultValue={
                          selectedStudent?.StudentStatus[0]?.status || ""
                        }
                        onChange={(e) => {
                          setEditStudentDetails((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }}
                        // value={selectedStudent?.StudentStatus[0]?.status || ""}
                        select
                      >
                        <MenuItem id="ACTIVE" value="ACTIVE">
                          ACTIVE
                        </MenuItem>
                        <MenuItem id="DROPOUT" value="DROPOUT">
                          DROPOUT
                        </MenuItem>
                      </TextField>
                    </FormControl>

                    <FormControl
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={
                        editForm.touched.semester && editForm.errors.semester
                      }
                    >
                      {/* <InputLabel id="semester-label">Semester *</InputLabel> */}
                      <TextField
                        name="semester"
                        id="semester"
                        label="Semester"
                        fullWidth
                        margin="normal"
                        defaultValue={selectedStudent?.semesterId}
                        value={selectedStudent?.semesterId}
                        onChange={(e) => {
                          setEditStudentDetails((prev) => ({
                            ...prev,
                            semester: Number(e.target.value),
                          }))
                        }}
                        select
                      >
                        {selectedProgram !== null &&
                          Array.from(
                            Array(
                              selectedProgram.ProgramSemesters !== undefined
                                ? selectedProgram.ProgramSemesters[0].semesterId
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
                      </TextField>
                    </FormControl>
                  </Stack>
                </DialogContent>
              </>
            )}
          </DialogContent>
          <Divider />

          <DialogActions>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              type="submit"
              color="primary"
            >
              Confirm
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={() => {
                setOpenEditDialog(false)
              }}
              color="secondary"
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog to delete student  */}
      <Dialog
        fullWidth
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false)
        }}
      >
        <DialogTitle>Confirm Student Deletion</DialogTitle>
        <Divider />
        <DialogContent sx={{ margin: 1, padding: 1 }}>
          {selectedStudent !== null && (
            <>
              <Typography variant="body1">
                Name: {selectedStudent.user.name}
              </Typography>
              <Typography variant="body1">
                Symbol Number: {selectedStudent.symbolNo}
              </Typography>
              <Typography variant="body1">
                PU Registration Number: {selectedStudent.puRegNo}
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

      {/* Dialog to add student  */}
      <Dialog
        maxWidth={"lg"}
        fullWidth
        open={openAddDialog}
        onClose={() => {
          setAddDialog(false)
          fetchStudentList(selectedProgram.id)
        }}
      >
        <DialogTitle>Add new student</DialogTitle>
        <Divider />
        <DialogContent sx={{ marginTop: -3 }}>
          <AddStudentForm />
        </DialogContent>
        <Divider />

        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            color="secondary"
            onClick={() => {
              setAddDialog(false)
              fetchStudentList(selectedProgram.id)
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
