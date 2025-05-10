import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        org: true,
      },
    });

    if (!user?.org) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    return NextResponse.json(user.org);
  } catch (error) {
    console.error("[ORGANIZATION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 