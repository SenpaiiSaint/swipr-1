'use client';

import { useRouter } from "next/navigation";
import SimulationButton from "./SimulationButton";

interface DashboardClientProps {
  industry: string | null;
}

export default function DashboardClient({ industry }: DashboardClientProps) {
  const router = useRouter();

  const handleSimulationUpdate = () => {
    // Force a re-render of the page data
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-4">
      <SimulationButton 
        industry={industry} 
        onUpdate={handleSimulationUpdate}
      />
    </div>
  );
} 