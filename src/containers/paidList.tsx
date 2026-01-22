"use client";

import { Card } from "../components/card";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FlagshipService } from "@/services/flagshipService";
import { IPayment, IRegistration } from "@/interfaces/trip/trip";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { IUser } from "@/services/types/user";

export const PaidListContainer = () => {
  const [paymentFilter, setPaymentFilter] = useState<
    "fullPayment" | "partialPayment"
  >("fullPayment");
  const [paymentUsers, setPaymentUsers] = useState<IRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { slug } = router.query;

  const fetchPaymentUsers = async (type: "fullPayment" | "partialPayment") => {
    try {
      setLoading(true);
      const response = await FlagshipService.getPaidUsers(slug as string, type);
      setPaymentUsers(response);
    } catch (error) {
      console.error("Failed to fetch payment users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentUsers(paymentFilter);
  }, [paymentFilter]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "do MMMM yyyy"); // Example: 17th July 2025
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            paymentFilter === "fullPayment"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setPaymentFilter("fullPayment")}
        >
          Full Payment
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            paymentFilter === "partialPayment"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setPaymentFilter("partialPayment")}
        >
          Partial Payment
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : paymentUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        paymentUsers.map((r) => (
          <Link
            href={`/admin/payment/${(r.payment as IPayment)._id}`}
            key={r.id}
          >
            <Card className="p-0 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
              <div className="p-4 flex items-center relative">
                <div className="h-12 w-12 mr-4 overflow-hidden rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4B83C4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-8"
                  >
                    <circle cx="12" cy="8" r="5" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">
                    {(r.user as IUser).fullName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Joining From: {(r.user as IUser).city}
                  </p>
                </div>
                <div className="relative top-4 right-4">
                  <Image
                    src="/star_shield.png"
                    alt="Verified Shield"
                    width={40}
                    height={40}
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-2 grid grid-cols-2 gap-2">
                <div className="text-gray-500">Registered</div>
                <div className="text-right font-medium">
                  {formatDate(r.createdAt)}
                </div>

                <div className="text-gray-500">Type</div>
                <div className="text-right font-medium"> {r.type}</div>

                <div className="text-gray-500">Amount</div>
                <div className="text-right font-medium">
                  {(r.payment as IPayment).amount}{" "}
                  <span className="text-gray-400 text-sm">PKR</span>
                </div>

                {(r.payment as IPayment)?.discount &&
                  (r.payment as IPayment)?.discount !== 0 && (
                    <>
                      <div className="text-gray-500">Discount</div>
                      <div className="text-right font-medium text-brand-primary">
                        {(r.payment as IPayment).discount}{" "}
                        <span className="text-gray-400 text-sm">PKR</span>
                      </div>
                    </>
                  )}

                <div className="text-gray-500">Status</div>
                <div className="text-right">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {(r.payment as IPayment).paymentType === "fullPayment"
                      ? "Full Payment"
                      : "Partial Payment"}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
};
