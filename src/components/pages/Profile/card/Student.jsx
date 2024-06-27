import { Card, Typography } from "@mui/material"
import PropTypes from "prop-types"

const StudentProfile = ({ data }) => {
  const { Student } = data

  return (
    <Card sx={{ margin: "20px", padding: "20px" }}>
      <Typography variant="h6">Student Details:</Typography>
      {Student.map((student) => (
        <div key={student.id}>
          <Typography variant="body1">Symbol No: {student.symbolNo}</Typography>
          <Typography variant="body1">PU Reg No: {student.puRegNo}</Typography>
          <Typography variant="body1">
            Program: {student.program.name}
          </Typography>
          <Typography variant="body1">
            Faculty: {student.program.department.faculty.name}
          </Typography>
          <Typography variant="body1">
            Status: {student.StudentStatus[0].status}
          </Typography>
          <Typography variant="body1">
            Syllabus: {student.syllabus.name}
          </Typography>
          <Typography variant="body1">
            Semester: {student.semester.id}
          </Typography>

          {/* Add any other student details you want to display */}
        </div>
      ))}
    </Card>
  )
}

StudentProfile.propTypes = {
  data: PropTypes.shape({
    email: PropTypes.string.isRequired,
    Student: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        symbolNo: PropTypes.string.isRequired,
        puRegNo: PropTypes.string.isRequired,
        program: PropTypes.shape({
          name: PropTypes.string.isRequired,
          department: PropTypes.shape({
            faculty: PropTypes.shape({
              name: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired,
        }).isRequired,
        StudentStatus: PropTypes.arrayOf(
          PropTypes.shape({
            status: PropTypes.string.isRequired,
            studentId: PropTypes.number.isRequired,
          })
        ).isRequired,
        syllabus: PropTypes.shape({
          name: PropTypes.string.isRequired,
        }).isRequired,
        semester: PropTypes.shape({
          id: PropTypes.number.isRequired,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
}

export default StudentProfile
