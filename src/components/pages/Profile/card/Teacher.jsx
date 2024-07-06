import PropTypes from "prop-types"
import { Card, Typography } from "@mui/material"

const TeacherProfile = ({ data }) => {
  const { Teacher } = data

  return (
    <Card sx={{ margin: "20px", padding: "20px" }}>
      <Typography variant="h6">Teacher Details:</Typography>
      {Teacher.map((teacher) => (
        <div key={teacher.id}>
          <Typography variant="body1" margin={2} color="text.secondary">
            Teacher ID: {teacher.id}
          </Typography>

          {/* Add any other teacher details you want to display */}
        </div>
      ))}
    </Card>
  )
}

TeacherProfile.propTypes = {
  data: PropTypes.shape({
    email: PropTypes.string.isRequired,
    Teacher: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
}

export default TeacherProfile
