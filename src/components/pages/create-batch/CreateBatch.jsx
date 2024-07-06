import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
} from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { useContext } from "react"
import { LoginContext } from "../../../store/LoginProvider"
import { toast } from "react-toastify"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const CreateBatch = () => {
  const { loginState } = useContext(LoginContext)

  // url to upload batch to
  const uploadUrl = `${VITE_BACKEND_URL}/admin/divisions/batch`

  // validation schema for adding new batch into db
  const validationSchema = Yup.object({
    year: Yup.number().required("Year is required"),
    season: Yup.string().required(
      "Season (SPRING/FALL/WINTER/SUMMER) is required"
    ),
  })

  // formik
  const formik = useFormik({
    initialValues: {
      year: "",
      season: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const data = { ...values }
      try {
        await axios
          .post(uploadUrl, data, {
            headers: {
              Authorization: `Bearer ${loginState.token}`,
            },
          })
          .then(() => {
            // for success
            toast.success("Batch was added successfully.")
            formik.resetForm()
          })
          .catch((err) => {
            if (err.response.status === 409) {
              toast.warn(err)
            } else {
              toast.warn(err)
            }
          })
      } catch (err) {
        console.log(err) // logging
        toast.warn("Something went wrong. Please try again.")
      }
    },
  })

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Add Batch
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              id="year"
              name="year"
              label="Batch Year"
              variant="outlined"
              {...formik.getFieldProps("year")}
              fullWidth
              margin="normal"
              type="number"
              defaultValue={formik.values.year}
              error={formik.touched.year && formik.errors.year}
              helperText={formik.touched.year && formik.errors.year}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="season"
              margin="normal"
              defaultValue={formik.values.season}
              error={formik.touched.season && formik.errors.season}
              helperText={formik.touched.season && formik.errors.season}
              {...formik.getFieldProps("season")}
              label="Select Season"
              select
              fullWidth
              required
            >
              <MenuItem value="FALL">FALL</MenuItem>
              <MenuItem value="WINTER">WINTER</MenuItem>
              <MenuItem value="SPRING">SPRING</MenuItem>
              <MenuItem value="SUMMER">SUMMER</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              color="primary"
              sx={{ maxWidth: "max-content", height: "40px" }}
              size="medium"
              startIcon={<AddCircleOutlineIcon />}
            >
              Add Batch
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

export default CreateBatch
