import React, { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import {
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
  Box,
  Typography,
} from "@mui/material"

/**
 * LoginForm Component
 */
const LoginForm = () => {
  const initialValues = {
    email: "",
    password: "",
    rememberMe: true,
  }

  const [loginError, setLoginError] = useState("")
  const [loginSuccess, setLoginSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (values) => {
    setLoading(true)
    setLoginError("")
    setLoginSuccess("")

    try {
      const response = await fetch("http://localhost:9000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      console.log(values)

      const data = await response.json()

      if (response.ok) {
        // Login success
        setLoginSuccess("Login successful!")
        console.log(data.token) // Access token
      } else {
        // Login error
        setLoginError("Invalid email or password")
      }
    } catch (error) {
      console.error("Login failed:", error)
      setLoginError("An error occurred during login")
    }

    setLoading(false)
  }

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email field is required"),
    password: yup.string().required("Password field is required"),
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
      <form onSubmit={formik.handleSubmit}>
        <Box maxWidth={400} width="100%" padding={2}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>

          <TextField
            id="email"
            name="email"
            label="Email"
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
            label="Password"
            type="password"
            variant="outlined"
            {...formik.getFieldProps("password")}
            error={formik.touched.password && formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
            margin="normal"
          />

          <FormControlLabel
            control={
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={formik.values.rememberMe}
                {...formik.getFieldProps("rememberMe")}
              />
            }
            label="Remember me"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? "Logging in..." : "Submit"}
          </Button>

          {loginError && (
            <Typography color="error" align="center" paragraph>
              {loginError}
           
            </Typography>
          )}

          {loginSuccess && (
            <Typography color="success" align="center" paragraph>
              {loginSuccess}
            </Typography>
          )}
        </Box>
      </form>
    </Box>
  )
}

export default LoginForm
