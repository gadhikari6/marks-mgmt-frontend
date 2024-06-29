import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { DataGrid, GridEditInputCell, GridToolbar } from "@mui/x-data-grid"
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  Typography,
  Stack,
  Box,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import { toast } from "react-toastify"
import useTeacherCourses from "../../../hooks/useTeacherCourses"
import { LoginContext } from "../../../store/LoginProvider"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Close"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const AddModifyMarks = () => {
  const { isLoading, error, data: teacherCourses } = useTeacherCourses()
  const { loginState } = useContext(LoginContext)
  const token = loginState.token

  // course selected from dropdown
  const [selectedCourse, setSelectedCourse] = useState(null)

  const [marks, setMarks] = useState(null) // marks fetched

  // for loading data
  const [loading, setLoading] = useState(true)

  // for bulk editing
  const [isBulkEditing, setIsBulkEditing] = useState(false)

  // rows for datagrid
  const [rows, setRows] = useState([])

  // state to open or close single edit dialog
  const [singleEdit, setSingleEdit] = useState(false)
  const [selectedRow, setSelectedRow] = useState({})

  // fetch courses taught by the teaher
  const fetchCourseMarks = async () => {
    if (selectedCourse) {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_URL}/teachers/marks/all?course_id=${selectedCourse.courseId}&program_id=${selectedCourse.programId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (response.status === 200) {
          setMarks(response.data.marks)
          setLoading(false)
        }
      } catch (error) {
        console.log(error) // for logging
      }
    }
  }

  // fetch marks of selected course using useEffect
  useEffect(() => {
    fetchCourseMarks()
  }, [selectedCourse, token])

  // change selected course from dropdown
  const handleCourseChange = (event) => {
    const courseId = parseInt(event.target.value)
    const selected = teacherCourses.courses.find(
      (course) => course.courseId === courseId
    )
    setSelectedCourse(selected)
  }

  // upload bulk marks
  const uploadBulkMarks = () => {
    const updatedMarks = rows.map((row) => ({
      studentId: row.id,
      theory: row.theory,
      practical: row.practical,
      notQualified: row.notQualified,
    }))

    axios
      .put(
        `${VITE_BACKEND_URL}/teachers/marks/all?course_id=${selectedCourse.courseId}&program_id=${selectedCourse.programId}`,
        {
          courseId: selectedCourse.courseId,
          programId: selectedCourse.programId,
          marks: updatedMarks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setIsBulkEditing(false)
        if (response.status === 200) {
          toast.success("Marks updated successfully!")
          fetchCourseMarks()
        } else {
          toast.error("Failed to update marks. Please try again.")
        }
      })
      .catch((error) => {
        console.log(error) // for logging
        if (error.response.status === 400) {
          toast.warn(
            "Something wrong went with request. Please provide valid details and try again."
          )
        } else {
          toast.error(error.message)
        }
      })
  }

  // upload marks of a single student
  const uploadSingleStudentMark = async (data) => {
    try {
      await axios
        .put(
          `${VITE_BACKEND_URL}/teachers/marks`,
          { ...data },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          toast.success(`Marks was updated successfully.`)
          fetchCourseMarks()
        })
        .catch((err) => {
          console.log(err) // for logging
          if (err.response.status === 400) {
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

  // columns for editable data-grid
  const bulkEditColumns = [
    { field: "name", headerName: "Name", width: 180 },
    { field: "symbolNo", headerName: "Symbol", width: 150 },
    { field: "puRegNo", headerName: "PU Reg No", width: 180 },
    { field: "semesterId", headerName: "Semester", width: 75 },
    {
      field: "theory",
      headerName: "Theory",
      type: "number",
      width: 100,
      editable: true,
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: selectedCourse?.course?.markWeightage?.theory,
            min: 0,
          }}
        />
      ),
    },
    {
      field: "practical",
      headerName: "Practical",
      type: "number",
      width: 100,
      editable: true,
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: selectedCourse?.course?.markWeightage?.practical,
            min: 0,
          }}
        />
      ),
    },
    {
      field: "notQualified",
      headerName: "Not Qualified",
      type: "boolean",
      width: 130,
      editable: true,
    },
    {
      field: "total",
      headerName: "Total",
      width: 100,
    },
  ]

  // columns for non-editable data-grid
  const columns = [
    { field: "name", headerName: "Name", width: 180 },
    { field: "symbolNo", headerName: "Symbol", width: 150 },
    { field: "puRegNo", headerName: "PU Reg No", width: 180 },
    { field: "semesterId", headerName: "Semester", width: 75 },
    {
      field: "theory",
      headerName: "Theory",
      type: "number",
      width: 100,
      editable: false,
    },
    {
      field: "practical",
      headerName: "Practical",
      type: "number",
      width: 100,
      editable: false,
    },
    {
      field: "notQualified",
      headerName: "Not Qualified",
      type: "boolean",
      width: 130,
      editable: false,
    },
    { field: "total", headerName: "Total", width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => {
            setSelectedRow(params.row)
            setSingleEdit(true)
          }}
        >
          Edit
        </Button>
      ),
    },
  ]

  // update rows when course is changed
  useEffect(() => {
    if (marks !== undefined && marks !== null) {
      const updatedRows = marks.map((mark) => ({
        id: mark.studentId,
        studentId: mark.studentId,
        name: mark.student.user.name,
        symbolNo: mark.student.symbolNo,
        puRegNo: mark.student.puRegNo,
        semesterId: mark.student.semesterId,
        theory: mark.theory,
        practical: mark.practical,
        notQualified: mark.NotQualified,
        total: mark.practical + mark.theory,
      }))
      setRows(updatedRows)
    }
  }, [marks])

  // process row update
  const processRowUpdate = (newRow) => {
    // check for max value
    newRow.theory =
      newRow.theory > selectedCourse?.course?.markWeightage.theory
        ? selectedCourse?.course?.markWeightage.theory || newRow.theory
        : newRow.theory

    // check for negative value
    newRow.theory = newRow.theory < 0 ? 0 : newRow.theory

    newRow.practical = newRow.practical < 0 ? 0 : newRow.practical

    newRow.practical =
      newRow.practical > selectedCourse?.course?.markWeightage.practical
        ? selectedCourse?.course?.markWeightage.practical || newRow.practical
        : newRow.practical

    newRow.total = newRow.theory + newRow.practical

    setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)))
  }

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
        <FormControl sx={{ m: 1, minWidth: "35rem" }}>
          <InputLabel>Select a Course</InputLabel>
          <Select
            value={selectedCourse ? selectedCourse.courseId : ""}
            onChange={handleCourseChange}
          >
            {teacherCourses !== undefined &&
              teacherCourses !== null &&
              teacherCourses.courses.map((course) => (
                <MenuItem key={course.courseId} value={course.courseId}>
                  <Card variant="outlined" sx={{ width: "100%", padding: 1 }}>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.primary"
                      gutterBottom
                    >
                      Name: {course.course.name}{" "}
                      {course.course.name === selectedCourse?.course.name &&
                        "*"}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 13 }}
                      color="text.primary"
                      variant="body1"
                    >
                      Program: {course.program.name}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 13 }}
                      color="text.primary"
                      variant="subtitle"
                    >
                      Semester: {course.semester.id}
                    </Typography>
                  </Card>
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setIsBulkEditing(true)
          }}
          disabled={isBulkEditing || loading}
          sx={{
            justifySelf: "center",
            alignSelf: "end",
            margin: 2,
            marginLeft: "auto",
          }}
        >
          Edit Bulk
        </Button>
      </Box>

      {selectedCourse && (
        <div
          style={{
            height: 400,
            width: "100%",
            display: "flex",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={100}
            editMode="row"
            rowsPerPageOptions={[100]}
            checkboxSelection
            disableSelectionOnClick
            loading={isLoading}
            resizable={true}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>
      )}

      {/* Single edit dialog*/}
      <Dialog
        fullWidth
        open={singleEdit}
        onClose={() => {
          setSingleEdit(false)
        }}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const theory = Number(e.target.theory.value)
            const practical = Number(e.target.practical.value)
            const NQ = e.target.NQ.checked
            const maxTheory = selectedCourse.course.markWeightage.theory
            const maxPrac = selectedCourse.course.markWeightage.practical

            if (theory < 0 || theory > maxTheory) {
              toast.warn("Please provide a valid theory marks value.")
              return
            }

            if (practical < 0 || practical > maxPrac) {
              toast.warn("Please provide a valid practical marks value.")
              return
            }

            setSingleEdit(false)

            await uploadSingleStudentMark({
              practical: practical,
              theory: theory,
              notQualified: NQ,
              studentId: selectedRow.studentId,
              courseId: selectedCourse.courseId,
            })
          }}
        >
          <DialogTitle>Edit Single Student Marks</DialogTitle>
          <Divider />

          <DialogContent>
            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              Name: {selectedRow?.name}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              Symbol: {selectedRow?.symbolNo}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              Pu Regd No: {selectedRow?.puRegNo}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              Semester: {selectedRow?.semesterId}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              Course: {selectedCourse?.course.name}
            </Typography>

            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              Marks: [Theory: {selectedRow?.theory}, Practical:{" "}
              {selectedRow?.practical}, Not Qualified:{" "}
              {selectedRow?.notQualified ? "Yes" : "No"}]
            </Typography>

            <Divider />

            <Stack direction="row" gap={1}>
              <TextField
                id="theory"
                name="Theory"
                label="Theory *"
                type="number"
                variant="outlined"
                margin="normal"
              />
              <TextField
                id="practical"
                name="Practical"
                label="Practical *"
                type="number"
                variant="outlined"
                margin="normal"
              />
            </Stack>

            <FormControlLabel
              control={<Checkbox id="NQ" name="NQ" label="Not Qualified?" />}
              label="Not Qualified ?"
            />
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button variant="outlined" startIcon={<SaveIcon />} type="submit">
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={() => {
                setSingleEdit(false)
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/** Multi edit dialog */}
      <Dialog
        fullScreen
        open={isBulkEditing}
        onClose={() => {
          setIsBulkEditing(false)
        }}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            toast.info(
              "Marks upload request has been sent. Please wait for response.",
              { autoClose: 1000 }
            )

            // close the bulk edit form
            setIsBulkEditing(false)

            // send marks to server
            uploadBulkMarks()
          }}
        >
          <DialogTitle>Edit Student Marks</DialogTitle>
          <Divider />

          <DialogContent>
            <DataGrid
              rows={rows}
              columns={bulkEditColumns}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={() => {}}
              checkboxSelection={true}
              editMode="row"
              components={{
                Toolbar: GridToolbar,
              }}
            />
            <Typography variant="body2">
              Note: Before saving, please focus out of rows .
            </Typography>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button variant="outlined" startIcon={<SaveIcon />} type="submit">
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={() => {
                setIsBulkEditing(false)
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default AddModifyMarks
