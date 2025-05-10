import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BudgetCategory, TxnStatus } from "../../../prisma/generated/prisma";
import { z } from "zod";

// Input validation schemas
const querySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.nativeEnum(TxnStatus).optional(),
  category: z.nativeEnum(BudgetCategory).optional(),
  cardId: z.string().min(1).optional(),
  limit: z.number().min(1).max(100).optional().default(50),
  offset: z.number().min(0).optional().default(0),
});

const createTransactionSchema = z.object({
  cardId: z.string().min(1),
  amountCents: z.number().positive(),
  merchant: z.string().min(1),
  category: z.nativeEnum(BudgetCategory),
  description: z.string().optional(),
  stripeAuthId: z.string().min(1),
});

const updateTransactionSchema = z.object({
  id: z.string().min(1),
  status: z.nativeEnum(TxnStatus),
  reason: z.string().optional(),
});

/**
 * GET /api/transactions
 * Retrieves transactions for the authenticated user's organization
 * Query parameters:
 * - startDate: ISO date string (optional)
 * - endDate: ISO date string (optional)
 * - status: TxnStatus enum value (optional)
 * - category: BudgetCategory enum value (optional)
 * - cardId: string (optional)
 * - limit: number (optional, default: 50, max: 100)
 * - offset: number (optional, default: 0)
 * @returns {Promise<NextResponse>} List of transactions or error
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.orgId) {
      return NextResponse.json(
        { error: "Unauthorized", status: 401 },
        { status: 401 }
      );
    }

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
      status: searchParams.get("status"),
      category: searchParams.get("category"),
      cardId: searchParams.get("cardId"),
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
      offset: searchParams.get("offset") ? Number(searchParams.get("offset")) : undefined,
    };

    const validationResult = querySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validationResult.error.format(),
          status: 400,
        },
        { status: 400 }
      );
    }

    const { startDate, endDate, status, category, cardId, limit, offset } = validationResult.data;

    // Build where clause
    const where: {
      orgId: string;
      createdAt?: { gte?: Date; lte?: Date };
      status?: TxnStatus;
      category?: BudgetCategory;
      cardId?: string;
    } = {
      orgId: session.user.orgId,
    };

    if (startDate) {
      where.createdAt = { ...where.createdAt, gte: new Date(startDate) };
    }
    if (endDate) {
      where.createdAt = { ...where.createdAt, lte: new Date(endDate) };
    }
    if (status) {
      where.status = status;
    }
    if (category) {
      where.category = category;
    }
    if (cardId) {
      where.cardId = cardId;
    }

    // Get total count for pagination
    const total = await prisma.transaction.count({ where });

    // Fetch transactions with related data
    const transactions = await prisma.transaction.findMany({
      where,
      select: {
        id: true,
        cardId: true,
        amountCents: true,
        merchant: true,
        category: true,
        status: true,
        reason: true,
        description: true,
        createdAt: true,
        card: {
          select: {
            nickname: true,
            last4: true,
            network: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      data: transactions,
      meta: {
        total,
        limit,
        offset,
        hasMore: total > offset + limit,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions", status: 500 },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transactions
 * Creates a new transaction
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} Created transaction or error
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
    const validationResult = createTransactionSchema.safeParse(body);

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

    const { cardId, amountCents, merchant, category, description, stripeAuthId } = validationResult.data;

    // Ensure card belongs to user's org
    const card = await prisma.card.findUnique({ where: { id: cardId } });
    if (!card || card.orgId !== session.user.orgId) {
      return NextResponse.json(
        { error: "Card not found or access denied", status: 404 },
        { status: 404 }
      );
    }

    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        orgId: session.user.orgId,
        cardId,
        amountCents,
        merchant,
        category,
        description,
        stripeAuthId,
        status: TxnStatus.PENDING,
      },
    });

    return NextResponse.json({ data: transaction, status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction", status: 500 },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/transactions
 * Updates a transaction's status
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} Updated transaction or error
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
    const validationResult = updateTransactionSchema.safeParse(body);

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

    const { id, status, reason } = validationResult.data;

    // Ensure transaction belongs to user's org
    const existingTransaction = await prisma.transaction.findUnique({ where: { id } });
    if (!existingTransaction || existingTransaction.orgId !== session.user.orgId) {
      return NextResponse.json(
        { error: "Transaction not found or access denied", status: 404 },
        { status: 404 }
      );
    }

    // Update the transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: { status, reason },
    });

    return NextResponse.json({ data: updatedTransaction, status: 200 });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction", status: 500 },
      { status: 500 }
    );
  }
}
