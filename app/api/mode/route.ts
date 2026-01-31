import { NextResponse } from "next/server";

export async function GET() {
  const v = (process.env.DEMO_MODE ?? "true").toLowerCase();
  const demo = v !== "false";
  return NextResponse.json({ demo });
}
