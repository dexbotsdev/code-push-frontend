import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface PieChartComponentProps {
  active: number;
  total: number;
  size?: number;
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  active,
  total,
  size = 40,
}) => {
  const inactive = total - active;
  const data = [
    { name: "Active", value: active },
    { name: "Inactive", value: inactive > 0 ? inactive : 0 },
  ];
  const COLORS = ["#81c784", "rgba(29, 29, 42, 0.5)"];
  const percentage = total > 0 ? Math.round((active / total) * 100) : 0;

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
                id="pieActiveGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#81c784" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#388e3c" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient
                id="pieInactiveGradient"
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
                      ? "url(#pieActiveGradient)"
                      : "url(#pieInactiveGradient)"
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
        {percentage}%
      </Typography>
    </Box>
  );
};

export default PieChartComponent;
