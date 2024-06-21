import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Divider,
  styled,
  Stack,
} from "@mui/material"
import useSyllabus from "../../../hooks/useSyllabus"
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}))

const SyllabusPage = () => {
  const { isLoading, error, data } = useSyllabus()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const coursesBySemester = {}

  data.syllabus.ProgramCourses.forEach((course) => {
    const semesterId = course.semesterId

    if (!coursesBySemester[semesterId]) {
      coursesBySemester[semesterId] = []
    }

    coursesBySemester[semesterId].push(course)
  })

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
      {/* displays eg: computer old semester */}
      {/* <Typography variant="h1">{data.syllabus.name}</Typography> */}
      <Typography
        variant="h4"
        style={{ marginBottom: "10px", textAlign: "center" }}
      >
        {data.syllabus.program.name}
      </Typography>
      <Root>
        <Divider style={{ marginBottom: "10px", textAlign: "center" }}>
          Syllabus
        </Divider>
      </Root>

      <Stack direction="column" gap={1.5}>
        {Object.entries(coursesBySemester).map(([semesterId, courses]) => (
          <Paper key={semesterId} variant="outlined" square sx={{ padding: 2 }}>
            <Typography
              sx={{ fontSize: 18 }}
              color="text.secondary"
              gutterBottom
              style={{ marginBottom: "20px" }}
            >
              Semester {semesterId}
            </Typography>
            <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course Code</TableCell>
                    <TableCell>Course Name</TableCell>
                    <TableCell>Credit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.courseId}>
                      <TableCell>{course.course.code}</TableCell>
                      <TableCell>{course.course.name}</TableCell>
                      <TableCell>{course.course.credit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ))}
      </Stack>
    </Box>
  )
}

export default SyllabusPage
