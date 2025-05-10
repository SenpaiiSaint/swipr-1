import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CreateBudgetButton from "@/components/CreateBudgetButton";
import DashboardClient from "@/components/DashboardClient";
import Link from "next/link";
import { Suspense } from "react";
import { formatCurrency } from "@/lib/utils";

// Loading component for dashboard sections
function DashboardSectionSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

// Empty state component for transactions
function EmptyTransactions() {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
      <p className="text-gray-500 mb-6">Get started by making your first transaction</p>
      <Link 
        href="/dashboard/cards" 
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Create Card
      </Link>
    </div>
  );
}

// Empty state component for budgets
function EmptyBudgets() {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets configured</h3>
      <p className="text-gray-500 mb-6">Set up your first budget to start tracking expenses</p>
      <CreateBudgetButton />
    </div>
  );
}

// Helper function to get industry-specific metrics
function getIndustryMetrics(industry: string | null, data: {
  totalSpent: number;
  activeCards: number;
  activePolicies: number;
  avgTransaction: number;
}) {
  const baseMetrics = [
    {
      label: "Total Spend",
      value: formatCurrency(data.totalSpent),
      iconBg: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Active Cards",
      value: data.activeCards.toString(),
      iconBg: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      label: "Active Policies",
      value: data.activePolicies.toString(),
      iconBg: "bg-gradient-to-br from-green-50 to-green-100",
      iconColor: "text-green-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Avg Transaction",
      value: formatCurrency(data.avgTransaction),
      iconBg: "bg-gradient-to-br from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ];

  // Add industry-specific metrics
  switch (industry?.toLowerCase()) {
    case 'retail':
      baseMetrics.push({
        label: "Inventory Value",
        value: formatCurrency(data.totalSpent * 0.3), // Example calculation
        iconBg: "bg-gradient-to-br from-indigo-50 to-indigo-100",
        iconColor: "text-indigo-600",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
      });
      break;
    case 'manufacturing':
      baseMetrics.push({
        label: "Production Cost",
        value: formatCurrency(data.totalSpent * 0.4), // Example calculation
        iconBg: "bg-gradient-to-br from-red-50 to-red-100",
        iconColor: "text-red-600",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        ),
      });
      break;
  }

  return baseMetrics;
}

// Helper function to get industry-specific insights
function getIndustryInsights(industry: string | null) {
  const baseInsights = [
    {
      title: "Spending Patterns",
      description: "Analyze your organization's spending patterns to identify cost-saving opportunities.",
      iconBg: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: "Policy Compliance",
      description: "Monitor policy compliance and identify areas for improvement.",
      iconBg: "bg-gradient-to-br from-green-50 to-green-100",
      iconColor: "text-green-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  // Add industry-specific insights
  switch (industry?.toLowerCase()) {
    case 'retail':
      baseInsights.push({
        title: "Inventory Management",
        description: "Optimize inventory levels and reduce carrying costs.",
        iconBg: "bg-gradient-to-br from-indigo-50 to-indigo-100",
        iconColor: "text-indigo-600",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
      });
      break;
    case 'manufacturing':
      baseInsights.push({
        title: "Production Efficiency",
        description: "Track production costs and identify efficiency improvements.",
        iconBg: "bg-gradient-to-br from-red-50 to-red-100",
        iconColor: "text-red-600",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        ),
      });
      break;
  }

  return baseInsights;
}

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  // Fetch organization details with more data
  const organization = await prisma.organization.findUnique({
    where: { id: session.user.orgId },
    include: {
      users: true,
      cards: {
        where: { status: 'ACTIVE' }
      },
      budgets: true,
      policies: {
        where: { isActive: true }
      },
      transactions: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { card: true }
      }
    }
  });

  if (!organization) {
    redirect("/auth/signin");
  }

  const budgets = organization.budgets || [];
  const transactions = organization.transactions || [];
  const activeCards = organization.cards?.length || 0;
  const activePolicies = organization.policies?.length || 0;

  // Calculate key metrics
  const totalSpent = transactions.reduce((sum: number, txn) => sum + txn.amountCents, 0);
  const avgTransaction = transactions.length > 0 ? totalSpent / transactions.length : 0;

  // Get industry-specific metrics with actual data
  const industryMetrics = getIndustryMetrics(organization.industry, {
    totalSpent,
    activeCards,
    activePolicies,
    avgTransaction
  });

  // Calculate spending by category
  const spendingByCategory = transactions.reduce((acc: Record<string, number>, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + txn.amountCents;
    return acc;
  }, {});

  // Calculate spending by card
  const spendingByCard = transactions.reduce((acc: Record<string, number>, txn) => {
    const cardName = txn.card.nickname;
    acc[cardName] = (acc[cardName] || 0) + txn.amountCents;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {organization.industry}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {organization.companySize}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {organization.subscriptionTier} Plan
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <DashboardClient industry={organization.industry} />
              <CreateBudgetButton />
            </div>
          </div>

          {/* Industry-Specific Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {industryMetrics.map((metric, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                      {metric.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                    <div className={metric.iconColor}>{metric.icon}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Company Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                  <Link 
                    href="/dashboard/transactions" 
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <Suspense fallback={<DashboardSectionSkeleton />}>
                  {transactions.length === 0 ? (
                    <EmptyTransactions />
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((txn) => (
                        <div 
                          key={txn.id} 
                          className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{txn.merchant}</p>
                              <p className="text-sm text-gray-600">{txn.card.nickname}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatCurrency(txn.amountCents)}
                            </p>
                            <p className={`text-sm ${
                              txn.status === 'APPROVED' 
                                ? 'text-green-600 bg-green-50' 
                                : txn.status === 'DECLINED'
                                ? 'text-red-600 bg-red-50'
                                : 'text-yellow-600 bg-yellow-50'
                            } px-2 py-1 rounded-full inline-block`}>
                              {txn.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Suspense>
              </div>
            </div>

            {/* Budget Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Budget Overview</h2>
                  <Link 
                    href="/dashboard/budgets" 
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <Suspense fallback={<DashboardSectionSkeleton />}>
                  {budgets.length === 0 ? (
                    <EmptyBudgets />
                  ) : (
                    <div className="space-y-6">
                      {budgets.slice(0, 3).map((budget) => (
                        <div key={budget.id} className="py-2">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900">{budget.category}</p>
                            <p className="text-sm font-medium text-gray-600">
                              {formatCurrency(budget.spentCents)} / {formatCurrency(budget.amountCents)}
                            </p>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${budget.utilization}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Suspense>
              </div>
            </div>
          </div>

          {/* Spending Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Spending by Category */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-semibold text-gray-900">Spending by Category</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(spendingByCategory).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {category.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{category}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Spending by Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-semibold text-gray-900">Spending by Card</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(spendingByCard).map(([cardName, amount]) => (
                    <div key={cardName} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-900">{cardName}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Industry-Specific Insights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-semibold text-gray-900">Industry Insights</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getIndustryInsights(organization.industry).map((insight, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 border border-gray-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 ${insight.iconBg} rounded-lg flex items-center justify-center shadow-sm`}>
                        <div className={insight.iconColor}>{insight.icon}</div>
                      </div>
                      <h3 className="font-medium text-gray-900">{insight.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

