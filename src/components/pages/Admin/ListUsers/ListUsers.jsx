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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const ListUsers = () => {
  // TODO: Add button and dialog add new user of type (admin, programHead, examHEad) : also to select pogram/faculty for them
  const { isLoading, error, data, token } = useRoleName()

  // state to fetch user based on role
  const [selectedRole, setSelectedRole] = useState("")

  const [filteredUsers, setFilteredUsers] = useState([])
  const [userID, setUserID] = useState(null)
  const [roleId, setRoleId] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  //  selected user for displaying role while editing roles
  const [selectedUser, setSelectedUser] = useState(null)

  const [editUser, setEditUser] = useState({
    address: "",
    contactNo: "",
    email: "",
    name: "",
    role: [],
  })

  // for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)

  // fetch list of users based on selected role
  const fetchUserList = async () => {
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
  }

  // effect to auto run fetching of users
  useEffect(() => {
    fetchUserList()
  }, [selectedRole, token])

  // auto update selected user's data when new data is fetched
  useEffect(() => {
    if (userID !== null) {
      setSelectedUser(filteredUsers.find((user) => user.id === userID))
    }
  }, [filteredUsers])

  // role selection to fetch users based on role type
  const handleRoleSelect = (event) => {
    setSelectedRole(event.target.value)
  }

  // edit user data
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

  // update user details
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
          fetchUserList()
        } else {
          toast.error("Error updating user")
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error)
        toast.error("Error updating user")
      })
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

  // delete a user
  const handleConfirmDelete = async () => {
    await axios
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
          fetchUserList()
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

  // function that sets user id for role edit and opens role edit dialog
  const handleAssignRole = (userId) => {
    setUserID(userId)
    setAssignDialogOpen(true)
  }

  // delete a role from user
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
        if (response.status === 200) {
          toast.success("Role deleted successfully")
          fetchUserList()
        } else {
          toast.error("Error deleting role")
        }
      })
      .catch((error) => {
        console.error("Error deleting role:", error)
        if (error.response.status === 400) {
          toast.warn(
            error.response.data.error.message ||
              "Something went wrong with request"
          )
        } else {
          toast.error("Error deleting role")
        }
      })
  }

  // add new role to user
  const handleConfirmAssignRole = async () => {
    if (roleId === null) {
      toast.warn("Please select a role before assinging.")
      return
    }

    const requestBody = {
      roleId: roleId,
    }

    await axios
      .put(`${VITE_BACKEND_URL}/admin/users/${userID}/roles`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle successful response
        console.log("Role assigned:", response.data)
        if (response.status === 200) {
          toast.success("Role assigned successfully")
          fetchUserList()
        } else {
          toast.error("Error assigning role")
        }
      })
      .catch((error) => {
        console.error("Error assigning role:", error)
        toast.error("Error assigning role")
      })
  }

  // cancel edit dialog
  const handleCancelAssignRole = () => {
    setAssignDialogOpen(false)
  }

  if (isLoading) {
    return <Typography>Loading ...</Typography>
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>
  }

  // columns for the datagrid
  const columns = [
    { field: "sn", headerName: "SN", width: 70 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "address", headerName: "Address", width: 150 },
    { field: "contactNo", headerName: "Contact No", width: 120 },
    { field: "roles", headerName: "Roles", width: 230 },
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
              onClick={() => {
                handleAssignRole(params.row.id)
                const user = filteredUsers.find(
                  (user) => user.id === params.row.id
                )
                setSelectedUser(user)
              }}
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
          <MenuItem value="">ALL</MenuItem>
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
          <Box style={{ width: "100%" }}>
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
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </Box>
        )}
      </Box>

      {/* Edit dialog */}
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
        <Divider />
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        maxWidth={"md"}
        fullWidth
      >
        <DialogTitle>Delete User</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="h6">
            Are you sure you want to delete this user?
          </Typography>
        </DialogContent>
        <Divider sx={{ marginTop: 1 }} />

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

      {/* Assign/Delete Role Dialog */}
      <Dialog
        open={assignDialogOpen}
        onClose={handleCancelAssignRole}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Modify Role</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack direction="column" gap={1}>
            {selectedUser !== null && (
              <>
                <Typography>Name: {selectedUser.name}</Typography>
                <Typography>Email: {selectedUser.email}</Typography>

                <Divider sx={{ marginTop: 1 }}>Assigned Roles</Divider>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Role</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedUser.UserRoles.map((role, index) => (
                        <TableRow key={index}>
                          <TableCell>{role.role.name}</TableCell>
                          <TableCell>{role.role.description}</TableCell>

                          <TableCell>
                            <Button
                              variant="outlined"
                              sx={{ color: "red" }}
                              startIcon={<DeleteForeverIcon />}
                              onClick={() => {
                                // set the role to delete and call the role delete func
                                setRoleId(role.role.id)
                                handleConfirmDeleteRole()
                              }}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            <Typography variant="h6" sx={{ marginTop: 1 }}>
              Assign New Role
            </Typography>

            <Stack direction="row" gap={2}>
              <InputLabel>
                Select a role to Add or Delete:
                <Select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  sx={{ margin: "0.5rem", width: "300px" }}
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
              <Button
                onClick={handleConfirmAssignRole}
                variant="contained"
                style={{
                  backgroundColor: "green",
                  width: 200,
                  margin: 10,
                }}
                startIcon={<AddIcon />}
              >
                Assign
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={handleCancelAssignRole}
            startIcon={<CloseIcon />}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ListUsers
