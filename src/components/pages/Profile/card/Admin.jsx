/* eslint-disable react/prop-types */
import {
  Typography,
} from '@material-ui/core'


function Admin({data}) {
  return (
    <>
      <Typography variant="body1">
        <strong>User ID:</strong> {data.id}
      </Typography>
      {/* <Typography variant="body1">
        <strong>Activated:</strong> {data.activated ? 'Yes' : 'No'}
      </Typography>
      <Typography variant="body1">
        <strong>Expired:</strong> {data.expired ? 'Yes' : 'No'}
      </Typography> */}
    </>
  )
}

export default Admin