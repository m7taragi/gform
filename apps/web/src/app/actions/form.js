"use server";

import { cookies } from "next/headers";
import { prisma } from "@gform/database";
import { FormCreateSchema } from "@gform/core";

export async function createFormAction(payload) {
  try {
    // 1. Verify Authentication Session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (!sessionCookie || !sessionCookie.value) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const userId = sessionCookie.value;

    // Optional: Verify user exists and is an admin
    // const user = await prisma.user.findUnique({ where: { id: userId } });
    // if (!user || user.role !== "admin") return { success: false, error: "Forbidden." };

    // 2. Validate Payload with Shared Domain Logic (Zod)
    const validationResult = FormCreateSchema.safeParse(payload);
    
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.format());
      return { 
        success: false, 
        error: "Invalid form data.", 
        details: validationResult.error.format() 
      };
    }

    const validData = validationResult.data;

    // 3. Persist to Database using Prisma
    // We use a nested write to create the Form and all Questions in a single transaction
    const newForm = await prisma.form.create({
      data: {
        title: validData.title,
        description: validData.description || null,
        isPublic: validData.isPublic,
        isActive: validData.isActive,
        questions: {
          create: (function buildTree(parentId = null) {
            return (validData.questions || [])
              .filter(q => (q.parentId || null) === parentId)
              .map(q => {
                const { id, parentId: pid, ...rest } = q; // Strip temp IDs
                const children = buildTree(id);
                return {
                  ...rest,
                  ...(children.length > 0 ? { children: { create: children } } : {})
                };
              });
          })(null),
        },
      },
    });

    return { success: true, formId: newForm.id };
  } catch (error) {
    console.error("Error creating form:", error);
    return { success: false, error: "An unexpected error occurred while saving." };
  }
}
