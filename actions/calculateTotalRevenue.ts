"use server";

import { db } from "@/db";
import { invoices, projectFinance, projects } from "@/db/schema";
import { Project } from "@/types/types";
import { and, eq, inArray } from "drizzle-orm";

export async function calculateTotalRevenue(
  userId: string,
  userProjects: Project[],
) {
  console.log(
    "setTotalRevenue called with userId:",
    userId,
    "userProjects:",
    userProjects,
  );

  if (!userId || !userProjects) {
    console.log("Validation failed: All fields are required");
    return { success: false, error: "All fields are required" };
  }

  if (userProjects.length === 0) {
    return { success: true, data: [] };
  }

  try {
    const projectIds = userProjects.map((project) => project.id);
    console.log("Fetching projectData for projectIds:", projectIds);

    const projectsData = await db.query.projects.findMany({
      where: and(
        inArray(projects.id, projectIds),
        eq(projects.userId, userId), // security fix: ensure ownership
      ),
    });

    console.log("projectData found:", projectsData);

    if (!projectsData || projectsData.length === 0) {
      return { success: false, error: "Projects not found" };
    }

    const results = await Promise.all(
      projectsData.map(async (project) => {
        const invoicesData = await db
          .select()
          .from(invoices)
          .where(
            and(
              eq(invoices.projectId, project.id),
              eq(invoices.userId, userId),
              eq(invoices.status, "paid"),
            ),
          );

        const projectRevenue = await db.query.projectFinance.findMany({
          where: and(
            eq(projectFinance.projectId, project.id),
            eq(projectFinance.userId, userId),
            eq(projectFinance.type, "income"),
          ),
        });

        const projectRevenueTotal = projectRevenue.reduce((acc, revenue) => {
          const amount = parseFloat(revenue.amount ?? "0");
          return acc + (isNaN(amount) ? 0 : amount);
        }, 0);

        // Step 4: if no invoices, skip — set revenue to 0
        if (invoicesData.length === 0) {
          await db
            .update(projects)
            .set({ totalRevenue: "0.00" })
            .where(eq(projects.id, project.id));
          return { projectId: project.id, total: "0.00" };
        }

        // Step 5: calculate total from paid invoices only
        const paidInvoiceTotal = invoicesData.reduce((acc, invoice) => {
          const amount = parseFloat(invoice.totalAmount ?? "0");
          return acc + (isNaN(amount) ? 0 : amount);
        }, 0);

        const total = (projectRevenueTotal + paidInvoiceTotal).toFixed(2);

        // Step 6: update THIS project's totalRevenue
        await db
          .update(projects)
          .set({ totalRevenue: total })
          .where(eq(projects.id, project.id));

        return { projectId: project.id, total };
      }),
    );

    return { success: true, data: results };
  } catch (error) {
    console.error("Error setting total revenue:", error);
    return {
      success: false,
      error: "An error occurred while setting total revenue",
    };
  }
}
