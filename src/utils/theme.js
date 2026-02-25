import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563EB",
      light: "#EFF6FF",
      dark: "#1D4ED8",
    },
    secondary: {
      main: "#0EA5E9",
    },
    success: { main: "#16A34A" },
    error:   { main: "#DC2626" },
    warning: { main: "#D97706" },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },
    divider: "#E2E8F0",
  },
  typography: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    h4: { fontWeight: 700, letterSpacing: "-0.5px" },
    h5: { fontWeight: 700, letterSpacing: "-0.3px" },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  shadows: [
    "none",
    "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
    "0 4px 6px rgba(15,23,42,0.05), 0 2px 4px rgba(15,23,42,0.04)",
    "0 10px 15px rgba(15,23,42,0.07), 0 4px 6px rgba(15,23,42,0.04)",
    ...Array(21).fill("none"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 20px",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #1D4ED8 0%, #0284C7 100%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
          border: "1px solid #E2E8F0",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2563EB" },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 600, fontSize: "0.75rem" },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "2px 0",
          "&.Mui-selected": {
            backgroundColor: "#EFF6FF",
            color: "#2563EB",
            "& .MuiListItemIcon-root": { color: "#2563EB" },
            "&:hover": { backgroundColor: "#DBEAFE" },
          },
        },
      },
    },
  },
});

export default theme;
