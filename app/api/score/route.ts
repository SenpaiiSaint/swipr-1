import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { Parser } from "expr-eval";
import { z } from "zod";

// Input validation schema
const scoreRequestSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  merchant: z.string(),
  amount_cts: z.number().positive(),
  category: z.string(),
});

/**
 * POST /api/score
 * Evaluates transaction against organization policies
 * @param {NextRequest} req - The incoming request
 * @returns {Promise<NextResponse>} Success or error
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const body = await req.json();
    let validatedData;
    try {
      validatedData = scoreRequestSchema.parse(body);
    } catch (err) {
      console.error("Invalid request data:", err);
      return NextResponse.json(
        { error: "Invalid request data", status: 400 },
        { status: 400 }
      );
    }

    const { id, org_id, merchant, amount_cts, category } = validatedData;

    // Find card by Stripe card ID
    const card = await prisma.card.findUnique({
      where: { stripeCardId: id },
    });

    if (!card) {
      console.error("Card not found:", id);
      return NextResponse.json(
        { approved: false, reason: "Card not found", status: 404 },
        { status: 404 }
      );
    }

    // Verify organization matches
    if (card.orgId !== org_id) {
      console.error("Organization mismatch:", { cardOrgId: card.orgId, requestOrgId: org_id });
      return NextResponse.json(
        { approved: false, reason: "Organization mismatch", status: 403 },
        { status: 403 }
      );
    }

    // Get active policies
    const policies = await prisma.policy.findMany({
      where: { orgId: org_id, isActive: true },
      orderBy: { name: "asc" },
    });

    // Evaluate policies
    let approved = true;
    let reason = "Approved";
    let triggeredPolicy = null;

    for (const policy of policies) {
      // Support merchant-specific policies like "Alcohol: amount < 0"
      let [policyMerchant, expr] = policy.expression
        .split(":")
        .map((s: string) => s.trim());

      if (!expr) {
        expr = policyMerchant;
        policyMerchant = "";
      }

      // If merchant is specified, check it matches
      if (
        policyMerchant &&
        merchant.toLowerCase() !== policyMerchant.toLowerCase()
      ) {
        continue;
      }

      try {
        const parser = new Parser();
        const result = parser.evaluate(expr, { 
          amount: amount_cts,
          merchant,
          category,
        });

        if (result) {
          approved = false;
          reason = `Policy triggered: ${policy.name} (${policy.expression})`;
          triggeredPolicy = policy;
          break;
        }
      } catch (err) {
        console.error("Policy evaluation error:", {
          policyId: policy.id,
          expression: policy.expression,
          error: err,
        });
        continue;
      }
    }

    // Log transaction in Supabase
    try {
      await supabase.from("transactions").insert([
        {
          id,
          org_id,
          card_id: card.id,
          amount_cts,
          merchant,
          category,
          approved,
          reason,
          policy_id: triggeredPolicy?.id,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Failed to log transaction:", err);
      // Don't fail the request if logging fails
    }

    console.log("Transaction scored:", {
      id,
      org_id,
      merchant,
      amount_cts,
      approved,
      reason,
    });

    return NextResponse.json({
      approve: approved,
      reason: approved ? undefined : reason,
      policy: triggeredPolicy,
    });
  } catch (error) {
    console.error("Error processing score request:", error);
    return NextResponse.json(
      { error: "Internal server error", status: 500 },
      { status: 500 }
    );
  }
}
