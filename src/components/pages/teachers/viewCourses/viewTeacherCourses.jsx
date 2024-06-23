import { useEffect } from "react"
import useTeacherCourses from "../../../../hooks/useTeacherCourses"
import { useState } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import InfoIcon from "@mui/icons-material/Info"
import CloseIcon from "@mui/icons-material/Close"

export default function ViewTeacherCourses() {
  const [allCourses, setAllCourses] = useState(null)
  const { isLoading, error, data } = useTeacherCourses()

  const [openDialog, setOpenDialog] = useState(false)
  // state to keep selected course detail for dialog
  const [selectedProgram, setSelectedProgram] = useState(null)

  useEffect(() => {
    if (data !== null) {
      if (allCourses !== undefined) setAllCourses(data)
    }
  }, [data])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <Box
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
          "gothammedium-webfont",
        ].join(","),
      }}
    >
      <Typography
        variant="h5"
        style={{ marginBottom: "10px", textAlign: "center" }}
      >
        Courses Taught
      </Typography>
      <Divider />
      <Stack direction="column" gap={1.5}>
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell>Credit</TableCell>
                <TableCell>Program</TableCell>
                <TableCell>Semester</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allCourses !== undefined &&
                allCourses !== null &&
                allCourses.courses.map((course, index) => (
                  <TableRow key={index}>
                    <TableCell>{course.course.name}</TableCell>
                    <TableCell>{course.course.credit}</TableCell>

                    <TableCell key={course.program.name}>
                      {course.program.name} ({course.syllabus.name})
                    </TableCell>

                    <TableCell key={course.semester.id + "sem"}>
                      {course.semester.id}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        startIcon={<InfoIcon />}
                        onClick={() => {
                          setSelectedProgram(course)
                          setOpenDialog(true)
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      {/* Dialog to view course details */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
        }}
      >
        <DialogTitle>Course Details</DialogTitle>
        <Divider />
        <DialogContent sx={{ margin: 1, padding: 1 }}>
          {selectedProgram !== null && (
            <>
              <Stack gap={2} sx={{ padding: 1 }}>
                <Typography key={selectedProgram.name} variant="body1">
                  Name: {selectedProgram?.course?.name}
                </Typography>

                <Typography key={selectedProgram.credit} variant="body1">
                  Credit: {selectedProgram?.course?.credit}
                </Typography>

                <Typography key={selectedProgram.code} variant="body1">
                  Code: {selectedProgram?.course?.code}
                </Typography>

                <Typography key={selectedProgram.code} variant="body1">
                  Elective: {selectedProgram?.course?.elective ? "Yes" : "No"}
                </Typography>

                <Typography key={selectedProgram.code} variant="body1">
                  Project: {selectedProgram?.course?.project ? "Yes" : "No"}
                </Typography>

                <Typography key={selectedProgram.code} variant="body1">
                  Program: {selectedProgram?.program?.name}
                </Typography>

                <Typography key={selectedProgram.code} variant="body1">
                  Syllabus: {selectedProgram?.syllabus?.name}
                </Typography>

                <Typography key={selectedProgram.code} variant="body1">
                  Semester: {selectedProgram?.semester?.id}
                </Typography>

                <Typography key={selectedProgram.code} variant="body1">
                  MarksWeightage: [ Theory:{" "}
                  {selectedProgram?.course?.markWeightage?.theory}, Practical:{" "}
                  {selectedProgram?.course?.markWeightage?.practical} ]
                </Typography>
              </Stack>
            </>
          )}
        </DialogContent>
        <Divider />

        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={() => {
              setOpenDialog(false)
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
