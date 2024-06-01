import { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { TextField, Button, Box, Typography, Paper } from "@mui/material"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

/**
 * LoginForm Component
 */
const LoginForm = () => {
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
        setLoginSuccess("Login successful!")

        const data = await response.json()
        // Access token
        console.log(data.token) // TODO: to remove later
      } else if (response.status === 401) {
        // 401 : Invalid credentails
        setLoginError("Invalid email or password")
      } else {
        console.error("Login failed:", response)
        setLoginError("An error occurred during login. Please try again.")
      }
    } catch (err) {
      console.error("Login failed:", err) // Most probably, network problem
      setLoginError("An error occurred during login. Please try again.")
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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      {/* TODO: Add banner or text mentioning IMMS , also some logo/icon for login */}
      <Paper
        variant="elevation"
        elevation={2}
        sx={{
          padding: 2,
          borderRadius: 1,
          paddingBottom: 1,
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box maxWidth={400} width="100%" padding={2}>
            <Typography variant="h4" align="center" gutterBottom>
              Login
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
              helperText={formik.touched.password && formik.errors.password}
              fullWidth
              margin="normal"
            />

            {/* <FormControlLabel
            control={
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={formik.values.rememberMe}
                {...formik.getFieldProps("rememberMe")}
              />
            }
            label="Remember me"
          /> */}

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
            TODO: Add forgot password link */}
          </Box>
        </form>
      </Paper>
    </Box>
  )
}

export default LoginForm
