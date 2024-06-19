import React, { useState } from "react"
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material"

const Settings = () => {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handlePasswordReset = () => {
    // Perform password reset logic here
    if (newPassword === confirmPassword) {
      // Reset password API call or function
      console.log("Password reset successful!")
    } else {
      console.log("New password and confirm password do not match.")
    }
    // TODO: Add Paaword Change Network Call
  }

  return (
    <Container>
      <Card sx ={{width:'100%'}}>
        <CardContent  sx ={{width:'30rem'}}>
          <Typography variant="h4" gutterBottom>
            Settings
          </Typography>

          <TextField
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button sx ={{marginTop:'6px'}}
            variant="contained"
            color="primary"
            onClick={handlePasswordReset}
          >
            Change Password
          </Button>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Settings
