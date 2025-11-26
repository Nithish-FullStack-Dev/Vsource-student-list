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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import * as XLSX from "xlsx";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function StudentRegistrationList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [collapsed, setCollapsed] = useState(false);
  // const [masters, setMasters] = useState("");
  // const [team, setTeam] = useState("");
  // const [year, setYear] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  // const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [masters, setMasters] = useState("ALL");
  const [team, setTeam] = useState("ALL");
  const [year, setYear] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const fetchStudents = async () => {
    const res = await api.get("/api/student-registration");
    return res.data.data || [];
  };

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["student-registrations"],
    queryFn: fetchStudents,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/student-registration/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-registrations"] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      deleteMutation.mutate(id);
    }
  };

  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(filtered);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Student Registrations");
    XLSX.writeFile(book, "student-registration-list.xlsx");
  };

  const filtered = useMemo(() => {
    return data.filter((item: any) => {
      // Masters
      if (masters !== "ALL" && item.abroadMasters !== masters) return false;

      // Team
      if (team !== "ALL" && item.processedBy !== team) return false;

      // Year
      if (year !== "ALL" && item.academicYear !== year) return false;

      // Status
      if (status !== "ALL" && item.status !== status) return false;

      // Date From
      if (fromDate && new Date(item.registrationDate) < new Date(fromDate))
        return false;

      // Date To
      if (toDate && new Date(item.registrationDate) > new Date(toDate))
        return false;

      // Search
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

          <div
            className="grid gap-4 mb-6 
            xl:grid-cols-6 
            lg:grid-cols-4 
            md:grid-cols-3 
            sm:grid-cols-2 
            grid-cols-1"
          >
            {/* Masters */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Abroad Masters</label>
              <Select onValueChange={setMasters}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
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
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Team</label>
              <Select onValueChange={setTeam}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="TEAM-1">TEAM-1</SelectItem>
                  <SelectItem value="TEAM-2">TEAM-2</SelectItem>
                  <SelectItem value="TEAM-ONLINE">TEAM-ONLINE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Year</label>
              <Select onValueChange={setYear}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
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
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">From Date</label>
              <Input
                type="date"
                className="h-10"
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">To Date</label>
              <Input
                type="date"
                className="h-10"
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Status</label>
              <Select onValueChange={setStatus}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Hold">Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 mb-4 items-center">
            <Button>Submit</Button>
            <Button
              onClick={exportExcel}
              className="bg-red-600 hover:bg-red-700"
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

          <div className="hidden md:block overflow-x-scroll mt-6">
            <Table className="border border-gray-300">
              <TableHeader>
                <TableRow className="border-b border-gray-300">
                  <TableHead className="border-r">S.No</TableHead>
                  <TableHead className="border-r">StdId</TableHead>
                  <TableHead className="border-r">Team</TableHead>
                  <TableHead className="border-r">Assignee</TableHead>
                  <TableHead className="border-r">Counsellor</TableHead>
                  <TableHead className="border-r">Student Name</TableHead>
                  <TableHead className="border-r">Mobile Number</TableHead>
                  <TableHead className="border-r">Email</TableHead>
                  <TableHead className="border-r">Masters</TableHead>
                  <TableHead className="border-r">Father Name</TableHead>
                  <TableHead className="border-r">Father Mobile</TableHead>
                  <TableHead className="border-r">Town</TableHead>
                  {/* <TableHead className="border-r">Type</TableHead> */}
                  <TableHead className="border-r">Status</TableHead>
                  <TableHead className="border-r text-center">
                    Actions
                  </TableHead>
                  {/* <TableHead className="text-center">Confirm</TableHead> */}
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((item: any, index: number) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 border-b">
                    <TableCell className="border-r">{index + 1}</TableCell>

                    <TableCell className="border-r">{item.stid}</TableCell>

                    <TableCell className="border-r">
                      {item.processedBy}
                    </TableCell>

                    <TableCell className="border-r">
                      {item.assigneeName}
                    </TableCell>

                    <TableCell className="border-r">
                      {item.counselorName}
                    </TableCell>

                    <TableCell className="border-r">
                      {item.studentName}
                    </TableCell>

                    <TableCell className="border-r">
                      {item.mobileNumber}
                    </TableCell>

                    <TableCell className="border-r">{item.email}</TableCell>

                    <TableCell className="border-r">
                      {item.abroadMasters}
                    </TableCell>

                    <TableCell className="border-r">
                      {item.fathersName}
                    </TableCell>

                    <TableCell className="border-r">
                      {item.parentMobile}
                    </TableCell>

                    <TableCell className="border-r">{item.city}</TableCell>

                    {/* <TableCell className="border-r">{item.type}</TableCell> */}

                    <TableCell className="border-r">{item.status}</TableCell>

                    <TableCell className="border-r text-center flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/student-registration/${item.id}`)
                        }
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>

                    {/* <TableCell className="text-center font-medium">
                      {item.confirm ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filtered.length === 0 && (
              <p className="text-center py-4 text-slate-500">
                No records found
              </p>
            )}
          </div>

          <div className="md:hidden grid gap-4">
            {filtered.map((item: any) => (
              <Card key={item.id} className="p-4 shadow-sm border">
                <div className="font-semibold">{item.studentName}</div>
                <div className="text-sm">ID: {item.stid}</div>
                <div className="text-sm">Mobile: {item.mobileNumber}</div>
                <div className="text-sm">Email: {item.email}</div>
                <div className="text-sm">Team: {item.processedBy}</div>
                <div className="text-sm">Status: {item.status}</div>
                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(`/student-registration/${item.id}`)
                    }
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
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
