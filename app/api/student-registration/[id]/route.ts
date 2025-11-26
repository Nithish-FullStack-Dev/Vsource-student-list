import { prisma } from "@/lib/prisma";
import { ApiError } from "@/utils/ApiError";
import { apiHandler } from "@/utils/apiHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export const PUT = apiHandler(async (req: Request, context: any) => {
  const { id } = context.params;
  const body = await req.json();

  if (!id) throw new ApiError(400, "student ID is required");

  delete body.id;
  delete body.createdAt;
  delete body.updatedAt;
  delete body.stid;

  const updatedStudent = await prisma.studentRegistration.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(
    new ApiResponse(200, updatedStudent, "Student updated successfully")
  );
});

export const DELETE = apiHandler(async (_req: Request, context: any) => {
  const { id } = context.params;
  if (!id) throw new ApiError(400, "student ID is required");
  await prisma.studentRegistration.delete({ where: { id } });
  return NextResponse.json(
    new ApiResponse(200, null, "Student deleted successfully")
  );
});

// 🔴 FIXED GET – return all fields required by the form
export const GET = apiHandler(async (_req: Request, context: any) => {
  const { id } = context.params;

  if (!id) throw new ApiError(400, "student ID is required");

  const student = await prisma.studentRegistration.findUnique({
    where: { id },
    select: {
      id: true,
      stid: true,

      // personal info
      studentName: true,
      dateOfBirth: true,
      mobileNumber: true,
      email: true,
      parentMobile: true,
      fathersName: true,
      nationality: true,
      gender: true,
      registrationDate: true,

      // address
      addressLine1: true,
      addressLine2: true,
      country: true,
      state: true,
      city: true,
      district: true,
      pincode: true,

      // course details
      abroadMasters: true,
      courseName: true,
      passportNumber: true,
      serviceCharge: true,
      academicYear: true,
      officeCity: true,
      processedBy: true,
      counselorName: true,
      assigneeName: true,

      // status / others
      status: true,
      payment: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!student) {
    throw new ApiError(404, `No student found with this id ${id}`);
  }

  return NextResponse.json(
    new ApiResponse(200, student, "user fetched successfully")
  );
});
