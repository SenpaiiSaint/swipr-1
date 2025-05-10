"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Txn {
  id: string;
  orgId: string;
  merchant: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
}

export default function TxnRow({ txn }: { txn: Txn }) {
  const [status, setStatus] = useState(txn.status);

  useEffect(() => {
    // subscribe to updates on the `transaction` table
    const channel = supabase
      .channel(`realtime:public:Transaction:orgId=eq.${txn.orgId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Transaction",
          filter: `orgId=eq.${txn.orgId}`,
        },
        (payload) => {
          if (payload.new.id === txn.id) {
            setStatus(payload.new.status as Txn["status"]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [txn.id, txn.orgId]);

  return (
    <div
      className={status === "DECLINED" ? "bg-red-100 p-2" : "bg-green-100 p-2"}
    >
      {txn.merchant} — {status}
    </div>
  );
}
