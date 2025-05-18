import React, { useEffect, useState } from "react";
import { getApps, getDeploymentKeys } from "../../api/api";
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
  const [keysModalOpen, setKeysModalOpen] = useState(false);
  const [deploymentKeys, setDeploymentKeys] = useState<
    { name: string; key: string }[] | null
  >(null);
  const [keysLoading, setKeysLoading] = useState(false);

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

  const handleOpenKeysModal = async () => {
    setKeysModalOpen(true);
    setKeysLoading(true);
    try {
      const keys = await getDeploymentKeys(apps[0]?.name); // Fetch keys for the first app
      setDeploymentKeys(keys);
    } catch (error) {
      console.error("Error fetching deployment keys:", error);
    } finally {
      setKeysLoading(false);
    }
  };

  const handleCloseKeysModal = () => {
    setKeysModalOpen(false);
    setDeploymentKeys(null);
  };

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
        width: "250px",
        backgroundColor: "#2c2c3e", // Purple-tinted sidebar
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
      <ul style={{ listStyle: "none", padding: 0 }}>
        {apps.map((app) => (
          <li key={app.name} style={{ marginBottom: "10px" }}>
            <Link
              href={`/${app.name}`}
              style={{
                textDecoration: "none",
              }}
            >
              <Box
                sx={{
                  padding: "10px",
                  borderRadius: "8px",
                  background:
                    location === `/${app.name}`
                      ? "linear-gradient(90deg, #7c4dff, #9575cd)" // Gradient for selected app
                      : "transparent",
                  color: location === `/${app.name}` ? "white" : "#b39ddb",
                  transition: "0.3s all", // Smooth transition effect
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
            minWidth: "910px", // Added minWidth for the page
            overflowX: "auto",
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
              gap: "3px", // Added gap for all columns
            }}
          >
            <Switch>
              {apps.length > 0 ? (
                apps.map((app) => (
                  <Route
                    key={app.name}
                    path={`/${app.name}`}
                    component={() =>
                      apps[0]?.deployments?.length > 0 ? (
                        <Box
                          sx={{
                            backgroundColor: "#2c2c3e",
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          <DeploymentTable app={app} keyName={app?.name} />
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
                ))
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
              )}
            </Switch>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
