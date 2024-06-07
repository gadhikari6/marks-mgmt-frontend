import { Avatar, Card, CardContent, Grid, Typography } from "@material-ui/core"
import EmptySkeleton from "../../skeleton"
import { useStyles } from "../../../utils/style"
import useProfile from "../../../hooks/useProfile"
import Student from "./card/Student"
import Teacher from "./card/Teacher"
import Admin from "./card/Admin"
import UserRoleCards from "./card/UserRolecards"
function Profile() {
  const classes = useStyles()
  // const [data, setData] = useState(null)
  const { isLoading, error, data } = useProfile()

  if (isLoading) {
    return <EmptySkeleton />
  }

  if (error) return "An error has occurred: " + error.message
  // console.log(data)

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item>
          <Avatar
            alt="User Avatar"
            src={data.avatarUrl}
            className={classes.avatar}
          />
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography variant="h5">{data.name}</Typography>
              <Typography variant="subtitle1">{data.email}</Typography>
            </Grid>
            <Grid item>
              <Card className={classes.card}>
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    <strong>
                      {data.UserRoles.map((userRole) =>
                        userRole.role.name
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")
                      ).join(", ")}{" "}
                      Profile
                    </strong>
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        <strong>Address:</strong> {data.address}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Contact No:</strong> {data.contactNo}
                      </Typography>
                      <Typography variant="body1">
                        <strong>User Roles:</strong>{" "}
                        {data.UserRoles.map(
                          (userRole) => userRole.role.name
                        ).join(", ")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {data.UserRoles[0].role.name === "student" && (
                        //student
                        <Student data={data} />
                      )}
                      {data.UserRoles[0].role.name === "teacher" && (
                        //teacherComponent
                        <Teacher data={data} />
                      )}
                      {data.UserRoles[0].role.name === "admin" && (
                        <Admin data={data} />
                      )}
                    </Grid>

                    <UserRoleCards data={data} />
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default Profile
