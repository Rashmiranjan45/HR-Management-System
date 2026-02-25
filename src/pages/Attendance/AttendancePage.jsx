import { useEffect, useState } from "react";
import { getEmployees, markAttendance, getAttendance } from "../../api/client";
import dayjs from "dayjs";

import {
  Box, Card, CardContent, Typography, Button, TextField,
  MenuItem, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Avatar, Alert, CircularProgress,
  Grid, Divider, Skeleton, InputAdornment,
} from "@mui/material";

import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const STATUS_STYLES = {
  Present: { bgcolor: "#F0FDF4", color: "#16A34A" },
  Absent:  { bgcolor: "#FEF2F2", color: "#DC2626" },
  Late:    { bgcolor: "#FFFBEB", color: "#D97706" },
};

export default function AttendancePage() {
  const [employees, setEmployees]   = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [date, setDate]             = useState(dayjs().format("YYYY-MM-DD"));
  const [status, setStatus]         = useState("Present");
  const [history, setHistory]       = useState([]);
  const [historyName, setHistoryName] = useState("");
  const [loading, setLoading]       = useState(false);
  const [histLoading, setHistLoading] = useState(false);
  const [success, setSuccess]       = useState("");
  const [error, setError]           = useState("");
  const [empSearch, setEmpSearch]   = useState("");

  useEffect(() => {
    getEmployees().then((r) => setEmployees(r.data)).catch(() => {});
  }, []);

  const filteredEmps = employees.filter((e) =>
    e.full_name.toLowerCase().includes(empSearch.toLowerCase()) ||
    e.department.toLowerCase().includes(empSearch.toLowerCase())
  );

  const handleMark = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      await markAttendance({ employee_id: Number(selectedEmp), date, status });
      setSuccess(`Attendance marked as "${status}" successfully!`);
      if (selectedEmp) fetchHistory(selectedEmp);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to mark attendance.");
    }
    setLoading(false);
  };

  const fetchHistory = async (empId) => {
    setHistLoading(true);
    try {
      const res = await getAttendance(empId);
      const sorted = [...res.data.attendance].sort((a, b) => (a.date < b.date ? 1 : -1));
      setHistory(sorted);
      setHistoryName(res.data.employee_name);
    } catch (_) {
      setHistory([]);
    }
    setHistLoading(false);
  };

  const handleEmpChange = (val) => {
    setSelectedEmp(val);
    setSuccess(""); setError("");
    if (val) fetchHistory(val);
    else { setHistory([]); setHistoryName(""); }
  };

  const totalPresent = history.filter((h) => h.status === "Present").length;
  const totalAbsent  = history.filter((h) => h.status === "Absent").length;
  const totalLate    = history.filter((h) => h.status === "Late").length;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>Attendance</Typography>
        <Typography variant="body2" color="text.secondary">
          Mark and review employee attendance records
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Mark Attendance Form */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ position: "sticky", top: 24 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <EventAvailableRoundedIcon sx={{ color: "#2563EB", fontSize: 20 }} />
                </Box>
                <Typography variant="h6">Mark Attendance</Typography>
              </Box>

              {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess("")}>{success}</Alert>}
              {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError("")}>{error}</Alert>}

              <TextField
                fullWidth select label="Select Employee"
                value={selectedEmp}
                onChange={(e) => handleEmpChange(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ color: "#94A3B8", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="" disabled>Choose an employee</MenuItem>
                {employees.map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: "0.7rem", bgcolor: "#EFF6FF", color: "#2563EB" }}>
                        {e.full_name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{e.full_name}</Typography>
                        <Typography variant="caption" color="text.secondary">{e.department}</Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth type="date" label="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth select label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ mb: 3 }}
              >
                {["Present", "Absent", "Late"].map((s) => (
                  <MenuItem key={s} value={s}>
                    <Chip label={s} size="small" sx={STATUS_STYLES[s]} />
                  </MenuItem>
                ))}
              </TextField>

              <Button
                fullWidth variant="contained" size="large"
                onClick={handleMark}
                disabled={loading || !selectedEmp || !date || !status}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : "Mark Attendance"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* History */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {historyName ? `${historyName}'s Attendance History` : "Attendance History"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {historyName ? "Select a date to view or update records" : "Select an employee to view their history"}
              </Typography>

              {/* Mini stats */}
              {history.length > 0 && (
                <>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                      { label: "Present", count: totalPresent, ...STATUS_STYLES.Present },
                      { label: "Absent",  count: totalAbsent,  ...STATUS_STYLES.Absent },
                      { label: "Late",    count: totalLate,    ...STATUS_STYLES.Late },
                    ].map((s) => (
                      <Grid item xs={4} key={s.label}>
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: s.bgcolor, textAlign: "center" }}>
                          <Typography variant="h5" fontWeight={700} sx={{ color: s.color }}>{s.count}</Typography>
                          <Typography variant="caption" sx={{ color: s.color, fontWeight: 600 }}>{s.label}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Divider sx={{ mb: 2, borderColor: "#F1F5F9" }} />
                </>
              )}

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ "& th": { bgcolor: "#F8FAFC", fontWeight: 600, color: "#64748B", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" } }}>
                      <TableCell>Date</TableCell>
                      <TableCell>Day</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {histLoading && Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton width={80} /></TableCell>
                      </TableRow>
                    ))}

                    {!histLoading && history.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                          <EventAvailableRoundedIcon sx={{ fontSize: 40, color: "#CBD5E1", mb: 1 }} />
                          <Typography color="text.secondary" variant="body2">
                            {selectedEmp ? "No attendance records found" : "Select an employee to see history"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}

                    {!histLoading && history.map((rec, i) => (
                      <TableRow key={i} hover sx={{ "&:hover": { bgcolor: "#FAFBFF" } }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {dayjs(rec.date).format("MMM D, YYYY")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {dayjs(rec.date).format("dddd")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={rec.status} size="small" sx={STATUS_STYLES[rec.status] || {}} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
