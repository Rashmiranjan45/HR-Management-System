import { useEffect, useState } from "react";
import {
  Box, Grid, Card, CardContent, Typography,
  Chip, Skeleton, Avatar, List, ListItem, ListItemAvatar,
  ListItemText, Divider,
} from "@mui/material";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { getEmployees, getAttendance } from "../../api/client";
import dayjs from "dayjs";

const COLORS = { Present: "#2563EB", Absent: "#DC2626", Late: "#D97706" };

function StatCard({ title, value, icon, color, sub, loading }) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
              {title}
            </Typography>
            {loading ? (
              <Skeleton width={60} height={40} />
            ) : (
              <Typography variant="h4" fontWeight={700}>{value}</Typography>
            )}
            {sub && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                {sub}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48, height: 48, borderRadius: 2,
              display: "flex", alignItems: "center", justifyContent: "center",
              bgcolor: `${color}14`,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [employees, setEmployees]       = useState([]);
  const [attendanceData, setAttendance] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const empRes = await getEmployees();
        const emps = empRes.data;
        setEmployees(emps);

        // Fetch attendance for all employees
        const attPromises = emps.map((e) =>
          getAttendance(e.id).then((r) => r.data.attendance).catch(() => [])
        );
        const allAtt = (await Promise.all(attPromises)).flat();
        setAttendance(allAtt);
      } catch (_) {}
      setLoading(false);
    }
    load();
  }, []);

  const today       = dayjs().format("YYYY-MM-DD");
  const todayRecs   = attendanceData.filter((a) => a.date === today);
  const presentToday = todayRecs.filter((a) => a.status === "Present").length;
  const absentToday  = todayRecs.filter((a) => a.status === "Absent").length;

  // Department breakdown
  const deptMap = {};
  employees.forEach((e) => { deptMap[e.department] = (deptMap[e.department] || 0) + 1; });
  const deptData = Object.entries(deptMap).map(([dept, count]) => ({ dept, count }));

  // Attendance status pie
  const statusMap = {};
  attendanceData.forEach((a) => { statusMap[a.status] = (statusMap[a.status] || 0) + 1; });
  const pieData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  // Last 7 days bar chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = dayjs().subtract(6 - i, "day");
    const label = d.format("MMM D");
    const dateStr = d.format("YYYY-MM-DD");
    const recs = attendanceData.filter((a) => a.date === dateStr);
    return {
      date: label,
      Present: recs.filter((a) => a.status === "Present").length,
      Absent:  recs.filter((a) => a.status === "Absent").length,
      Late:    recs.filter((a) => a.status === "Late").length,
    };
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">
          {dayjs().format("dddd, MMMM D, YYYY")} · Overview of your workforce
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Employees" value={employees.length}
            icon={<PeopleRoundedIcon sx={{ color: "#2563EB" }} />}
            color="#2563EB" loading={loading}
            sub={`Across ${Object.keys(deptMap).length} departments`}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Present Today" value={presentToday}
            icon={<CheckCircleRoundedIcon sx={{ color: "#16A34A" }} />}
            color="#16A34A" loading={loading}
            sub="Marked present today"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Absent Today" value={absentToday}
            icon={<CancelRoundedIcon sx={{ color: "#DC2626" }} />}
            color="#DC2626" loading={loading}
            sub="Marked absent today"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Attendance Rate"
            value={todayRecs.length ? `${Math.round((presentToday / todayRecs.length) * 100)}%` : "—"}
            icon={<TrendingUpRoundedIcon sx={{ color: "#D97706" }} />}
            color="#D97706" loading={loading}
            sub="Today's attendance rate"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* 7-Day Bar Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Attendance — Last 7 Days</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Daily breakdown of attendance status
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={last7} barSize={12} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  />
                  <Bar dataKey="Present" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Absent"  fill="#DC2626" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Late"    fill="#D97706" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Status Breakdown</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                All-time attendance distribution
              </Typography>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={COLORS[entry.name] || "#94A3B8"} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" iconSize={8} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 220 }}>
                  <Typography color="text.secondary" variant="body2">No attendance data yet</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Department List */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Employees by Department</Typography>
              <List disablePadding>
                {deptData.length === 0 && (
                  <Typography variant="body2" color="text.secondary">No data</Typography>
                )}
                {deptData.map((d, i) => (
                  <Box key={d.dept}>
                    <ListItem disablePadding sx={{ py: 1.2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#EFF6FF", color: "#2563EB", width: 36, height: 36, fontSize: "0.85rem", fontWeight: 700 }}>
                          {d.dept.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={d.dept} primaryTypographyProps={{ fontWeight: 500 }} />
                      <Chip label={d.count} size="small" sx={{ bgcolor: "#EFF6FF", color: "#2563EB" }} />
                    </ListItem>
                    {i < deptData.length - 1 && <Divider sx={{ borderColor: "#F1F5F9" }} />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Employees */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Recent Employees</Typography>
              <List disablePadding>
                {employees.slice(0, 6).map((emp, i) => (
                  <Box key={emp.id}>
                    <ListItem disablePadding sx={{ py: 1.2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#EFF6FF", color: "#2563EB", fontWeight: 700 }}>
                          {emp.full_name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={emp.full_name}
                        secondary={emp.email}
                        primaryTypographyProps={{ fontWeight: 500 }}
                        secondaryTypographyProps={{ fontSize: "0.8rem" }}
                      />
                      <Chip label={emp.department} size="small" variant="outlined" sx={{ borderColor: "#E2E8F0", color: "#64748B" }} />
                    </ListItem>
                    {i < Math.min(employees.length, 6) - 1 && <Divider sx={{ borderColor: "#F1F5F9" }} />}
                  </Box>
                ))}
                {employees.length === 0 && (
                  <Typography variant="body2" color="text.secondary">No employees yet</Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
