import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CardNetwork, CardType, CardStatus } from "../../../prisma/generated/prisma";
import { z } from "zod";

// Input validation schemas
const createCardSchema = z.object({
  nickname: z.string().min(1).max(50),
  stripeCardId: z.string().min(1),
  last4: z.string().length(4),
  network: z.nativeEnum(CardNetwork).optional().default(CardNetwork.VISA),
  type: z.nativeEnum(CardType).optional().default(CardType.CORPORATE),
  monthlyLimit: z.number().positive().optional(),
});

const updateCardSchema = z.object({
  id: z.string().min(1),
  nickname: z.string().min(1).max(50).optional(),
  monthlyLimit: z.number().positive().optional(),
  status: z.nativeEnum(CardStatus).optional(),
});

const deleteCardSchema = z.object({
  id: z.string().min(1),
});

/**
 * GET /api/cards
 * Retrieves all cards for the authenticated user's organization
 * @returns {Promise<NextResponse>} List of cards or error
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

    const cards = await prisma.card.findMany({
      where: { orgId: session.user.orgId },
      select: {
        id: true,
        nickname: true,
        last4: true,
        network: true,
        type: true,
        status: true,
        monthlyLimit: true,
        totalSpent: true,
        averageTransaction: true,
        lastUsed: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: cards, status: 200 });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch cards", status: 500 },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cards
 * Creates a new card for the authenticated user's organization
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} Created card or error
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
    const validationResult = createCardSchema.safeParse(body);

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

    const { nickname, stripeCardId, last4, network, type, monthlyLimit } = validationResult.data;

    // Check if card with same stripeCardId already exists
    const existingCard = await prisma.card.findFirst({
      where: { stripeCardId },
    });

    if (existingCard) {
      return NextResponse.json(
        { error: "Card already exists", status: 409 },
        { status: 409 }
      );
    }

    // Create the new card
    const card = await prisma.card.create({
      data: {
        orgId: session.user.orgId,
        nickname,
        stripeCardId,
        last4,
        network,
        type,
        monthlyLimit,
        totalSpent: 0,
        averageTransaction: 0,
        status: CardStatus.ACTIVE,
      },
    });

    return NextResponse.json({ data: card, status: 201 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Failed to create card", status: 500 },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cards
 * Updates an existing card
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} Updated card or error
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
    const validationResult = updateCardSchema.safeParse(body);

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

    const { id, nickname, monthlyLimit, status } = validationResult.data;

    // Ensure card belongs to user's org
    const existingCard = await prisma.card.findUnique({ where: { id } });
    if (!existingCard || existingCard.orgId !== session.user.orgId) {
      return NextResponse.json(
        { error: "Card not found or access denied", status: 404 },
        { status: 404 }
      );
    }

    // Update the card
    const updatedCard = await prisma.card.update({
      where: { id },
      data: {
        ...(nickname && { nickname }),
        ...(monthlyLimit && { monthlyLimit }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({ data: updatedCard, status: 200 });
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { error: "Failed to update card", status: 500 },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cards
 * Deletes an existing card
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
    const validationResult = deleteCardSchema.safeParse(body);

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

    // Ensure card belongs to user's org
    const existingCard = await prisma.card.findUnique({ where: { id } });
    if (!existingCard || existingCard.orgId !== session.user.orgId) {
      return NextResponse.json(
        { error: "Card not found or access denied", status: 404 },
        { status: 404 }
      );
    }

    // Delete the card
    await prisma.card.delete({ where: { id } });

    return NextResponse.json({ data: { success: true }, status: 200 });
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { error: "Failed to delete card", status: 500 },
      { status: 500 }
    );
  }
}
