import {
  Box,
  Paper,
  Stack,
  Card,
  CardContent,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js"
import useProfile from "../../../hooks/useProfile"
import { ArcElement } from "chart.js"
import useTeacherCourses from "../../../hooks/useTeacherCourses"
import useCurrentBatch from "../../../hooks/count/useCurrentBatch"

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  Colors
)

export default function TeacherDashboard() {
  // fetch profile details
  const { data: profile } = useProfile()
  const { data: courses } = useTeacherCourses()
  const { data: batch } = useCurrentBatch()

  return (
    <Paper elevation={1} sx={{ backgroundColor: "#f2f2f2" }}>
      <Box
        flexDirection="column"
        sx={{ margin: 1, display: "flex", gap: 2, padding: 2 }}
      >
        {/* First row for basic info*/}
        <Box>
          <Stack direction="row" spacing={5} justifyContent={"flex-start"}>
            <Card>
              <CardContent>
                <Stack direction="column" spacing={2} textAlign="center">
                  <Typography gutterBottom variant="h5" component="div">
                    Courses Taught
                  </Typography>
                  <Divider />
                  <Typography gutterBottom variant="h4" component="div">
                    {(courses !== undefined &&
                      courses !== null &&
                      courses.courses.length) ||
                      "..."}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Stack direction="column" spacing={2} textAlign="center">
                  <Typography gutterBottom variant="h5" component="div">
                    Marks Collection
                  </Typography>
                  <Divider />
                  <Typography
                    gutterBottom
                    variant="h4"
                    component="div"
                    color={"red"}
                  >
                    {(batch !== undefined &&
                    batch !== null &&
                    batch?.marksCollect
                      ? "Enabled"
                      : "Disabled") || "..."}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </Paper>
  )
}
