import { Card, Divider, Typography } from "@mui/material"
import PropTypes from "prop-types"

const StudentProfile = ({ data }) => {
  const { Student } = data

  return (
    <Card>
      <Typography variant="h6">Student Details</Typography>
      <Divider />
      {Student.map((student) => (
        <div key={student.id}>
          <Typography variant="body1" margin={2} color="text.secondary">
            <strong style={{ marginRight: "90px" }}>
              PU Registration Number
            </strong>{" "}
            {student.puRegNo}
          </Typography>
          <Divider />
          <Typography variant="body1" margin={2} color="text.secondary">
            <strong style={{ marginRight: "220px" }}>Faculty</strong>{" "}
            {student.program.department.faculty.name}
          </Typography>
          <Divider />
          <Typography variant="body1" margin={2} color="text.secondary">
            <strong style={{ marginRight: "210px" }}>Program</strong>{" "}
            {student.program.name}
          </Typography>
          <Divider />
          <Typography variant="body1" margin={2} color="text.secondary">
            <strong style={{ marginRight: "150px" }}>Symbol Number:</strong>{" "}
            {student.symbolNo}
          </Typography>
          <Divider />

          <Typography variant="body1" margin={2} color="text.secondary">
            <strong style={{ marginRight: "210px" }}>Syllabus</strong>{" "}
            {student.syllabus.name}
          </Typography>
          <Divider />

          <Typography variant="body1" margin={2} color="text.secondary">
            <strong style={{ marginRight: "200px" }}>Semester</strong>
            {student.semester.id}
          </Typography>
          <Divider />
          <Typography variant="body1" margin={2} color="text.secondary">
            <strong style={{ marginRight: "230px" }}>Status</strong>{" "}
            {student.StudentStatus[0].status}
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
