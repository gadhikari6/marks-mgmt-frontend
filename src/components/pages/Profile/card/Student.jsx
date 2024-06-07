/* eslint-disable react/prop-types */
import { Typography } from "@material-ui/core"
function Student({ data }) {
  return (
    <>
      <Typography variant="body1">
        <strong>Symbol No:</strong> {data.student.symbolNo}
      </Typography>
      <Typography variant="body1">
        <strong>PU Reg No:</strong> {data.student.puRegNo}
      </Typography>
      <Typography variant="body1">
        <strong>Semester ID:</strong> {data.student.semesterId}
      </Typography>
      <Typography variant="body1">
        <strong>Level:</strong> {data.student.program.level.name}
      </Typography>
      <Typography variant="body1">
        <strong>Program:</strong> {data.student.program.department.name}
      </Typography>
      <Typography variant="body1">
        <strong>Syllabus:</strong> {data.student.syllabus.name}
      </Typography>
    </>
  )
}

export default Student
