# Swipr - Corporate Card Management Platform 🚀

## Project Overview

Swipr is a full-stack corporate card management platform I developed to demonstrate my expertise in modern web development. This project showcases my ability to build complex, production-ready applications using cutting-edge technologies and best practices.

## Why I Built This

I created Swipr to solve real-world problems in corporate expense management while demonstrating my full-stack development capabilities. The project allowed me to:

- Implement complex business logic in a scalable architecture
- Design and build a secure authentication system
- Create an intuitive user interface for financial management
- Integrate multiple third-party services
- Handle real-time data processing and analytics

## Technical Deep Dive

### Architecture & Design Decisions

- **Next.js App Router**: Chose for its server components, streaming, and improved performance
- **TypeScript**: Implemented strict typing for better code reliability
- **Prisma ORM**: Selected for type-safe database operations and efficient querying
- **PostgreSQL**: Used for robust data storage and complex querying capabilities
- **NextAuth.js**: Implemented for secure, flexible authentication
- **Tailwind CSS**: Utilized for rapid, responsive UI development
- **Stripe Integration**: Built for secure payment processing
- **Supabase**: Integrated for additional data storage and real-time features

### Key Technical Challenges & Solutions

1. **Real-time Budget Tracking**
   - Implemented efficient database queries with Prisma
   - Created optimized data structures for quick calculations
   - Built caching mechanisms for performance

2. **Secure Authentication Flow**
   - Designed role-based access control
   - Implemented secure session management
   - Created SSO integration capabilities

3. **Transaction Processing**
   - Built robust error handling
   - Implemented idempotency for payment processing
   - Created audit trails for all financial operations

## Features I'm Proud Of

### 🔐 Authentication System
- Custom role-based access control
- Secure session management
- SSO integration capabilities

### 💳 Card Management
- Virtual card generation
- Real-time transaction monitoring
- Status tracking and history

### 📊 Budget Management
- Category-based budgeting
- Real-time spending analytics
- Multi-period budget support

### ⚖️ Policy Engine
- Custom rule creation
- Automated policy enforcement
- Compliance monitoring

### 📈 Analytics Dashboard
- Real-time spending insights
- Custom report generation
- Data visualization

## Technical Implementation

### Database Schema
```prisma
// Key models I designed
model User {
  id            String    @id @default(cuid())
  role          Role      @default(EMPLOYEE)
  // ... other fields
}

model Card {
  id            String    @id @default(cuid())
  status        CardStatus
  // ... other fields
}

model Budget {
  id            String    @id @default(cuid())
  category      BudgetCategory
  // ... other fields
}
```

### API Structure
```typescript
// Example of type-safe API implementation
export async function GET(req: Request) {
  const users = await prisma.user.findMany();
  return users.map((user: User) => ({
    id: user.id,
    role: user.role,
    // ... other fields
  }));
}
```

## Development Journey

### What I Learned
- Advanced TypeScript patterns and type safety
- Complex state management in Next.js
- Secure authentication implementation
- Real-time data processing
- Payment processing best practices

### Challenges Overcome
- Implementing secure financial transactions
- Building real-time analytics
- Creating an intuitive policy engine
- Optimizing database queries
- Managing complex state

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd swipr
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="your-stripe-secret"
   STRIPE_WEBHOOK_SECRET="your-webhook-secret"
   SUPABASE_URL="your-supabase-url"
   SUPABASE_KEY="your-supabase-key"
   ```

4. Initialize the database:
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

## Project Structure

```
swipr/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard pages
│   └── auth/           # Authentication pages
├── components/         # React components
├── lib/               # Utility functions
├── prisma/            # Database schema
└── public/            # Static assets
```

## Future Improvements

- Implement machine learning for spending pattern analysis
- Add mobile application support
- Enhance real-time collaboration features
- Implement advanced reporting capabilities
- Add multi-currency support

## Contact

I'm always open to discussing this project and potential opportunities. Feel free to reach out!

- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn]
- GitHub: [Your GitHub]
- Email: [Your Email]

## Demo Access

You can explore Swipr using these real accounts from our demo organizations:

### Grassroots Inc (Cannabis Production)
```
Admin:
Email: james.wilson@grassrootsinc.com
Password: Password123!

Manager:
Email: sarah.chen@grassrootsinc.com
Password: Password123!

Employee:
Email: mike.rodriguez@grassrootsinc.com
Password: Password123!
```

### Wekfest (Automotive Events)
```
Admin:
Email: david.mbeki@wekfest.com
Password: Password123!

Manager:
Email: nomsa.dlamini@wekfest.com
Password: Password123!
```

### Other Demo Organizations
- Ultrace (Fashion Manufacturing)
- Liberty Walk (Automotive Customization)
- Airbus (Aerospace Manufacturing)
- AMAN (Luxury Hospitality)
- De Beers (Diamond Mining & Trading)

> **Note:** These are real demo accounts with full functionality. Each organization has its own set of cards, budgets, and policies configured. All data is reset daily at midnight UTC.
