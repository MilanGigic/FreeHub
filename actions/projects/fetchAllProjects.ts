"use server"

import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchAllProjects(userId: string) {
    if (!userId) {
        return { success: false, error: "User ID is required" };
    }

    try {
        const data = await db.select().from(projects).where(eq(projects.userId, userId));
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching all projects:", error);
        return { success: false, error: "An error occurred while fetching all projects" };
    }
}