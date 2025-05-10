import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Input validation schemas
const createPolicySchema = z.object({
  name: z.string().min(1).max(100),
  expression: z.string().min(1),
  isActive: z.boolean().default(true),
});

const updatePolicySchema = createPolicySchema.extend({
  id: z.string().min(1),
});

const deletePolicySchema = z.object({
  id: z.string().min(1),
});

/**
 * GET /api/policies
 * Retrieves all policies for the authenticated user's organization
 * @returns {Promise<NextResponse>} List of policies or error
 */
export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.orgId) {
      return NextResponse.json(
        { error: "Unauthorized", status: 401 },
        { status: 401 }
      );
    }

    const policies = await prisma.policy.findMany({
      where: { orgId: session.user.orgId },
      select: {
        id: true,
        name: true,
        expression: true,
        isActive: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ data: policies, status: 200 });
  } catch (error) {
    console.error("Error fetching policies:", error);
    return NextResponse.json(
      { error: "Failed to fetch policies", status: 500 },
      { status: 500 }
    );
  }
}

/**
 * POST /api/policies
 * Creates a new policy for the authenticated user's organization
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} Created policy or error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.orgId) {
      return NextResponse.json(
        { error: "Unauthorized", status: 401 },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createPolicySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validationResult.error.format(),
          status: 400,
        },
        { status: 400 }
      );
    }

    const { name, expression, isActive } = validationResult.data;

    // Create the new policy
    const policy = await prisma.policy.create({
      data: {
        orgId: session.user.orgId,
        name,
        expression,
        isActive,
      },
    });

    return NextResponse.json({ data: policy, status: 201 });
  } catch (error) {
    console.error("Error creating policy:", error);
    return NextResponse.json(
      { error: "Failed to create policy", status: 500 },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/policies
 * Updates an existing policy
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} Updated policy or error
 */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.orgId) {
      return NextResponse.json(
        { error: "Unauthorized", status: 401 },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updatePolicySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validationResult.error.format(),
          status: 400,
        },
        { status: 400 }
      );
    }

    const { id, name, expression, isActive } = validationResult.data;

    // Ensure policy belongs to user's org
    const existingPolicy = await prisma.policy.findUnique({ where: { id } });
    if (!existingPolicy || existingPolicy.orgId !== session.user.orgId) {
      return NextResponse.json(
        { error: "Policy not found or access denied", status: 404 },
        { status: 404 }
      );
    }

    // Update the policy
    const updatedPolicy = await prisma.policy.update({
      where: { id },
      data: { name, expression, isActive },
    });

    return NextResponse.json({ data: updatedPolicy, status: 200 });
  } catch (error) {
    console.error("Error updating policy:", error);
    return NextResponse.json(
      { error: "Failed to update policy", status: 500 },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/policies
 * Deletes an existing policy
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} Success or error
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.orgId) {
      return NextResponse.json(
        { error: "Unauthorized", status: 401 },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = deletePolicySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validationResult.error.format(),
          status: 400,
        },
        { status: 400 }
      );
    }

    const { id } = validationResult.data;

    // Ensure policy belongs to user's org
    const existingPolicy = await prisma.policy.findUnique({ where: { id } });
    if (!existingPolicy || existingPolicy.orgId !== session.user.orgId) {
      return NextResponse.json(
        { error: "Policy not found or access denied", status: 404 },
        { status: 404 }
      );
    }

    // Delete the policy
    await prisma.policy.delete({ where: { id } });

    return NextResponse.json({ data: { success: true }, status: 200 });
  } catch (error) {
    console.error("Error deleting policy:", error);
    return NextResponse.json(
      { error: "Failed to delete policy", status: 500 },
      { status: 500 }
    );
  }
}
