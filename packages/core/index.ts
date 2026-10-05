import { z } from 'zod';

// ==========================================
// User & Auth Schemas
// ==========================================
export const UserCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  avatarUrl: z.string().url("Invalid avatar URL").optional(),
});

export const UserLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ==========================================
// Form & Question Schemas
// ==========================================
export const QuestionSchema = z.object({
  id: z.string().uuid().optional(),
  parentId: z.string().uuid().nullable().optional(),
  shortHeading: z.string().min(1, "Heading is required"),
  questionText: z.string().min(1, "Question text is required"),
  dataType: z.enum(["text", "long_text", "number", "boolean", "date", "single_choice", "multiple_choice", "section", "master_data", "matrix", "rating", "location"]),
  options: z.string().optional(),
  showIf: z.string().nullable().optional(),
  isRequired: z.boolean().default(false),
  isRepeatable: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const FormCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
  isActive: z.boolean().default(true),
  limitOneResponse: z.boolean().default(false),
  customSubmitMessage: z.string().nullable().optional(),
  layout: z.enum(["single_page", "multi_page"]).default("single_page"),
  questions: z.array(QuestionSchema).optional(),
});

export const FormUpdateSchema = FormCreateSchema.partial();

// ==========================================
// Submission & Response Schemas
// ==========================================
export const ResponseSchema = z.object({
  questionId: z.string().uuid("Invalid question ID"),
  value: z.string().nullable().optional(), // Stringified value of the answer
  iterationIndex: z.number().int().default(0),
});

export const SubmissionCreateSchema = z.object({
  formId: z.string().uuid("Invalid form ID"),
  responses: z.array(ResponseSchema).min(1, "At least one response is required"),
});

// ==========================================
// Compliance Schemas
// ==========================================
export const ConsentLogCreateSchema = z.object({
  policyVersion: z.string().min(1, "Policy version is required"),
  // Note: hashedIp and userId should be handled securely server-side
  // and not blindly accepted from a client payload.
});

// Export inferred types for frontend/backend usage
export type UserCreateInput = z.infer<typeof UserCreateSchema>;
export type UserLoginInput = z.infer<typeof UserLoginSchema>;
export type FormCreateInput = z.infer<typeof FormCreateSchema>;
export type FormUpdateInput = z.infer<typeof FormUpdateSchema>;
export type QuestionInput = z.infer<typeof QuestionSchema>;
export type SubmissionCreateInput = z.infer<typeof SubmissionCreateSchema>;
export type ResponseInput = z.infer<typeof ResponseSchema>;
export type ConsentLogCreateInput = z.infer<typeof ConsentLogCreateSchema>;
