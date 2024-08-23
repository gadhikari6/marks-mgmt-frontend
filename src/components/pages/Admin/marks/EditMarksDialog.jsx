import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { toast } from "react-toastify"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Close"

export default function EditMarksDialog({
  openToggle,
  closeDialogFunc,
  editMarksFunc,
  selectedRow,
}) {
  /* Single Marks Entry edit dialog*/

  return (
    <Dialog
      fullWidth
      open={openToggle}
      onClose={() => {
        closeDialogFunc()
      }}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const theory = Number(e.target.theory.value)
          const practical = Number(e.target.practical.value)
          const NQ = e.target.NQ.checked
          const maxTheory = selectedRow.courseDetails.markWeightage.theory
          const maxPrac = selectedRow.courseDetails.markWeightage.practical
          const absent = e.target.absent.checked
          const expelled = e.target.expelled.checked

          if (theory < 0 || theory > maxTheory) {
            toast.warn(
              `Please provide a valid theory marks value. Should not execeed ${maxTheory}`
            )
            return
          }

          if (practical < 0 || practical > maxPrac) {
            toast.warn(
              `Please provide a valid practical marks value. Should not exceed ${maxPrac}`
            )
            return
          }

          await editMarksFunc({
            practical: practical,
            theory: theory,
            notQualified: NQ,
            studentId: selectedRow?.studentId,
            courseId: selectedRow?.courseId,
            absent: absent,
            expelled: expelled,
          })
          toast.info("Marks update request has been submitted.", {
            autoClose: 150,
          })
          closeDialogFunc()
        }}
      >
        <DialogTitle>Edit Single Student Marks</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Name: {selectedRow?.name}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Symbol: {selectedRow?.symbol}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Pu Regd No: {selectedRow?.puRegNo}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Year Joined: {selectedRow?.yearJoined}
          </Typography>
          <Divider>Marks Details</Divider>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Semester: {selectedRow?.semester || ""}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Course: {selectedRow?.course || ""}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Batch:{" "}
            {selectedRow?.batch?.year + " " + selectedRow?.batch?.season || ""}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Current Marks: [Theory: {selectedRow?.theory}, Practical:{" "}
            {selectedRow?.practical}, Total:{" "}
            {selectedRow?.theory + selectedRow?.practical}]
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Others: [ Not Qualified: {selectedRow?.notQualified ? "Yes" : "No"},
            Absent: {selectedRow?.absent ? "Yes" : "No"}, Expelled:{" "}
            {selectedRow?.expelled ? "Yes" : "No"}]
          </Typography>

          <Divider sx={{ m: 1 }}>Edit Marks</Divider>
          <Stack direction="row" gap={1}>
            <TextField
              id="theory"
              name="Theory"
              label="Theory *"
              type="number"
              variant="outlined"
              margin="normal"
              defaultValue={selectedRow?.theory || ""}
            />

            <TextField
              id="practical"
              name="Practical"
              label="Practical *"
              type="number"
              variant="outlined"
              margin="normal"
              defaultValue={selectedRow?.practical || ""}
            />
          </Stack>
          <FormControlLabel
            control={
              <Checkbox
                id="NQ"
                name="NQ"
                label="Not Qualified?"
                defaultChecked={selectedRow?.NotQualified || false}
              />
            }
            label="Not Qualified ?"
          />
          <FormControlLabel
            control={
              <Checkbox
                id="absent"
                name="absent"
                label="Absent?"
                defaultChecked={selectedRow?.absent || false}
              />
            }
            label="Absent ?"
          />
          <FormControlLabel
            control={
              <Checkbox
                id="expelled"
                name="expelled"
                label="Expelled?"
                defaultChecked={selectedRow?.expelled || false}
              />
            }
            label="Expelled ?"
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant="outlined" startIcon={<SaveIcon />} type="submit">
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<CancelIcon />}
            onClick={() => {
              closeDialogFunc()
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
