import { PrismaClient, Role, BudgetCategory, SubscriptionTier, CardStatus, CardType, TxnStatus, ExpenseType, CardNetwork } from "./generated/prisma";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  // Create organizations with industry-specific details
  const orgs = await Promise.all([
    prisma.organization.create({
      data: { 
        name: "Grassroots Inc",
        industry: "Cannabis Production & Distribution",
        companySize: "Medium (50-200 employees)",
        subscriptionTier: SubscriptionTier.PRO,
        billingEmail: "finance@grassrootsinc.com",
        billingAddress: "123 Green Lane, Denver, CO 80202"
      }
    }),
    prisma.organization.create({
      data: { 
        name: "Wekfest",
        industry: "Automotive Event Production",
        companySize: "Small (10-50 employees)",
        subscriptionTier: SubscriptionTier.ENTERPRISE,
        billingEmail: "accounts@wekfest.com",
        billingAddress: "456 Show Street, Los Angeles, CA 90001"
      }
    }),
    prisma.organization.create({
      data: { 
        name: "Ultrace",
        industry: "Fashion Manufacturing",
        companySize: "Medium (50-200 employees)",
        subscriptionTier: SubscriptionTier.PRO,
        billingEmail: "finance@ultrace.com",
        billingAddress: "789 Fashion Avenue, Los Angeles, CA 90001"
      }
    }),
    prisma.organization.create({
      data: { 
        name: "Liberty Walk",
        industry: "Automotive Customization",
        companySize: "Small (10-50 employees)",
        subscriptionTier: SubscriptionTier.ENTERPRISE,
        billingEmail: "finance@lbwk.com",
        billingAddress: "1-2-3 Chuo-ku, Tokyo, Japan 104-0031"
      }
    }),
    prisma.organization.create({
      data: { 
        name: "Airbus",
        industry: "Aerospace Manufacturing",
        companySize: "Large (1000+ employees)",
        subscriptionTier: SubscriptionTier.ENTERPRISE,
        billingEmail: "finance@airbus.com",
        billingAddress: "2 Rond-Point Emile Dewoitine, 31700 Blagnac, France"
      }
    }),
    prisma.organization.create({
      data: { 
        name: "AMAN",
        industry: "Luxury Hospitality",
        companySize: "Medium (50-200 employees)",
        subscriptionTier: SubscriptionTier.ENTERPRISE,
        billingEmail: "finance@aman.com",
        billingAddress: "Dubai Mall, Downtown Dubai, UAE"
      }
    }),
    prisma.organization.create({
      data: { 
        name: "De Beers",
        industry: "Diamond Mining & Trading",
        companySize: "Large (1000+ employees)",
        subscriptionTier: SubscriptionTier.ENTERPRISE,
        billingEmail: "finance@debeers.com",
        billingAddress: "17 Charterhouse Street, London, EC1N 6RA, United Kingdom"
      }
    }),
  ]);

  // Store organization IDs in a map for easy lookup
  const orgMap = new Map();
  for (const org of orgs) {
    // Store multiple variations of the org name for flexible matching
    const normalizedName = org.name.toLowerCase().replace(/\s+/g, '');
    const shortName = normalizedName.replace(/inc|&|co|\./g, '');
    orgMap.set(normalizedName, org.id);
    orgMap.set(shortName, org.id);
    
    // Store domain variations and common nicknames
    if (normalizedName === 'libertywalk') {
      orgMap.set('lbwk', org.id);
    } else if (normalizedName === 'grassrootsinc') {
      orgMap.set('grassroots', org.id);
    } else if (normalizedName === 'wekfest') {
      orgMap.set('wekfest', org.id);
    } else if (normalizedName === 'ultrace') {
      orgMap.set('ultrace', org.id);
    } else if (normalizedName === 'airbus') {
      orgMap.set('airbus', org.id);
    } else if (normalizedName === 'aman') {
      orgMap.set('aman', org.id);
    } else if (normalizedName === 'debeers') {
      orgMap.set('debeers', org.id);
    }
  }

  // Helper function to find organization ID from card stripeCardId
  function findOrgIdFromStripeCardId(stripeCardId: string): string | undefined {
    // Extract org name from stripeCardId (e.g., "card_grassroots_1" -> "grassroots")
    const orgName = stripeCardId.split('_')[1];
    return orgMap.get(orgName);
  }

  // Create users with realistic names, roles, and departments
  const grassrootsUsers = [
    {
      name: "James Wilson",
      email: "james.wilson@grassrootsinc.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.ADMIN,
      jobTitle: "Chief Operations Officer",
      department: "Operations",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      phone: "+1 (303) 555-1234",
      officeLocation: "Denver HQ",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "USD",
        timezone: "America/Denver",
        language: "en",
        theme: "light"
      }
    },
    {
      name: "Sarah Chen",
      email: "sarah.chen@grassrootsinc.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.MANAGER,
      jobTitle: "Production Manager",
      department: "Production",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      phone: "+1 (303) 555-2345",
      officeLocation: "Denver Facility",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "USD",
        timezone: "America/Denver",
        language: "en",
        theme: "dark"
      }
    },
    {
      name: "Mike Rodriguez",
      email: "mike.rodriguez@grassrootsinc.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.EMPLOYEE,
      jobTitle: "Quality Control Specialist",
      department: "Quality Assurance",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      phone: "+1 (303) 555-3456",
      officeLocation: "Denver Lab",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "USD",
        timezone: "America/Denver",
        language: "en",
        theme: "light"
      }
    },
  ];

  const wekfestUsers = [
    {
      name: "David Mbeki",
      email: "david.mbeki@wekfest.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.ADMIN,
      jobTitle: "Event Director",
      department: "Executive",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      phone: "+1 (323) 555-7890",
      officeLocation: "LA HQ",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "USD",
        timezone: "America/Los_Angeles",
        language: "en",
        theme: "dark"
      }
    },
    {
      name: "Nomsa Dlamini",
      email: "nomsa.dlamini@wekfest.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.MANAGER,
      jobTitle: "Venue Manager",
      department: "Events",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nomsa",
      phone: "+1 (323) 555-8901",
      officeLocation: "LA Office",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "USD",
        timezone: "America/Los_Angeles",
        language: "en",
        theme: "light"
      }
    },
    {
      name: "Thabo Nkosi",
      email: "thabo.nkosi@wekfest.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.EMPLOYEE,
      jobTitle: "Event Coordinator",
      department: "Operations",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thabo",
      phone: "+1 (323) 555-9012",
      officeLocation: "LA Office",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "USD",
        timezone: "America/Los_Angeles",
        language: "en",
        theme: "dark"
      }
    },
  ];

  const ultraceUsers = [
    {
      name: "Sophie Laurent",
      email: "sophie.laurent@ultrace.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.ADMIN,
      jobTitle: "Creative Director",
      department: "Design",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      phone: "+1 (555) 789-0123",
      officeLocation: "Los Angeles Studio",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "USD",
        timezone: "America/Los_Angeles",
        language: "en",
        theme: "light"
      }
    },
    {
      name: "Marco Rossi",
      email: "marco.rossi@ultrace.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.MANAGER,
      jobTitle: "Production Manager",
      department: "Manufacturing",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
      phone: "+1 (555) 890-1234",
      officeLocation: "Los Angeles Factory",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "USD",
        timezone: "America/Los_Angeles",
        language: "en",
        theme: "dark"
      }
    },
    {
      name: "Emma Thompson",
      email: "emma.thompson@ultrace.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.EMPLOYEE,
      jobTitle: "Retail Operations Specialist",
      department: "Retail",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      phone: "+1 (555) 901-2345",
      officeLocation: "Los Angeles Store",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "USD",
        timezone: "America/Los_Angeles",
        language: "en",
        theme: "light"
      }
    },
  ];

  const lbwkUsers = [
    {
      name: "Wataru Kato",
      email: "wataru.kato@lbwk.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.ADMIN,
      jobTitle: "Founder & CEO",
      department: "Executive",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wataru",
      phone: "+81 3-1234-5678",
      officeLocation: "Tokyo HQ",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "JPY",
        timezone: "Asia/Tokyo",
        language: "ja",
        theme: "dark"
      }
    },
    {
      name: "Yuki Tanaka",
      email: "yuki.tanaka@lbwk.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.MANAGER,
      jobTitle: "Customization Manager",
      department: "Customization",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
      phone: "+81 3-2345-6789",
      officeLocation: "Tokyo Workshop",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "JPY",
        timezone: "Asia/Tokyo",
        language: "ja",
        theme: "light"
      }
    },
    {
      name: "Kenji Suzuki",
      email: "kenji.suzuki@lbwk.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.EMPLOYEE,
      jobTitle: "Senior Designer",
      department: "Design",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji",
      phone: "+81 3-3456-7890",
      officeLocation: "Tokyo Studio",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "JPY",
        timezone: "Asia/Tokyo",
        language: "ja",
        theme: "dark"
      }
    },
  ];

  const airbusUsers = [
    {
      name: "Jean Dupont",
      email: "jean.dupont@airbus.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.ADMIN,
      jobTitle: "Chief Financial Officer",
      department: "Finance",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
      phone: "+33 5-1234-5678",
      officeLocation: "Toulouse HQ",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "EUR",
        timezone: "Europe/Paris",
        language: "fr",
        theme: "light"
      }
    },
    {
      name: "Marie Laurent",
      email: "marie.laurent@airbus.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.MANAGER,
      jobTitle: "Procurement Manager",
      department: "Procurement",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
      phone: "+33 5-2345-6789",
      officeLocation: "Toulouse Factory",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "EUR",
        timezone: "Europe/Paris",
        language: "fr",
        theme: "dark"
      }
    },
    {
      name: "Pierre Martin",
      email: "pierre.martin@airbus.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.EMPLOYEE,
      jobTitle: "Aerospace Engineer",
      department: "Engineering",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre",
      phone: "+33 5-3456-7890",
      officeLocation: "Toulouse R&D Center",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "EUR",
        timezone: "Europe/Paris",
        language: "fr",
        theme: "light"
      }
    },
  ];

  const amanUsers = [
    {
      name: "Ahmed Al Mansouri",
      email: "ahmed.almansouri@aman.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.ADMIN,
      jobTitle: "Regional Director",
      department: "Executive",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
      phone: "+971 4-123-4567",
      officeLocation: "Dubai HQ",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "AED",
        timezone: "Asia/Dubai",
        language: "ar",
        theme: "dark"
      }
    },
    {
      name: "Fatima Al Qasimi",
      email: "fatima.alqasimi@aman.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.MANAGER,
      jobTitle: "Operations Manager",
      department: "Operations",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
      phone: "+971 4-234-5678",
      officeLocation: "Dubai Resort",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "AED",
        timezone: "Asia/Dubai",
        language: "ar",
        theme: "light"
      }
    },
    {
      name: "Mohammed Al Hashimi",
      email: "mohammed.alhashimi@aman.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.EMPLOYEE,
      jobTitle: "Guest Relations Specialist",
      department: "Guest Services",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed",
      phone: "+971 4-345-6789",
      officeLocation: "Dubai Resort",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "AED",
        timezone: "Asia/Dubai",
        language: "ar",
        theme: "dark"
      }
    },
  ];

  const debeersUsers = [
    {
      name: "Bruce Cleaver",
      email: "bruce.cleaver@debeers.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.ADMIN,
      jobTitle: "Chief Executive Officer",
      department: "Executive",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bruce",
      phone: "+44 20 7404 4444",
      officeLocation: "London HQ",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "USD",
        timezone: "Europe/London",
        language: "en",
        theme: "light"
      }
    },
    {
      name: "Stephen Lussier",
      email: "stephen.lussier@debeers.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.MANAGER,
      jobTitle: "Executive Vice President",
      department: "Consumer & Markets",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Stephen",
      phone: "+44 20 7404 4444",
      officeLocation: "London Office",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "USD",
        timezone: "Europe/London",
        language: "en",
        theme: "dark"
      }
    },
    {
      name: "Katie Fergusson",
      email: "katie.fergusson@debeers.com",
      password: await bcrypt.hash("Password123!", 10),
      role: Role.EMPLOYEE,
      jobTitle: "Senior Vice President",
      department: "Sustainable Impact",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Katie",
      phone: "+44 20 7404 4444",
      officeLocation: "London Office",
      preferences: {
        notificationEmail: true,
        notificationSMS: true,
        currency: "USD",
        timezone: "Europe/London",
        language: "en",
        theme: "light"
      }
    },
  ];

  // Create users with their preferences
  for (const user of [...grassrootsUsers, ...wekfestUsers, ...ultraceUsers, ...lbwkUsers, ...airbusUsers, ...amanUsers, ...debeersUsers]) {
    const { preferences, ...userData } = user;
    const orgName = user.email.split('@')[1].split('.')[0];
    const orgId = orgMap.get(orgName);
    
    if (!orgId) {
      console.warn(`Could not find organization for user ${user.email}`);
      continue;
    }

    await prisma.user.create({
      data: {
        ...userData,
        org: {
          connect: { id: orgId }
        },
        preferences: {
          create: preferences
        }
      }
    });
  }

  // Create industry-specific budgets
  const grassrootsBudgets = [
    {
      category: BudgetCategory.PARTS_AND_MATERIALS,
      amountCents: 50000 * 100,
      period: "MONTHLY" as const,
      spentCents: 35000 * 100,
      utilization: 70.0,
      alertThreshold: 80,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      category: BudgetCategory.EQUIPMENT,
      amountCents: 20000 * 100,
      period: "MONTHLY" as const,
      spentCents: 15000 * 100,
      utilization: 75.0,
      alertThreshold: 85,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      category: BudgetCategory.MARKETING,
      amountCents: 15000 * 100,
      period: "MONTHLY" as const,
      spentCents: 10000 * 100,
      utilization: 66.7,
      alertThreshold: 75,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ];

  const wekfestBudgets = [
    {
      category: BudgetCategory.EQUIPMENT,
      amountCents: 100000 * 100,
      period: "MONTHLY" as const,
      spentCents: 75000 * 100,
      utilization: 75.0,
      alertThreshold: 85,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      category: BudgetCategory.MARKETING,
      amountCents: 50000 * 100,
      period: "MONTHLY" as const,
      spentCents: 35000 * 100,
      utilization: 70.0,
      alertThreshold: 80,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      category: BudgetCategory.TRAVEL,
      amountCents: 30000 * 100,
      period: "MONTHLY" as const,
      spentCents: 20000 * 100,
      utilization: 66.7,
      alertThreshold: 75,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ];

  const ultraceBudgets = [
    {
      category: BudgetCategory.FABRIC_AND_MATERIALS,
      amountCents: 30000 * 100,
      period: "MONTHLY" as const,
      spentCents: 20000 * 100,
      utilization: 66.7,
      alertThreshold: 75,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      category: BudgetCategory.MANUFACTURING,
      amountCents: 40000 * 100,
      period: "MONTHLY" as const,
      spentCents: 28000 * 100,
      utilization: 70.0,
      alertThreshold: 80,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      category: BudgetCategory.MARKETING,
      amountCents: 25000 * 100,
      period: "MONTHLY" as const,
      spentCents: 17000 * 100,
      utilization: 68.0,
      alertThreshold: 75,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ];

  const lbwkBudgets = [
    {
      category: BudgetCategory.PARTS_AND_MATERIALS,
      amountCents: 100000 * 100,
      period: "MONTHLY" as const,
      spentCents: 70000 * 100,
      utilization: 70.0,
      alertThreshold: 80,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      category: BudgetCategory.EQUIPMENT,
      amountCents: 50000 * 100,
      period: "MONTHLY" as const,
      spentCents: 35000 * 100,
      utilization: 70.0,
      alertThreshold: 80,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      category: BudgetCategory.MARKETING,
      amountCents: 30000 * 100,
      period: "MONTHLY" as const,
      spentCents: 20000 * 100,
      utilization: 66.7,
      alertThreshold: 75,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ];

  const airbusBudgets = [
    {
      category: BudgetCategory.PARTS_AND_MATERIALS,
      amountCents: 1000000 * 100,
      period: "MONTHLY" as const,
      spentCents: 750000 * 100,
      utilization: 75.0,
      alertThreshold: 85,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      category: BudgetCategory.EQUIPMENT,
      amountCents: 500000 * 100,
      period: "MONTHLY" as const,
      spentCents: 350000 * 100,
      utilization: 70.0,
      alertThreshold: 80,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      category: BudgetCategory.TRAINING,
      amountCents: 100000 * 100,
      period: "MONTHLY" as const,
      spentCents: 70000 * 100,
      utilization: 70.0,
      alertThreshold: 80,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ];

  const amanBudgets = [
    {
      category: BudgetCategory.MARKETING,
      amountCents: 50000 * 100,
      period: "MONTHLY" as const,
      spentCents: 35000 * 100,
      utilization: 70.0,
      alertThreshold: 80,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      category: BudgetCategory.EQUIPMENT,
      amountCents: 30000 * 100,
      period: "MONTHLY" as const,
      spentCents: 20000 * 100,
      utilization: 66.7,
      alertThreshold: 75,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      category: BudgetCategory.TRAINING,
      amountCents: 20000 * 100,
      period: "MONTHLY" as const,
      spentCents: 15000 * 100,
      utilization: 75.0,
      alertThreshold: 80,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ];

  const debeersBudgets = [
    {
      category: BudgetCategory.DIAMOND_INVENTORY,
      amountCents: 1000000 * 100,
      period: "MONTHLY" as const,
      spentCents: 750000 * 100,
      utilization: 75.0,
      alertThreshold: 85,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      category: BudgetCategory.EQUIPMENT,
      amountCents: 500000 * 100,
      period: "MONTHLY" as const,
      spentCents: 350000 * 100,
      utilization: 70.0,
      alertThreshold: 80,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      category: BudgetCategory.MARKETING,
      amountCents: 200000 * 100,
      period: "MONTHLY" as const,
      spentCents: 150000 * 100,
      utilization: 75.0,
      alertThreshold: 85,
      lastAlert: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ];

  // Create budgets for each organization
  await prisma.budget.createMany({
    data: grassrootsBudgets.map(budget => ({ ...budget, orgId: orgs[0].id })),
  });
  await prisma.budget.createMany({
    data: wekfestBudgets.map(budget => ({ ...budget, orgId: orgs[1].id })),
  });
  await prisma.budget.createMany({
    data: ultraceBudgets.map(budget => ({ ...budget, orgId: orgs[2].id })),
  });
  await prisma.budget.createMany({
    data: lbwkBudgets.map(budget => ({ ...budget, orgId: orgs[3].id })),
  });
  await prisma.budget.createMany({
    data: airbusBudgets.map(budget => ({ ...budget, orgId: orgs[4].id })),
  });
  await prisma.budget.createMany({
    data: amanBudgets.map(budget => ({ ...budget, orgId: orgs[5].id })),
  });
  await prisma.budget.createMany({
    data: debeersBudgets.map(budget => ({ ...budget, orgId: orgs[6].id })),
  });

  // Create industry-specific cards with usage patterns
  const grassrootsCards = [
    {
      nickname: "Executive Card",
      stripeCardId: `card_grassroots_1`,
      last4: "4242",
      network: CardNetwork.AMEX,
      expirationMonth: 12,
      expirationYear: 2025,
      status: CardStatus.ACTIVE,
      type: CardType.CORPORATE,
      monthlyLimit: 50000 * 100,
      totalSpent: 35000 * 100,
      averageTransaction: 2500 * 100,
      lastUsed: new Date(),
      statusHistory: {
        create: [
          {
            status: CardStatus.ACTIVE,
            reason: "Card activated",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
    {
      nickname: "Manager Card",
      stripeCardId: `card_grassroots_2`,
      last4: "5678",
      network: CardNetwork.VISA,
      expirationMonth: 12,
      expirationYear: 2025,
      status: CardStatus.ACTIVE,
      type: CardType.CORPORATE,
      monthlyLimit: 20000 * 100,
      totalSpent: 15000 * 100,
      averageTransaction: 2000 * 100,
      lastUsed: new Date(),
      statusHistory: {
        create: [
          {
            status: CardStatus.ACTIVE,
            reason: "Card activated",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
  ];

  const wekfestCards = [
    {
      nickname: "Director Card",
      stripeCardId: `card_wekfest_1`,
      last4: "1234",
      network: CardNetwork.MASTERCARD,
      expirationMonth: 12,
      expirationYear: 2025,
      status: CardStatus.ACTIVE,
      type: CardType.CORPORATE,
      monthlyLimit: 100000 * 100,
      totalSpent: 75000 * 100,
      averageTransaction: 15000 * 100,
      lastUsed: new Date(),
      statusHistory: {
        create: [
          {
            status: CardStatus.ACTIVE,
            reason: "Card activated",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
    {
      nickname: "Coordinator Card",
      stripeCardId: `card_wekfest_2`,
      last4: "5678",
      network: CardNetwork.VISA,
      expirationMonth: 12,
      expirationYear: 2025,
      status: CardStatus.ACTIVE,
      type: CardType.CORPORATE,
      monthlyLimit: 50000 * 100,
      totalSpent: 30000 * 100,
      averageTransaction: 6000 * 100,
      lastUsed: new Date(),
      statusHistory: {
        create: [
          {
            status: CardStatus.ACTIVE,
            reason: "Card activated",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
  ];

  const ultraceCards = [
    {
      nickname: "Senior Manager Card",
      stripeCardId: `card_ultrace_1`,
      last4: "1234",
      network: CardNetwork.MASTERCARD,
      expirationMonth: 12,
      expirationYear: 2025,
      status: CardStatus.ACTIVE,
      type: CardType.CORPORATE,
      monthlyLimit: 30000 * 100,
      totalSpent: 15000 * 100,
      averageTransaction: 1000 * 100,
      lastUsed: new Date(),
      statusHistory: {
        create: [
          {
            status: CardStatus.ACTIVE,
            reason: "Card activated",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
    {
      nickname: "Team Lead Card",
      stripeCardId: `card_ultrace_2`,
      last4: "5678",
      network: CardNetwork.VISA,
      expirationMonth: 12,
      expirationYear: 2025,
      status: CardStatus.ACTIVE,
      type: CardType.CORPORATE,
      monthlyLimit: 50000 * 100,
      totalSpent: 30000 * 100,
      averageTransaction: 2000 * 100,
      lastUsed: new Date(),
      statusHistory: {
        create: [
          {
            status: CardStatus.ACTIVE,
            reason: "Card activated",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
    {
      nickname: "Staff Card",
      stripeCardId: `card_ultrace_3`,
      last4: "9012",
      network: CardNetwork.VISA,
      expirationMonth: 12,
      expirationYear: 2025,
      status: CardStatus.ACTIVE,
      type: CardType.EMPLOYEE,
      monthlyLimit: 15000 * 100,
      totalSpent: 8000 * 100,
      averageTransaction: 1600 * 100,
      lastUsed: new Date(),
      statusHistory: {
        create: [
          {
            status: CardStatus.ACTIVE,
            reason: "Card activated",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
  ];

  const lbwkCards = [
    {
      nickname: "Senior Director Card",
      stripeCardId: `card_lbwk_1`,
      last4: "1234",
      network: CardNetwork.AMEX,
      expirationMonth: 12,
      expirationYear: 2025,
      status: CardStatus.ACTIVE,
      type: CardType.CORPORATE,
      monthlyLimit: 100000 * 100,
      totalSpent: 75000 * 100,
      averageTransaction: 5000 * 100,
      lastUsed: new Date(),
      statusHistory: {
        create: [
          {
            status: CardStatus.ACTIVE,
            reason: "Card activated",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
    {
      nickname: "Manager Card",
      stripeCardId: `card_lbwk_2`,
      last4: "5678",
      network: CardNetwork.VISA,
      expirationMonth: 12,
      expirationYear: 2025,
      status: CardStatus.ACTIVE,
      type: CardType.CORPORATE,
      monthlyLimit: 50000 * 100,
      totalSpent: 35000 * 100,
      averageTransaction: 3000 * 100,
      lastUsed: new Date(),
      statusHistory: {
        create: [
          {
            status: CardStatus.ACTIVE,
            reason: "Card activated",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
  ];

  const airbusCards = [
    {
      nickname: "Executive Card",
      stripeCardId: `card_airbus_1`,
      last4: "1234",
      network: CardNetwork.AMEX,
      expirationMonth: 12,
      expirationYear: 2025,
      status: CardStatus.ACTIVE,
      type: CardType.CORPORATE,
      monthlyLimit: 1000000 * 100,
      totalSpent: 750000 * 100,
      averageTransaction: 50000 * 100,
      lastUsed: new Date(),
      statusHistory: {
        create: [
          {
            status: CardStatus.ACTIVE,
            reason: "Card activated",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
    {
      nickname: "Director Card",
      stripeCardId: `card_airbus_2`,
      last4: "5678",
      network: CardNetwork.MASTERCARD,
      expirationMonth: 12,
      expirationYear: 2025,
      status: CardStatus.ACTIVE,
      type: CardType.CORPORATE,
      monthlyLimit: 500000 * 100,
      totalSpent: 350000 * 100,
      averageTransaction: 25000 * 100,
      lastUsed: new Date(),
      statusHistory: {
        create: [
          {
            status: CardStatus.ACTIVE,
            reason: "Card activated",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
  ];

  const amanCards = [
    {
      nickname: "Executive Card",
      stripeCardId: `card_aman_1`,
      last4: "1234",
      network: CardNetwork.AMEX,
      expirationMonth: 12,
      expirationYear: 2025,
      status: CardStatus.ACTIVE,
      type: CardType.CORPORATE,
      monthlyLimit: 50000 * 100,
      totalSpent: 35000 * 100,
      averageTransaction: 5000 * 100,
      lastUsed: new Date(),
      statusHistory: {
        create: [
          {
            status: CardStatus.ACTIVE,
            reason: "Card activated",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
    {
      nickname: "Manager Card",
      stripeCardId: `card_aman_2`,
      last4: "5678",
      network: CardNetwork.VISA,
      expirationMonth: 12,
      expirationYear: 2025,
      status: CardStatus.ACTIVE,
      type: CardType.CORPORATE,
      monthlyLimit: 30000 * 100,
      totalSpent: 20000 * 100,
      averageTransaction: 3000 * 100,
      lastUsed: new Date(),
      statusHistory: {
        create: [
          {
            status: CardStatus.ACTIVE,
            reason: "Card activated",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
  ];

  const debeersCards = [
    {
      nickname: "Executive Card",
      stripeCardId: `card_debeers_1`,
      last4: "1234",
      network: CardNetwork.AMEX,
      expirationMonth: 12,
      expirationYear: 2025,
      status: CardStatus.ACTIVE,
      type: CardType.CORPORATE,
      monthlyLimit: 1000000 * 100,
      totalSpent: 750000 * 100,
      averageTransaction: 50000 * 100,
      lastUsed: new Date(),
      statusHistory: {
        create: [
          {
            status: CardStatus.ACTIVE,
            reason: "Card activated",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
    {
      nickname: "Director Card",
      stripeCardId: `card_debeers_2`,
      last4: "5678",
      network: CardNetwork.MASTERCARD,
      expirationMonth: 12,
      expirationYear: 2025,
      status: CardStatus.ACTIVE,
      type: CardType.CORPORATE,
      monthlyLimit: 500000 * 100,
      totalSpent: 350000 * 100,
      averageTransaction: 25000 * 100,
      lastUsed: new Date(),
      statusHistory: {
        create: [
          {
            status: CardStatus.ACTIVE,
            reason: "Card activated",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
  ];

  // Create cards with their status history
  for (const card of [...grassrootsCards, ...wekfestCards, ...ultraceCards, ...lbwkCards, ...airbusCards, ...amanCards, ...debeersCards]) {
    const { statusHistory, ...cardData } = card;
    
    // Try to find organization ID from card stripeCardId
    const orgId = findOrgIdFromStripeCardId(card.stripeCardId);
    
    if (!orgId) {
      console.warn(`Could not find organization for card ${card.nickname} (${card.stripeCardId})`);
      continue;
    }

    await prisma.card.create({
      data: {
        ...cardData,
        org: {
          connect: { id: orgId }
        },
        statusHistory: {
          create: statusHistory.create
        }
      }
    });
  }

  // Create industry-specific policies
  const grassrootsPolicies = [
    {
      name: "Production Supplies Limit",
      expression: "amount < 50000 && category == 'PARTS_AND_MATERIALS' && (hour >= 8 && hour <= 18)",
      isActive: true,
    },
    {
      name: "Equipment Approval Required",
      expression: "category == 'EQUIPMENT' && amount > 20000 && (dayOfWeek != 'SUNDAY')",
      isActive: true,
    },
    {
      name: "Marketing Policy",
      expression: "category == 'MARKETING' && amount < 15000 && (dayOfWeek != 'SUNDAY')",
      isActive: true,
    }
  ];

  const wekfestPolicies = [
    {
      name: "Equipment Purchase Limit",
      expression: "amount < 100000 && category == 'EQUIPMENT' && (hour >= 9 && hour <= 17)",
      isActive: true,
    },
    {
      name: "Marketing Approval Required",
      expression: "category == 'MARKETING' && amount > 50000 && (dayOfWeek != 'SUNDAY')",
      isActive: true,
    },
    {
      name: "Travel Policy",
      expression: "category == 'TRAVEL' && amount < 30000 && location in ['Los Angeles', 'New York', 'Tokyo', 'Dubai', 'Paris']",
      isActive: true,
    }
  ];

  const ultracePolicies = [
    {
      name: "Materials Purchase Limit",
      expression: "amount < 30000 && category == 'FABRIC_AND_MATERIALS' && (hour >= 9 && hour <= 17)",
      isActive: true,
    },
    {
      name: "Manufacturing Equipment",
      expression: "category == 'MANUFACTURING' && amount < 40000 && (dayOfWeek != 'SUNDAY')",
      isActive: true,
    },
    {
      name: "Marketing Policy",
      expression: "category == 'MARKETING' && amount < 25000 && (dayOfWeek != 'SUNDAY')",
      isActive: true,
    }
  ];

  const lbwkPolicies = [
    {
      name: "Parts Purchase Limit",
      expression: "amount < 100000 && category == 'PARTS_AND_MATERIALS' && (hour >= 9 && hour <= 18)",
      isActive: true,
    },
    {
      name: "Equipment Approval Required",
      expression: "category == 'EQUIPMENT' && amount > 50000 && (dayOfWeek != 'SUNDAY')",
      isActive: true,
    },
    {
      name: "Marketing Policy",
      expression: "category == 'MARKETING' && amount < 30000 && (dayOfWeek != 'SUNDAY')",
      isActive: true,
    }
  ];

  const airbusPolicies = [
    {
      name: "Parts Purchase Limit",
      expression: "amount < 1000000 && category == 'PARTS_AND_MATERIALS' && (hour >= 8 && hour <= 20)",
      isActive: true,
    },
    {
      name: "Equipment Approval Required",
      expression: "category == 'EQUIPMENT' && amount > 500000 && (dayOfWeek != 'SUNDAY')",
      isActive: true,
    },
    {
      name: "Training Policy",
      expression: "category == 'TRAINING' && amount < 100000 && (dayOfWeek != 'SUNDAY')",
      isActive: true,
    }
  ];

  const amanPolicies = [
    {
      name: "Marketing Limit",
      expression: "amount < 50000 && category == 'MARKETING' && (hour >= 9 && hour <= 18)",
      isActive: true,
    },
    {
      name: "Equipment Approval Required",
      expression: "category == 'EQUIPMENT' && amount > 30000 && (dayOfWeek != 'FRIDAY')",
      isActive: true,
    },
    {
      name: "Training Policy",
      expression: "category == 'TRAINING' && amount < 20000 && (dayOfWeek != 'FRIDAY')",
      isActive: true,
    }
  ];

  const debeersPolicies = [
    {
      name: "Diamond Trading Limit",
      expression: "amount < 1000000 && category == 'DIAMOND_INVENTORY' && (hour >= 8 && hour <= 18)",
      isActive: true,
    },
    {
      name: "Mining Equipment Approval",
      expression: "category == 'EQUIPMENT' && amount > 500000 && (dayOfWeek != 'SUNDAY')",
      isActive: true,
    },
    {
      name: "Marketing Policy",
      expression: "category == 'MARKETING' && amount < 200000 && (dayOfWeek != 'SUNDAY')",
      isActive: true,
    }
  ];

  // Create policies for each organization
  await prisma.policy.createMany({
    data: grassrootsPolicies.map(policy => ({ ...policy, orgId: orgs[0].id })),
  });
  await prisma.policy.createMany({
    data: wekfestPolicies.map(policy => ({ ...policy, orgId: orgs[1].id })),
  });
  await prisma.policy.createMany({
    data: ultracePolicies.map(policy => ({ ...policy, orgId: orgs[2].id })),
  });
  await prisma.policy.createMany({
    data: lbwkPolicies.map(policy => ({ ...policy, orgId: orgs[3].id })),
  });
  await prisma.policy.createMany({
    data: airbusPolicies.map(policy => ({ ...policy, orgId: orgs[4].id })),
  });
  await prisma.policy.createMany({
    data: amanPolicies.map(policy => ({ ...policy, orgId: orgs[5].id })),
  });
  await prisma.policy.createMany({
    data: debeersPolicies.map(policy => ({ ...policy, orgId: orgs[6].id })),
  });

  // Create industry-specific transactions
  const grassrootsMerchants = [
    "Cannabis Supplies Co", "Lab Equipment Inc", "Green Tech Solutions", "Quality Control Labs",
    "Marketing Partners", "Security Systems", "Compliance Consultants", "Distribution Network",
    "Denver Cannabis", "Colorado Growers", "Mountain Labs", "Green Valley Supplies"
  ];
  const grassrootsCategories = [
    BudgetCategory.PARTS_AND_MATERIALS,
    BudgetCategory.EQUIPMENT,
    BudgetCategory.MARKETING
  ];

  const wekfestMerchants = [
    "Event Equipment Rentals", "Stage & Sound Systems", "Security Services", "Catering Services",
    "Marketing Agencies", "Travel Agencies", "Venue Partners", "Media Partners",
    "LA Auto Shows", "Tokyo Drift Events", "Dubai Car Week", "Paris Auto Expo"
  ];
  const wekfestCategories = [
    BudgetCategory.EQUIPMENT,
    BudgetCategory.MARKETING,
    BudgetCategory.TRAVEL
  ];

  const ultraceMerchants = [
    "Fabric.com", "Mood Fabrics", "Sewing Machines Plus", "Shopify", "Instagram Ads",
    "Facebook Ads", "Google Ads", "LinkedIn Premium", "Uber", "Airbnb",
    "LA Textile District", "Fashion District LA", "California Fabrics"
  ];
  const ultraceCategories = [
    BudgetCategory.FABRIC_AND_MATERIALS,
    BudgetCategory.MANUFACTURING,
    BudgetCategory.MARKETING,
    BudgetCategory.RETAIL_SPACE,
    BudgetCategory.TRAVEL
  ];

  const lbwkMerchants = [
    "Rays Engineering", "Bridgestone", "Tein", "HKS", "Apex'i",
    "Mitsubishi Motors", "Nissan", "Toyota", "Honda", "Mazda",
    "Tokyo Auto Parts", "Osaka Performance", "Kyoto Custom"
  ];
  const lbwkCategories = [
    BudgetCategory.PARTS_AND_MATERIALS,
    BudgetCategory.EQUIPMENT,
    BudgetCategory.MARKETING
  ];

  const airbusMerchants = [
    "Boeing", "Lockheed Martin", "Rolls-Royce", "GE Aviation", "Safran",
    "Honeywell", "UTC Aerospace", "Thales", "Lufthansa Technik", "Air France Industries",
    "European Aviation", "Aerospace Components", "Aviation Supplies"
  ];
  const airbusCategories = [
    BudgetCategory.PARTS_AND_MATERIALS,
    BudgetCategory.EQUIPMENT,
    BudgetCategory.TRAINING
  ];

  const amanMerchants = [
    "Dubai Mall", "Burj Al Arab", "Emirates Airlines", "Dubai Tourism", "Luxury Hotels",
    "Fine Dining", "Spa Supplies", "Guest Services", "Concierge Services", "VIP Transport",
    "Dubai Luxury", "Premium Services", "Exclusive Events"
  ];
  const amanCategories = [
    BudgetCategory.MARKETING,
    BudgetCategory.EQUIPMENT,
    BudgetCategory.TRAINING
  ];

  const debeersMerchants = [
    "Alrosa", "Rio Tinto", "Petra Diamonds", "Dominion Diamond Mines",
    "Mining Equipment Corp", "Diamond Grading Labs", "Security Services",
    "Marketing Partners", "Travel Agencies", "Luxury Retail Partners",
    "London Diamond Exchange", "Antwerp Diamond Center", "Dubai Diamond Exchange"
  ];
  const debeersCategories = [
    BudgetCategory.DIAMOND_INVENTORY,
    BudgetCategory.EQUIPMENT,
    BudgetCategory.MARKETING
  ];

  // Helper function to create transactions with enhanced data
  async function createTransactions(orgId: string, cardId: string, merchants: string[], categories: BudgetCategory[]) {
    const statuses = ["PENDING", "APPROVED", "DECLINED"] as const;
    const locations = ["Houston", "Dallas", "Austin", "San Antonio", "New York", "Los Angeles", "Chicago", "Miami"];
    
    // Common tags for each category
    const categoryTags: Record<BudgetCategory, string[]> = {
      [BudgetCategory.PARTS_AND_MATERIALS]: ["inventory", "supplies", "maintenance"],
      [BudgetCategory.EQUIPMENT]: ["capital", "tools", "infrastructure"],
      [BudgetCategory.TRAVEL]: ["business-trip", "meeting", "conference"],
      [BudgetCategory.TRAINING]: ["education", "certification", "workshop"],
      [BudgetCategory.MARKETING]: ["advertising", "promotion", "branding"],
      [BudgetCategory.DIAMOND_INVENTORY]: ["inventory", "luxury", "high-value"],
      [BudgetCategory.SECURITY]: ["safety", "protection", "equipment"],
      [BudgetCategory.INSURANCE]: ["coverage", "protection", "risk-management"],
      [BudgetCategory.FABRIC_AND_MATERIALS]: ["inventory", "raw-materials", "production"],
      [BudgetCategory.MANUFACTURING]: ["production", "equipment", "operations"],
      [BudgetCategory.RETAIL_SPACE]: ["facility", "store", "display"]
    };

    // Common notes templates with more specific details
    const noteTemplates = [
      "Monthly recurring purchase - Office supplies and maintenance",
      "Emergency replacement needed - Critical equipment failure",
      "Team building activity - Quarterly department meeting",
      "Client meeting expenses - Project kickoff lunch",
      "Annual maintenance - Equipment service and calibration",
      "Equipment upgrade - Performance optimization",
      "Training session materials - New software implementation",
      "Marketing campaign materials - Q2 product launch"
    ];

    // Category-specific amount ranges with realistic price points
    const amountRanges: Record<BudgetCategory, { min: number; max: number; commonPoints: number[] }> = {
      [BudgetCategory.PARTS_AND_MATERIALS]: { 
        min: 49.99, 
        max: 499.99, 
        commonPoints: [49.99, 99.99, 149.95, 199.99, 249.95, 299.99, 399.99, 499.99] 
      },
      [BudgetCategory.EQUIPMENT]: { 
        min: 199.99, 
        max: 1999.99, 
        commonPoints: [199.99, 299.99, 499.99, 799.99, 999.99, 1499.99, 1999.99] 
      },
      [BudgetCategory.TRAVEL]: { 
        min: 99.99, 
        max: 999.99, 
        commonPoints: [99.99, 149.99, 199.99, 299.99, 499.99, 799.99, 999.99] 
      },
      [BudgetCategory.TRAINING]: { 
        min: 49.99, 
        max: 499.99, 
        commonPoints: [49.99, 99.99, 149.99, 199.99, 299.99, 399.99, 499.99] 
      },
      [BudgetCategory.MARKETING]: { 
        min: 99.99, 
        max: 1999.99, 
        commonPoints: [99.99, 199.99, 499.99, 799.99, 999.99, 1499.99, 1999.99] 
      },
      [BudgetCategory.DIAMOND_INVENTORY]: { 
        min: 999.99, 
        max: 9999.99, 
        commonPoints: [999.99, 1999.99, 2999.99, 4999.99, 7999.99, 9999.99] 
      },
      [BudgetCategory.SECURITY]: { 
        min: 199.99, 
        max: 1999.99, 
        commonPoints: [199.99, 299.99, 499.99, 799.99, 999.99, 1499.99, 1999.99] 
      },
      [BudgetCategory.INSURANCE]: { 
        min: 99.99, 
        max: 999.99, 
        commonPoints: [99.99, 149.99, 199.99, 299.99, 499.99, 799.99, 999.99] 
      },
      [BudgetCategory.FABRIC_AND_MATERIALS]: { 
        min: 49.99, 
        max: 499.99, 
        commonPoints: [49.99, 99.99, 149.99, 199.99, 299.99, 399.99, 499.99] 
      },
      [BudgetCategory.MANUFACTURING]: { 
        min: 199.99, 
        max: 1999.99, 
        commonPoints: [199.99, 299.99, 499.99, 799.99, 999.99, 1499.99, 1999.99] 
      },
      [BudgetCategory.RETAIL_SPACE]: { 
        min: 99.99, 
        max: 999.99, 
        commonPoints: [99.99, 149.99, 199.99, 299.99, 499.99, 799.99, 999.99] 
      }
    };

    // Category-specific descriptions with more detail
    const descriptions: Record<BudgetCategory, string[]> = {
      [BudgetCategory.PARTS_AND_MATERIALS]: [
        "Auto parts purchase - Engine components",
        "Maintenance supplies - Filters and fluids",
        "Repair materials - Body work supplies",
        "Spare parts inventory - Electrical components",
        "Tools and equipment - Diagnostic tools"
      ],
      [BudgetCategory.EQUIPMENT]: [
        "New machinery purchase - Production line upgrade",
        "Equipment upgrade - Performance optimization",
        "Technical tools - Precision measurement",
        "Safety equipment - Personal protective gear",
        "Diagnostic tools - Advanced testing equipment"
      ],
      [BudgetCategory.TRAVEL]: [
        "Business trip expenses - Client meeting in New York",
        "Hotel accommodation - Conference stay",
        "Airline tickets - International business class",
        "Car rental - Executive vehicle",
        "Meals during travel - Team dinner"
      ],
      [BudgetCategory.TRAINING]: [
        "Professional certification - Advanced technical course",
        "Workshop registration - Industry conference",
        "Online course subscription - Software training",
        "Training materials - Course books and resources",
        "Conference attendance - Annual industry summit"
      ],
      [BudgetCategory.MARKETING]: [
        "Digital advertising campaign - Social media promotion",
        "Social media promotion - Product launch",
        "Print materials - Brochures and catalogs",
        "Event sponsorship - Industry trade show",
        "Brand merchandise - Corporate gifts"
      ],
      [BudgetCategory.DIAMOND_INVENTORY]: [
        "Diamond purchase - Premium quality stones",
        "Gemstone acquisition - Investment grade",
        "Jewelry inventory - Luxury collection",
        "Precious stones - Certified diamonds",
        "Collection pieces - Limited edition"
      ],
      [BudgetCategory.SECURITY]: [
        "Security system upgrade - Access control",
        "Surveillance equipment - HD cameras",
        "Access control system - Biometric readers",
        "Security personnel - Specialized training",
        "Safety measures - Emergency response"
      ],
      [BudgetCategory.INSURANCE]: [
        "Property insurance - Building coverage",
        "Liability coverage - Business protection",
        "Asset protection - Equipment insurance",
        "Business insurance - Comprehensive plan",
        "Risk management - Policy renewal"
      ],
      [BudgetCategory.FABRIC_AND_MATERIALS]: [
        "Fabric purchase - Premium textiles",
        "Raw materials - Production supplies",
        "Textile supplies - Design materials",
        "Design materials - Pattern making",
        "Production supplies - Manufacturing"
      ],
      [BudgetCategory.MANUFACTURING]: [
        "Production equipment - Assembly line",
        "Manufacturing supplies - Raw materials",
        "Assembly tools - Specialized equipment",
        "Quality control equipment - Testing devices",
        "Production line upgrade - Automation"
      ],
      [BudgetCategory.RETAIL_SPACE]: [
        "Store renovation - Interior design",
        "Display fixtures - Product showcases",
        "Retail equipment - Point of sale",
        "Store supplies - Daily operations",
        "Shop maintenance - Regular service"
      ]
    };

    // Enhanced merchant names with suffixes and locations
    const merchantSuffixes = ["Inc.", "LLC", "& Co.", "Group", "International", "Solutions", "Systems", "Technologies"];
    const merchantPrefixes = ["Premium", "Professional", "Advanced", "Elite", "Global", "United", "American", "European"];
    const merchantTypes = ["Supply", "Services", "Equipment", "Solutions", "Systems", "Technologies", "Resources", "Products"];

    // Generate enhanced merchant names
    const enhancedMerchants = merchants.map(merchant => {
      const suffix = merchantSuffixes[Math.floor(Math.random() * merchantSuffixes.length)];
      const prefix = Math.random() > 0.7 ? merchantPrefixes[Math.floor(Math.random() * merchantPrefixes.length)] + " " : "";
      const type = Math.random() > 0.5 ? " " + merchantTypes[Math.floor(Math.random() * merchantTypes.length)] : "";
      return `${prefix}${merchant}${type} ${suffix}`;
    });

    // Policy violation reasons
    const violationReasons = [
      "Amount exceeds category limit",
      "Unauthorized merchant category",
      "Transaction outside business hours",
      "Location not in approved regions",
      "Multiple transactions in short period",
      "Suspicious purchase pattern",
      "Missing required documentation",
      "Category budget exceeded"
    ];

    // Generate random dates within the last 3 months
    const getRandomDate = () => {
      const now = new Date();
      const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
      return new Date(threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime()));
    };

    // Generate a mock receipt URL
    const getReceiptUrl = (merchant: string, date: Date) => {
      const timestamp = date.getTime();
      return `https://receipts.example.com/${orgId}/${merchant.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`;
    };

    const transactions = Array.from({ length: 10 }, (_, i) => {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const range = amountRanges[category];
      // Use common price points 70% of the time, random amount 30% of the time
      const amountCents = Math.random() > 0.3 
        ? range.commonPoints[Math.floor(Math.random() * range.commonPoints.length)] * 100
        : (Math.floor(Math.random() * (range.max - range.min + 1)) + range.min) * 100;
      const merchant = enhancedMerchants[Math.floor(Math.random() * enhancedMerchants.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)] as TxnStatus;
      const hasViolation = Math.random() > 0.7;
      const createdAt = getRandomDate();
      const receiptUrl = getReceiptUrl(merchant, createdAt);
      const isRecurring = Math.random() > 0.8;
      const expenseType = isRecurring ? ExpenseType.SUBSCRIPTION : ExpenseType.ONE_TIME;
      
      // Select random tags for this category
      const tags = categoryTags[category]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1);

      // Add urgency tag for some transactions
      if (Math.random() > 0.7) {
        tags.push("urgent");
      }

      return {
        orgId,
        cardId,
        stripeAuthId: `auth_${orgId}_${cardId}_${i}`,
        amountCents,
        merchant,
        category,
        description: `${descriptions[category][Math.floor(Math.random() * descriptions[category].length)]} at ${merchant}`,
        location,
        status,
        reason: hasViolation ? violationReasons[Math.floor(Math.random() * violationReasons.length)] : null,
        createdAt,
        receiptUrl,
        isRecurring,
        expenseType,
        notes: noteTemplates[Math.floor(Math.random() * noteTemplates.length)],
        tags,
        attachments: [receiptUrl],
        approvedBy: status === "APPROVED" ? "admin" : null,
        rejectedBy: status === "DECLINED" ? "admin" : null,
      };
    });
    await prisma.transaction.createMany({ data: transactions });
  }

  // Create transactions for each organization
  for (const org of orgs) {
    const cards = await prisma.card.findMany({ where: { orgId: org.id } });
    for (const card of cards) {
      if (org.name === "Grassroots Inc") {
        await createTransactions(org.id, card.id, grassrootsMerchants, grassrootsCategories);
      } else if (org.name === "Wekfest") {
        await createTransactions(org.id, card.id, wekfestMerchants, wekfestCategories);
      } else if (org.name === "Ultrace") {
        await createTransactions(org.id, card.id, ultraceMerchants, ultraceCategories);
      } else if (org.name === "Liberty Walk") {
        await createTransactions(org.id, card.id, lbwkMerchants, lbwkCategories);
      } else if (org.name === "Airbus") {
        await createTransactions(org.id, card.id, airbusMerchants, airbusCategories);
      } else if (org.name === "AMAN") {
        await createTransactions(org.id, card.id, amanMerchants, amanCategories);
      } else if (org.name === "De Beers") {
        await createTransactions(org.id, card.id, debeersMerchants, debeersCategories);
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

    
