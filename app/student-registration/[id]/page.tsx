"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import RegistrationForm from "@/components/student-registration/RegistrationForm";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { useState } from "react";

export default function EditStudentPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [collapsed, setCollapsed] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["student-registration", id],
    queryFn: async () => {
      const res = await api.get(`/api/student-registration/${id}`);
      const student = res.data.data;

      return {
        ...student,
        // normalize for <input type="date" />
        dateOfBirth: student.dateOfBirth
          ? student.dateOfBirth.slice(0, 10)
          : "",
        registrationDate: student.registrationDate
          ? student.registrationDate.slice(0, 10)
          : "",
      };
    },
  });

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  if (isError || !data) {
    return <p className="p-4 text-red-500">Failed to load student</p>;
  }

  return (
    <div className="flex w-full bg-slate-100 min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 min-h-screen">
        <TopNav
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed((c) => !c)}
        />
        <div className="p-4">
          <RegistrationForm mode="edit" id={id} defaultValues={data} />
        </div>
      </div>
    </div>
  );
}
