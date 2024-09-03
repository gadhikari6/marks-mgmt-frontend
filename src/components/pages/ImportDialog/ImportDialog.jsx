import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Input,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import PublishIcon from "@mui/icons-material/Publish"
import { useState } from "react"
import { toast } from "react-toastify"

export default function ImportDialog({
  openToggle,
  closeToggleFunc,
  dialogTitle,
  downloadLink,
  uploadFunc,
  extraMsg = "",
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSelected, setIsSelected] = useState(false)

  // handler for file
  const fileChangeHandler = (e) => {
    if (
      e.target.files[0].type !== "text/csv" &&
      e.target.files[0].type !== "application/vnd.ms-excel"
    ) {
      toast.warn("Only CSV files are allowed.")
      e.target.value = ""
      return
    }
    setSelectedFile(e.target.files[0])
    setIsSelected(true)
  }

  return (
    <Dialog
      open={openToggle}
      onClose={() => {
        closeToggleFunc()
        setIsSelected(false)
        setSelectedFile(null)
      }}
      maxWidth={"md"}
      fullWidth
    >
      <DialogTitle>Import {dialogTitle} CSV file</DialogTitle>
      <Divider />

      <DialogContent>
        <Typography component={"div"} variant="h6">
          Download sample:{" "}
          <a
            href={downloadLink}
            download={"courses-sample.csv"}
            target="_blank"
            rel="noreferrer"
          >
            Click here
          </a>
        </Typography>
        <Typography component={"div"} variant="caption">
          Note: Please donot upload more than a thousand records at once.
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            toast.info("Request has been submitted.", { autoClose: 300 })
            uploadFunc(selectedFile)
            e.target.reset()
            setIsSelected(false)
          }}
        >
          <Stack direction="row" gap={5} sx={{ marginTop: 3, padding: 1 }}>
            <TextField
              type="file"
              name="file"
              fullWidth
              onChange={fileChangeHandler}
            />
            <Button
              startIcon={<PublishIcon />}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ maxWidth: "15rem" }}
              type="submit"
              disabled={!isSelected}
            >
              Upload
            </Button>
          </Stack>
        </form>

        <Typography component={"div"} variant="caption" mt={1}>
          {extraMsg}
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          variant="outlined"
          startIcon={<CloseIcon />}
          color="secondary"
          onClick={() => {
            closeToggleFunc()
            setIsSelected(false)
            setSelectedFile(null)
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
