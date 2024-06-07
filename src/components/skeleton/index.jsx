import Skeleton from '@mui/material/Skeleton'
import {
  Card,
  CardContent,
  Grid,
} from '@material-ui/core'
import { useStyles } from '../../utils/style'
const EmptySkeleton = () => {
  const classes= useStyles()
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item>
          <Skeleton variant="circular" width={80} height={80} />
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Skeleton animation="wave" width={200} />
              <Skeleton animation="wave" width={200} />
            </Grid>
            <Grid item>
              <Card className={classes.card}>
                <CardContent>
                  <Skeleton animation="wave" width={200} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Skeleton animation="wave" width={200} />
                      <Skeleton animation="wave" width={200} />
                      <Skeleton animation="wave" width={200} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Skeleton animation="wave" width={200} />
                      <Skeleton animation="wave" width={200} />
                      <Skeleton animation="wave" width={200} />
                    </Grid>
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

export default EmptySkeleton