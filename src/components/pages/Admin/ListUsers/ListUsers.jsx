import { useState, useEffect } from "react"
import useRoleName from "../../../../hooks/count/useRoleNames"
import axios from "axios"
import { toast } from "react-toastify"

import {
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const ListUsers = () => {
  const { isLoading, error, data, token } = useRoleName()
  const [selectedRole, setSelectedRole] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [userID, setUserID] = useState(null)
  const [editUser, setEditUser] = useState({
    address: "",
    contactNo: "",
    email: "",
    name: "",
    role: [],
  })
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (selectedRole) {
      axios
        .get(`${VITE_BACKEND_URL}/admin/users?role_id=${selectedRole}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setFilteredUsers(response.data.users)
        })
        .catch((error) => {
          console.error("Error fetching filtered users:", error)
        })
    } else {
      setFilteredUsers([])
    }
  }, [selectedRole])

  const handleRoleSelect = (event) => {
    setSelectedRole(event.target.value)
  }

  const handleEditUser = (userId) => {
    // Find the user by ID from the filtered users list
    const user = filteredUsers.find((user) => user.id === userId)
    if (user) {
      setEditUser({
        address: user.address || "",
        contactNo: user.contactNo || "",
        email: user.email || "",
        name: user.name || "",
      })
      setUserID(user.id)
      setEditDialogOpen(true)
    }
  }

  const handleUpdateUser = () => {
    axios
      .put(`${VITE_BACKEND_URL}/admin/users/${userID}/profile`, editUser, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const handleDialogClose = () => {
    setEditDialogOpen(false)
  }

  const getRowsWithSerialNumber = (rows) => {
    return rows.map((row, index) => ({
      ...row,
      sn: index + 1,
      roles: row.UserRoles.map((userRole) => userRole.role.name).join(", "), // Extract role names and join as a string
    }))
  }
  const handleDeleteUser = (userId) => {
    // Set the user ID to be deleted
    setUserID(userId)
    // Open the delete confirmation dialog
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    axios
      .delete(`${VITE_BACKEND_URL}/admin/users/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle successful response
        console.log("User deleted:", response.data)
        setDeleteDialogOpen(false)
        if (response.status === 200) {
          toast.success("User deleted successfully")
        } else {
          toast.error("Error deleting user")
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error)
        toast.error("Error deleting user")
      })
  }

  const handleCancelDelete = () => {
    // Close the delete confirmation dialog
    setDeleteDialogOpen(false)
  }

  if (isLoading) {
    return <Typography>Loading ...</Typography>
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>
  }

  const columns = [
    { field: "sn", headerName: "SN", width: 50 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "address", headerName: "Address", width: 150 },
    { field: "contactNo", headerName: "Contact No", width: 150 },
    { field: "roles", headerName: "Roles", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 225,
      renderCell: (params) => (
        <div>
          <Button
            variant="outlined"
            color="primary"
            style={{
              marginRight: "8px",
            }}
            startIcon={<EditIcon />}
            onClick={() => handleEditUser(params.row.id)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            style={{
              marginRight: "8px",
              color: "white",
              backgroundColor: "red",
            }}
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteUser(params.row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <InputLabel>
        Select type of users:
        <Select
          value={selectedRole}
          onChange={handleRoleSelect}
          sx={{ margin: "1rem" }}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select a role
          </MenuItem>
          {data.roles.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
      </InputLabel>

      {selectedRole && (
        <div>
          {filteredUsers.length === 0 ? (
            <Typography>No users found for the selected role.</Typography>
          ) : (
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={getRowsWithSerialNumber(filteredUsers)}
                columns={columns}
                filterModel={{
                  items: columns.map((column) => ({
                    columnField: column.field,
                    operatorValue: "contains",
                    value: "",
                  })),
                }}
                sortingOrder={["asc", "desc"]}
                hideFooterSelectedRowCount
              />
            </div>
          )}
        </div>
      )}

      <Dialog open={editDialogOpen} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Edit User Details</DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            label="Email"
            value={editUser.email}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
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
            onClick={handleDialogClose}
            startIcon={<CloseIcon />}
            variant="outlined"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete User</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            startIcon={<CloseIcon />}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            style={{
              marginRight: "8px",
              color: "white",
              backgroundColor: "red",
            }}
            startIcon={<DeleteIcon />}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ListUsers
