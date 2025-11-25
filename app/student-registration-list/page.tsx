"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import * as XLSX from "xlsx";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { Pencil, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function StudentRegistrationList() {
  const router = useRouter();

  // const [data, setData] = useState<any[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  // Filters
  const [masters, setMasters] = useState("");
  const [team, setTeam] = useState("");
  const [year, setYear] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  // Fetch Students
  // useEffect(() => {
  //   (async () => {
  //     const res = await fetch("/api/student-registration");
  //     const json = await res.json();
  //     console.log(json);
  //     setData(json.data || []);
  //   })();
  // }, []);
  // FETCH via React Query
  const fetchStudents = async () => {
    const res = await fetch("/api/student-registration");
    const json = await res.json();
    return json.data || [];
  };

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["student-registrations"],
    queryFn: fetchStudents,
  });

  // Filter Logic
  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (masters && item.abroadMasters !== masters) return false;
      if (team && item.processedBy !== team) return false;
      if (year && item.academicYear !== year) return false;
      if (status && item.status !== status) return false;

      if (fromDate && new Date(item.registrationDate) < new Date(fromDate))
        return false;
      if (toDate && new Date(item.registrationDate) > new Date(toDate))
        return false;

      if (search) {
        const value = search.toLowerCase();
        if (
          !(
            item.studentName?.toLowerCase().includes(value) ||
            item.email?.toLowerCase().includes(value) ||
            item.mobileNumber?.includes(value)
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [data, masters, team, year, status, fromDate, toDate, search]);

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    await fetch(`/api/student-registration/${id}`, { method: "DELETE" });

    // Refresh using React Query
    refetch();
  };

  // Excel Export
  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(filtered);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Student Registrations");
    XLSX.writeFile(book, "student-registration-list.xlsx");
  };

  return (
    <div className="flex w-full bg-slate-100 min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className="flex-1 min-h-screen">
        <TopNav
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed((c) => !c)}
        />

        <Card className="p-6 m-4 shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4">
            Student Registration List
          </h2>

          {/* FILTERS */}
          <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-6">
            {/* Masters */}
            <div>
              <label className="text-sm font-medium">Abroad Masters</label>
              <Select onValueChange={setMasters}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Masters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ABROADMASTERS-USA">USA</SelectItem>
                  <SelectItem value="ABROADMASTERS-UK">UK</SelectItem>
                  <SelectItem value="ABROADMASTERS-AUSTRALIA">
                    AUSTRALIA
                  </SelectItem>
                  <SelectItem value="ABROADMASTERS-CANADA">CANADA</SelectItem>
                  <SelectItem value="ABROADMASTERS-IRELAND">IRELAND</SelectItem>
                  <SelectItem value="ABROADMASTERS-FRANCE">FRANCE</SelectItem>
                  <SelectItem value="ABROADMASTERS-GERMANY">GERMANY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Team */}
            <div>
              <label className="text-sm font-medium">Team</label>
              <Select onValueChange={setTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEAM-1">TEAM-1</SelectItem>
                  <SelectItem value="TEAM-2">TEAM-2</SelectItem>
                  <SelectItem value="TEAM-ONLINE">TEAM-ONLINE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div>
              <label className="text-sm font-medium">Year</label>
              <Select onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SPRING-2024">SPRING-2024</SelectItem>
                  <SelectItem value="FALL-2024">FALL-2024</SelectItem>
                  <SelectItem value="SUMMER-2024">SUMMER-2024</SelectItem>
                  <SelectItem value="SPRING-2025">SPRING-2025</SelectItem>
                  <SelectItem value="FALL-2025">FALL-2025</SelectItem>
                  <SelectItem value="SUMMER-2025">SUMMER-2025</SelectItem>
                  <SelectItem value="SPRING-2026">SPRING-2026</SelectItem>
                  <SelectItem value="FALL-2026">FALL-2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* From Date */}
            <div>
              <label className="text-sm font-medium">From Date</label>
              <Input
                type="date"
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            {/* To Date */}
            <div>
              <label className="text-sm font-medium">To Date</label>
              <Input type="date" onChange={(e) => setToDate(e.target.value)} />
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Hold">Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Buttons + Search */}
          <div className="flex gap-3 mb-4 items-center">
            <Button>Submit</Button>

            <Button
              onClick={exportExcel}
              className="bg-green-600 hover:bg-green-700"
            >
              Export to Excel
            </Button>

            <Input
              placeholder="Search..."
              className="ml-auto w-60"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full border rounded-lg text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">S.No</th>
                  <th className="p-2 border">Student ID</th>
                  <th className="p-2 border">Team</th>
                  <th className="p-2 border">Assignee</th>
                  <th className="p-2 border">Counsellor</th>
                  <th className="p-2 border">Student Name</th>
                  <th className="p-2 border">Mobile</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Masters</th>
                  <th className="p-2 border">Father Name</th>
                  <th className="p-2 border">Father Mobile</th>
                  <th className="p-2 border">Town/City</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item, index) => (
                  <tr key={item?.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{item?.stid}</td>

                    <td className="p-2 border">{item?.processedBy}</td>
                    <td className="p-2 border">{item?.assigneeName}</td>
                    <td className="p-2 border">{item?.counselorName}</td>
                    <td className="p-2 border">{item?.studentName}</td>
                    <td className="p-2 border">{item?.mobileNumber}</td>
                    <td className="p-2 border">{item?.email}</td>
                    <td className="p-2 border">{item?.abroadMasters}</td>
                    <td className="p-2 border">{item?.fathersName}</td>
                    <td className="p-2 border">{item?.parentMobile}</td>
                    <td className="p-2 border">{item?.city}</td>
                    <td className="p-2 border">{item?.status}</td>

                    {/* Actions */}
                    <td className="p-2 border text-center flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/student-registration/${item?.id}`)
                        }
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button size="sm" onClick={() => handleDelete(item?.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <p className="text-center py-4 text-slate-500">
                No records found
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
