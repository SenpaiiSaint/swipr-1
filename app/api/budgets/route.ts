import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BudgetCategory, BudgetPeriod } from "../../../prisma/generated/prisma";
import { z } from "zod";

// Input validation schemas
const createBudgetSchema = z.object({
  category: z.nativeEnum(BudgetCategory),
  amountCents: z.number().positive(),
  period: z.nativeEnum(BudgetPeriod),
  alertThreshold: z.number().min(0).max(100).optional().default(80),
});

const updateBudgetSchema = z.object({
  id: z.string().min(1),
  amountCents: z.number().positive().optional(),
  period: z.nativeEnum(BudgetPeriod).optional(),
  alertThreshold: z.number().min(0).max(100).optional(),
});

const deleteBudgetSchema = z.object({
  id: z.string().min(1),
});

/**
 * GET /api/budgets
 * Retrieves all budgets for the authenticated user's organization
 * @returns {Promise<NextResponse>} List of budgets or error
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

    const budgets = await prisma.budget.findMany({
      where: { orgId: session.user.orgId },
      select: {
        id: true,
        category: true,
        amountCents: true,
        period: true,
        spentCents: true,
        utilization: true,
        alertThreshold: true,
        lastAlert: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: budgets, status: 200 });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets", status: 500 },
      { status: 500 }
    );
  }
}

/**
 * POST /api/budgets
 * Creates a new budget for the authenticated user's organization
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} Created budget or error
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
    const validationResult = createBudgetSchema.safeParse(body);

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

    const { category, amountCents, period, alertThreshold } = validationResult.data;

    // Check if budget for category already exists
    const existingBudget = await prisma.budget.findFirst({
      where: {
        orgId: session.user.orgId,
        category,
      },
    });

    if (existingBudget) {
      return NextResponse.json(
        { error: "Budget for this category already exists", status: 409 },
        { status: 409 }
      );
    }

    // Create the new budget
    const budget = await prisma.budget.create({
      data: {
        orgId: session.user.orgId,
        category,
        amountCents,
        period,
        spentCents: 0,
        utilization: 0,
        alertThreshold,
      },
    });

    return NextResponse.json({ data: budget, status: 201 });
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json(
      { error: "Failed to create budget", status: 500 },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/budgets
 * Updates an existing budget
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} Updated budget or error
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
    const validationResult = updateBudgetSchema.safeParse(body);

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

    const { id, amountCents, period, alertThreshold } = validationResult.data;

    // Ensure budget belongs to user's org
    const existingBudget = await prisma.budget.findUnique({ where: { id } });
    if (!existingBudget || existingBudget.orgId !== session.user.orgId) {
      return NextResponse.json(
        { error: "Budget not found or access denied", status: 404 },
        { status: 404 }
      );
    }

    // Update the budget
    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: {
        ...(amountCents && { amountCents }),
        ...(period && { period }),
        ...(alertThreshold && { alertThreshold }),
      },
    });

    return NextResponse.json({ data: updatedBudget, status: 200 });
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json(
      { error: "Failed to update budget", status: 500 },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/budgets
 * Deletes an existing budget
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
    const validationResult = deleteBudgetSchema.safeParse(body);

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

    // Ensure budget belongs to user's org
    const existingBudget = await prisma.budget.findUnique({ where: { id } });
    if (!existingBudget || existingBudget.orgId !== session.user.orgId) {
      return NextResponse.json(
        { error: "Budget not found or access denied", status: 404 },
        { status: 404 }
      );
    }

    // Delete the budget
    await prisma.budget.delete({ where: { id } });

    return NextResponse.json({ data: { success: true }, status: 200 });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      { error: "Failed to delete budget", status: 500 },
      { status: 500 }
    );
  }
}
