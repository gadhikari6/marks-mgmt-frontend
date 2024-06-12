import {
  Box,
  Paper,
  Stack,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from "chart.js"
import { Doughnut } from "react-chartjs-2"

import useStudentCount from "../../../hooks/count/useStudentCount"

import { useState } from "react"
import { useEffect } from "react"
import useDepartments from "../../../hooks/count/useDepartments"

ChartJS.register(ArcElement, Tooltip, Legend, Colors)

// TODO: add skeleton for dashboard if needed at all

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
  console.log(JSON.stringify(chartData))
  return chartData
}

export default function AdminDashboard() {
  const [totalStds, setTotalStds] = useState(0)
  const [activeStds, setActiveStds] = useState(0)
  const [programs, setPrograms] = useState([])
  const [departments, setDepartments] = useState([])
  const [doughnutData, setDoughnutData] = useState(null)
  const { isLoading, error, data } = useStudentCount()

  const { data: departmentsData } = useDepartments()

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
                    {/* Add teachers count over here */}
                    .....
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
            spacing={5}
            justifyContent={"space-evenly"}
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
          </Stack>
        </Box>
      </Box>
    </Paper>
  )
}
