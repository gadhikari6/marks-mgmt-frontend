import { useState } from "react"
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import useMarks from "../../../hooks/useMarks"
import { useEffect } from "react"

const Marks = () => {
  const [selectedSemester, setSelectedSemester] = useState("")
  const { isLoading, error, data: response } = useMarks()

  // marks storage
  const [data, setData] = useState(null)

  // set response as data
  useEffect(() => {
    if (response !== undefined && response !== null) {
      setData(response)
    }
  }, [response])

  if (isLoading) {
    return <Typography>Loading marks...</Typography>
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>
  }

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value)
  }

  const filterMarksBySemester = (marksData, selectedSemester) => {
    if (selectedSemester === "") {
      return marksData.semesters
    } else {
      return marksData.semesters.filter(
        (semester) => semester.semester === selectedSemester
      )
    }
  }

  return (
    <div>
      <div>
        <FormControl variant="outlined" margin="normal" sx={{ width: 200 }}>
          <InputLabel id="sem-label">Select Semester*</InputLabel>

          <Select
            value={selectedSemester || ""}
            onChange={handleSemesterChange}
            fullWidth
            label="Select Semester*"
          >
            <MenuItem value="">All Semesters</MenuItem>
            {data !== undefined &&
              data !== null &&
              data.semesters.length > 0 &&
              data.semesters.map((semester) => (
                <MenuItem value={semester.semester} key={semester.semester}>
                  Semester {semester.semester}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>

      {data !== undefined && data !== null && data.semesters.length > 0 ? (
        filterMarksBySemester(data, selectedSemester).map((semester) => (
          <div key={semester.semester}>
            <Typography variant="h5" align="center" gutterBottom>
              Semester {semester.semester}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course Name</TableCell>
                    <TableCell>Course Code</TableCell>

                    <TableCell>Theory</TableCell>
                    <TableCell>Practical</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {semester.courses.map((course) => (
                    <TableRow key={course.courseId}>
                      <TableCell>{course.course.name || "-"}</TableCell>
                      <TableCell>{course.course.code || "-"}</TableCell>
                      <TableCell>
                        {(!course.marks.absent &&
                          !course.marks.expelled &&
                          !course.marks.NotQualified &&
                          course.marks.theory) ||
                          "-"}
                      </TableCell>
                      <TableCell>
                        {(!course.marks.absent &&
                          !course.marks.expelled &&
                          !course.marks.NotQualified &&
                          course.marks.practical) ||
                          "-"}
                      </TableCell>
                      <TableCell>
                        <Typography color={"red"}>
                          {course.marks.absent ? "Absent " : null}
                          {course.marks.expelled ? "Expelled " : null}
                          {course.marks.NotQualified ? "Not Qualified " : null}
                        </Typography>
                        <Typography>
                          {!course.marks.NotQualified &&
                            !course.marks.expelled &&
                            !course.marks.absent &&
                            course.marks.practical + course.marks.theory}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div style={{ margin: "30px" }}></div> {/* Adding a gap */}
          </div>
        ))
      ) : (
        <Typography>No data available.</Typography>
      )}
    </div>
  )
}

export default Marks
