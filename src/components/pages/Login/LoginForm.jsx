/* eslint-disable react/no-unescaped-entities */
// LoginForm.jsx
import { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material"
import { useContext } from "react"
import { LoginContext } from "../../../store/LoginProvider"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import LoginIcon from "@mui/icons-material/Login"
import CloseIcon from "@mui/icons-material/Close"
import LiveHelpIcon from "@mui/icons-material/LiveHelp"
import axios from "axios"
import ViewMarksDialog from "./ViewMarksDialog"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

/**
 * LoginForm Component
 */
const LoginForm = () => {
  const { loginState, dispatchLoginState } = useContext(LoginContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (loginState.isLogged) {
      navigate("/dashboard")
    }
  }, [loginState.isLogged])

  const initialValues = {
    email: "",
    password: "",
  }

  const [loginError, setLoginError] = useState("")
  const [loginSuccess, setLoginSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  // for faq dialog toggle
  const [showFAQ, setShowFAQ] = useState(false)

  const handleFAQOpen = () => {
    setShowFAQ(true)
  }

  const handleFAQClose = () => {
    setShowFAQ(false)
  }

  const onSubmit = async (values) => {
    setLoading(true)
    setLoginError("")
    setLoginSuccess("")

    try {
      const response = await fetch(`${VITE_BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).catch((err) => console.log(err))

      if (response.ok) {
        // Login success
        const data = await response.json()

        // loop through roles
        const roles = data.user.UserRoles.map((item) => {
          return item.role.name
        })

        // dispatch multi role login

        setLoginSuccess("Login successful!")

        toast.success("Login successful!")

        // dispatch new login action for login context
        dispatchLoginState({
          type: "LOGIN",
          payload: {
            token: data.token,
            roles: {
              hasMultiRoles: roles.length > 1,
              allRoles: roles,
              currentRole: roles[0],
            },
          },
        })
      } else if (response.status === 401) {
        const data = await response.json()
        // 401 : Invalid credentails
        setLoginError(data.error.title || "Invalid email or password")
        // send toast
        toast.error(data.error.title || "Invalid email or password!")
      } else {
        console.error("Login failed:", response)
        setLoginError("An error occurred during login. Please try again.")
        toast.error("An error occurred during login. Please try again.")
      }
    } catch (err) {
      console.error("Login failed:", err) // Most probably, network problem
      setLoginError("An error occurred during login. Please try again.")
      toast.error("An error occurred during login. Please try again.")
    }

    setLoading(false)
  }

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email field is required"),
    password: yup
      .string()
      .min(5, "The minimum length of Password is 5 characters")
      .required("Password field is required"),
  })

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  // toggle open or close reset dialog
  const [resetToggle, setResetToggle] = useState(false)
  const resetSchema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email field is required"),
  })

  // formik for reset form
  const resetFormik = useFormik({
    initialValues: { email: "" },
    onSubmit: async (values) => {
      try {
        await axios
          .post(`${VITE_BACKEND_URL}/login/reset`, {
            email: values.email,
          })
          .then((response) => {
            if (response.status === 200) {
              toast.success(response.data.msg)
              resetFormik.resetForm()
            }
          })
          .catch((err) => {
            if (err.response.status === 404) {
              toast.warn("Please provide valid email address.")
            } else {
              toast.warn("Something wrong went with request")
              console.log(err) // see error on console
            }
          })
      } catch (err) {
        toast.warn("Something went wrong.Please try again.")
      }
    },
    validationSchema: resetSchema,
  })

  // toggle of dialog for viewing marks without login
  const [marksToggle, setMarksToggle] = useState(false)

  // result toggle
  const [resultToggle, setResultToggle] = useState(false)
  const [result, setResult] = useState(null)

  // handler for result change
  const resultHandler = (data) => {
    setResult(data)
  }

  return (
    <>
      {loginState.isLogged ? null : (
        <Box //main container-outer
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          fontFamily={{
            fontFamily: [
              "-apple-system",
              "BlinkMacSystemFont",
              '"Segoe UI"',
              "Roboto",
              '"Helvetica Neue"',
              "Arial",
              "sans-serif",
              '"Apple Color Emoji"',
              '"Segoe UI Emoji"',
              '"Segoe UI Symbol"',
            ].join(","),
          }}
        >
          <Box
            color="black" //box component inside outer container
            width="100%"
            textAlign="center"
            sx={{ marginTop: 2, marginBottom: 10 }}
          >
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h3">Welcome to IMMS</Typography>
              <Box marginTop={1}>
                <Typography variant="h8">
                  Sign in with your email and password
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
            width="100%"
          >
            <Paper
              variant="elevation"
              elevation={2}
              sx={{
                padding: 5,
                borderRadius: 1,
                paddingBottom: 3,
                boxShadow: 5,
              }}
            >
              <form onSubmit={formik.handleSubmit}>
                <Box maxWidth={400} width="100%">
                  <Typography variant="h4" align="center" gutterBottom>
                    <LoginIcon /> Login {/* Add Login icon here*/}
                  </Typography>

                  <TextField
                    id="email"
                    name="email"
                    label="Email *"
                    type="email"
                    variant="outlined"
                    {...formik.getFieldProps("email")}
                    error={formik.touched.email && formik.errors.email}
                    helperText={formik.touched.email && formik.errors.email}
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    id="password"
                    name="password"
                    label="Password *"
                    type="password"
                    variant="outlined"
                    {...formik.getFieldProps("password")}
                    error={formik.touched.password && formik.errors.password}
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    fullWidth
                    margin="normal"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ marginTop: 2 }}
                  >
                    <Typography sx={{ fontSize: "0.94rem" }}>
                      {loading ? "Logging in..." : "Submit"}
                    </Typography>
                  </Button>

                  {loginError && (
                    <Typography
                      sx={{ marginTop: 1 }}
                      color="error"
                      align="center"
                      paragraph
                    >
                      {loginError}
                    </Typography>
                  )}

                  {loginSuccess && (
                    <Typography
                      sx={{ marginTop: 2 }}
                      color="green"
                      align="center"
                      paragraph
                    >
                      {loginSuccess}
                    </Typography>
                  )}
                </Box>
              </form>
              <Stack direction="row" sx={{ marginTop: 3 }}>
                <Link
                  href="#"
                  underline="hover"
                  title="Click here to reset your password"
                  onClick={() => {
                    setResetToggle(true)
                  }}
                >
                  <Typography sx={{ fontSize: "1rem" }}>
                    Forgot Password?
                  </Typography>
                </Link>

                <Link
                  href="#"
                  underline="hover"
                  title="Click here to read frequently asked questions"
                  onClick={handleFAQOpen}
                  sx={{ marginLeft: "auto" }}
                >
                  <Typography
                    sx={{
                      fontSize: "1rem",
                    }}
                  >
                    {showFAQ ? "Hide FAQ" : "Frequently Asked Questions"}
                  </Typography>
                </Link>
              </Stack>
              <Link
                href="#"
                component={"button"}
                underline="hover"
                title="Click here to view marks without login"
                onClick={() => {
                  setMarksToggle(true)
                }}
              >
                <Typography
                  sx={{
                    marginLeft: "auto",
                    fontSize: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  View marks without login
                </Typography>
              </Link>
            </Paper>
          </Box>
          {/* Dialog for FAQ */}
          <Dialog open={showFAQ} onClose={handleFAQClose}>
            <DialogTitle
              sx={{
                justifyItems: "self",
              }}
            >
              <LiveHelpIcon /> Frequently Asked Questions
            </DialogTitle>
            <Divider />
            <DialogContent
              sx={{
                height: 400,
                overflow: "auto",
              }}
            >
              <DialogContentText color={"black"}>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <strong style={{ color: "green" }}>1: What is IMMS?</strong>
                  <br />
                  <u>Ans</u>: IMMS (Internal Marks Management System) is a web
                  platform for managing internal examination marks of students
                  developed as a final year project.
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <strong style={{ color: "green" }}>
                    2: Who are the project members?
                  </strong>
                  <br />
                  <u>Ans</u>: The project is supervised by Er. Rajesh Kamar. The
                  project members are students of B.E Computer.
                  <ul>
                    <li>Roshan Lamichhane</li>
                    <li>Maheshwor Acharya</li>
                    <li>Susmita Thapa</li>
                    <li>Asbin Poudel</li>
                  </ul>
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <strong style={{ color: "green" }}>
                    3: How do I create an account?
                  </strong>
                  <br />
                  <u>Ans</u>: To create an account, please contact the
                  administration. Adminstration will create an account for you.
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <strong style={{ color: "green" }}>
                    4: How can I change my password?
                  </strong>
                  <br />
                  <u>Ans</u>: You can change your password by navigating to the
                  "Account Settings" page and selecting the "Change Password"
                  option.
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <strong style={{ color: "green" }}>
                    5: How can I recover a forgotten password?
                  </strong>
                  <br />
                  <u>Ans</u>: If you have forgotten your password, you can click
                  on the "Forgot Password" link on the login page and follow the
                  instructions to reset your password.
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <strong style={{ color: "green" }}>
                    6: How can I update my profile information?
                  </strong>
                  <br />
                  <u>Ans</u>: To update your profile information, navigate to
                  the "Account Settings" page and edit the necessary details
                  such as name, email, or contact information.
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <strong style={{ color: "green" }}>
                    7: How can an expired account view marks?
                  </strong>
                  <br />
                  <u>Ans</u>: Click on the link "View marks without login" for
                  this.
                </Typography>
                {/* <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <strong style={{ color: "green" }}>
                    5: How do I delete my account?
                  </strong>
                  <br />
                  <u>Ans</u>: To delete your account, please contact our support
                  team and provide them with the necessary information. They
                  will guide you through the account deletion process.
                </Typography> */}
                {/* Add more questions and answers here */}
              </DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions>
              <Button
                onClick={handleFAQClose}
                color="primary"
                startIcon={<CloseIcon />}
                variant="outlined"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
          {/* Dialog for password reset */}
          <Dialog
            maxWidth="sm"
            fullWidth
            open={resetToggle}
            onClose={() => {
              setResetToggle(false)
            }}
          >
            <DialogTitle
              sx={{
                justifyItems: "self",
              }}
            >
              Password Reset Form
            </DialogTitle>
            <Divider />
            <DialogContent>
              <form onSubmit={resetFormik.handleSubmit}>
                <TextField
                  id="email"
                  name="email"
                  label="Email *"
                  type="email"
                  variant="outlined"
                  {...resetFormik.getFieldProps("email")}
                  error={resetFormik.touched.email && resetFormik.errors.email}
                  helperText={
                    resetFormik.touched.email && resetFormik.errors.email
                  }
                  fullWidth
                  margin="normal"
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{ marginTop: 2 }}
                >
                  <Typography sx={{ fontSize: "0.94rem" }}>Submit</Typography>
                </Button>
              </form>
            </DialogContent>
            <Divider />
            <DialogActions>
              <Button
                onClick={() => {
                  setResetToggle(false)
                }}
                color="primary"
                startIcon={<CloseIcon />}
                variant="outlined"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
          {/* dialog for marks viewing */}
          <ViewMarksDialog
            toggle={marksToggle}
            closeFunc={() => {
              setMarksToggle(false)
            }}
            setResult={resultHandler}
            enableResult={() => {
              setResultToggle(true)
            }}
          />

          {/* dialog for showing result */}
          <Dialog
            open={resultToggle}
            onClose={() => {
              setResultToggle(false)
            }}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle
              sx={{
                justifyItems: "self",
              }}
            >
              Marks
            </DialogTitle>
            <Divider />
            <DialogContent>
              {result !== undefined && result !== null && (
                <Marks data={result} />
              )}
            </DialogContent>
            <Divider />
            <DialogActions>
              <Button
                onClick={() => {
                  setResultToggle(false)
                }}
                color="primary"
                startIcon={<CloseIcon />}
                variant="outlined"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  )
}
// Marks viewing component
const Marks = ({ data }) => {
  const [selectedSemester, setSelectedSemester] = useState("")

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value)
  }

  const filterMarksBySemester = (marksData, selectedSemester) => {
    if (selectedSemester === "") {
      return marksData.semesters
    } else {
      return marksData.semesters.filter(
        (semester) => semester.semester === selectedSemester
      )
    }
  }

  return (
    <>
      {data !== null && (
        <div>
          <Stack direction="column" gap={1}>
            <Stack direction="row" gap={20}>
              <Typography variant="body1">
                Name: {data.student?.user?.name || "..."}
              </Typography>

              <Typography variant="body1">
                Program: {data.student?.program?.name || "..."}
              </Typography>
            </Stack>
            <Stack direction="row" gap={5}>
              <Typography variant="body1">
                PU Regd Number: {data.student?.puRegNo || "..."}
              </Typography>
              <Typography variant="body1">
                Symbol Number: {data.student?.symbolNo || "..."}
              </Typography>
            </Stack>
            <Stack direction="row" gap={12}>
              <Typography variant="body1">
                Email: {data.student?.user?.email || "..."}
              </Typography>
              <Typography variant="body1">
                Contact Number: {data.student?.contactNo || "..."}
              </Typography>
            </Stack>
          </Stack>
          <Divider sx={{ marginBottom: 1, marginTop: 1 }} />
          <div>
            <FormControl variant="outlined" margin="normal" sx={{ width: 200 }}>
              <InputLabel id="sem-label">Select Semester*</InputLabel>

              <Select
                value={selectedSemester || ""}
                onChange={handleSemesterChange}
                fullWidth
                label="Select Semester*"
              >
                <MenuItem value="">All Semesters</MenuItem>
                {data !== undefined &&
                  data !== null &&
                  data.semesters.length > 0 &&
                  data.semesters.map((semester) => (
                    <MenuItem value={semester.semester} key={semester.semester}>
                      Semester {semester.semester}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          {data !== undefined && data !== null && data.semesters.length > 0 ? (
            filterMarksBySemester(data, selectedSemester).map((semester) => (
              <div key={semester.semester}>
                <Typography variant="h5" align="center" gutterBottom>
                  Semester {semester.semester}
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Name</TableCell>
                        <TableCell>Course Code</TableCell>

                        <TableCell>Theory</TableCell>
                        <TableCell>Practical</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {semester.courses.map((course) => (
                        <TableRow key={course.courseId}>
                          <TableCell>{course.course.name || "-"}</TableCell>
                          <TableCell>{course.course.code || "-"}</TableCell>
                          <TableCell>
                            {(!course.marks.absent &&
                              !course.marks.expelled &&
                              !course.marks.NotQualified &&
                              course.marks.theory) ||
                              "-"}
                          </TableCell>
                          <TableCell>
                            {(!course.marks.absent &&
                              !course.marks.expelled &&
                              !course.marks.NotQualified &&
                              course.marks.practical) ||
                              "-"}
                          </TableCell>
                          <TableCell>
                            <Typography color={"red"}>
                              {course.marks.absent ? "Absent " : null}
                              {course.marks.expelled ? "Expelled " : null}
                              {course.marks.NotQualified
                                ? "Not Qualified "
                                : null}
                            </Typography>
                            <Typography>
                              {!course.marks.NotQualified &&
                                !course.marks.expelled &&
                                !course.marks.absent &&
                                course.marks.practical + course.marks.theory}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div style={{ margin: "30px" }}></div> {/* Adding a gap */}
              </div>
            ))
          ) : (
            <Typography>No data available.</Typography>
          )}
        </div>
      )}
    </>
  )
}

export default LoginForm
