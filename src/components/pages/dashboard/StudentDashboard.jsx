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
import useMarks from "../../../hooks/useMarks" // student's personal marks
import { useState } from "react"
import { useEffect } from "react"
import { Bar, Doughnut } from "react-chartjs-2"
import { ArcElement } from "chart.js"

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

// chart options
const options = {
  responsive: true,

  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Performance chart",
    },
  },
}

// prepare data for circular chart
const prepareCircularChart = (data) => {
  let labels = []
  let values = []
  for (const semester of data.semesters) {
    for (const course of semester.courses) {
      labels.push(course.course.name)
      values.push(course.marks.theory + course.marks.practical)
    }
  }

  return {
    labels: labels,
    datasets: [{ label: "Marks Obtained", data: values }],
  }
}

// prepare chart data for a single semester
const prepareForSemester = (data) => {
  console.log(data) // remove later
  let labels = []
  let values = []
  for (const course of data.courses) {
    labels.push(course.course.name)

    // label: "Marks Obtained",
    values.push(course.marks.theory + course.marks.practical)
  }
  console.log({ labels: labels, datasets: { data: values } }) // remove later

  return {
    labels: labels,
    datasets: [{ label: "Marks Obtained", data: values }],
  }
}

// prepare chart data for overall of all semesters
const prepareForAll = (data) => {
  let labels = []
  let values = []
  for (const semester of data.semesters) {
    labels.push("Semester " + semester.semester)
    let totalSemMarks = 0
    for (const course of semester.courses) {
      totalSemMarks += course.marks.theory + course.marks.practical
    }

    values.push(totalSemMarks)
  }

  return {
    labels: labels,
    datasets: [{ label: "Marks Obtained", data: values }],
  }
}

export default function StudentDashboard() {
  // fetch profile details
  const { data: profile } = useProfile()

  const { data: marks } = useMarks()

  // semester value for selection
  const [semesterId, setSemesterId] = useState(0)

  // bar chart data
  const [chartData, setChartData] = useState(null)

  // ciruclar chart data
  const [circularChartData, setCircularChartData] = useState(null)

  // handler for semester selector
  const handleSemesterChange = (e) => {
    setSemesterId(Number(e.target.value) || 0)
  }

  // prepare chart data on semester change
  useEffect(() => {
    if (marks === undefined || marks === null) return

    setCircularChartData(prepareCircularChart(marks)) // set ciruclar chart data

    if (semesterId === 0) {
      setChartData(prepareForAll(marks))
    } else {
      const semData = marks.semesters.filter(
        (sem) => sem.semester === semesterId
      )
      setChartData(prepareForSemester(semData[0]))
    }
  }, [marks, semesterId])

  return (
    // TODO: Change background color later
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
                    Current Semester
                  </Typography>
                  <Divider />
                  <Typography gutterBottom variant="h4" component="div">
                    {(profile !== undefined &&
                      profile !== null &&
                      profile.Student[0]?.semester?.id) ||
                      "..."}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Stack direction="column" spacing={2} textAlign="center">
                  <Typography gutterBottom variant="h5" component="div">
                    Program
                  </Typography>
                  <Divider />
                  <Typography gutterBottom variant="h4" component="div">
                    {(profile !== undefined &&
                      profile !== null &&
                      profile.Student[0]?.program?.name) ||
                      "..."}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack direction="column" spacing={2} textAlign="center">
                  <Typography gutterBottom variant="h5" component="div">
                    Syllabus
                  </Typography>
                  <Divider />
                  <Typography gutterBottom variant="h4" component="div">
                    {(profile !== undefined &&
                      profile !== null &&
                      profile.Student[0]?.syllabus?.name) ||
                      "..."}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>

        {/* Second row for charts*/}

        <Box>
          <Stack
            direction="row"
            spacing={5}
            justifyContent={"flex-start"}
            textAlign="center"
          >
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Performance Chart
                </Typography>
                <FormControl sx={{ m: 1, width: "35rem" }}>
                  <InputLabel>Select Semester</InputLabel>
                  <Select
                    value={semesterId ? semesterId : 0}
                    onChange={handleSemesterChange}
                    label="Semester Semester"
                  >
                    <MenuItem key={0} value={0}>
                      All Semesters
                    </MenuItem>

                    {marks !== undefined &&
                      marks !== null &&
                      marks.semesters.map((sem) => (
                        <MenuItem key={sem.semester} value={sem.semester}>
                          Semester {sem.semester}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <Divider />
                {chartData !== null && (
                  <Bar options={options} data={chartData} />
                )}
              </CardContent>
            </Card>
            <Card sx={{ minWidth: "30rem" }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Subject Wise Chart
                </Typography>

                <Divider sx={{ m: 1 }} />
                {circularChartData !== null && (
                  <Doughnut
                    data={circularChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: true,
                          position: "bottom",
                        },
                      },
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </Paper>
  )
}
