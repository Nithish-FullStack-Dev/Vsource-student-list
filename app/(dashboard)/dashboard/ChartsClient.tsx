"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#f97316"];

export default function ChartsClient({
  monthlyRegistrations,
  paymentStatusData,
  mastersData,
}: {
  monthlyRegistrations: any[];
  paymentStatusData: any[];
  mastersData: any[];
}) {
  const maxY = Math.max(...monthlyRegistrations.map((m) => m.total));
  const ticks = Array.from(
    { length: Math.ceil(maxY / 2) + 1 },
    (_, i) => i * 2
  );

  return (
    <div className="grid xl:grid-cols-3 gap-6 mt-6">
      {/* Monthly Registrations */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="font-semibold text-lg mb-4">Monthly Registrations</h2>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <BarChart data={monthlyRegistrations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => v} ticks={ticks} />

              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Status Pie Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="font-semibold text-lg mb-4">
          Payment Status Distribution
        </h2>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={paymentStatusData}
                outerRadius={80}
                label
                dataKey="value"
              >
                {paymentStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Masters Distribution */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="font-semibold text-lg mb-4">Masters Distribution</h2>

        <div className="w-full h-64">
          <ResponsiveContainer>
            <BarChart data={mastersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />

              <Bar
                dataKey="value"
                radius={[10, 10, 0, 0]}
                barSize={40}
                fill="#16a34a"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
