import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { BudgetCategory, TxnStatus } from "../../../prisma/generated/prisma";
import { z } from "zod";

export const config = { api: { bodyParser: false } };

// Input validation schema for score API request
const scoreRequestSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  merchant: z.string(),
  amount_cts: z.number(),
  category: z.string(),
});

// Input validation schema for Stripe response
const stripeResponseSchema = z.object({
  approve: z.boolean(),
  decline_reason: z.string().optional(),
});

/**
 * Maps Stripe merchant categories to our budget categories
 * @param {string} stripeCategory - The Stripe merchant category
 * @returns {BudgetCategory} The mapped budget category
 */
function mapStripeCategoryToBudgetCategory(stripeCategory: string): BudgetCategory {
  // Map common Stripe merchant categories to our budget categories
  const categoryMap: Record<string, BudgetCategory> = {
    // Equipment and Parts
    "ac_refrigeration_repair": BudgetCategory.EQUIPMENT,
    "auto_repair_shop": BudgetCategory.EQUIPMENT,
    "camera_and_photographic_supply_stores": BudgetCategory.EQUIPMENT,
    "commercial_equipment": BudgetCategory.EQUIPMENT,
    "computer_repair": BudgetCategory.EQUIPMENT,
    "computer_software_stores": BudgetCategory.EQUIPMENT,
    "computers_peripherals_and_software": BudgetCategory.EQUIPMENT,
    "electrical_services": BudgetCategory.EQUIPMENT,
    "electronics_repair_shops": BudgetCategory.EQUIPMENT,
    "electronics_stores": BudgetCategory.EQUIPMENT,
    "equipment_rental": BudgetCategory.EQUIPMENT,
    "heating_plumbing_a_c": BudgetCategory.EQUIPMENT,
    "medical_dental_ophthalmic_and_hospital_equipment_and_supplies": BudgetCategory.EQUIPMENT,
    "office_and_commercial_furniture": BudgetCategory.EQUIPMENT,
    "small_appliance_repair": BudgetCategory.EQUIPMENT,
    "telecommunication_equipment_and_telephone_sales": BudgetCategory.EQUIPMENT,
    "telecommunication_services": BudgetCategory.EQUIPMENT,
    "telegraph_services": BudgetCategory.EQUIPMENT,
    "utilities": BudgetCategory.EQUIPMENT,
    "video_amusement_game_supplies": BudgetCategory.EQUIPMENT,

    // Parts and Materials
    "auto_paint": BudgetCategory.PARTS_AND_MATERIALS,
    "automotive_parts_and_accessories_stores": BudgetCategory.PARTS_AND_MATERIALS,
    "automotive_tire_stores": BudgetCategory.PARTS_AND_MATERIALS,
    "business_supplies": BudgetCategory.PARTS_AND_MATERIALS,
    "chemicals_and_allied_products": BudgetCategory.PARTS_AND_MATERIALS,
    "construction_materials": BudgetCategory.PARTS_AND_MATERIALS,
    "drugs_drug_proprietaries_and_druggist_sundries": BudgetCategory.PARTS_AND_MATERIALS,
    "electrical_parts_and_equipment": BudgetCategory.PARTS_AND_MATERIALS,
    "florists_supplies_nursery_stock_and_flowers": BudgetCategory.PARTS_AND_MATERIALS,
    "fuel_dealers_non_automotive": BudgetCategory.PARTS_AND_MATERIALS,
    "glass_paint_and_wallpaper_stores": BudgetCategory.PARTS_AND_MATERIALS,
    "hardware_equipment_and_supplies": BudgetCategory.PARTS_AND_MATERIALS,
    "hardware_stores": BudgetCategory.PARTS_AND_MATERIALS,
    "lumber_building_materials_stores": BudgetCategory.PARTS_AND_MATERIALS,
    "motor_vehicle_supplies_and_new_parts": BudgetCategory.PARTS_AND_MATERIALS,
    "nurseries_lawn_and_garden_supply_stores": BudgetCategory.PARTS_AND_MATERIALS,
    "paints_varnishes_and_supplies": BudgetCategory.PARTS_AND_MATERIALS,
    "petroleum_and_petroleum_products": BudgetCategory.PARTS_AND_MATERIALS,
    "plumbing_heating_equipment_and_supplies": BudgetCategory.PARTS_AND_MATERIALS,
    "stationary_office_supplies_printing_and_writing_paper": BudgetCategory.PARTS_AND_MATERIALS,
    "stationery_stores_office_and_school_supply_stores": BudgetCategory.PARTS_AND_MATERIALS,
    "tire_retreading_and_repair": BudgetCategory.PARTS_AND_MATERIALS,

    // Travel
    "airlines_air_carriers": BudgetCategory.TRAVEL,
    "car_rental_agencies": BudgetCategory.TRAVEL,
    "commuter_transport_and_ferries": BudgetCategory.TRAVEL,
    "courier_services": BudgetCategory.TRAVEL,
    "cruise_lines": BudgetCategory.TRAVEL,
    "direct_marketing_travel": BudgetCategory.TRAVEL,
    "motor_freight_carriers_and_trucking": BudgetCategory.TRAVEL,
    "passenger_railways": BudgetCategory.TRAVEL,
    "postal_services_government_only": BudgetCategory.TRAVEL,
    "railroads": BudgetCategory.TRAVEL,
    "recreational_vehicle_rentals": BudgetCategory.TRAVEL,
    "taxicabs_limousines": BudgetCategory.TRAVEL,
    "t_ui_travel_germany": BudgetCategory.TRAVEL,
    "tolls_bridge_fees": BudgetCategory.TRAVEL,
    "transportation_services": BudgetCategory.TRAVEL,
    "travel_agencies_tour_operators": BudgetCategory.TRAVEL,
    "truck_stop_iteration": BudgetCategory.TRAVEL,
    "truck_utility_trailer_rentals": BudgetCategory.TRAVEL,

    // Training
    "accounting_bookkeeping_services": BudgetCategory.TRAINING,
    "child_care_services": BudgetCategory.TRAINING,
    "chiropodists_podiatrists": BudgetCategory.TRAINING,
    "chiropractors": BudgetCategory.TRAINING,
    "colleges_universities": BudgetCategory.TRAINING,
    "computer_programming": BudgetCategory.TRAINING,
    "consulting_public_relations": BudgetCategory.TRAINING,
    "correspondence_schools": BudgetCategory.TRAINING,
    "counseling_services": BudgetCategory.TRAINING,
    "dance_hall_studios_schools": BudgetCategory.TRAINING,
    "dentists_orthodontists": BudgetCategory.TRAINING,
    "doctors": BudgetCategory.TRAINING,
    "educational_services": BudgetCategory.TRAINING,
    "elementary_secondary_schools": BudgetCategory.TRAINING,
    "employment_temp_agencies": BudgetCategory.TRAINING,
    "medical_and_dental_labs": BudgetCategory.TRAINING,
    "medical_services": BudgetCategory.TRAINING,
    "nursing_personal_care": BudgetCategory.TRAINING,
    "optometrists_ophthalmologist": BudgetCategory.TRAINING,
    "osteopaths": BudgetCategory.TRAINING,
    "professional_services": BudgetCategory.TRAINING,
    "secretarial_support_services": BudgetCategory.TRAINING,
    "tax_preparation_services": BudgetCategory.TRAINING,
    "testing_laboratories": BudgetCategory.TRAINING,
    "veterinary_services": BudgetCategory.TRAINING,
    "vocational_trade_schools": BudgetCategory.TRAINING,

    // Marketing
    "advertising_services": BudgetCategory.MARKETING,
    "charitable_and_social_service_organizations": BudgetCategory.MARKETING,
    "commercial_photography_art_and_graphics": BudgetCategory.MARKETING,
    "dating_escort_services": BudgetCategory.MARKETING,
    "direct_marketing_catalog_merchant": BudgetCategory.MARKETING,
    "direct_marketing_combination_catalog_and_retail_merchant": BudgetCategory.MARKETING,
    "direct_marketing_inbound_telemarketing": BudgetCategory.MARKETING,
    "direct_marketing_other": BudgetCategory.MARKETING,
    "direct_marketing_outbound_telemarketing": BudgetCategory.MARKETING,
    "direct_marketing_subscription": BudgetCategory.MARKETING,
    "door_to_door_sales": BudgetCategory.MARKETING,
    "membership_organizations": BudgetCategory.MARKETING,
    "miscellaneous_publishing_and_printing": BudgetCategory.MARKETING,
    "picture_video_production": BudgetCategory.MARKETING,
    "political_organizations": BudgetCategory.MARKETING,
    "quick_copy_repro_and_blueprint": BudgetCategory.MARKETING,
    "religious_organizations": BudgetCategory.MARKETING,
    "typesetting_plate_making_and_related_services": BudgetCategory.MARKETING,

    // Diamond Inventory
    "jewelry_stores_watches_clocks_and_silverware_stores": BudgetCategory.DIAMOND_INVENTORY,
    "precious_stones_and_metals_watches_and_jewelry": BudgetCategory.DIAMOND_INVENTORY,
    "watch_jewelry_repair": BudgetCategory.DIAMOND_INVENTORY,

    // Security
    "bail_and_bond_payments": BudgetCategory.SECURITY,
    "court_costs": BudgetCategory.SECURITY,
    "detective_agencies": BudgetCategory.SECURITY,
    "fines_government_administrative_entities": BudgetCategory.SECURITY,
    "government_services": BudgetCategory.SECURITY,
    "legal_services_attorneys": BudgetCategory.SECURITY,
    "security_brokers_dealers": BudgetCategory.SECURITY,
    "tax_payments_government_agencies": BudgetCategory.SECURITY,
    "u_s_federal_government_agencies_or_departments": BudgetCategory.SECURITY,

    // Insurance
    "credit_reporting_agencies": BudgetCategory.INSURANCE,
    "direct_marketing_insurance_services": BudgetCategory.INSURANCE,
    "financial_institutions": BudgetCategory.INSURANCE,
    "manual_cash_disburse": BudgetCategory.INSURANCE,
    "non_fi_money_orders": BudgetCategory.INSURANCE,
    "non_fi_stored_value_card_purchase_load": BudgetCategory.INSURANCE,
    "wires_money_orders": BudgetCategory.INSURANCE,

    // Fabric and Materials
    "apparel_accessory_stores": BudgetCategory.FABRIC_AND_MATERIALS,
    "carpet_upholstery_cleaning": BudgetCategory.FABRIC_AND_MATERIALS,
    "clothing_rental": BudgetCategory.FABRIC_AND_MATERIALS,
    "commercial_footwear": BudgetCategory.FABRIC_AND_MATERIALS,
    "drapery_window_covering_and_upholstery_stores": BudgetCategory.FABRIC_AND_MATERIALS,
    "dry_cleaners": BudgetCategory.FABRIC_AND_MATERIALS,
    "family_clothing_stores": BudgetCategory.FABRIC_AND_MATERIALS,
    "furriers_and_fur_shops": BudgetCategory.FABRIC_AND_MATERIALS,
    "laundries": BudgetCategory.FABRIC_AND_MATERIALS,
    "laundry_cleaning_services": BudgetCategory.FABRIC_AND_MATERIALS,
    "luggage_and_leather_goods_stores": BudgetCategory.FABRIC_AND_MATERIALS,
    "mens_and_boys_clothing_and_accessories_stores": BudgetCategory.FABRIC_AND_MATERIALS,
    "mens_womens_clothing_stores": BudgetCategory.FABRIC_AND_MATERIALS,
    "miscellaneous_apparel_and_accessory_shops": BudgetCategory.FABRIC_AND_MATERIALS,
    "piece_goods_notions_and_other_dry_goods": BudgetCategory.FABRIC_AND_MATERIALS,
    "sewing_needlework_fabric_and_piece_goods_stores": BudgetCategory.FABRIC_AND_MATERIALS,
    "shoe_repair_hat_cleaning": BudgetCategory.FABRIC_AND_MATERIALS,
    "shoe_stores": BudgetCategory.FABRIC_AND_MATERIALS,
    "tailors_alterations": BudgetCategory.FABRIC_AND_MATERIALS,
    "tent_and_awning_shops": BudgetCategory.FABRIC_AND_MATERIALS,
    "uniforms_commercial_clothing": BudgetCategory.FABRIC_AND_MATERIALS,
    "wig_and_toupee_stores": BudgetCategory.FABRIC_AND_MATERIALS,
    "womens_accessory_and_specialty_shops": BudgetCategory.FABRIC_AND_MATERIALS,
    "womens_ready_to_wear_stores": BudgetCategory.FABRIC_AND_MATERIALS,

    // Manufacturing
    "carpentry_services": BudgetCategory.MANUFACTURING,
    "cleaning_and_maintenance": BudgetCategory.MANUFACTURING,
    "concrete_work_services": BudgetCategory.MANUFACTURING,
    "exterminating_services": BudgetCategory.MANUFACTURING,
    "general_services": BudgetCategory.MANUFACTURING,
    "landscaping_services": BudgetCategory.MANUFACTURING,
    "masonry_stonework_and_plaster": BudgetCategory.MANUFACTURING,
    "metal_service_centers": BudgetCategory.MANUFACTURING,
    "miscellaneous_business_services": BudgetCategory.MANUFACTURING,
    "miscellaneous_general_services": BudgetCategory.MANUFACTURING,
    "public_warehousing_and_storage": BudgetCategory.MANUFACTURING,
    "roofing_siding_sheet_metal": BudgetCategory.MANUFACTURING,
    "special_trade_services": BudgetCategory.MANUFACTURING,
    "specialty_cleaning": BudgetCategory.MANUFACTURING,
    "welding_repair": BudgetCategory.MANUFACTURING,
    "wrecking_and_salvage_yards": BudgetCategory.MANUFACTURING,

    // Retail Space
    "bakeries": BudgetCategory.RETAIL_SPACE,
    "bars_and_nightclubs": BudgetCategory.RETAIL_SPACE,
    "beauty_salons": BudgetCategory.RETAIL_SPACE,
    "bicycle_shops": BudgetCategory.RETAIL_SPACE,
    "book_stores": BudgetCategory.RETAIL_SPACE,
    "candy_nut_and_confectionery_stores": BudgetCategory.RETAIL_SPACE,
    "caterers": BudgetCategory.RETAIL_SPACE,
    "cigar_stores_and_stands": BudgetCategory.RETAIL_SPACE,
    "country_clubs": BudgetCategory.RETAIL_SPACE,
    "dairy_products_stores": BudgetCategory.RETAIL_SPACE,
    "department_stores": BudgetCategory.RETAIL_SPACE,
    "discount_stores": BudgetCategory.RETAIL_SPACE,
    "drinking_places": BudgetCategory.RETAIL_SPACE,
    "drug_stores_and_pharmacies": BudgetCategory.RETAIL_SPACE,
    "duty_free_stores": BudgetCategory.RETAIL_SPACE,
    "eating_places_restaurants": BudgetCategory.RETAIL_SPACE,
    "electric_razor_stores": BudgetCategory.RETAIL_SPACE,
    "fast_food_restaurants": BudgetCategory.RETAIL_SPACE,
    "florists": BudgetCategory.RETAIL_SPACE,
    "freezer_and_locker_meat_provisioners": BudgetCategory.RETAIL_SPACE,
    "funeral_services_crematories": BudgetCategory.RETAIL_SPACE,
    "gift_card_novelty_and_souvenir_shops": BudgetCategory.RETAIL_SPACE,
    "glassware_crystal_stores": BudgetCategory.RETAIL_SPACE,
    "golf_courses_public": BudgetCategory.RETAIL_SPACE,
    "grocery_stores_supermarkets": BudgetCategory.RETAIL_SPACE,
    "health_and_beauty_spas": BudgetCategory.RETAIL_SPACE,
    "massage_parlors": BudgetCategory.RETAIL_SPACE,
    "miscellaneous_food_stores": BudgetCategory.RETAIL_SPACE,
    "miscellaneous_general_merchandise": BudgetCategory.RETAIL_SPACE,
    "miscellaneous_recreation_services": BudgetCategory.RETAIL_SPACE,
    "miscellaneous_specialty_retail": BudgetCategory.RETAIL_SPACE,
    "mobile_home_dealers": BudgetCategory.RETAIL_SPACE,
    "motion_picture_theaters": BudgetCategory.RETAIL_SPACE,
    "motor_homes_dealers": BudgetCategory.RETAIL_SPACE,
    "motorcycle_shops_and_dealers": BudgetCategory.RETAIL_SPACE,
    "motorcycle_shops_dealers": BudgetCategory.RETAIL_SPACE,
    "news_dealers_and_newsstands": BudgetCategory.RETAIL_SPACE,
    "package_stores_beer_wine_and_liquor": BudgetCategory.RETAIL_SPACE,
    "parking_lots_garages": BudgetCategory.RETAIL_SPACE,
    "pawn_shops": BudgetCategory.RETAIL_SPACE,
    "pet_shops_pet_food_and_supplies": BudgetCategory.RETAIL_SPACE,
    "photographic_studios": BudgetCategory.RETAIL_SPACE,
    "record_stores": BudgetCategory.RETAIL_SPACE,
    "religious_goods_stores": BudgetCategory.RETAIL_SPACE,
    "service_stations": BudgetCategory.RETAIL_SPACE,
    "snowmobile_dealers": BudgetCategory.RETAIL_SPACE,
    "sporting_goods_stores": BudgetCategory.RETAIL_SPACE,
    "sporting_recreation_camps": BudgetCategory.RETAIL_SPACE,
    "sports_clubs_fields": BudgetCategory.RETAIL_SPACE,
    "stamp_and_coin_stores": BudgetCategory.RETAIL_SPACE,
    "theatrical_ticket_agencies": BudgetCategory.RETAIL_SPACE,
    "timeshares": BudgetCategory.RETAIL_SPACE,
    "tourist_attractions_and_exhibits": BudgetCategory.RETAIL_SPACE,
    "trailer_parks_campgrounds": BudgetCategory.RETAIL_SPACE,
    "used_merchandise_and_secondhand_stores": BudgetCategory.RETAIL_SPACE,
    "variety_stores": BudgetCategory.RETAIL_SPACE,
    "video_game_arcades": BudgetCategory.RETAIL_SPACE,
    "video_tape_rental_stores": BudgetCategory.RETAIL_SPACE,
    "wholesale_clubs": BudgetCategory.RETAIL_SPACE,
  };

  return categoryMap[stripeCategory] || BudgetCategory.PARTS_AND_MATERIALS;
}

/**
 * POST /api/jit
 * Handles Just-In-Time authorization requests from Stripe
 * @param {NextRequest} req - The incoming request
 * @returns {Promise<NextResponse>} Success or error
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Initialize Stripe client
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-04-30.basil",
    });

    // Get and validate signature
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header", status: 400 },
        { status: 400 }
      );
    }

    // Get request body
    const body = await req.text();

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature", status: 400 },
        { status: 400 }
      );
    }

    // Only handle authorization requests
    if (event.type !== "issuing_authorization.request") {
      console.log("Ignoring non-authorization event:", event.type);
      return NextResponse.json({ received: true });
    }

    // Get authorization object
    const authObj = event.data.object as Stripe.Issuing.Authorization;

    // Validate organization ID
    const orgId = authObj.card?.metadata?.orgId;
    if (!orgId) {
      console.error("Missing orgId in card metadata");
      return NextResponse.json(
        { error: "Missing organization ID", status: 400 },
        { status: 400 }
      );
    }

    // Validate card exists
    const card = await prisma.card.findUnique({
      where: { stripeCardId: authObj.card!.id },
    });

    if (!card) {
      console.error("Card not found:", authObj.card!.id);
      return NextResponse.json(
        { error: "Card not found", status: 404 },
        { status: 404 }
      );
    }

    // Prepare score request data
    const scoreRequestData = {
      id: authObj.id,
      org_id: orgId,
      merchant: authObj.merchant_data.name ?? "Unknown Merchant",
      amount_cts: authObj.amount,
      category: authObj.merchant_data.category,
    };

    // Validate score request data
    try {
      scoreRequestSchema.parse(scoreRequestData);
    } catch (err) {
      console.error("Invalid score request data:", err);
      return NextResponse.json(
        { error: "Invalid request data", status: 400 },
        { status: 400 }
      );
    }

    // Call scoring API
    const scoreRes = await fetch(`${process.env.NEXTAUTH_URL}/api/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scoreRequestData),
    });

    if (!scoreRes.ok) {
      console.error("Score API error:", await scoreRes.text());
      return NextResponse.json(
        { error: "Score API error", status: 500 },
        { status: 500 }
      );
    }

    const decision = await scoreRes.json();

    // Prepare Stripe response
    const stripeResp = {
      approve: decision.approve,
      ...(decision.approve ? {} : { decline_reason: decision.reason }),
    };

    // Validate Stripe response
    try {
      stripeResponseSchema.parse(stripeResp);
    } catch (err) {
      console.error("Invalid Stripe response:", err);
      return NextResponse.json(
        { error: "Invalid response data", status: 500 },
        { status: 500 }
      );
    }

    // Map merchant category to budget category
    const budgetCategory = mapStripeCategoryToBudgetCategory(authObj.merchant_data.category);

    // Create transaction record
    await prisma.transaction.create({
      data: {
        stripeAuthId: authObj.id,
        orgId,
        cardId: authObj.card!.id,
        amountCents: authObj.amount,
        merchant: authObj.merchant_data.name ?? "Unknown Merchant",
        category: budgetCategory,
        status: decision.approve ? TxnStatus.APPROVED : TxnStatus.DECLINED,
        reason: decision.reason,
      },
    });

    // Update card stats if approved
    if (decision.approve) {
      await prisma.card.update({
        where: { id: card.id },
        data: {
          totalSpent: { increment: authObj.amount },
          lastUsed: new Date(),
        },
      });
    }

    console.log("JIT authorization processed:", {
      authId: authObj.id,
      orgId,
      cardId: authObj.card!.id,
      amount: authObj.amount,
      approved: decision.approve,
    });

    return NextResponse.json(stripeResp);
  } catch (error) {
    console.error("Error processing JIT authorization:", error);
    return NextResponse.json(
      { error: "Internal server error", status: 500 },
      { status: 500 }
    );
  }
}
