import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TxnStatus, BudgetCategory } from "../../../prisma/generated/prisma";
import { z } from "zod";

// Query parameter validation schema
const querySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.nativeEnum(TxnStatus).optional(),
});

// Type for the groupBy result
type CardGroupResult = {
  cardId: string;
  _sum: {
    amountCents: number | null;
  };
  _count: number;
};

// Type for the category group result
type CategoryGroupResult = {
  category: BudgetCategory;
  _sum: {
    amountCents: number | null;
  };
  _count: number;
};

// Type for the transaction with card details
type TransactionWithCard = {
  id: string;
  amountCents: number;
  merchant: string;
  category: BudgetCategory;
  status: TxnStatus;
  createdAt: Date;
  card: {
    nickname: string | null;
    last4: string;
  } | null;
};

/**
 * GET /api/reports
 * Generates financial reports for the authenticated organization
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} Success or error
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      console.error("Unauthorized access attempt");
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
    };

    let validatedParams;
    try {
      validatedParams = querySchema.parse(queryParams);
    } catch (err) {
      console.error("Invalid query parameters:", err);
      return NextResponse.json(
        { error: "Invalid query parameters", status: 400 },
        { status: 400 }
      );
    }

    // Build where clause
    const where = {
      orgId: session.user.orgId,
      ...(validatedParams.status && { status: validatedParams.status }),
      ...(validatedParams.startDate && {
        createdAt: {
          gte: new Date(validatedParams.startDate),
        },
      }),
      ...(validatedParams.endDate && {
        createdAt: {
          lte: new Date(validatedParams.endDate),
        },
      }),
    };

    // Get transaction statistics
    const [count, total, byCategory, byCard] = await Promise.all([
      // Total transaction count
      prisma.transaction.count({ where }),
      // Total spend
      prisma.transaction.aggregate({
        where,
        _sum: { amountCents: true },
      }),
      // Spend by category
      prisma.transaction.groupBy({
        by: ["category"],
        where,
        _sum: { amountCents: true },
        _count: true,
      }),
      // Spend by card
      prisma.transaction.groupBy({
        by: ["cardId"],
        where,
        _sum: { amountCents: true },
        _count: true,
      }),
    ]);

    // Get card details for the byCard report
    const cardDetails = await Promise.all(
      (byCard as CardGroupResult[]).map(async (row) => {
        const card = await prisma.card.findUnique({
          where: { id: row.cardId },
          select: { nickname: true, last4: true },
        });
        return {
          cardId: row.cardId,
          nickname: card?.nickname || "Unknown Card",
          last4: card?.last4 || "****",
          amountCents: row._sum.amountCents || 0,
          transactionCount: row._count,
        };
      })
    );

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        card: {
          select: {
            nickname: true,
            last4: true,
          },
        },
      },
    });

    const report = {
      totalTransactions: count,
      totalSpendCents: total._sum.amountCents || 0,
      spendByCategory: (byCategory as CategoryGroupResult[]).map((row) => ({
        category: row.category,
        amountCents: row._sum.amountCents || 0,
        transactionCount: row._count,
      })),
      spendByCard: cardDetails,
      recentTransactions: (recentTransactions as TransactionWithCard[]).map((txn) => ({
        id: txn.id,
        amountCents: txn.amountCents,
        merchant: txn.merchant,
        category: txn.category,
        status: txn.status,
        createdAt: txn.createdAt,
        card: txn.card,
      })),
    };

    console.log("Report generated:", {
      orgId: session.user.orgId,
      totalTransactions: count,
      totalSpendCents: total._sum.amountCents || 0,
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Internal server error", status: 500 },
      { status: 500 }
    );
  }
}
