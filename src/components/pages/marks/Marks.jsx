import React, { useState } from "react"
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
} from "@mui/material"
import { toast } from "react-toastify"
import useMarks from "../../../hooks/useMarks"

const Marks = () => {
  const [selectedSemester, setSelectedSemester] = useState("")
  const { isLoading, error, data } = useMarks()

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
        {/* <Select value={selectedSemester || ""} onChange={handleSemesterChange}>
          <MenuItem value="">All Semesters</MenuItem>
          {data &&
            data.semesters &&
            data.semesters.length > 0 &&
            data.semesters.map((semester) => (
              <MenuItem value={semester.semester} key={semester.semester}>
                Semester {semester.semester}
              </MenuItem>
            ))}
        </Select> */}
        <Select value={selectedSemester || ""} onChange={handleSemesterChange}>
          <MenuItem value="">All Semesters</MenuItem>
          {data &&
            data.semesters &&
            data.semesters.length > 0 &&
            data.semesters.map((semester) => (
              <MenuItem value={semester.semester} key={semester.semester}>
                Semester {semester.semester}
              </MenuItem>
            ))}
        </Select>
      </div>

      {data && data.semesters && data.semesters.length > 0 ? (
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
                      <TableCell>{course.marks.theory || "-"}</TableCell>
                      <TableCell>{course.marks.practical || "-"}</TableCell>
                      <TableCell>
                        {course.marks.NotQualified
                          ? "NQ"
                          : course.marks.practical + course.marks.theory || "-"}
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
