import type { NextRequest } from "next/server";
import { fetchAndStoreRates } from "@/lib/fetchAndStoreRates"; // adjust path

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const ranAt = new Date().toISOString();
  const schedule = request.headers.get("x-vercel-cron-schedule");

  console.log(
    `[cron] FX job started at ${ranAt}`,
    schedule ? `(${schedule})` : "",
  );

  try {
    const rows = await fetchAndStoreRates();

    console.log(
      `[cron] FX job finished — stored ${rows.length} rates:`,
      rows.map((r) => `${r.code}=${r.middleRate}`).join(", "),
    );

    return Response.json({
      success: true,
      ranAt,
      schedule,
      stored: rows.length,
      rates: rows.map((r) => ({
        currency: r.code,
        rate: r.middleRate,
        date: r.date,
      })),
    });
  } catch (error) {
    console.error("[cron] FX job failed:", error);

    return Response.json(
      {
        success: false,
        ranAt,
        schedule,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
