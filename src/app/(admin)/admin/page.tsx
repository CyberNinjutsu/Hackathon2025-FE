"use client";

import BarChart from "@/components/dashboard/BarChart";
import LineChart from "@/components/dashboard/LineChart";
import StatsCard from "@/components/dashboard/StatsCard";
import { ArrowRightLeft, Coins, DollarSign, Users } from "lucide-react";

// Mock data
const statsData = [
  {
    title: "Total Assets",
    value: "1,234",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Coins,
  },
  {
    title: "Total Value",
    value: "$2.4M",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "5,678",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Transactions",
    value: "12,345",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: ArrowRightLeft,
  },
];

const lineChartData = [
  { date: "Jan", value: 1200 },
  { date: "Feb", value: 1900 },
  { date: "Mar", value: 1500 },
  { date: "Apr", value: 2200 },
  { date: "May", value: 2800 },
  { date: "Jun", value: 2400 },
  { date: "Jul", value: 3100 },
];

const barChartData = [
  { label: "Gold Tokens", value: 450, color: "#ffd700" },
  { label: "Real Estate", value: 320, color: "#8b4513" },
  { label: "Gemstones", value: 280, color: "#9932cc" },
  { label: "Silver", value: 184, color: "#c0c0c0" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={lineChartData}
          title="Token Value Over Time"
          color="#00ffb2"
        />
        <BarChart data={barChartData} title="Assets Distribution" />
      </div>
    </div>
  );
}
