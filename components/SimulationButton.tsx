'use client';

import { useState, useEffect, useCallback, useRef } from "react";

type BudgetCategory = 
  | 'PARTS_AND_MATERIALS'
  | 'EQUIPMENT'
  | 'TRAVEL'
  | 'TRAINING'
  | 'MARKETING'
  | 'DIAMOND_INVENTORY'
  | 'SECURITY'
  | 'INSURANCE'
  | 'FABRIC_AND_MATERIALS'
  | 'MANUFACTURING'
  | 'RETAIL_SPACE';

interface SimulationButtonProps {
  industry: string | null;
  onUpdate: () => void;
}

// Define transaction statuses in order
const TRANSACTION_STATUSES = ['APPROVED', 'PENDING', 'DECLINED'] as const;

type IndustryKey = 'retail' | 'manufacturing' | 'default';

// Define common merchants by industry with proper BudgetCategory types
const MERCHANTS_BY_INDUSTRY = {
  retail: [
    { name: "Amazon", category: "RETAIL_SPACE" as BudgetCategory },
    { name: "Walmart", category: "RETAIL_SPACE" as BudgetCategory },
    { name: "Target", category: "RETAIL_SPACE" as BudgetCategory },
    { name: "Office Depot", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "Staples", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "Best Buy", category: "EQUIPMENT" as BudgetCategory },
    { name: "Home Depot", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "Lowe's", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "Costco", category: "RETAIL_SPACE" as BudgetCategory },
    { name: "Sam's Club", category: "RETAIL_SPACE" as BudgetCategory }
  ],
  manufacturing: [
    { name: "Grainger", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "McMaster-Carr", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "Fastenal", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "MSC Industrial", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "Uline", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "Global Industrial", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "Motion Industries", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "Applied Industrial", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "Airgas", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "Motion & Control", category: "PARTS_AND_MATERIALS" as BudgetCategory }
  ],
  default: [
    { name: "Amazon", category: "RETAIL_SPACE" as BudgetCategory },
    { name: "Office Depot", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "Staples", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "Best Buy", category: "EQUIPMENT" as BudgetCategory },
    { name: "Home Depot", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "Lowe's", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "Costco", category: "RETAIL_SPACE" as BudgetCategory },
    { name: "Sam's Club", category: "RETAIL_SPACE" as BudgetCategory },
    { name: "Grainger", category: "PARTS_AND_MATERIALS" as BudgetCategory },
    { name: "McMaster-Carr", category: "PARTS_AND_MATERIALS" as BudgetCategory }
  ]
} as const;

// Define amount ranges by industry
const AMOUNT_RANGES = {
  retail: {
    min: 50,
    max: 5000,
    common: [100, 250, 500, 1000, 2500]
  },
  manufacturing: {
    min: 100,
    max: 10000,
    common: [250, 500, 1000, 2500, 5000]
  },
  default: {
    min: 50,
    max: 5000,
    common: [100, 250, 500, 1000, 2500]
  }
} as const;

type AmountRange = {
  min: number;
  max: number;
  common: readonly number[];
};

export default function SimulationButton({ industry, onUpdate }: SimulationButtonProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeCard, setActiveCard] = useState<{ id: string } | null>(null);
  const simulateTransactionRef = useRef<(() => Promise<void>) | undefined>(undefined);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const statusIndexRef = useRef<number>(0);

  // Fetch an active card when component mounts
  useEffect(() => {
    const fetchActiveCard = async () => {
      try {
        const response = await fetch('/api/cards');
        const data = await response.json();
        const activeCards = data.data?.filter((card: { status: string }) => card.status === 'ACTIVE') || [];
        if (activeCards.length > 0) {
          setActiveCard(activeCards[0]);
        }
      } catch (error) {
        console.error('Error fetching active card:', error);
      }
    };

    fetchActiveCard();
  }, []);

  const getNextStatus = useCallback(() => {
    const status = TRANSACTION_STATUSES[statusIndexRef.current];
    statusIndexRef.current = (statusIndexRef.current + 1) % TRANSACTION_STATUSES.length;
    return status;
  }, []);

  const getRandomAmount = useCallback((range: AmountRange) => {
    // 70% chance to use a common amount
    if (Math.random() < 0.7) {
      return range.common[Math.floor(Math.random() * range.common.length)];
    }
    // 30% chance to use a random amount
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  }, []);

  const getRandomMerchant = useCallback((industry: string | null) => {
    const normalizedIndustry = industry?.toLowerCase() as IndustryKey;
    const merchants = MERCHANTS_BY_INDUSTRY[normalizedIndustry] || MERCHANTS_BY_INDUSTRY.default;
    return merchants[Math.floor(Math.random() * merchants.length)];
  }, []);

  const simulateTransaction = useCallback(async () => {
    if (!activeCard) {
      console.error('No active card available for simulation');
      return;
    }

    const industryKey = industry?.toLowerCase() as IndustryKey;
    const amountRange = AMOUNT_RANGES[industryKey] || AMOUNT_RANGES.default;
    const amount = getRandomAmount(amountRange);
    const merchant = getRandomMerchant(industry);
    const status = getNextStatus();

    const transactionData = {
      cardId: activeCard.id,
      amountCents: amount * 100,
      merchant: merchant.name,
      category: merchant.category,
      stripeAuthId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      description: `Simulation transaction at ${merchant.name}`,
      status: status
    };

    console.log('Attempting to create transaction with data:', transactionData);

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Transaction creation failed:', {
          error: errorData.error,
          details: errorData.details,
          status: errorData.status,
          requestData: transactionData
        });
        throw new Error(errorData.error || 'Failed to create transaction');
      }

      onUpdate();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  }, [activeCard, industry, getRandomAmount, getRandomMerchant, getNextStatus, onUpdate]);

  // Update the ref whenever simulateTransaction changes
  useEffect(() => {
    simulateTransactionRef.current = simulateTransaction;
  }, [simulateTransaction]);

  // Handle simulation interval
  useEffect(() => {
    if (isSimulating && activeCard) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Run first transaction immediately
      simulateTransactionRef.current?.();
      
      // Set up new interval for 3 seconds
      intervalRef.current = setInterval(() => {
        simulateTransactionRef.current?.();
      }, 3000);
    }

    // Cleanup function to clear interval when component unmounts or simulation stops
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSimulating, activeCard]);

  const startSimulation = () => {
    if (!activeCard) {
      alert('No active card available for simulation. Please add a card first.');
      return;
    }
    setIsSimulating(true);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={isSimulating ? stopSimulation : startSimulation}
        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isSimulating ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        {isSimulating ? (
          <>
            <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
            Stop Simulation
          </>
        ) : (
          <>
            <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Start Simulation
          </>
        )}
      </button>
    </div>
  );
} 