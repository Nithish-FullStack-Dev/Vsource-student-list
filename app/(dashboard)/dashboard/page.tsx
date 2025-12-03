import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import ChartsClient from "./ChartsClient";

// Helper: get month name
function monthName(date: Date) {
  return date.toLocaleString("en-US", { month: "short" }).toUpperCase();
}

export default async function DashboardPage() {
  // KPIs
  const totalStudents = await prisma.studentRegistration.count();

  const pendingPayments = await prisma.payment.count({
    where: { status: "PENDING" },
  });

  const approvedPayments = await prisma.payment.count({
    where: { status: "APPROVED" },
  });

  const invoicesGenerated = await prisma.payment.count();

  const activeEmployees = await prisma.user.count();

  // ---------- Dynamic Charts ----------
  // Get the last 6 months with keys
  function getLastSixMonths() {
    const months: { key: string; month: string }[] = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;

      months.push({
        key,
        month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
      });
    }

    return months;
  }

  // Helper: last 6 months range
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRegistrationsRaw = await prisma.$queryRaw<
    { month: number; year: number; total: number }[]
  >`
  SELECT 
    EXTRACT(MONTH FROM "createdAt")::int AS month,
    EXTRACT(YEAR FROM "createdAt")::int AS year,
    COUNT(*) AS total
  FROM "StudentRegistration"
  WHERE "createdAt" >= ${sixMonthsAgo}
  GROUP BY month, year
  ORDER BY year, month;
`;
  const monthMap: Record<string, number> = {};

  monthlyRegistrationsRaw.forEach((r) => {
    const key = `${r.year}-${String(r.month).padStart(2, "0")}`;
    monthMap[key] = Number(r.total);
  });
  const lastSix = getLastSixMonths();

  const monthlyRegistrations = lastSix.map((m) => ({
    month: m.month,
    total: monthMap[m.key] || 0, // fill 0 if missing
  }));

  // const monthlyRegistrations = monthlyRegistrationsRaw.map((r) => ({
  //   month: new Date(r.year, r.month - 1).toLocaleString("en-US", {
  //     month: "short",
  //   }),
  //   total: Number(r.total), // ← FIX
  // }));

  // 2️⃣ Payment status chart
  const paymentStatus = await prisma.payment.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const paymentStatusData = paymentStatus.map((p) => ({
    name: p.status,
    value: p._count.id,
  }));

  // 3️⃣ Masters distribution
  const mastersRaw = await prisma.studentRegistration.groupBy({
    by: ["abroadMasters"],
    _count: { id: true },
  });

  const mastersData = mastersRaw.map((m) => ({
    name: m.abroadMasters,
    value: m._count.id,
  }));

  // Convert to IST date range
  function getISTDayRange() {
    const now = new Date();

    // IST offset = +5:30 = 330 minutes
    const istOffset = 330;

    // Convert current UTC time → IST
    const istNow = new Date(now.getTime() + istOffset * 60000);

    // Start of IST day
    const startIST = new Date(
      istNow.getFullYear(),
      istNow.getMonth(),
      istNow.getDate(),
      0,
      0,
      0,
      0
    );

    // End of IST day
    const endIST = new Date(
      istNow.getFullYear(),
      istNow.getMonth(),
      istNow.getDate(),
      23,
      59,
      59,
      999
    );

    // Convert back to UTC so database matches correctly
    const startUTC = new Date(startIST.getTime() - istOffset * 60000);
    const endUTC = new Date(endIST.getTime() - istOffset * 60000);

    return { startUTC, endUTC };
  }

  const { startUTC, endUTC } = getISTDayRange();

  const loginsToday = await prisma.employeeLoginDetail.count({
    where: {
      loginTime: {
        gte: startUTC,
        lte: endUTC,
      },
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Overview
        </h1>
        <p className="text-sm text-slate-600">
          Real-time insights into registrations, payments & employee activity.
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-blue-600">
            {totalStudents}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-yellow-600">
            {pendingPayments}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Approved Payments</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">
            {approvedPayments}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Invoices Generated</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-purple-600">
            {invoicesGenerated}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Active Employees</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-emerald-600">
            {activeEmployees}
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Logins Today</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-orange-600">
            {loginsToday}
          </CardContent>
        </Card>
      </div>

      {/* PASS dynamic data to ChartsClient */}
      <ChartsClient
        monthlyRegistrations={monthlyRegistrations}
        paymentStatusData={paymentStatusData}
        mastersData={mastersData}
      />
    </div>
  );
}
