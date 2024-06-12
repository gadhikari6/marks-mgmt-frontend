import { useState, useEffect, useContext } from "react"
import { LoginContext } from "../../../store/LoginProvider"
import {
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core"

const Marks = () => {
  const [semester, setSemester] = useState("")
  const [courseName, setCourseName] = useState("")
  const [courseCode, setCourseCode] = useState("")
  const [marksData, setMarksData] = useState(null)
  const { loginState } = useContext(LoginContext)
  const token = loginState.token

  useEffect(() => {
    fetchMarks()
  }, [])

  const fetchMarks = async () => {
    try {
      let url = "http://localhost:9000/api/v1/students/marks"
      if (semester || courseName || courseCode) {
        url += `?course_name=${courseName}&course_code=${courseCode}&semester=${semester}`
      }
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setMarksData(data)
    } catch (error) {
      console.error("An error has occurred: " + error.message)
    }
  }

  return (
    <div>
      <h1>Student Marks Page</h1>
      <TextField
        label="Semester"
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
      />
      <TextField
        label="Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />
      <TextField
        label="Course Code"
        value={courseCode}
        onChange={(e) => setCourseCode(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={fetchMarks}>
        Filter
      </Button>

      {marksData && marksData.semesters && marksData.semesters.length > 0 ? (
        <div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course ID</TableCell>
                  <TableCell>Course Code</TableCell>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Theory Marks</TableCell>
                  <TableCell>Practical Marks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {marksData.semesters.map((semester) =>
                  semester.courses.map((course) => (
                    <TableRow key={course.courseId}>
                      <TableCell>{course.courseId}</TableCell>
                      <TableCell>{course.course.code}</TableCell>
                      <TableCell>{course.course.name}</TableCell>
                      <TableCell>{course.marks.theory}</TableCell>
                      <TableCell>{course.marks.practical}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <Typography>No data available.</Typography>
      )}
    </div>
  )
}

export default Marks
