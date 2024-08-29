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
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from "chart.js"
import { Bar, Doughnut } from "react-chartjs-2"

import useStudentCount from "../../../hooks/count/useStudentCount"
import useTeacherCount from "../../../hooks/count/useTeacherCount"
import { useState } from "react"
import { useEffect } from "react"
import useDepartments from "../../../hooks/count/useDepartments"
import useBatches from "../../../hooks/count/useBatches"
import axios from "axios"
import { useContext } from "react"
import { LoginContext } from "../../../store/LoginProvider"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

ChartJS.register(ArcElement, Tooltip, Legend, Colors)

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

const prepDoughnutData = (data) => {
  const labels = []
  const students = []
  for (const program of data.programs) {
    labels.push(program.name)
    students.push(program.students)
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "# of Students",
        data: students,

        borderWidth: 5,
      },
    ],
  }
  return chartData
}

// prepare chart data for overall of a certain batch
const prepareBatchWise = (data) => {
  let labels = []
  let values = []
  const marks = new Map()

  for (const mark of data) {
    const program = mark.student.program.name
    let total = mark.theory + mark.practical
    if (marks.get(program) === undefined) {
      marks.set(program, total)
    } else {
      total += marks.get(program)
      marks.set(program, total)
    }
  }

  marks.forEach((value, key) => {
    labels.push(key)
    values.push(value)
  })

  return {
    labels: labels,
    datasets: [{ label: `Marks Obtained`, data: values }],
  }
}

export default function AdminDashboard() {
  const { loginState } = useContext(LoginContext)

  const [totalStds, setTotalStds] = useState(0)
  const [activeStds, setActiveStds] = useState(0)
  const [programs, setPrograms] = useState([])
  const [departments, setDepartments] = useState([])
  const [doughnutData, setDoughnutData] = useState(null)
  const { isLoading, error, data } = useStudentCount()

  const { data: teacherCount } = useTeacherCount()

  const { data: departmentsData } = useDepartments()

  // list of all batches
  const { data: batchList } = useBatches()

  // batch id
  const [selectedBatchId, setSelectedBatchId] = useState(0)

  // make data by batch id
  useEffect(() => {
    if (
      selectedBatchId === undefined ||
      selectedBatchId === null ||
      selectedBatchId === 0
    ) {
      return
    }
    fetchMarks(selectedBatchId)
  }, [selectedBatchId])

  // chartData for vertical bar
  const [verticalBarData, setVerticalBarData] = useState(null)

  // fetchMarks
  const fetchMarks = async (batchId = 0) => {
    if (batchId === 0) return
    try {
      const response = await axios.get(
        `${VITE_BACKEND_URL}/admin/marks?batch_id=${batchId}`,
        {
          headers: {
            Authorization: `Bearer ${loginState.token}`,
          },
        }
      )
      if (response.status === 200) {
        setVerticalBarData(prepareBatchWise(response.data))
      }
    } catch (error) {
      console.log(error) // for logging
    }
  }

  // handle batch id change
  const handleBatchChange = (event) => {
    setSelectedBatchId(Number(event.target.value) || 0)
  }

  // for students count and programs
  useEffect(() => {
    if (!isLoading && error === null) {
      setActiveStds(data.active)
      setTotalStds(data.total)
      setPrograms(data.programs)
      setDoughnutData(prepDoughnutData(data))
    }
  }, [isLoading, error, data])

  // for departments
  useEffect(() => {
    if (departmentsData !== null && departmentsData !== undefined) {
      setDepartments(departmentsData)
    }
  }, [departmentsData])

  return (
    // TODO: Change background color later
    <Paper elevation={1} sx={{ backgroundColor: "#f2f2f2" }}>
      <Box
        flexDirection="column"
        sx={{ margin: 2, display: "flex", gap: 3, padding: 2 }}
      >
        {/* First row for basic info*/}
        <Box>
          <Stack direction="row" spacing={5} justifyContent={"space-evenly"}>
            <Card>
              <CardContent>
                <Stack direction="column" spacing={2} textAlign="center">
                  <Typography gutterBottom variant="h4" component="div">
                    Total Students
                  </Typography>
                  <Divider />
                  <Typography gutterBottom variant="h3" component="div">
                    {totalStds}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Stack direction="column" spacing={2} textAlign="center">
                  <Typography gutterBottom variant="h4" component="div">
                    Active Students
                  </Typography>
                  <Divider />
                  <Typography gutterBottom variant="h3" component="div">
                    {activeStds}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Stack
                  direction="column"
                  spacing={2}
                  textAlign="center"
                  height="max-content"
                >
                  <Typography gutterBottom variant="h4" component="div">
                    Total Programs
                  </Typography>
                  <Divider />
                  <Typography gutterBottom variant="h3" component="div">
                    {programs.length}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Stack direction="column" spacing={2} textAlign="center">
                  <Typography gutterBottom variant="h4" component="div">
                    Total Teachers
                  </Typography>
                  <Divider />
                  <Typography gutterBottom variant="h3" component="div">
                    {teacherCount !== undefined &&
                      teacherCount !== null &&
                      (teacherCount.total || "...")}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Stack direction="column" spacing={2} textAlign="center">
                  <Typography gutterBottom variant="h4" component="div">
                    Total Departments
                  </Typography>
                  <Divider />
                  <Typography gutterBottom variant="h3" component="div">
                    {departments.length}
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
            spacing={2}
            justifyContent={"center"}
            textAlign="center"
          >
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Student Distribution
                </Typography>
                {doughnutData !== null && <Doughnut data={doughnutData} />}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Performance Chart
                </Typography>
                <FormControl sx={{ m: 1, width: "35rem" }}>
                  <InputLabel>Select Batch</InputLabel>
                  <Select
                    value={selectedBatchId ? selectedBatchId : 0}
                    onChange={handleBatchChange}
                    label="Select Batch"
                  >
                    <MenuItem key={0} value={0}>
                      Select a batch
                    </MenuItem>

                    {batchList !== undefined &&
                      batchList !== null &&
                      batchList.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {item.year} {item.season}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <Divider />
                {verticalBarData !== null && (
                  <Bar options={options} data={verticalBarData} />
                )}
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </Paper>
  )
}
