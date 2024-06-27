/* eslint-disable react/prop-types */
import axios from "axios"
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
} from "@mui/material"
import { toast } from "react-toastify"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file
export const EditDialog = ({
  editUser,
  setEditUser,
  userID,
  editDialogOpen,
  setEditDialogOpen,
}) => {
  const handleUpdateUser = () => {
    axios
      .put(`${VITE_BACKEND_URL}/admin/users/${userID}/profile`, editUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // Handle successful response
        console.log("User updated:", response.data)
        setEditDialogOpen(false)
        if (response.status === 200) {
          toast.success("User updated successfully")
        } else {
          toast.error("Error updating user")
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error)
        toast.error("Error updating user")
      })
  }

  return (
    <Dialog
      open={editDialogOpen}
      onClose={() => setEditDialogOpen(false)}
      fullWidth
    >
      <DialogTitle>Edit User Details</DialogTitle>
      <Divider />
      <DialogContent>
        <TextField
          label="Email"
          value={editUser.email}
          onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Name"
          value={editUser.name}
          onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          fullWidth
          margin="normal"
        />
        <Stack direction="row" gap={2}>
          <TextField
            label="Address"
            value={editUser.address}
            onChange={(e) =>
              setEditUser({ ...editUser, address: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact No"
            value={editUser.contactNo}
            onChange={(e) =>
              setEditUser({ ...editUser, contactNo: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleUpdateUser}
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Update
        </Button>
        <Button
          onClick={() => setEditDialogOpen(false)}
          startIcon={<CloseIcon />}
          variant="outlined"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
