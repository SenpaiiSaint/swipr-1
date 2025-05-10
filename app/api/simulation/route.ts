import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { BudgetCategory } from "../../../prisma/generated/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { industry, updateOnly = false } = await req.json();

    // Generate simulation data
    const simulationData = generateSimulationData(industry, updateOnly);

    // Create simulation transactions
    const transactions = await Promise.all(
      simulationData.transactions.map(async (txn) => {
        return prisma.transaction.create({
          data: {
            orgId: session.user.orgId,
            stripeAuthId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            cardId: (await prisma.card.findFirst({ where: { orgId: session.user.orgId } }))?.id || "",
            amountCents: txn.amountCents,
            merchant: txn.merchant,
            category: txn.category,
            status: "APPROVED",
            description: "Simulation transaction",
          },
        });
      })
    );

    // Only create policies if this is not an update-only request
    let policies: { id: string; name: string; expression: string; isActive: boolean }[] = [];
    if (!updateOnly) {
      policies = await Promise.all(
        simulationData.policies.map(async (policy) => {
          return prisma.policy.create({
            data: {
              orgId: session.user.orgId,
              name: policy.name,
              expression: policy.expression,
              isActive: true,
            },
          });
        })
      );
    }

    return NextResponse.json({ success: true, transactions, policies });
  } catch (error) {
    console.error("Simulation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Simulation data generator
function generateSimulationData(industry: string | null, updateOnly: boolean = false) {
  const baseTransactions: { merchant: string; amountCents: number; category: BudgetCategory }[] = [
    { merchant: "Office Supplies Co", amountCents: 25000, category: "EQUIPMENT" },
    { merchant: "Cloud Services Inc", amountCents: 150000, category: "MARKETING" },
    { merchant: "Travel Agency", amountCents: 75000, category: "TRAVEL" },
    { merchant: "Training Institute", amountCents: 50000, category: "TRAINING" },
  ];

  const industrySpecificTransactions: Record<string, { merchant: string; amountCents: number; category: BudgetCategory }[]> = {
    retail: [
      { merchant: "Inventory Supplier", amountCents: 200000, category: "DIAMOND_INVENTORY" },
      { merchant: "Store Renovation", amountCents: 150000, category: "RETAIL_SPACE" },
      { merchant: "Security System", amountCents: 45000, category: "SECURITY" },
    ],
    manufacturing: [
      { merchant: "Raw Materials Co", amountCents: 300000, category: "PARTS_AND_MATERIALS" },
      { merchant: "Factory Equipment", amountCents: 500000, category: "EQUIPMENT" },
      { merchant: "Production Line", amountCents: 250000, category: "MANUFACTURING" },
    ],
    technology: [
      { merchant: "Cloud Provider", amountCents: 200000, category: "EQUIPMENT" },
      { merchant: "Software Licenses", amountCents: 150000, category: "TRAINING" },
      { merchant: "Server Hardware", amountCents: 300000, category: "EQUIPMENT" },
    ],
  };

  // For periodic updates, only generate 1-2 random transactions
  if (updateOnly) {
    const allTransactions = [
      ...baseTransactions,
      ...(industrySpecificTransactions[industry?.toLowerCase() as keyof typeof industrySpecificTransactions] || []),
    ];
    const randomTransactions = allTransactions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 2) + 1);
    
    return {
      transactions: randomTransactions,
      policies: [],
    };
  }

  const basePolicies = [
    {
      name: "Travel Policy",
      expression: "amount < 100000 && category == 'TRAVEL'",
    },
    {
      name: "Training Policy",
      expression: "amount < 50000 && category == 'TRAINING'",
    },
    {
      name: "Equipment Policy",
      expression: "amount < 200000 && category == 'EQUIPMENT'",
    },
  ];

  const industrySpecificPolicies = {
    retail: [
      {
        name: "Inventory Policy",
        expression: "amount < 300000 && category == 'DIAMOND_INVENTORY'",
      },
      {
        name: "Store Policy",
        expression: "amount < 200000 && category == 'RETAIL_SPACE'",
      },
      {
        name: "Security Policy",
        expression: "amount < 50000 && category == 'SECURITY'",
      },
    ],
    manufacturing: [
      {
        name: "Materials Policy",
        expression: "amount < 400000 && category == 'PARTS_AND_MATERIALS'",
      },
      {
        name: "Equipment Policy",
        expression: "amount < 600000 && category == 'EQUIPMENT'",
      },
      {
        name: "Production Policy",
        expression: "amount < 300000 && category == 'MANUFACTURING'",
      },
    ],
    technology: [
      {
        name: "Cloud Policy",
        expression: "amount < 250000 && category == 'EQUIPMENT'",
      },
      {
        name: "Software Policy",
        expression: "amount < 200000 && category == 'TRAINING'",
      },
      {
        name: "Hardware Policy",
        expression: "amount < 400000 && category == 'EQUIPMENT'",
      },
    ],
  };

  return {
    transactions: [
      ...baseTransactions,
      ...(industrySpecificTransactions[industry?.toLowerCase() as keyof typeof industrySpecificTransactions] || []),
    ],
    policies: [
      ...basePolicies,
      ...(industrySpecificPolicies[industry?.toLowerCase() as keyof typeof industrySpecificPolicies] || []),
    ],
  };
} 