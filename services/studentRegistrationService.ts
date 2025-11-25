import axios from "@/lib/axios"; // or your axios instance

export const studentRegistrationService = {
    // CREATE
    create: (data: any) =>
        axios.post("/api/student-registration", data),

    // LIST
    list: () =>
        axios.get("/api/student-registration"),

    // 🔍 GET SINGLE STUDENT
    getById: (id: string) =>
        axios.get(`/api/student-registration/${id}`),

    // ✏️ UPDATE STUDENT
    update: (id: string, data: any) =>
        axios.put(`/api/student-registration/${id}`, data),

    // 🗑 DELETE
    delete: (id: string) =>
        axios.delete(`/api/student-registration/${id}`),
};
