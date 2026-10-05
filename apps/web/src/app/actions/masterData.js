"use server";
import { prisma } from "@gform/database";

export async function getMasterDataListsAction() {
  try {
    const lists = await prisma.masterData.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        data: true
      }
    });
    return { success: true, lists };
  } catch (error) {
    console.error("Error fetching master data:", error);
    return { success: false, error: "Failed to load master data" };
  }
}

// Helper to seed some master data for testing purposes since we don't have a UI for it yet
export async function seedMasterDataAction() {
  try {
    const count = await prisma.masterData.count();
    if (count === 0) {
      await prisma.masterData.createMany({
        data: [
          {
            name: "Districts",
            data: JSON.stringify(["District A", "District B", "District C", "District D"])
          },
          {
            name: "Police Ranks",
            data: JSON.stringify(["Constable", "Head Constable", "Sub-Inspector", "Inspector", "DSP"])
          }
        ]
      });
      return { success: true, message: "Seeded" };
    }
    return { success: true, message: "Already seeded" };
  } catch (error) {
    return { success: false, error: "Failed to seed" };
  }
}
