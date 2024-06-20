import React, { useState } from "react"
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material"
import { toast } from "react-toastify"
import * as yup from "yup"
import { useFormik } from "formik"
import axios from "axios"
import { useContext } from "react"
import { LoginContext } from "../../../store/LoginProvider"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const ChangePasswordForm = () => {
  const { loginState } = useContext(LoginContext)
  const [loading, setLoading] = useState(false)

  const validationSchema = yup.object({
    newPassword: yup
      .string()
      .required("Password field is required")
      .min(5, "The minimum length of Password is 5 characters")
      .max(50),
    reNewPassword: yup
      .string()
      .required("Retype Password field is required")
      .min(5, "The minimum length of Password is 5 characters")
      .max(50),
  })
  const initialValues = { newPassword: "", reNewPassword: "" }

  const onSubmit = async (values) => {
    if (values.reNewPassword === values.newPassword) {
      setLoading(true)
      const response = await axios
        .post(
          `${VITE_BACKEND_URL}/login/change`,
          {
            newPassword: values.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${loginState.token}`,
            },
          }
        )
        .catch((err) => {
          console.log(err)
          toast.warn(`Something went wrong. ${err.message}`)
        })

      if (response.status === 200) {
        toast.success("Password changed successfully!")
      }
    } else {
      toast.warn("Provided passwords are not same!")
    }
    setLoading(false)
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  return (
    <Container
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
      <Card sx={{ width: "100%" }}>
        <CardContent sx={{ width: "30rem" }}>
          <Typography variant="h4" gutterBottom>
            Change Password
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <TextField
              type="password"
              label="New Password"
              {...formik.getFieldProps("newPassword")}
              error={formik.touched.newPassword && formik.errors.newPassword}
              helperText={
                formik.touched.newPassword && formik.errors.newPassword
              }
              fullWidth
              margin="normal"
            />
            <TextField
              type="password"
              label="Confirm New Password"
              {...formik.getFieldProps("reNewPassword")}
              error={
                formik.touched.reNewPassword && formik.errors.reNewPassword
              }
              helperText={
                formik.touched.reNewPassword && formik.errors.reNewPassword
              }
              fullWidth
              margin="normal"
            />
            <Button
              sx={{ marginTop: "6px" }}
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}

const Settings = () => {
  // Settings page may contain multiple components
  return (
    <>
      <ChangePasswordForm />
    </>
  )
}

export default Settings
