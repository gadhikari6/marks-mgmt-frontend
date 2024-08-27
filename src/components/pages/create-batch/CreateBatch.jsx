import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Stack,
} from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { useContext } from "react"
import { LoginContext } from "../../../store/LoginProvider"
import { toast } from "react-toastify"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import { useQueryClient } from "@tanstack/react-query"
import useCurrentBatch from "../../../hooks/count/useCurrentBatch"
import useBatches from "../../../hooks/count/useBatches"
import { useState } from "react"
import { useEffect } from "react"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

// method to create new batch
const CreateBatch = () => {
  const { loginState } = useContext(LoginContext)

  // query clients
  const queryClient = useQueryClient()

  // list of current and all batches
  const { data: currentBatch } = useCurrentBatch()
  const { data: allBatches } = useBatches()

  // current batch
  const [year, setYear] = useState("")
  const [season, setSeason] = useState("")

  // target batch details
  const [targetBatchDetails, setTargetBatchDetails] = useState(null)

  // fetch current batch details
  useEffect(() => {
    if (currentBatch !== undefined && currentBatch !== null) {
      setYear(currentBatch.year)
      setSeason(currentBatch.season)
    }
  }, [currentBatch])

  useEffect(() => {
    if (allBatches !== undefined && allBatches !== null) {
      setTargetBatchDetails(allBatches.filter((batch) => batch.used === false))
    }
  }, [allBatches])

  // target batch for upgrade
  const [targetBatch, setTargetBatch] = useState(0)

  // url to create batch
  const uploadUrl = `${VITE_BACKEND_URL}/admin/divisions/batch`

  // url to upgrade batch
  const upgradeUrl = `${VITE_BACKEND_URL}/admin/divisions/batch/upgrade`

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
            queryClient.invalidateQueries(["batches"])
            formik.resetForm()
          })
          .catch((err) => {
            console.log(err.response.data.error.message)
            if (err.response.status === 409) {
              toast.warn(err.response.data.error.message)
            } else {
              toast.warn(err.response.data.error.message)
            }
          })
      } catch (err) {
        console.log(err) // logging
        toast.warn("Something went wrong. Please try again.")
      }
    },
  })

  // handler for target batch select
  const targetBatchHandler = (e) => {
    if (Number(e.target.value) === 0) return
    setTargetBatch(Number(e.target.value) || 0)
  }

  // method call for upgrading batch
  const upgradeBatch = async () => {
    try {
      await axios
        .post(
          upgradeUrl,
          { targetBatchId: targetBatch },
          {
            headers: {
              Authorization: `Bearer ${loginState.token}`,
            },
          }
        )
        .then(() => {
          // for success
          toast.success("Batch was upgraded successfully.")
          queryClient.invalidateQueries(["batches"])
          queryClient.invalidateQueries(["current-batch"])
        })
        .catch((err) => {
          console.log(err.response)
          if (err.response.status === 409) {
            toast.warn(err.response.data.error.message)
          } else {
            toast.warn(err.response.data.error.message)
          }
        })
    } catch (err) {
      console.log(err) // logging
      toast.warn("Something went wrong. Please try again.")
    }
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ margin: 2, padding: 2, maxWidth: "50rem" }}>
        <Typography variant="h4" gutterBottom>
          Add Batch
        </Typography>
        <Divider m={1} p={1} />
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
      </Paper>

      <Paper elevation={2} sx={{ margin: 2, padding: 2, maxWidth: "50rem" }}>
        <Typography variant="h4" gutterBottom>
          Upgrade Batch (Semester)
        </Typography>
        <Divider m={1} />
        <Stack direction="column" gap={2}>
          <Typography variant="h5" gutterBottom m={1}>
            Current batch: {year} {season}
          </Typography>

          <FormControl sx={{ m: 1, minWidth: "15rem" }}>
            <InputLabel label="batch-label">Target batch</InputLabel>
            <Select
              id="batch"
              value={targetBatch ? targetBatch : ""}
              onChange={targetBatchHandler}
              label="Target batch"
            >
              <MenuItem key={0} value={0}>
                Select a target batch
              </MenuItem>

              {targetBatchDetails !== undefined &&
                targetBatchDetails !== null &&
                targetBatchDetails.map((batch) => (
                  <MenuItem key={batch.id} value={batch.id}>
                    {batch.year} {batch.season}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={async () => {
              if (targetBatch <= 0) {
                toast.warn("Please set a proper target batch")
                return
              }

              toast.info("Request has been submitted. Might take some time.", {
                autoClose: 400,
              })

              upgradeBatch()
            }}
          >
            Upgrade Batch
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}

export default CreateBatch
