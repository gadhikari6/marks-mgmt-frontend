/* eslint-disable react/prop-types */
import {
  Typography,
} from '@material-ui/core'
function Teacher({data}) {

  return (
    <>
      <Typography variant="body1">
        <strong>Teacher ID:</strong> {data.teacher.id}
        
      </Typography>
      <Typography variant="body1">
        <strong>User ID:</strong> {data.teacher.userId}
      </Typography>
    </>
  )
}

export default Teacher