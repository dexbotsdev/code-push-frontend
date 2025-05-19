import React, { useEffect, useState } from "react";
import { getApps } from "../../api/api";
import { Link, Route, Router, Switch } from "wouter";
import DeploymentTable from "../DeploymentTable/DeploymentTable";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "./App.css";
import { useLocation } from "wouter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorCard from "./ErrorCard";
import LoadingCard from "./LoadingCard";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import IconButton from "@mui/material/IconButton";

const darkTheme = createTheme({
  typography: {
    fontFamily: "Nunito, Arial, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@global": {
          "*": {
            fontFamily: "Nunito, Arial, sans-serif",
          },
          body: {
            backgroundColor: "#1e1e2f", // Purple tint for the entire app
            color: "#ffffff",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.MuiButton-contained": {
            backgroundColor: "#7c4dff", // Unified button color for contained variant
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#9575cd", // Lighter hover effect
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#2c2c3e", // Purple tint for modals
          color: "#ffffff",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#2c2c3e", // Purple tint for input fields
            color: "#ffffff",
            "& fieldset": {
              borderColor: "#4a4a5e", // Subtler border color
            },
            "&:hover fieldset": {
              borderColor: "#7c7c9a",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#b39ddb",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#b39ddb",
          },
        },
      },
    },
  },
  palette: {
    mode: "dark",
    background: {
      default: "#1e1e2f", // Purple tint for background
    },
    text: {
      primary: "#ffffff",
    },
  },
});

// Define App type for state
interface AppType {
  name: string;
  deployments?: any[];
}

const App: React.FC = () => {
  const [apps, setApps] = useState<AppType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Only update windowWidth on resize, not sidebarOpen
  useEffect(() => {
    let resizeTimeout: number | undefined;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 200); // Wait 200ms after resizing stops
    };
    window.addEventListener("resize", handleResize);
    return () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isSmallScreen = windowWidth <= 1024;

  // Only update sidebarOpen if screen size crosses threshold
  useEffect(() => {
    setSidebarOpen((prev) => {
      if (isSmallScreen && prev) return false;
      if (!isSmallScreen && !prev) return true;
      return prev;
    });
  }, [isSmallScreen]);

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    getApps()
      .then((response) => {
        if (response?.apps) {
          setApps(response.apps);
        } else {
          setLoadError("No apps found in the response");
          toast.error("No apps found in the response");
        }
      })
      .catch((error) => {
        setLoadError(error?.message || "Apps can't be loaded");
        toast.error(error?.message || "Apps can't be loaded");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (apps.length > 0 && location === "/") {
      setLocation(`/${apps[0].name}`);
    }
  }, [apps, location, setLocation]);

  // Find the selected app based on the current route (no useMemo)
  let selectedApp: AppType | null = null;
  const match = location.match(/^\/(.+)$/);
  if (match) {
    const appName = match[1];
    selectedApp = apps.find((a) => a.name === appName) || null;
  }

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            minWidth: "910px",
            overflowX: "auto",
            backgroundColor: "#1e1e2f",
          }}
        >
          <Box
            sx={{
              width: "250px",
              backgroundColor: "#2c2c3e",
              color: "white",
              padding: "20px",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: "18px",
                }}
              >
                CodePush Deployments
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#1e1e2f",
              mt: 6,
            }}
          >
            <LoadingCard />
          </Box>
        </Box>
      </ThemeProvider>
    );
  } else if (typeof window !== "undefined") {
  }

  if (loadError) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            minWidth: "910px",
            overflowX: "auto",
            backgroundColor: "#1e1e2f",
          }}
        >
          <Box
            sx={{
              width: "250px",
              backgroundColor: "#2c2c3e",
              color: "white",
              padding: "20px",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: "18px",
                }}
              >
                CodePush Deployments
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#1e1e2f",
              mt: 6, // margin top
            }}
          >
            <ErrorCard title="Error Loading Apps" message={loadError} />
          </Box>
        </Box>
        <ToastContainer position="top-right" autoClose={3000} />
      </ThemeProvider>
    );
  }

  const SidebarContent = (
    <Box
      sx={{
        width: sidebarOpen ? "250px" : "50px",
        minWidth: sidebarOpen ? "250px" : "50px",
        maxWidth: sidebarOpen ? "250px" : "50px",
        backgroundColor: "#2c2c3e",
        color: "white",
        padding: sidebarOpen ? "20px" : "8px 0 8px 0",
        flexShrink: 0,
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
        position: "fixed", // Make sidebar fixed
        zIndex: 1200, // High z-index to stay above content
        left: 0,
        top: 0,
        height: "100vh",
        boxShadow: sidebarOpen ? "2px 0 12px #140e27" : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: sidebarOpen ? "flex-start" : "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          mb: 0,
          justifyContent: sidebarOpen ? "flex-start" : "center",
          pl: 0,
          pr: 0,
          minHeight: 44,
        }}
      >
        <IconButton
          onClick={() => setSidebarOpen((open) => !open)}
          sx={{
            color: "#b39ddb",
            alignSelf: "center",
            transition: "margin 0.3s",
            mr: sidebarOpen ? 1 : 0,
            ml: 0,
            p: 0.5,
            minWidth: 36,
            minHeight: 36,
          }}
          size="large"
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
        {sidebarOpen && (
          <Typography
            sx={{
              fontWeight: "bold",
              color: "white",
              fontSize: "18px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
              ml: 1,
              pr: 0,
              pl: 0,
            }}
          >
            Codepush
          </Typography>
        )}
      </Box>
      {sidebarOpen && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {apps.map((app) => (
            <li key={app.name} style={{ marginBottom: "10px", width: "100%" }}>
              <Link
                href={`/${app.name}`}
                style={{ textDecoration: "none", width: "100%" }}
              >
                <Box
                  sx={{
                    padding: "10px",
                    borderRadius: "8px",
                    background:
                      location === `/${app.name}`
                        ? "linear-gradient(90deg, #7c4dff, #9575cd)"
                        : "transparent",
                    color: location === `/${app.name}` ? "white" : "#b39ddb",
                    transition: "0.3s all",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: "left",
                    fontSize: "inherit",
                    width: "100%",
                    "&:hover": {
                      backgroundColor: "#673ab7",
                      color: "white",
                    },
                  }}
                >
                  {app.name}
                </Box>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            minWidth: "910px",
            overflowX: "auto",
            position: "relative",
          }}
        >
          {SidebarContent}
          <Box
            sx={{
              flex: 1,
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              overflowX: "auto",
              backgroundColor: "#1e1e2f",
              gap: "3px",
              ml: sidebarOpen
                ? isSmallScreen
                  ? "250px"
                  : "250px"
                : isSmallScreen
                ? "50px"
                : "50px",
              transition: "margin-left 0.3s",
            }}
          >
            <Switch>
              <Route
                path="/:appName"
                component={() =>
                  selectedApp && selectedApp.deployments?.length > 0 ? (
                    <Box
                      sx={{
                        backgroundColor: "#2c2c3e",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      {/* Pass appLoading to DeploymentTable */}
                      <DeploymentTable
                        app={selectedApp}
                        keyName={selectedApp.name}
                        appLoading={loading}
                      />
                    </Box>
                  ) : (
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        textAlign: "center",
                        marginTop: "20px",
                      }}
                    >
                      No deployments
                    </Typography>
                  )
                }
              />
              <Route
                path="/"
                component={() => (
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      textAlign: "center",
                      marginTop: "20px",
                    }}
                  >
                    No deployments
                  </Typography>
                )}
              />
            </Switch>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
