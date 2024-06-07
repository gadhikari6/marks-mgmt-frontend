/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { Card, CardContent, Typography, Grid } from "@mui/material"

function UserRoleCards({ data }) {
  return (
    <Grid container spacing={1}>
      {data.UserRoles.map((userRole) => {
        const { name, description } = userRole.role

        return (
          <Card sx={{ margin: "10px" }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Role: {name}
              </Typography>
              <Typography variant="body2">{description}</Typography>
            </CardContent>
          </Card>
        )
      })}
    </Grid>
  )
}

export default UserRoleCards
