import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  TextField,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import axios from "axios"
import { toast } from "react-toastify"
import * as yup from "yup"
import { useState } from "react"
import { useFormik } from "formik"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  symbolNo: yup.string().min(6).max(20).required("Symbol number is required"),
  puRegNo: yup
    .string()
    .min(8)
    .max(20)
    .required("Registration number is required"),
  dateOfBirth: yup
    .string()
    .min(10)
    .max(10)
    .required("Date of birth field is required"),
})

/* Dialog for viewing marks without login */
export default function ViewMarksDialog({
  toggle,
  closeFunc,
  enableResult,
  setResult = () => {},
}) {
  // viewForm for marks viewing form
  const viewForm = useFormik({
    initialValues: { email: "", dateOfBirth: "", symbolNo: "", puRegNo: "" },
    onSubmit: async (values) => {
      try {
        const { email, dateOfBirth, symbolNo, puRegNo } = values
        await axios
          .get(
            `${VITE_BACKEND_URL}/public/marks?email=${email}&dob=${dateOfBirth}&symbol_no=${symbolNo}&pu_reg=${puRegNo}`
          )
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data)
              setResult(response.data)
              // enable result dialog
              enableResult()
              // reset the form
              viewForm.resetForm()
              closeFunc()
            }
          })
          .catch((err) => {
            console.log(err)
            if (err.response.status === 404) {
              toast.warn(
                err.response.data.error.message ||
                  "Please provide valid student details."
              )
            } else {
              toast.warn("Something wrong went with request")
              console.log(err) // see error on console
            }
          })
      } catch (err) {
        toast.warn("Something went wrong.Please try again.")
        console.log(err)
      }
    },
    validationSchema: validationSchema,
  })
  return (
    <>
      <Dialog open={toggle} onClose={closeFunc} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            justifyItems: "self",
          }}
        >
          View Marks Without Login
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box>
            <form onSubmit={viewForm.handleSubmit}>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={0.5}>
                  {/* Email field */}
                  <Grid item xs={6}>
                    <TextField
                      id="email"
                      name="email"
                      label="Email *"
                      variant="outlined"
                      {...viewForm.getFieldProps("email")}
                      error={viewForm.touched.email && viewForm.errors.email}
                      helperText={
                        viewForm.touched.email && viewForm.errors.email
                      }
                      fullWidth
                      margin="normal"
                    />
                  </Grid>

                  {/* Date of birth field */}
                  <Grid item xs={6}>
                    <TextField
                      id="dateOfBirth"
                      name="dateOfBirth"
                      label="Date of Birth (YYYY-MM-DD)*"
                      variant="outlined"
                      {...viewForm.getFieldProps("dateOfBirth")}
                      error={
                        viewForm.touched.dateOfBirth &&
                        viewForm.errors.dateOfBirth
                      }
                      helperText={
                        viewForm.touched.dateOfBirth &&
                        viewForm.errors.dateOfBirth
                      }
                      fullWidth
                      margin="normal"
                    />
                  </Grid>

                  {/* Symbol Number field */}
                  <Grid item xs={6}>
                    <TextField
                      id="symbolNo"
                      name="symbolNo"
                      label="Symbol Number *"
                      variant="outlined"
                      {...viewForm.getFieldProps("symbolNo")}
                      error={
                        viewForm.touched.symbolNo && viewForm.errors.symbolNo
                      }
                      helperText={
                        viewForm.touched.symbolNo && viewForm.errors.symbolNo
                      }
                      fullWidth
                      margin="normal"
                    />
                  </Grid>

                  {/* PU Registration Number field */}
                  <Grid item xs={6}>
                    <TextField
                      id="puRegNo"
                      name="puRegNo"
                      label="PU Registration Number *"
                      variant="outlined"
                      {...viewForm.getFieldProps("puRegNo")}
                      error={
                        viewForm.touched.puRegNo && viewForm.errors.puRegNo
                      }
                      helperText={
                        viewForm.touched.puRegNo && viewForm.errors.puRegNo
                      }
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                >
                  View Marks
                </Button>
              </Box>
            </form>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={closeFunc}
            color="primary"
            startIcon={<CloseIcon />}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
