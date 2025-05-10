import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TxnStatus, BudgetCategory } from "../../../prisma/generated/prisma";
import { z } from "zod";

// Query parameter validation schema
const querySchema = z.object({
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  status: z.nativeEnum(TxnStatus).optional().nullable(),
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

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user?.orgId) {
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

    const validationResult = querySchema.safeParse(queryParams);
    if (!validationResult.success) {
      console.error("Invalid query parameters:", validationResult.error);
      return NextResponse.json(
        { error: "Invalid query parameters", status: 400 },
        { status: 400 }
      );
    }

    const { startDate, endDate, status } = validationResult.data;

    // Build where clause
    const where = {
      orgId: session.user.orgId,
      ...(status && { status }),
      ...(startDate && {
        createdAt: {
          gte: new Date(startDate),
        },
      }),
      ...(endDate && {
        createdAt: {
          lte: new Date(endDate),
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
      recentTransactions: recentTransactions.map((txn) => ({
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
