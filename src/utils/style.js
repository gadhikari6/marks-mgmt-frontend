import { makeStyles } from "@material-ui/core/styles"

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1.5),
    boxShadow: theme.shadows[2],
  },
  avatar: {
    width: 100,
    height: 100,
    marginRight: theme.spacing(2),
  },
  card: {
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(1.5),
    boxShadow: theme.shadows[2],
  },
}))
