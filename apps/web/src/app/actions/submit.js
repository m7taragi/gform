"use server";

import { cookies, headers } from "next/headers";
import { prisma } from "@gform/database";
import { SubmissionCreateSchema } from "@gform/core";
import crypto from "crypto";

export async function submitFormAction(payload) {
  try {
    // 1. Validation with Zod
    const validationResult = SubmissionCreateSchema.safeParse(payload);
    
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.format());
      return { 
        success: false, 
        error: "Invalid submission data.", 
        details: validationResult.error.format() 
      };
    }

    const { formId, responses } = validationResult.data;

    // 2. Identify User (if logged in)
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    const userId = sessionCookie?.value || null;

    // 3. Form Settings Validation
    const form = await prisma.form.findUnique({ where: { id: formId }});
    if (!form) return { success: false, error: "Form not found." };
    if (!form.isActive) return { success: false, error: "This form is no longer accepting responses." };
    
    if (form.limitOneResponse) {
      if (!userId) {
        return { success: false, error: "You must be logged in to submit this form." };
      }
      
      const existingSubmission = await prisma.submission.findFirst({
        where: { formId, submittedBy: userId }
      });
      
      if (existingSubmission) {
        return { success: false, error: "You have already submitted a response to this form." };
      }
    }

    // 4. Extract and Hash IP for ConsentLog (Compliance Requirement)
    const headersList = await headers();
    const rawIp = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "127.0.0.1";
    // Hash the IP to prevent raw PII storage
    const hashedIp = crypto.createHash("sha256").update(rawIp).digest("hex");

    // 5. Prisma Transaction: Create Submission and ConsentLog
    const result = await prisma.$transaction(async (tx) => {
      // a. Create Submission & Responses
      const newSubmission = await tx.submission.create({
        data: {
          formId,
          submittedBy: userId,
          responses: {
            create: responses.map((r) => ({
              questionId: r.questionId,
              value: r.value,
              iterationIndex: r.iterationIndex || 0,
            })),
          },
        },
      });

      // b. Enforce DPDP/DPBI Compliance: Log Consent if User is authenticated
      if (userId) {
        await tx.consentLog.create({
          data: {
            userId,
            policyVersion: "v1.0", // Hardcoded for MVP, ideally fetched from active policy
            hashedIp,
          },
        });
      }

      return newSubmission;
    });

    return { success: true, submissionId: result.id };
  } catch (error) {
    console.error("Error submitting form:", error);
    
    // Handle specific Prisma unique constraint violations (e.g. duplicate response for same question)
    if (error.code === 'P2002') {
      return { success: false, error: "A response constraint was violated." };
    }

    return { success: false, error: "An unexpected error occurred while submitting." };
  }
}
