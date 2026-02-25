import { useEffect, useState } from "react";
import { getEmployees, createEmployee, deleteEmployee } from "../../api/client";

import {
  Box, Card, CardContent, Typography, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Avatar, InputAdornment, Alert, CircularProgress,
  Skeleton, Tooltip,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";


const DEPT_COLORS = {
  Engineering: "#EFF6FF",
  HR: "#F0FDF4",
  Finance: "#FFFBEB",
  Marketing: "#FDF4FF",
  Sales: "#FFF7ED",
  Operations: "#F0F9FF",
};
const DEPT_TEXT = {
  Engineering: "#1D4ED8",
  HR: "#16A34A",
  Finance: "#D97706",
  Marketing: "#9333EA",
  Sales: "#EA580C",
  Operations: "#0284C7",
};

function getDeptColor(dept) {
  return DEPT_COLORS[dept] || "#F8FAFC";
}
function getDeptText(dept) {
  return DEPT_TEXT[dept] || "#64748B";
}

const emptyForm = { full_name: "", email: "", department: "" };

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getEmployees();
      setEmployees(res.data);
      setFiltered(res.data);
    } catch (_) { }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      employees.filter(
        (e) =>
          e.full_name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q)
      )
    );
  }, [search, employees]);

  const handleCreate = async () => {
    setError("");
    setSaving(true);
    try {
      await createEmployee(form);
      setOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create employee.");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      await deleteEmployee(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (_) { }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom>Employees</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your workforce · {employees.length} total
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => { setOpen(true); setError(""); setForm(emptyForm); }}
        >
          Add Employee
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Search */}
          <Box sx={{ p: 2.5, borderBottom: "1px solid #F1F5F9" }}>
            <TextField
              placeholder="Search by name, email or department…"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: { xs: "100%", sm: 340 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ "& th": { bgcolor: "#F8FAFC", fontWeight: 600, color: "#64748B", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" } }}>
                  <TableCell>Employee</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <TableCell key={j}><Skeleton /></TableCell>
                      ))}
                    </TableRow>
                  ))}
                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <PersonAddAltRoundedIcon sx={{ fontSize: 40, color: "#CBD5E1", mb: 1 }} />
                      <Typography color="text.secondary" variant="body2">No employees found</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {!loading && filtered.map((emp) => (
                  <TableRow key={emp.id} hover sx={{ "&:hover": { bgcolor: "#FAFBFF" } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: "#EFF6FF", color: "#2563EB", fontSize: "0.9rem", fontWeight: 700 }}>
                          {emp.full_name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>{emp.full_name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{emp.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={emp.department}
                        size="small"
                        sx={{ bgcolor: getDeptColor(emp.department), color: getDeptText(emp.department) }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">#{emp.id}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete employee">
                        <IconButton size="small" onClick={() => setDeleteTarget(emp)} sx={{ color: "#CBD5E1", "&:hover": { color: "#DC2626", bgcolor: "#FEF2F2" } }}>
                          <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6">Add New Employee</Typography>
          <Typography variant="body2" color="text.secondary">Fill in the details to add a new team member</Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          <TextField
            fullWidth label="Full Name" value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            sx={{ mb: 2 }} required
          />
          <TextField
            fullWidth label="Email Address" type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            sx={{ mb: 2 }} required
          />
          <TextField
            fullWidth label="Department" value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            required helperText="e.g. Engineering, HR, Finance, Marketing"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button
            variant="contained" onClick={handleCreate}
            disabled={saving || !form.full_name || !form.email || !form.department}
          >
            {saving ? <CircularProgress size={20} color="inherit" /> : "Add Employee"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove <strong>{deleteTarget?.full_name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} color="inherit">Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
