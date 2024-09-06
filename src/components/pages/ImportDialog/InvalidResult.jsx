import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

export default function InvalidResult({ openToggle, closeToggleFunc, data }) {
  return (
    <Dialog
      open={openToggle}
      onClose={() => {
        closeToggleFunc()
      }}
      maxWidth={"md"}
      fullWidth
    >
      <DialogTitle>Failed Queries</DialogTitle>
      <Divider />
      {console.log(data)}
      <DialogContent>
        <ol>
          {data !== null &&
            data.length > 0 &&
            data?.map((item, index) => (
              <li key={index}>
                <ul key={index}>
                  {Object.keys(item).map((val, k) => (
                    <li key={k}>
                      {val} :{item[val]}
                    </li>
                  ))}
                </ul>
                <br />
              </li>
            ))}
        </ol>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          variant="outlined"
          startIcon={<CloseIcon />}
          color="secondary"
          onClick={() => {
            closeToggleFunc()
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
