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

  return (
    // TODO: Change background color later
    <Paper elevation={1} sx={{ backgroundColor: "#f2f2f2" }}>
      <h1>This is teacher dashboard!!!</h1>
    </Paper>
  )
}
