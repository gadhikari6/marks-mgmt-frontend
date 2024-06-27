import { useState, useEffect } from "react"
import useRoleName from "../../../../hooks/count/useRoleNames"
import axios from "axios"
import { toast } from "react-toastify"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
  Box,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import { EditDialog } from "../DialogBoxes/EditDialog"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const ListUsers = () => {
  const { isLoading, error, data, token } = useRoleName()
  const [selectedRole, setSelectedRole] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [userID, setUserID] = useState(null)
  const [roleId, setRoleId] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const [editUser, setEditUser] = useState({
    address: "",
    contactNo: "",
    email: "",
    name: "",
    role: [],
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: handleConfirmDeleteRole,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["deleterole"] })
    },
  })
  useEffect(() => {
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
  }, [selectedRole, token])
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

  const handleAssignRole = (userId) => {
    setUserID(userId)
    setAssignDialogOpen(true)
  }
  function handleConfirmDeleteRole() {
    const requestBody = {
      roleId: roleId,
    }

    axios
      .delete(`${VITE_BACKEND_URL}/admin/users/${userID}/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: requestBody,
      })
      .then((response) => {
        // Handle successful response
        console.log("Role deleted:", response.data)
        setAssignDialogOpen(false)
        if (response.status === 200) {
          toast.success("Role deleted successfully")
        } else {
          toast.error("Error deleting role")
        }
      })
      .catch((error) => {
        console.error("Error deleting role:", error)
        toast.error("Error deleting role")
      })
  }

  const handleConfirmAssignRole = () => {
    const requestBody = {
      roleId: roleId,
    }

    axios
      .put(`${VITE_BACKEND_URL}/admin/users/${userID}/roles`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle successful response
        console.log("Role assigned:", response.data)
        setAssignDialogOpen(false)
        if (response.status === 200) {
          toast.success("Role assigned successfully")
        } else {
          toast.error("Error assigning role")
        }
      })
      .catch((error) => {
        console.error("Error assigning role:", error)
        toast.error("Error assigning role")
      })
  }

  const handleCancelAssignRole = () => {
    setAssignDialogOpen(false)
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
      width: 325,
      renderCell: (params) => (
        <Box>
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
          {params.row.roles.includes("student") ? null : (
            <Button
              variant="contained"
              style={{
                marginRight: "8px",
                color: "white",
                backgroundColor: "green",
              }}
              startIcon={<EditIcon />}
              onClick={() => handleAssignRole(params.row.id)}
            >
              Role
            </Button>
          )}
        </Box>
      ),
    },
  ]

  return (
    <Box>
      <InputLabel>
        Select type of users:
        <Select
          value={selectedRole}
          onChange={handleRoleSelect}
          sx={{ margin: "1rem" }}
          displayEmpty
        >
          <MenuItem value="" disabled>
            ALL
          </MenuItem>
          {data.roles.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
      </InputLabel>

      <Box>
        {filteredUsers.length === 0 ? (
          <Typography>No users found </Typography>
        ) : (
          <Box style={{ height: 400, width: "100%" }}>
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
          </Box>
        )}
      </Box>
      <EditDialog
        editUser={editUser}
        setEditUser={setEditUser}
        userID={userID}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
      />

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
              color: "white",
              backgroundColor: "red",
            }}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Role Dialog */}
      <Dialog
        open={assignDialogOpen}
        onClose={handleCancelAssignRole}
        fullWidth
      >
        <DialogTitle>Modify Role</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack direction="row" gap={1}>
            <InputLabel>
              Select a role to Add or Delete:
              <Select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                sx={{ margin: "0.5rem", width: "200px" }}
              >
                {data.roles.map((role) => {
                  if (role.name === "student") {
                    return
                  }
                  return (
                    <MenuItem key={role.id} value={role.id} fullWidth>
                      {role.name}
                    </MenuItem>
                  )
                })}
              </Select>
            </InputLabel>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelAssignRole}
            startIcon={<CloseIcon />}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAssignRole}
            variant="contained"
            style={{
              color: "white",
              backgroundColor: "green",
            }}
            startIcon={<AddIcon />}
          >
            Assign
          </Button>
          <Button
            // onClick={handleConfirmDeleteRole}
            onClick={deleteMutation.mutate}
            variant="contained"
            style={{
              color: "white",
              backgroundColor: "blue",
            }}
            startIcon={<DeleteIcon />}
          >
            Delete now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ListUsers
