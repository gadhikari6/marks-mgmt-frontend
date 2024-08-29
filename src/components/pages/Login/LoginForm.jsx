// LoginForm.jsx
import { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { TextField, Button, Box, Typography, Paper, Link } from "@mui/material"
import { useContext } from "react"
import { LoginContext } from "../../../store/LoginProvider"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
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
        // 401 : Invalid credentails
        setLoginError("Invalid email or password")
        // send toast
        toast.error("Invalid email or password!")
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
          {/* TODO: Add FAQ related to registration and other details */}
          <Box
            color="black" //box component inside outer container
            width="100%"
            textAlign="center"
            sx={{ marginTop: 2, marginBottom: 10 }}
          >
            <Typography variant="h3">Welcome to IMMS</Typography>
            <Box marginTop={1}>
              <Typography variant="h8">
                Sign in with your email and password
              </Typography>
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
                    Login {/* Add Login icon here*/}
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
                    {loading ? "Logging in..." : "Submit"}
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

                  {/*
            TODO: Add forgot password link logic */}
                  <Box sx={{ paddingTop: 2 }}>
                    <Link
                      href="#"
                      underline="hover"
                      onClick={() => {
                        toast.info(
                          "Password reset will be added soon. Thank you for your pateince."
                        )
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </Box>
                </Box>
              </form>
            </Paper>
          </Box>
        </Box>
      )}
    </>
  )
}

export default LoginForm
