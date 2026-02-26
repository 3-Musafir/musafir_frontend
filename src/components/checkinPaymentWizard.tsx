"use client";

import { useEffect, useMemo, useState } from "react";
import { PaymentService } from "@/services/paymentService";
import { IBankAccount, IAdminManualPayment } from "@/services/types/payment";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type PaymentMethod = "cash" | "bank_transfer" | "split_cash_bank" | "partial_cash";

type Props = {
  registrationId: string;
  name: string;
  amountDue: number;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CheckinPaymentWizard({
  registrationId,
  name,
  amountDue,
  onClose,
  onSuccess,
}: Props) {
  const { toast } = useToast();
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [cashAmount, setCashAmount] = useState<number>(amountDue);
  const [bankAmount, setBankAmount] = useState<number>(0);
  const [bankAccounts, setBankAccounts] = useState<IBankAccount[]>([]);
  const [bankAccountId, setBankAccountId] = useState<string>("");
  const [bankAccountLabel, setBankAccountLabel] = useState<string>("");
  const [cashProof, setCashProof] = useState<File | null>(null);
  const [bankProof, setBankProof] = useState<File | null>(null);
  const [adminNote, setAdminNote] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadBankAccounts = async () => {
      try {
        const res = await PaymentService.getBankAccounts();
        const data = (res as any)?.data ?? res ?? [];
        setBankAccounts(data);
        if (Array.isArray(data) && data.length > 0) {
          setBankAccountId(data[0]._id);
          setBankAccountLabel(data[0].bankName);
        }
      } catch (error) {
        // ignore; bank accounts optional for cash-only
      }
    };
    loadBankAccounts();
  }, []);

  useEffect(() => {
    if (method === "cash") {
      setCashAmount(amountDue);
      setBankAmount(0);
    } else if (method === "bank_transfer") {
      setCashAmount(0);
      setBankAmount(amountDue);
    } else if (method === "split_cash_bank") {
      setCashAmount(0);
      setBankAmount(0);
    } else if (method === "partial_cash") {
      setBankAmount(0);
      if (cashAmount >= amountDue) {
        setCashAmount(0);
      }
    }
    setCashProof(null);
    setBankProof(null);
  }, [method, amountDue]);

  const splitMismatch = useMemo(() => {
    if (method !== "split_cash_bank") return false;
    return cashAmount + bankAmount !== amountDue;
  }, [method, cashAmount, bankAmount, amountDue]);

  const partialInvalid = useMemo(() => {
    if (method !== "partial_cash") return false;
    return cashAmount <= 0 || cashAmount >= amountDue;
  }, [method, cashAmount, amountDue]);

  const bankRequired = method === "bank_transfer" || method === "split_cash_bank";
  const bankMissing = bankRequired && !bankAccountId && !bankAccountLabel;
  const requiresCashProof = cashAmount > 0;
  const requiresBankProof = bankAmount > 0;

  const submitDisabled =
    submitting ||
    amountDue <= 0 ||
    splitMismatch ||
    partialInvalid ||
    bankMissing ||
    (requiresCashProof && !cashProof) ||
    (requiresBankProof && !bankProof);

  const handleSubmit = async () => {
    if (submitDisabled) {
      toast({
        title: "Please review the amounts",
        description: "Make sure the split totals and proof uploads are correct.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload: IAdminManualPayment = {
        registration: registrationId,
        paymentMethod: method,
        cashAmount: cashAmount > 0 ? cashAmount : undefined,
        bankAmount: bankAmount > 0 ? bankAmount : undefined,
        bankAccount: bankAccountId || undefined,
        bankAccountLabel: bankAccountLabel || undefined,
        cashProof: cashProof || undefined,
        bankProof: bankProof || undefined,
        adminNote: adminNote || undefined,
      };

      await PaymentService.adminManualPayment(payload);
      toast({
        title: "Payment recorded",
        description: "The payment has been saved and approved.",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Failed to record payment",
        description:
          error?.response?.data?.message || "Please retry or check the details.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center">
      <div className="w-full md:max-w-lg bg-white rounded-t-2xl md:rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Collect remaining payment</p>
            <p className="text-xs text-gray-500">
              {name} • Remaining due: PKR {amountDue.toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 uppercase">Payment option</p>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {[
              { id: "cash", label: "Pay full via cash" },
              { id: "bank_transfer", label: "Pay full via bank transfer" },
              { id: "split_cash_bank", label: "Partial cash + partial bank transfer (split)" },
              { id: "partial_cash", label: "Cash for less than remaining due" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setMethod(option.id as PaymentMethod)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-left",
                  method === option.id
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 text-gray-700"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Wallet payments are user-initiated on their own device.
          </p>
        </div>

        {(method === "split_cash_bank" || method === "partial_cash") && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Cash amount (PKR)</label>
              <input
                type="number"
                min={0}
                value={cashAmount}
                onChange={(e) => setCashAmount(Math.max(0, Number(e.target.value) || 0))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Bank amount (PKR)</label>
              <input
                type="number"
                min={0}
                value={bankAmount}
                onChange={(e) => setBankAmount(Math.max(0, Number(e.target.value) || 0))}
                disabled={method === "partial_cash"}
                className={cn(
                  "mt-1 w-full rounded-lg border px-3 py-2 text-sm",
                  method === "partial_cash"
                    ? "border-gray-100 bg-gray-50 text-gray-400"
                    : "border-gray-200"
                )}
              />
            </div>
          </div>
        )}

        {(method === "cash" || method === "bank_transfer") && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            Amount auto-set to PKR {amountDue.toLocaleString()}.
          </div>
        )}

        {splitMismatch && (
          <p className="text-xs text-amber-600">
            Split total must equal remaining due.
          </p>
        )}
        {partialInvalid && (
          <p className="text-xs text-amber-600">
            Cash amount must be less than remaining due.
          </p>
        )}

        {bankRequired && (
          <div>
            <label className="text-xs text-gray-500">Deposit account</label>
            <select
              value={bankAccountId}
              onChange={(e) => {
                setBankAccountId(e.target.value);
                const selected = bankAccounts.find((b) => b._id === e.target.value);
                setBankAccountLabel(selected?.bankName || "");
              }}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="">Select an account</option>
              {bankAccounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.bankName}
                </option>
              ))}
            </select>
            {bankMissing && (
              <p className="text-xs text-red-600 mt-1">Select a deposit account.</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500">Cash proof</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCashProof(e.target.files?.[0] || null)}
              className="mt-1 w-full text-xs"
            />
            {requiresCashProof && !cashProof && (
              <p className="text-xs text-red-600 mt-1">Cash proof is required.</p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500">Bank proof</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBankProof(e.target.files?.[0] || null)}
              className="mt-1 w-full text-xs"
            />
            {requiresBankProof && !bankProof && (
              <p className="text-xs text-red-600 mt-1">Bank proof is required.</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500">Admin note (optional)</label>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            rows={2}
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitDisabled}
          className={cn(
            "w-full rounded-full px-4 py-3 text-sm font-semibold transition",
            submitDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600"
          )}
        >
          {submitting ? "Recording..." : "Record payment"}
        </button>
      </div>
    </div>
  );
}
