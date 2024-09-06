import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material"
import { useState } from "react"
import useBatches from "../../../../hooks/count/useBatches"
import useYearJoined from "../../../../hooks/count/useYearJoined"
import GetAppIcon from "@mui/icons-material/GetApp"
import usePrograms from "../../../../hooks/count/usePrograms"
import ClearIcon from "@mui/icons-material/Clear"
import EditIcon from "@mui/icons-material/Edit"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import EditMarksDialog from "./EditMarksDialog"
import axios from "axios"
import { toast } from "react-toastify"
import { useContext } from "react"
import { LoginContext } from "../../../../store/LoginProvider"
import { useEffect } from "react"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import ImportDialog from "../../ImportDialog/ImportDialog"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

export default function AdminMarks() {
  const { loginState } = useContext(LoginContext)

  // to keep track of batchId
  const [batchId, setBatchId] = useState(-1)
  // for year joined
  const [year, setYear] = useState(-1)

  // for programid
  const [programId, setProgramId] = useState(-1)

  // for semester
  const [semester, setSemester] = useState(0)

  // details of selected program
  const [selectedProgram, setSelectedProgram] = useState(null)

  // fetch batch info
  const { data: batchData } = useBatches()
  // fetch list of distinct years joined
  const { data: yearsJoinedList } = useYearJoined()
  // programs list
  const { data: programs } = usePrograms()

  // toggle to open and close marks edit dialog
  const [editMarksToggle, setEditMarksToggle] = useState(false)

  // for recording response of marks endpoint
  const [response, setResponse] = useState(null)

  // for editing marks
  const [rowForEdit, setRowForEdit] = useState({})

  // for rows
  const [rowsData, setRowsData] = useState(null)

  // fetchMarks
  const fetchMarks = async (
    batchId = 0,
    yearJoined = 0,
    programId = 0,
    semesterId = 0
  ) => {
    const batch = batchId <= 0 ? 0 : batchId
    const year = yearJoined <= 0 ? 0 : yearJoined
    const program = programId <= 0 ? 0 : programId
    const semester = semesterId <= 0 ? 0 : semesterId
    try {
      const response = await axios.get(
        `${VITE_BACKEND_URL}/admin/marks?year_joined=${year}&program_id=${program}&semester=${semester}&batch_id=${batch}`,
        {
          headers: {
            Authorization: `Bearer ${loginState.token}`,
          },
        }
      )
      if (response.status === 200) {
        setResponse(response.data)
      }
    } catch (error) {
      console.log(error) // for logging
    }
  }

  // auto update the rows
  useEffect(() => {
    if (response !== undefined && response !== null) {
      readyMarksForRows(response)
    }
  }, [response])

  // func to update marks of student
  const updateMarks = async (data) => {
    try {
      await axios
        .put(
          `${VITE_BACKEND_URL}/admin/marks`,
          { ...data },
          { headers: { Authorization: `Bearer ${loginState.token}` } }
        )
        .then((response) => {
          toast.success(`Marks was updated successfully.`)
          fetchMarksHandler()
        })
        .catch((err) => {
          console.log(err) // for logging
          if (err.response.status === 400) {
            toast.warn("Please check values and try again.")
          } else if (err.response.status === 403) {
            toast.warn("Not allowed. Not enough privelges.")
          } else {
            toast.warn("Something went wrong. Please try again later.")
          }
        })
    } catch (err) {
      console.log(err) // for logging
      toast.warn("Something went wrong. Please try again later.")
    }
  }

  // ready the marks for rows of datagrid
  const readyMarksForRows = (marks) => {
    if (marks !== undefined && marks !== null) {
      setRowsData(
        marks.map((mark, index) => {
          return {
            id: index,
            sn: index + 1,
            ...mark,
            name: mark.student.user.name || "",
            symbol: mark.student.symbolNo,
            puRegNo: mark.student.puRegNo,
            course: mark.course.name,
            courseDetails: mark.course,
            yearJoined: mark.student.yearJoined,
            semester: mark.course.ProgramCourses[0].semesterId | "-",
            program: mark.student.program.name,
            total: mark.theory + mark.practical || 0,
          }
        })
      )
    }
  }

  // handle the changes of batch select
  const handleBatchChange = (e) => {
    setBatchId(Number(e.target.value))
  }

  // handle the changes of yeaar select
  const handleYearChange = (e) => {
    setYear(Number(e.target.value))
  }

  // handle the changes of program select
  const handleProgramChange = (e) => {
    setProgramId(Number(e.target.value))
    setSelectedProgram(
      programs.filter((program) => program.id === Number(e.target.value))
    )
  }

  // handle the changes of semester select
  const handleSemesterChange = (e) => {
    setSemester(Number(e.target.value))
  }

  // fetch marks handler
  const fetchMarksHandler = async () => {
    fetchMarks(batchId || 0, year || 0, programId || 0, semester || 0)
  }

  // clear all filters
  const clearAllFilters = () => {
    setBatchId(-1)
    setYear(-1)
    setProgramId(-1)
    setSemester(0)
  }

  // columns for data grid
  const columns = [
    { field: "sn", headerName: "S.N.", width: 60 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "symbol", headerName: "SymbolNo", width: 120 },
    { field: "puRegNo", headerName: "PuRegNo", width: 150 },
    { field: "yearJoined", headerName: "Year Joined", width: 100 },
    { field: "program", headerName: "Program", width: 150 },
    { field: "semester", headerName: "Semester", width: 100 },
    { field: "course", headerName: "Course", width: 200 },
    {
      field: "theory",
      headerName: "Theory",
      width: 100,

      renderCell: (params) => (
        <>
          {(!params.row.NotQualified &&
            !params.row.expelled &&
            !params.row.absent &&
            params.row.theory) ||
            "-"}
        </>
      ),
    },
    {
      field: "practical",
      headerName: "Practical",
      width: 100,
      renderCell: (params) => (
        <>
          {(!params.row.NotQualified &&
            !params.row.expelled &&
            !params.row.absent &&
            params.row.practical) ||
            "-"}
        </>
      ),
    },
    {
      field: "total",
      headerName: "Total",

      width: 105,
      renderCell: (params) => (
        <>
          <Typography color={"red"}>
            <Stack direction={"column"}>
              <span> {params.row.absent ? "Absent " : null}</span>
              <span>{params.row.expelled ? "Expelled " : null}</span>
              <span>{params.row.NotQualified ? "Not-Qualified" : null}</span>
            </Stack>
          </Typography>
          <Typography>
            {!params.row.NotQualified &&
              !params.row.expelled &&
              !params.row.absent &&
              params.row.practical + params.row.theory}
          </Typography>
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Stack direction="row" gap={1}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<EditIcon />}
            onClick={() => {
              // open the edit dialog
              setRowForEdit(params.row)
              setEditMarksToggle(true)
            }}
          >
            EDIT
          </Button>
        </Stack>
      ),
    },
  ]

  // toggle to open dialog
  const [importToggle, setImportToggle] = useState(false)

  // method to upload csv
  const uploadMarksCSV = async (file) => {
    try {
      await axios
        .post(
          `${VITE_BACKEND_URL}/admin/marks/import`,
          {
            file: file,
          },
          {
            headers: {
              Authorization: `Bearer ${loginState.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          if (response.status === 201) {
            const valid = response.data?.validQueries?.length || 0
            const invalid = response.data?.invalidQueries?.length || 0

            toast.success(
              `Request resulted in ${valid} valid queries and ${invalid} invalid queries.`
            )
            fetchMarks(batchId || 0, year || 0, programId || 0, semester || 0)
          }
        })
        .catch((err) => {
          console.log(err.response) // remove later
          toast.warn(err.response.data.error.message)
          toast.warn(
            "Did you provide right csv fields? Use the sample csv as guide."
          )
        })
    } catch (err) {
      toast.warn("Something wrong went with request")
      console.log(err) // remove later
    }
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
      <Stack direction="column">
        <Stack direction="row" gap={3}>
          <FormControl sx={{ m: 1, minWidth: "30rem" }}>
            <InputLabel id="batch-level">Select a Batch</InputLabel>
            <Select
              id="batch"
              labelId="batch-level"
              label="Select a Batch"
              onChange={handleBatchChange}
              value={batchId === -1 ? "" : batchId}
            >
              <MenuItem key={0} value={0}>
                <Typography>All Batches</Typography>
              </MenuItem>
              {batchData !== undefined &&
                batchData !== null &&
                batchData.map((batch) => (
                  <MenuItem key={batch.id} value={batch.id}>
                    <Typography>
                      {batch.year} {batch.season}
                    </Typography>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: "30rem" }}>
            <InputLabel id="year-level">Select a Year Joined</InputLabel>
            <Select
              id="year"
              labelId="year-level"
              label="Select a Year Joined"
              onChange={handleYearChange}
              value={year === -1 ? "" : year}
            >
              <MenuItem key={0} value={0}>
                <Typography>All Years</Typography>
              </MenuItem>
              {yearsJoinedList !== undefined &&
                yearsJoinedList !== null &&
                yearsJoinedList.map((year) => (
                  <MenuItem key={year.yearJoined} value={year.yearJoined}>
                    <Typography>{year.yearJoined}</Typography>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<GetAppIcon />}
            onClick={() => {
              fetchMarksHandler()
            }}
            sx={{
              alignSelf: "center",
              padding: 1,
              margin: 1,
              // marginLeft: "auto",
            }}
          >
            Fetch Marks
          </Button>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={() => {
              setImportToggle(true)
            }}
            sx={{
              alignSelf: "center",
              padding: 1,
              paddingLeft: 2,
              paddingRight: 2,
              margin: 1,
              marginLeft: "auto",
            }}
          >
            Import Marks
          </Button>
        </Stack>
        <Stack direction="row" gap={3}>
          <FormControl sx={{ m: 1, minWidth: "30rem" }}>
            <InputLabel id="program-label">Select a Program</InputLabel>
            <Select
              id="program"
              labelId="program-label"
              label="Select a Program"
              onChange={handleProgramChange}
              value={programId === -1 ? "" : programId}
            >
              <MenuItem key={0} value={0}>
                <Typography>All Programs</Typography>
              </MenuItem>
              {programs !== undefined &&
                programs !== null &&
                programs.map((program) => (
                  <MenuItem key={program.id} value={program.id}>
                    <Box>
                      <Typography>{program.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl
            disabled={programId <= 0}
            sx={{ m: 1, minWidth: "30rem" }}
          >
            <InputLabel id="semester-label">Select a semester</InputLabel>
            <Select
              id="semester"
              labelId="semester-label"
              label="Select a Semester"
              onChange={handleSemesterChange}
              value={semester === 0 ? "" : semester}
            >
              <MenuItem key={0} value={0}>
                <Typography>All Semesters</Typography>
              </MenuItem>
              {programId > 0 &&
                selectedProgram !== null &&
                Array.from(
                  Array(
                    selectedProgram.ProgramSemesters !== undefined
                      ? selectedProgram.ProgramSemesters[0].semesterId
                      : 8
                  ).keys()
                ).map((index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {`${index + 1}${
                      index === 0
                        ? "st"
                        : index === 1
                        ? "nd"
                        : index === 2
                        ? "rd"
                        : "th"
                    } Semester`}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<ClearIcon />}
            onClick={() => {
              clearAllFilters()
            }}
            sx={{
              alignSelf: "center",
              padding: 1,
              margin: 1,
              // marginLeft: "auto",
            }}
          >
            Clear Filters
          </Button>
        </Stack>
      </Stack>

      {/* Datagrid to show marks*/}
      <DataGrid
        sx={{ marginTop: 1 }}
        checkboxSelection
        rows={rowsData === undefined || rowsData === null ? [] : rowsData}
        columns={columns}
        // free version has a limitation upto 100
        pageSizeOptions={[50, 100]}
        components={{
          Toolbar: GridToolbar,
        }}
      />

      <EditMarksDialog
        openToggle={editMarksToggle}
        closeDialogFunc={() => {
          setEditMarksToggle(false)
        }}
        editMarksFunc={updateMarks}
        selectedRow={rowForEdit}
      />

      <ImportDialog
        openToggle={importToggle}
        closeToggleFunc={() => {
          setImportToggle(false)
        }}
        dialogTitle={"Student Marks"}
        downloadLink={"/student-marks-sample.csv"}
        uploadFunc={uploadMarksCSV}
        extraMsg="Please be careful with course name. It is case-sensitive."
      />
    </Box>
  )
}
