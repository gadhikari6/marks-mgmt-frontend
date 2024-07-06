import PropTypes from "prop-types"
import { Card, Typography } from "@mui/material"

const AdminProfile = ({ data }) => {
  const { Admin } = data

  return (
    <Card sx={{ margin: "20px", padding: "20px" }}>
      <Typography variant="h6">Admin Details:</Typography>
      {Admin.map((admin) => (
        <div key={admin.id}>
          <Typography variant="body1" margin={2} color="text.secondary">
            Admin ID: {admin.id}
          </Typography>
          {/* Add any other admin details you want to display */}
        </div>
      ))}
    </Card>
  )
}

AdminProfile.propTypes = {
  data: PropTypes.shape({
    email: PropTypes.string.isRequired,
    Admin: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
}

export default AdminProfile
