import { NextResponse } from "next/server";
import profile from "@/data/profile.json";

export async function GET() {
  try {
    return NextResponse.json({
      projects: profile.star_items || [],
      owner: profile.owner,
      role: profile.role,
      summary: profile.summary
    });
  } catch (error) {
    console.error("Failed to load projects:", error);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}