import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DownloadIcon from "@mui/icons-material/Download";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import PieChartComponent from "../Metrics/PieChartComponent";
import RolloutChartComponent from "../Metrics/RolloutChartComponent";
import LinkIcon from "@mui/icons-material/Link";
import StorageIcon from "@mui/icons-material/Storage";
import LaunchIcon from "@mui/icons-material/Launch";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import LoadingCard from "../App/LoadingCard";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

interface DashboardAnalyticsProps {
  latestDeployment: any;
  dashboardData: { name: string; value: number }[];
  loading?: boolean;
  appLoading?: boolean;
}

const metricIcons = [
  <TrendingUpIcon sx={{ fontSize: 32, color: "#7c4dff" }} />, // Active
  <DownloadIcon sx={{ fontSize: 32, color: "#4fc3f7" }} />, // Downloaded
  <ErrorOutlineIcon sx={{ fontSize: 32, color: "#ff5252" }} />, // Failed
  <CheckCircleIcon sx={{ fontSize: 32, color: "#81c784" }} />, // Installed (system green)
];
const barColors = [
  "#7c4dff", // Active
  "#4fc3f7", // Downloaded
  "#ff5252", // Failed
  "#81c784", // Installed (system green)
];
const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  latestDeployment,
  dashboardData,
  loading = false,
  appLoading = false,
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const isSmallScreen =
    typeof window !== "undefined" && window.innerWidth <= 1024;
  React.useEffect(() => {
    if (isSmallScreen) setSidebarOpen(false);
  }, [isSmallScreen]);

  if (loading && !appLoading) {
    return null;
  }
  if (!latestDeployment) return null;
  // Extract rollout and active installs for pie charts
  const rollout = latestDeployment.rollout ?? 0;
  const active = dashboardData.find((d) => d.name === "Active")?.value || 0;
  const installed =
    dashboardData.find((d) => d.name === "Installed")?.value || 0;

  return (
    <Paper
      elevation={4}
      sx={{
        background: "linear-gradient(145deg, #1e1e2e, #23233a)",
        borderRadius: 3,
        mb: 3,
        p: 3,
        maxWidth: 1500,
        mx: "auto",
        minHeight: 260,
        boxShadow: "8px 8px 16px #17171f, -8px -8px 16px #2a2a3d",
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: "#b39ddb", mb: 2, fontWeight: 700 }}
      >
        Latest Deployment Analytics
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          gap: 4,
          width: "100%",
        }}
      >
        {/* Sidebar toggle button for small screens */}
        {isSmallScreen && (
          <Button
            onClick={() => setSidebarOpen((open) => !open)}
            sx={{
              minWidth: 0,
              width: 36,
              height: 36,
              p: 0,
              mb: 1,
              background: "#23233a",
              color: "#b39ddb",
              borderRadius: 2,
              boxShadow: "0px 2px 8px rgba(44,44,62,0.12)",
              position: "absolute",
              left: 12,
              top: 18,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </Button>
        )}
        {/* Left column: metadata box, collapsible on small screens */}
        {(!isSmallScreen || sidebarOpen) && (
          <Box
            sx={{
              minWidth: 260,
              maxWidth: 260,
              width: 260,
              background: "#282846",
              borderRadius: 2,
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              boxShadow: "0px 2px 8px rgba(44,44,62,0.12)",
              gap: 1.2,
              alignSelf: "stretch",
              height: "auto",
              transition: "all 0.3s",
              position: isSmallScreen ? "absolute" : "static",
              zIndex: 9,
              left: 0,
              top: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ color: "#b39ddb", fontWeight: "bold", mb: 0.5, flex: 1 }}
              >
                {latestDeployment.label}
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<EditIcon />}
                sx={{
                  backgroundColor: "#7c4dff",
                  color: "white",
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: "none",
                  "&:hover": { backgroundColor: "#9575cd" },
                  ml: 2,
                }}
                onClick={latestDeployment.onEdit}
              >
                Edit
              </Button>
            </Box>
            <Typography variant="body2" sx={{ color: "white", mb: 0.5 }}>
              <strong>Date:</strong>{" "}
              {latestDeployment.uploadTime
                ? new Date(latestDeployment.uploadTime).toLocaleString()
                : "N/A"}
            </Typography>
            <Typography variant="body2" sx={{ color: "white", mb: 0.5 }}>
              <strong>Version:</strong> {latestDeployment.appVersion || "N/A"}
            </Typography>
            {latestDeployment.size && (
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  mb: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <StorageIcon sx={{ fontSize: 18, color: "#b39ddb" }} />
                <strong>Size:</strong>{" "}
                {(latestDeployment.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            )}
            {latestDeployment.releaseMethod && (
              <Typography variant="body2" sx={{ color: "white", mb: 0.5 }}>
                <strong>Release Method:</strong>{" "}
                {latestDeployment.releaseMethod}
              </Typography>
            )}
            {latestDeployment.blobUrl && (
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  mb: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <LinkIcon sx={{ fontSize: 18, color: "#4fc3f7" }} />
                <a
                  href={latestDeployment.blobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#4fc3f7",
                    textDecoration: "underline",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  Blob <LaunchIcon sx={{ fontSize: 16, ml: 0.5 }} />
                </a>
              </Typography>
            )}
            {latestDeployment.description && (
              <Typography variant="body2" sx={{ color: "#e1bee7", mb: 0.5 }}>
                <strong>Description:</strong> {latestDeployment.description}
              </Typography>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <strong>Mandatory:</strong>{" "}
                {latestDeployment.isMandatory ? (
                  <CheckCircleIcon
                    sx={{ color: "#7c4dff", fontSize: 18, ml: 0.5 }}
                  />
                ) : (
                  <CancelIcon
                    sx={{
                      color: "rgba(124, 77, 255, 0.5)",
                      fontSize: 18,
                      ml: 0.5,
                    }}
                  />
                )}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <strong>Status:</strong>{" "}
                {latestDeployment.isDisabled ? (
                  <Chip
                    label="Disabled"
                    sx={{
                      backgroundColor: "#ff6f61",
                      color: "white",
                      fontWeight: "bold",
                      height: 22,
                      fontSize: 12,
                    }}
                  />
                ) : (
                  <Chip
                    label="Active"
                    sx={{
                      backgroundColor: "#81c784",
                      color: "white",
                      fontWeight: "bold",
                      height: 22,
                      fontSize: 12,
                    }}
                  />
                )}
              </Typography>
            </Box>
          </Box>
        )}
        {/* Right column: metrics and charts, fills remaining space */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 0,
            alignSelf: "stretch",
            ml: isSmallScreen && sidebarOpen ? "270px" : 0,
            transition: "margin-left 0.3s",
          }}
        >
          {/* Metrics row: full width, evenly spaced, gap matches chart row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              width: "100%",
            }}
          >
            {dashboardData.map((stat, idx) => (
              <Paper
                key={stat.name}
                elevation={2}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  p: 2,
                  background: "#282846",
                  borderRadius: 2,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0px 2px 8px rgba(44,44,62,0.12)",
                }}
              >
                <Box sx={{ mb: 0.5 }}>{metricIcons[idx]}</Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: barColors[idx], mb: 0.5 }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#b39ddb", letterSpacing: 1 }}
                >
                  {stat.name}
                </Typography>
              </Paper>
            ))}
          </Box>
          {/* Charts row: responsive, consistent gap, pie charts never overflow */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              justifyContent: "flex-start",
              alignItems: "flex-end",
              width: "100%",
            }}
          >
            <Box
              sx={{
                flex: 1.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                minWidth: 0,
                height: 240,
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  flex: 1,
                  p: 2,
                  background: "#282846",
                  borderRadius: 2,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: "0px 2px 8px rgba(44,44,62,0.12)",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: 180,
                  }}
                >
                  <RolloutChartComponent rollout={rollout} size={150} />
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#b39ddb",
                      mt: 1,
                      minHeight: 24,
                      textAlign: "center",
                    }}
                  >
                    Rollout
                  </Typography>
                </Box>
              </Paper>
            </Box>
            <Box
              sx={{
                flex: 1.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                minWidth: 0,
                height: 240,
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  flex: 1,
                  p: 2,
                  background: "#282846",
                  borderRadius: 2,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: "0px 2px 8px rgba(44,44,62,0.12)",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: 180,
                  }}
                >
                  <PieChartComponent
                    active={active}
                    total={installed}
                    size={150}
                  />
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#b39ddb",
                      mt: 1,
                      minHeight: 24,
                      textAlign: "center",
                    }}
                  >
                    Active Installs
                  </Typography>
                </Box>
              </Paper>
            </Box>
            <Box
              sx={{
                flex: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                justifyContent: "flex-end",
                minWidth: 0,
                height: 240,
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  flex: 1,
                  p: 2,
                  background: "#282846",
                  borderRadius: 2,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: "0px 2px 8px rgba(44,44,62,0.12)",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 180,
                  }}
                >
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart
                      data={dashboardData}
                      margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="barGradientPurple"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#7c4dff"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#23233a"
                            stopOpacity={0.7}
                          />
                        </linearGradient>
                        <linearGradient
                          id="barGradientBlue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#4fc3f7"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#23233a"
                            stopOpacity={0.7}
                          />
                        </linearGradient>
                        <linearGradient
                          id="barGradientRed"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#ff5252"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#23233a"
                            stopOpacity={0.7}
                          />
                        </linearGradient>
                        <linearGradient
                          id="barGradientGreen"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#81c784"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#23233a"
                            stopOpacity={0.7}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#b39ddb22" />
                      <XAxis dataKey="name" stroke="#fff" fontSize={14} />
                      <YAxis
                        stroke="#fff"
                        allowDecimals={false}
                        fontSize={14}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#23233a",
                          color: "#fff",
                          border: "none",
                        }}
                        itemStyle={{ color: "#fff" }}
                        labelStyle={{ color: "#fff" }}
                        cursor={{ fill: "rgba(124,77,255,0.08)" }}
                      />
                      <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={10}>
                        {dashboardData.map((entry, idx) => {
                          const gradientIds = [
                            "url(#barGradientPurple)",
                            "url(#barGradientBlue)",
                            "url(#barGradientRed)",
                            "url(#barGradientGreen)",
                          ];
                          return (
                            <Cell
                              key={`cell-${entry.name}`}
                              fill={gradientIds[idx % gradientIds.length]}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#b39ddb",
                    mt: 1,
                    minHeight: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  Metrics
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default DashboardAnalytics;
