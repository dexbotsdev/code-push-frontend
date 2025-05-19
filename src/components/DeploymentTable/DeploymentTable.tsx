import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";
import EditDeployment from "../EditDeployment/EditDeployment";
import {
  getDeploymentHistory,
  rollbackDeployment,
  getDeploymentMetrics,
} from "../../api/api";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Chip from "@mui/material/Chip";
import DeploymentKeysModal from "../DeploymentKeysModal/DeploymentKeysModal";
import { getDeploymentKeys } from "../../api/api";
import DashboardAnalytics from "./DashboardAnalytics";

interface DeploymentTableProps {
  app: any;
  keyName: string;
  appLoading: boolean;
}

const DeploymentTable: React.FC<DeploymentTableProps> = ({
  app,
  keyName,
  appLoading,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [deploymentHistories, setDeploymentHistories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState<any>(null);
  const [sortOption, setSortOption] = useState<string>("uploadTime"); // Default sorting by date
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc"); // Default to descending
  const [keysModalOpen, setKeysModalOpen] = useState(false);
  const [deploymentKeys, setDeploymentKeys] = useState<
    { name: string; key: string }[] | null
  >(null);
  const [keysLoading, setKeysLoading] = useState(false);
  const [deploymentMetrics, setDeploymentMetrics] = useState<any | null>(null);
  const requestIdRef = useRef(0);

  // Clear state when switching deployments/apps
  useEffect(() => {
    setDeploymentHistories([]);
    setSelectedDeployment(null);
    setOpenModal(false);
    setSortOption("uploadTime");
    setSortDirection("desc");
    setDeploymentMetrics(null);
  }, [app, keyName]);

  const handleOpenModal = (deployment: any) => {
    setSelectedDeployment(deployment);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDeployment(null);
  };

  const fetchDeploymentHistory = async () => {
    setLoading(true);
    const currentRequestId = ++requestIdRef.current;
    try {
      const currentDeployment = app.deployments[activeTab];
      if (currentDeployment) {
        const history = await getDeploymentHistory(app.name, currentDeployment);
        if (requestIdRef.current === currentRequestId) {
          setDeploymentHistories(history);
        }
      } else {
        if (requestIdRef.current === currentRequestId) {
          setDeploymentHistories([]);
        }
      }
    } catch (error) {
      if (requestIdRef.current === currentRequestId) {
        console.error("Error fetching deployment history", error);
      }
    } finally {
      if (requestIdRef.current === currentRequestId) {
        setLoading(false);
      }
    }
  };

  const fetchDeploymentMetrics = async () => {
    const currentRequestId = requestIdRef.current;
    try {
      const currentDeployment = app.deployments[activeTab];
      if (currentDeployment) {
        const metrics = await getDeploymentMetrics(app.name, currentDeployment);

        // Aggregate only the active installs across all versions
        const aggregatedMetrics = Object.entries(metrics?.metrics || {}).reduce(
          (acc, [_, value]) => {
            const v = value as { active?: number };
            acc.active += v?.active && v.active > 0 ? v.active : 0;
            return acc;
          },
          { active: 0 }
        );

        if (requestIdRef.current === currentRequestId) {
          setDeploymentMetrics({
            aggregated: aggregatedMetrics,
            versions: metrics?.metrics || null,
          });
        }
      } else {
        if (requestIdRef.current === currentRequestId) {
          setDeploymentMetrics(null);
        }
      }
    } catch (error) {
      if (requestIdRef.current === currentRequestId) {
        console.error("Error fetching deployment metrics", error);
      }
    }
  };

  useEffect(() => {
    fetchDeploymentHistory();
    fetchDeploymentMetrics();
    // No cleanup needed, just rely on requestIdRef
  }, [app, activeTab]);

  const handleSort = (field: string) => {
    const newDirection =
      sortOption === field && sortDirection === "asc" ? "desc" : "asc";
    setSortOption(field);
    setSortDirection(newDirection);
  };

  const naturalCompare = (a: string, b: string) => {
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  };

  const sortedHistories = [...deploymentHistories].sort((a, b) => {
    const valueA = a[sortOption];
    const valueB = b[sortOption];

    if (sortOption === "label") {
      return sortDirection === "asc"
        ? naturalCompare(valueA, valueB)
        : naturalCompare(valueB, valueA);
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getStatusLabel = (isDisabled: boolean) => (
    <Chip
      label={isDisabled ? "Disabled" : "Active"}
      style={{
        backgroundColor: isDisabled ? "#ff6f61" : "#81c784", // Red-ish for Disabled, Green-ish for Active
        color: "white",
        fontWeight: "bold",
      }}
    />
  );

  const handleRollbackCallback = async (
    label: string,
    callbackSuccess?: () => void,
    callbackFail?: () => void
  ) => {
    try {
      await rollbackDeployment(app.name, app.deployments[activeTab], label);
      callbackSuccess && callbackSuccess();
    } catch (error) {
      console.error("Error during rollback:", error);
      callbackFail && callbackFail();
    }
  };

  const handleOpenKeysModal = async () => {
    setKeysModalOpen(true);
    setKeysLoading(true);
    try {
      const keys = await getDeploymentKeys(app.name); // Fetch keys for the current app
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

  // Dashboard for the last deployment (last in the list)
  const lastDeployment = deploymentHistories[deploymentHistories.length - 1];
  const lastMetrics =
    lastDeployment && deploymentMetrics?.versions?.[lastDeployment.label];

  const dashboardData = [
    {
      name: "Active",
      value: lastMetrics?.active || 0,
    },
    {
      name: "Downloaded",
      value: lastMetrics?.downloaded || 0,
    },
    {
      name: "Failed",
      value: lastMetrics?.failed || 0,
    },
    {
      name: "Installed",
      value: lastMetrics?.installed || 0,
    },
  ];

  if (appLoading) return null;

  return (
    <div
      key={keyName}
      style={{
        padding: "20px",
        color: "white",
        backgroundColor: "#1e1e2f", // Purple tint applied to the entire app
        minHeight: "100vh",
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(_event, newValue) => setActiveTab(newValue)}
        textColor="secondary"
        indicatorColor="secondary"
        style={{ marginBottom: "20px" }}
      >
        {app.deployments?.map((deployment: any, index: number) => (
          <Tab
            key={`${deployment?.otherDetails?.deploymentName}-${index}`}
            label={deployment || `Deployment ${index + 1}`}
            value={index}
            style={{ color: "#b39ddb" }}
          />
        ))}
        <Box style={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>
          <Button
            style={{
              justifySelf: "flex-end",
              display: "inline-flex",
            }}
            variant="text"
            onClick={handleOpenKeysModal}
          >
            View Deployment Keys
          </Button>
        </Box>
      </Tabs>

      {/* Dashboard Section for Latest Deployment (smaller, muted, split into cards) */}
      <DashboardAnalytics
        latestDeployment={
          lastDeployment
            ? {
                ...lastDeployment,
                onEdit: () =>
                  handleOpenModal({
                    appName: app.name,
                    deploymentName: app.deployments[activeTab],
                    row: lastDeployment,
                  }),
              }
            : null
        }
        dashboardData={dashboardData}
        loading={(!appLoading && loading) || !deploymentMetrics}
        appLoading={appLoading}
      />

      {loading && !appLoading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <CircularProgress color="secondary" />
        </div>
      ) : !loading && !appLoading ? (
        deploymentHistories.length === 0 ? (
          <Typography
            variant="h6"
            style={{
              color: "white",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            No deployments
          </Typography>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 15px",
                borderRadius: "10px 10px 0 0",
                fontWeight: "bold",
                letterSpacing: 1,
                fontSize: "1.08rem",
                zIndex: 1,
              }}
            >
              <Box
                style={{
                  flex: 2,
                  minWidth: "100px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                onClick={() => handleSort("label")}
              >
                Label
                {sortOption === "label" &&
                  (sortDirection === "asc" ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  ))}
              </Box>
              <Box
                style={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "space-between",
                  alignItems: "center",
                  placeContent: "center",
                }}
              >
                <Box
                  style={{
                    flex: 1,
                    textAlign: "center",
                    minWidth: "100px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    placeContent: "center",
                  }}
                  onClick={() => handleSort("isMandatory")}
                >
                  Mandatory
                  {sortOption === "isMandatory" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropUpIcon />
                    ) : (
                      <ArrowDropDownIcon />
                    ))}
                </Box>
                <Box
                  style={{
                    flex: 1,
                    textAlign: "center",
                    minWidth: "100px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    placeContent: "center",
                  }}
                  onClick={() => handleSort("isDisabled")}
                >
                  Status
                  {sortOption === "isDisabled" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropUpIcon />
                    ) : (
                      <ArrowDropDownIcon /> // Corrected closing parentheses
                    ))}
                </Box>
                <Box
                  style={{
                    flex: 1,
                    textAlign: "center",
                    minWidth: "100px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    placeContent: "center",
                  }}
                  onClick={() => handleSort("rollout")}
                >
                  Rollout
                  {sortOption === "rollout" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropUpIcon />
                    ) : (
                      <ArrowDropDownIcon />
                    ))}
                </Box>
                <Box
                  style={{
                    flex: 1,
                    textAlign: "center",
                    minWidth: "100px",
                    placeContent: "center",
                  }}
                >
                  Installs
                </Box>
                <Box
                  style={{
                    flex: 1,
                    textAlign: "center",
                    minWidth: "100px",
                    placeContent: "center",
                  }}
                >
                  Actions
                </Box>
              </Box>
            </Box>
            {sortedHistories.map((row, idx) => (
              <Box
                key={`${row.packageHash || idx}-${row.label}`} // Ensure unique keys
                style={{
                  backgroundColor: "#2c2c3e",
                  borderRadius: "8px",
                  padding: "15px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <Box style={{ flex: 2, minWidth: "100px" }}>
                  <Typography
                    variant="subtitle1"
                    style={{ color: "#b39ddb", fontWeight: "bold" }}
                  >
                    {row.label}
                  </Typography>
                  <Typography variant="body2" style={{ color: "white" }}>
                    <strong>Date:</strong>{" "}
                    {new Date(row.uploadTime).toLocaleString()}
                  </Typography>
                  {row.appVersion && (
                    <Typography variant="body2" style={{ color: "white" }}>
                      <strong>Version:</strong> {row.appVersion}
                    </Typography>
                  )}
                  {row.description && (
                    <Typography variant="body2" style={{ color: "white" }}>
                      <strong>Description:</strong> {row.description}
                    </Typography>
                  )}
                  {/* Removed Metrics, PieChartComponent, and RolloutChartComponent from table rows */}
                </Box>
                <Box
                  style={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    style={{
                      flex: 1,
                      textAlign: "center",
                      minWidth: "100px",
                    }}
                  >
                    {row.isMandatory ? (
                      <CheckCircleIcon style={{ color: "#7c4dff" }} />
                    ) : (
                      <CancelIcon
                        style={{ color: "rgba(124, 77, 255, 0.5)" }}
                      />
                    )}
                  </Box>
                  <Box
                    style={{
                      flex: 1,
                      textAlign: "center",
                      minWidth: "100px",
                    }}
                  >
                    {getStatusLabel(row.isDisabled)}
                  </Box>
                  <Box
                    style={{
                      flex: 1,
                      textAlign: "center",
                      minWidth: "100px",
                    }}
                  >
                    {/* Rollout value only */}
                    {typeof row.rollout === "number"
                      ? `${row.rollout}%`
                      : "N/A"}
                  </Box>
                  <Box
                    style={{
                      flex: 1,
                      textAlign: "center",
                      minWidth: "100px",
                    }}
                  >
                    {/* Installs: active/total */}
                    {(() => {
                      const active =
                        deploymentMetrics?.versions?.[row.label]?.active;
                      const total =
                        deploymentMetrics?.versions?.[row.label]?.installed;
                      if (
                        typeof active === "number" &&
                        typeof total === "number" &&
                        total > 0
                      ) {
                        const percent = ((active / total) * 100).toFixed(1);
                        return `${active}/${total} (${percent}%)`;
                      } else if (typeof active === "number") {
                        return `${active}`;
                      } else if (typeof total === "number") {
                        return `0/${total} (0%)`;
                      } else {
                        return "N/A";
                      }
                    })()}
                  </Box>
                  <Box
                    style={{
                      flex: 1,
                      textAlign: "center",
                      minWidth: "100px",
                    }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#7c4dff",
                        color: "white",
                      }}
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() =>
                        handleOpenModal({
                          appName: app.name,
                          deploymentName: app.deployments[activeTab],
                          row,
                        })
                      }
                    >
                      Edit
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </div>
        )
      ) : null}

      <EditDeployment
        open={openModal}
        onClose={handleCloseModal}
        deployment={selectedDeployment}
        callback={fetchDeploymentHistory}
        rollbackCallback={handleRollbackCallback}
      />

      <DeploymentKeysModal
        open={keysModalOpen}
        onClose={handleCloseKeysModal}
        keys={deploymentKeys}
        loading={keysLoading}
      />
    </div>
  );
};

export default DeploymentTable;
