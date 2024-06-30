import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import useMarkWt from "../../../hooks/count/useMarkWt"
import axios from "axios"
import { useContext } from "react"
import { LoginContext } from "../../../store/LoginProvider"
import { toast } from "react-toastify"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const Courses = () => {
  const { loginState } = useContext(LoginContext)

  // url to upload course to
  const uploadUrl = `${VITE_BACKEND_URL}/admin/courses`

  // state to keep list of supported mark weightages
  const [markWtList, setMarkWtList] = useState([])

  const { data: markWtData } = useMarkWt()

  // set markWtList
  useEffect(() => {
    if (markWtData !== undefined && markWtData !== null) {
      setMarkWtList(markWtData)
    }
  }, [markWtData])

  // validation schema for adding new course into db
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Course Name is required"),
    code: Yup.string().required("Course Code is required"),
    credit: Yup.number()
      .required("Course Credit is required")
      .min(1)
      .max(20)
      .positive("Course Credit must be a positive number"),
    elective: Yup.boolean().default(false).required("Elective is required"),
    project: Yup.boolean().default(false).required("Project is required"),
    markWeightageId: Yup.number()
      .required("Mark Weightage Id is required")
      .positive(),
  })

  // formik
  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      credit: "",
      elective: "",
      project: "",
      markWeightageId: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const data = { ...values, credit: Number(values.credit) || 0 }
      try {
        await axios
          .post(uploadUrl, data, {
            headers: {
              Authorization: `Bearer ${loginState.token}`,
            },
          })
          .then(() => {
            // for success
            toast.success("Course was added successfully.")
            formik.resetForm()
          })
          .catch((err) => {
            if (err.response.status === 409) {
              toast.warn("Course with provided details exists already.")
            } else {
              toast.warn("Course with provided details exists already.")
            }
          })
      } catch (err) {
        console.log(err) // logging
        toast.warn("Something went wrong. Please try again.")
      }
    },
  })

  return (
    <Container maxWidth={"md"}>
      <Typography variant="h4" gutterBottom>
        Add Course
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          label="Course Name"
          fullWidth
          id="name"
          margin="normal"
          defaultValue={formik.values.name}
          error={formik.touched.name && formik.errors.name}
          {...formik.getFieldProps("name")}
          required
        />
        <Stack direction="row" gap={1}>
          <TextField
            fullWidth
            label="Course Code"
            margin="normal"
            defaultValue={formik.values.code}
            error={formik.touched.code && formik.errors.code}
            {...formik.getFieldProps("code")}
            required
          />
          <TextField
            fullWidth
            label="Course Credit"
            margin="normal"
            {...formik.getFieldProps("credit")}
            defaultValue={formik.values.credit}
            error={formik.touched.credit && formik.errors.credit}
            required
          />
        </Stack>
        <Stack direction="row" gap={1}>
          <TextField
            label="Elective ?"
            id="elective"
            defaultValue={formik.values.elective}
            error={formik.touched.elective && formik.errors.elective}
            required
            select
            fullWidth
            margin="normal"
            {...formik.getFieldProps("elective")}
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </TextField>
          <TextField
            label="Project ?"
            margin="normal"
            id="project"
            defaultValue={formik.values.project}
            error={formik.touched.project && formik.errors.project}
            required
            select
            fullWidth
            {...formik.getFieldProps("project")}
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </TextField>
        </Stack>

        <Stack direction={"column"} gap={2} mt={1}>
          <TextField
            label="Select Mark Weightage"
            defaultValue={formik.values.markWeightageId}
            error={
              formik.touched.markWeightageId && formik.errors.markWeightageId
            }
            required
            select
            fullWidth
            {...formik.getFieldProps("markWeightageId")}
          >
            {markWtList.length > 0 &&
              markWtList.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  Theory: {item.theory}, Practical: {item.practical}
                </MenuItem>
              ))}
          </TextField>

          <Button
            variant="contained"
            type="submit"
            color="primary"
            sx={{ maxWidth: "max-content" }}
          >
            Add Course
          </Button>
        </Stack>
      </form>
    </Container>
  )
}

export default Courses
