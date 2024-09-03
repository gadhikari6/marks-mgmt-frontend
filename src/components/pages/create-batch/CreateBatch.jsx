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
  FormControlLabel,
  Switch,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
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
import UpgradeIcon from "@mui/icons-material/Upgrade"
import NoSimIcon from "@mui/icons-material/NoSim"
import { NoSim } from "@mui/icons-material"
import AddChartIcon from "@mui/icons-material/Addchart"
import ManageSearchIcon from "@mui/icons-material/ManageSearch"
import CloseIcon from "@mui/icons-material/Close"

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

  // marks toggle
  const [marksToggle, setMarksToggle] = useState(false)

  // fetch current batch details
  useEffect(() => {
    if (currentBatch !== undefined && currentBatch !== null) {
      setYear(currentBatch.year)
      setSeason(currentBatch.season)
      setMarksToggle(currentBatch.marksCollect)
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
    used: Yup.boolean().required(),
  })

  // formik
  const formik = useFormik({
    initialValues: {
      year: "",
      season: "",
      used: "",
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

  // method call for marks toggle
  const marksToggleHandler = async (toggle = false) => {
    try {
      const url = `${VITE_BACKEND_URL}/admin/divisions/batch/current`
      await axios
        .put(
          url,
          { marksCollect: toggle },
          {
            headers: {
              Authorization: `Bearer ${loginState.token}`,
            },
          }
        )
        .then(() => {
          // for success
          toast.success(
            `Marks Collection ${toggle ? "enabled" : "disabled"} successfully.`
          )
          queryClient.invalidateQueries(["batches"])
          queryClient.invalidateQueries(["current-batch"])
        })
        .catch((err) => {
          console.log(err.response)
          toast.warn(err.response.data.error.message)
        })
    } catch (err) {
      console.log(err) // logging
      toast.warn("Something went wrong. Please try again.")
    }
  }

  // batch dialog toggle
  const [batchDialog, setBatchDialog] = useState(false)

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={2}
        sx={{
          margin: 2,
          padding: 2,
          minWidth: "70rem",
          justifyContent: "center",
        }}
      >
        <Stack direction="row">
          <Typography variant="h4" gutterBottom>
            Add Batch
          </Typography>
          <Button
            variant="contained"
            startIcon={<ManageSearchIcon />}
            onClick={() => {
              setBatchDialog(true)
            }}
            sx={{
              alignSelf: "center",

              marginLeft: "auto",
            }}
          >
            View All Batches
          </Button>
        </Stack>
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
            <Grid item xs={10} sm={3}>
              <TextField
                id="used"
                margin="normal"
                defaultValue={formik.values.used}
                error={formik.touched.used && formik.errors.used}
                helperText={formik.touched.used && formik.errors.used}
                {...formik.getFieldProps("used")}
                label="Select Old or New"
                select
                fullWidth
                required
              >
                <MenuItem value={false}>NEW</MenuItem>
                <MenuItem value={true}>OLD</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                color="primary"
                sx={{ maxWidth: "20rem", height: "40px" }}
                size="medium"
                startIcon={<AddCircleOutlineIcon />}
              >
                Add Batch
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Stack direction={"row"} gap={1} justifyContent={"center"}>
        {/* Marks enable or disable*/}
        <Paper elevation={2} sx={{ margin: 2, padding: 2, minWidth: "35rem" }}>
          <Typography variant="h4" gutterBottom>
            Mark Collection For Batch
          </Typography>
          <Divider m={1} />
          <Stack direction="column" gap={1}>
            <Typography variant="h5" gutterBottom m={1} p={1}>
              Current batch: {year} {season}
            </Typography>
            <Typography variant="h5" p={1}>
              Marks Collection :{" "}
              <Typography variant="h5" color={"red"} component={"span"}>
                {marksToggle ? "Enabled" : "Disabled"}
              </Typography>
            </Typography>

            <Divider />
            <Stack direction="row" gap={2} m={1}>
              <Button
                startIcon={<AddChartIcon />}
                variant="contained"
                fullWidth
                disabled={marksToggle}
                onClick={() => {
                  marksToggleHandler(true)
                }}
              >
                Enable
              </Button>
              <Button
                startIcon={<NoSim />}
                variant="contained"
                fullWidth
                disabled={!marksToggle}
                onClick={() => {
                  marksToggleHandler(false)
                }}
              >
                Disable
              </Button>
            </Stack>
          </Stack>
        </Paper>
        {/* Batch upgrade form*/}
        <Paper elevation={2} sx={{ margin: 2, padding: 2, minWidth: "35rem" }}>
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
              startIcon={<UpgradeIcon />}
              onClick={async () => {
                if (targetBatch <= 0) {
                  toast.warn("Please set a proper target batch")
                  return
                }

                toast.info(
                  "Request has been submitted. Might take some time.",
                  {
                    autoClose: 400,
                  }
                )

                upgradeBatch()
              }}
            >
              Upgrade Batch
            </Button>
          </Stack>
        </Paper>
      </Stack>

      <Dialog
        open={batchDialog}
        onClose={() => {
          setBatchDialog(false)
        }}
        maxWidth={"sm"}
        fullWidth
      >
        <DialogTitle>List of all batches</DialogTitle>
        <Divider />

        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography>Batch Id</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Year</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Season</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Status</Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            {allBatches !== undefined &&
              allBatches !== null &&
              allBatches.map((batch, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography>{batch.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{batch.year} </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{batch.season}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {batch.current ? "CURRENT" : batch.used ? "OLD" : "NEW"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
          </Table>
        </DialogContent>
        <Divider />

        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={() => {
              setBatchDialog(false)
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default CreateBatch
