import { CreditCard, FileText } from "lucide-react";
import SubmitButton from "@/components/portal/SubmitButton";
import { StatusBadge, btnGold } from "@/components/portal/ui";
import { payAction } from "@/app/actions/events";
import { formatMoney } from "@/lib/settings";

// Shows what is owed and starts checkout through the configured payment provider.
export default function PaymentCard({
  purpose,
  refId,
  amount,
  currency,
  status,
  back,
  note,
}: {
  purpose: "conference" | "technext" | "event";
  refId: string;
  amount: number;
  currency: string;
  status: string;
  back: string;
  note?: string;
}) {
  if (status === "not_required") return null;
  const due = status === "unpaid" || status === "pending" || status === "failed";
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
      <div className="flex items-start gap-3">
        <CreditCard className="mt-0.5 h-5 w-5 text-amber-700" />
        <div>
          <div className="flex flex-wrap items-center gap-2 font-bold text-brand-primary">
            {formatMoney(amount, currency)} <StatusBadge status={status} />
          </div>
          <p className="text-sm text-slate-600">
            {status === "pending"
              ? "Payment started. It is confirmed once the organisers reconcile it."
              : due
                ? note ?? "Complete the payment to confirm your registration."
                : "Payment received. Thank you!"}
          </p>
        </div>
      </div>
      {status === "paid" && (
        <a href={`/api/invoices?purpose=${purpose}&ref=${encodeURIComponent(refId)}`} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <FileText className="h-4 w-4" /> Download invoice
        </a>
      )}
      {due && (
        <form action={payAction}>
          <input type="hidden" name="purpose" value={purpose} />
          <input type="hidden" name="ref" value={refId} />
          <input type="hidden" name="back" value={back} />
          <SubmitButton className={btnGold} pendingText="Opening payment…">
            {status === "pending" ? "Pay again" : "Pay now"}
          </SubmitButton>
        </form>
      )}
    </div>
  );
}
