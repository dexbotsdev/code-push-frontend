import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface RolloutChartComponentProps {
  rollout: number;
  size?: number;
}

const RolloutChartComponent: React.FC<RolloutChartComponentProps> = ({
  rollout,
  size = 40,
}) => {
  const data = [
    { name: "Rolled Out", value: rollout },
    { name: "Remaining", value: 100 - rollout > 0 ? 100 - rollout : 0 },
  ];
  const COLORS = ["#4fc3f7", "rgba(29, 29, 42, 0.5)"]; // Blue for rollout, transparent dark for remaining

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: `${size + 20}px`,
        minHeight: `${size}px`,
        maxHeight: `${size + 20}px`,
        margin: "auto",
        position: "relative",
      }}
    >
      {data.every((item) => item.value === 0) ? (
        <Typography
          variant="caption"
          sx={{ color: "white", textAlign: "center" }}
        >
          No data
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <linearGradient
                id="rolloutPieGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#4fc3f7" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#01579b" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient
                id="rolloutPieInactiveGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#23233a" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#23233a" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={450}
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={5}
              isAnimationActive={false}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === 0
                      ? "url(#rolloutPieGradient)"
                      : "url(#rolloutPieInactiveGradient)"
                  }
                  stroke="none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "12px",
          left: 0,
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      >
        {rollout}%
      </Typography>
    </Box>
  );
};

export default RolloutChartComponent;
