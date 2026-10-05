"use server";

import { prisma } from "@gform/database";

// Saves a section (and all its nested children) as a JSON string template
export async function saveSectionTemplateAction(name, questionsArray) {
  try {
    if (!name || name.trim() === "") {
      return { success: false, error: "Template name is required." };
    }

    const newTemplate = await prisma.sectionTemplate.create({
      data: {
        name: name.trim(),
        content: JSON.stringify(questionsArray),
      },
    });

    return { success: true, templateId: newTemplate.id };
  } catch (error) {
    console.error("Error saving section template:", error);
    return { success: false, error: "Failed to save template." };
  }
}

// Retrieves all saved section templates
export async function getSectionTemplatesAction() {
  try {
    const templates = await prisma.sectionTemplate.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        content: true,
      }
    });
    
    return { success: true, templates };
  } catch (error) {
    console.error("Error fetching templates:", error);
    return { success: false, error: "Failed to load templates." };
  }
}
