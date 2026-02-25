import { useAuth } from "../context/AuthContext";

import {
  Box, Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, Typography, Avatar, Divider, Tooltip, IconButton,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 260;

const navItems = [
  { label: "Dashboard",  icon: <DashboardRoundedIcon />,       path: "/" },
  { label: "Employees",  icon: <PeopleRoundedIcon />,           path: "/employees" },
  { label: "Attendance", icon: <EventAvailableRoundedIcon />,   path: "/attendance" },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { logout } = useAuth();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          border: "none",
          borderRight: "1px solid #E2E8F0",
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 3, py: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 36, height: 36, borderRadius: 2,
            background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <PeopleRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ lineHeight: 1.2, color: "#0F172A" }}>
            HR System
          </Typography>
          <Typography variant="caption" sx={{ color: "#94A3B8" }}>
            Admin Portal
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2, borderColor: "#F1F5F9" }} />

      {/* Nav */}
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        <Typography
          variant="caption"
          sx={{ px: 1.5, pb: 1, display: "block", color: "#94A3B8", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}
        >
          Menu
        </Typography>
        {navItems.map((item) => {
          const active = location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <ListItemButton
              key={item.path}
              selected={active}
              onClick={() => navigate(item.path)}
              sx={{ px: 1.5, py: 1.1, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: active ? "#2563EB" : "#94A3B8" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: active ? 600 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Bottom user area */}
      <Divider sx={{ mx: 2, borderColor: "#F1F5F9" }} />
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: "#EFF6FF", color: "#2563EB", fontSize: "0.9rem", fontWeight: 700 }}>
          A
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" fontWeight={600}>Admin</Typography>
          <Typography variant="caption" color="text.secondary">Super Admin</Typography>
        </Box>
        <Tooltip title="Logout">
          <IconButton size="small" onClick={logout} sx={{ color: "#94A3B8" }}>
            <LogoutRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
