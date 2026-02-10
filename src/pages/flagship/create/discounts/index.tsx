"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import useFlagshipHook from "@/hooks/useFlagshipHandler";
import { Flagship } from "@/interfaces/flagship";
import { ROLES, ROUTES_CONSTANTS, steps } from "@/config/constants";
import { showAlert } from "@/pages/alert";
import { HttpStatusCode } from "axios";
import withAuth from "@/hoc/withAuth";
import ProgressBar from "@/components/progressBar";
import { mapErrorToUserMessage } from "@/utils/errorMessages";
import { FlagshipService } from "@/services/flagshipService";
import { getEditIdFromSearch, withEditId } from "@/lib/flagship-edit";
import { ensureSilentUpdate, getContentVersionToken } from "@/lib/flagshipWizard";
import { loadDraft, saveDraft } from "@/lib/flagship-draft";

function DiscountsPage() {
  const activeStep = 5;
  const router = useRouter();
  const action = useFlagshipHook();
  const [flagshipData, setFlagshipData] = useState<Flagship>({} as Flagship);
  const [editId, setEditId] = useState<string | null | undefined>(undefined);
  const isEditMode = Boolean(editId);
  // Total values
  const [totalSeats, setTotalSeats] = useState("");
  const [totalDiscountsValue, setTotalDiscountsValue] = useState("");

  // Solo Female Discount
  const [soloFemaleEnabled, setSoloFemaleEnabled] = useState(true);
  const [soloFemaleAmount, setSoloFemaleAmount] = useState("");
  const [soloFemaleCount, setSoloFemaleCount] = useState("");

  // Group Discount
  const [groupEnabled, setGroupEnabled] = useState(true);
  const [groupAmount, setGroupAmount] = useState("");
  const [groupCount, setGroupCount] = useState("");

  // Musafir Discount
  const [musafirEnabled, setMusafirEnabled] = useState(true);
  const [musafirAmount, setMusafirAmount] = useState("");
  const [musafirCount, setMusafirCount] = useState("");

  // Error state for validations
  const [errors, setErrors] = useState({
    totalSeats: "",
    totalDiscountsValue: "",
    soloFemaleAmount: "",
    soloFemaleCount: "",
    groupAmount: "",
    groupCount: "",
    musafirAmount: "",
    musafirCount: "",
  });

  const parseAmount = (value: string) => {
    const numeric = value?.toString().replace(/[^0-9.-]/g, "");
    const parsed = Number(numeric);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const parseCount = (value: string) => {
    const parsed = Math.floor(Number(value) || 0);
    return Math.max(0, parsed);
  };

  const soloTotal =
    soloFemaleEnabled
      ? parseAmount(soloFemaleAmount) * parseCount(soloFemaleCount)
      : 0;
  const groupTotal =
    groupEnabled ? parseAmount(groupAmount) * parseCount(groupCount) : 0;
  const musafirTotal =
    musafirEnabled ? parseAmount(musafirAmount) * parseCount(musafirCount) : 0;
  const computedTotalDiscounts = soloTotal + groupTotal + musafirTotal;

  const soloUsedValue = flagshipData?.discounts?.soloFemale?.usedValue || 0;
  const soloUsedCount = flagshipData?.discounts?.soloFemale?.usedCount || 0;
  const groupUsedValue = flagshipData?.discounts?.group?.usedValue || 0;
  const groupUsedCount = flagshipData?.discounts?.group?.usedCount || 0;
  const musafirUsedValue = flagshipData?.discounts?.musafir?.usedValue || 0;
  const musafirUsedCount = flagshipData?.discounts?.musafir?.usedCount || 0;

  useEffect(() => {
    if (typeof window === "undefined") return;
    setEditId(getEditIdFromSearch(window.location.search));
  }, []);

  useEffect(() => {
    if (editId === undefined) return;
    if (!editId) {
      const draft = loadDraft<Flagship>("create");
      if (draft) {
        setFlagshipData(draft);
      }
      return;
    }
    const loadFlagship = async () => {
      try {
        const data = await FlagshipService.getFlagshipByID(editId);
        setFlagshipData(data);
        saveDraft("edit", editId, data);
      } catch (error) {
        console.error("Failed to load flagship for edit:", error);
        showAlert(mapErrorToUserMessage(error), "error");
        router.push(ROUTES_CONSTANTS.ADMIN_DASHBOARD);
      }
    };
    loadFlagship();
  }, [editId, router]);

  useEffect(() => {
    if (editId === undefined) return;
    if (isEditMode) return;
    if (!flagshipData._id || !flagshipData.startDate) {
      showAlert("Create a Flagship", "error");
      router.push(ROUTES_CONSTANTS.FLAGSHIP.CREATE);
    }
    if (!flagshipData.totalSeats) {
      showAlert("Add Seats Information", "error");
      router.push(ROUTES_CONSTANTS.FLAGSHIP.SEATS);
    }
    setTotalSeats(`${flagshipData.totalSeats ?? ""}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flagshipData?._id, flagshipData?.startDate, flagshipData?.totalSeats, isEditMode]);

  // useEffect to update state on page load if flagshipData is available
  useEffect(() => {
    if (flagshipData) {
      if (flagshipData.totalSeats) {
        setTotalSeats(`${flagshipData.totalSeats}`);
      }
      // Handle discount fields similarly...
      if (flagshipData.discounts) {
        setTotalDiscountsValue(
          flagshipData.discounts.totalDiscountsValue || ""
        );
        if (flagshipData.discounts.soloFemale) {
          setSoloFemaleEnabled(flagshipData.discounts.soloFemale.enabled);
          setSoloFemaleAmount(flagshipData.discounts.soloFemale.amount || "");
          setSoloFemaleCount(flagshipData.discounts.soloFemale.count || "");
        } else {
          setSoloFemaleEnabled(false);
        }
        if (flagshipData.discounts.group) {
          setGroupEnabled(flagshipData.discounts.group.enabled);
          const legacyGroupValue = (flagshipData.discounts.group as any)?.value;
          setGroupAmount(flagshipData.discounts.group.amount || legacyGroupValue || "");
          setGroupCount(flagshipData.discounts.group.count || "");
        } else {
          setGroupEnabled(false);
        }
        if (flagshipData.discounts.musafir) {
          setMusafirEnabled(flagshipData.discounts.musafir.enabled);
          const legacyBudget = (flagshipData.discounts.musafir as any)?.budget;
          setMusafirAmount(
            flagshipData.discounts.musafir.amount ||
              legacyBudget ||
              ""
          );
          setMusafirCount(flagshipData.discounts.musafir.count || "");
        } else {
          setMusafirEnabled(false);
        }
      }
    }
  }, [flagshipData]);

  useEffect(() => {
    setTotalDiscountsValue(
      `${Math.max(0, Math.floor(computedTotalDiscounts))}`
    );
  }, [computedTotalDiscounts]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors = {
      totalSeats: "",
      totalDiscountsValue: "",
      soloFemaleAmount: "",
      soloFemaleCount: "",
      groupAmount: "",
      groupCount: "",
      musafirAmount: "",
      musafirCount: "",
    };
    let isValid = true;

    // Although totalSeats and totalDiscountsValue are readOnly, we check for non-empty values.
    if (!totalSeats.trim()) {
      newErrors.totalSeats = "Total Seats is required";
      isValid = false;
    }
    if (!totalDiscountsValue.trim()) {
      newErrors.totalDiscountsValue = "Total Discounts Value is required";
      isValid = false;
    }

    if (soloFemaleEnabled) {
      const amount = parseAmount(soloFemaleAmount);
      const count = parseCount(soloFemaleCount);
      if (amount <= 0) {
        newErrors.soloFemaleAmount = "Solo female amount must be positive";
        isValid = false;
      }
      if (count <= 0) {
        newErrors.soloFemaleCount = "Solo female count must be positive";
        isValid = false;
      }
      if (soloTotal < soloUsedValue || count < soloUsedCount) {
        newErrors.soloFemaleAmount = "Cannot set total below used discounts";
        isValid = false;
      }
    }

    if (groupEnabled) {
      const amount = parseAmount(groupAmount);
      const count = parseCount(groupCount);
      if (amount <= 0) {
        newErrors.groupAmount = "Group amount must be positive";
        isValid = false;
      }
      if (count <= 0) {
        newErrors.groupCount = "Group count must be positive";
        isValid = false;
      }
      if (groupTotal < groupUsedValue || count < groupUsedCount) {
        newErrors.groupAmount = "Cannot set total below used discounts";
        isValid = false;
      }
    }

    if (musafirEnabled) {
      const amount = parseAmount(musafirAmount);
      const count = parseCount(musafirCount);
      if (amount <= 0) {
        newErrors.musafirAmount = "Musafir amount must be positive";
        isValid = false;
      }
      if (count <= 0) {
        newErrors.musafirCount = "Musafir count must be positive";
        isValid = false;
      }
      if (musafirTotal < musafirUsedValue || count < musafirUsedCount) {
        newErrors.musafirAmount = "Cannot set total below used discounts";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = {
      discounts: {
        totalDiscountsValue,
        soloFemale: soloFemaleEnabled
          ? {
              amount: soloFemaleAmount,
              count: soloFemaleCount,
              enabled: soloFemaleEnabled,
            }
          : undefined,
        group: groupEnabled
          ? {
              amount: groupAmount,
              count: groupCount,
              enabled: groupEnabled,
            }
          : undefined,
        musafir: musafirEnabled
          ? {
              amount: musafirAmount,
              count: musafirCount,
              enabled: musafirEnabled,
            }
          : undefined,
      },
      contentVersion: getContentVersionToken(flagshipData),
    };
    ensureSilentUpdate(formData);
    try {
      const flagshipId = flagshipData._id || "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await action.update(flagshipId, formData);
      if (res.statusCode === HttpStatusCode.Ok) {
        showAlert("Discounts Added!", "success");
        if (res?.data) {
          setFlagshipData(res.data);
          saveDraft(editId ? "edit" : "create", editId ?? null, res.data);
        }
        router.push(withEditId(ROUTES_CONSTANTS.FLAGSHIP.PAYMENT, editId));
      }
    } catch (error) {
      console.error("API Error:", error);
      showAlert(mapErrorToUserMessage(error), "error");
    }
  };

  // Handle increment/decrement
  const updateCount = (
    value: string,
    setter: (value: string) => void,
    increment: boolean
  ) => {
    const currentValue = Number.parseInt(value) || 0;
    const newValue = increment
      ? currentValue + 1
      : Math.max(0, currentValue - 1);
    setter(newValue.toString());
  };

  return (
    <div className="min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0">
      <div className="bg-white max-w-md mx-auto rounded-lg h-screen p-3 w-full">
        {/* Title */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit a Flagship" : "Create a Flagship"}
          </h1>
        </div>

        {/* Progress bar */}
        <ProgressBar steps={steps} activeStep={activeStep} />

        {/* Main Content */}
        <div className="px-4 pb-20">
          <h2 className="text-3xl font-bold mb-6">6: Discounts Applicable</h2>

          {/* Total Seats */}
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Total Seats</h3>
            <div className="bg-gray-100 rounded-lg p-3">
              <input
                type="text"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
                readOnly
              />
            </div>
          </div>

          {/* Total Discounts Value */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Total Discounts Value</h3>
            <div className="border-2 border-black rounded-lg overflow-hidden p-3">
              <input
                min={0}
                value={totalDiscountsValue}
                placeholder="0"
                className="w-full bg-transparent focus:outline-none"
                readOnly
              />
            </div>
            {errors.totalDiscountsValue && (
              <p className="text-brand-error text-sm mt-1">
                {errors.totalDiscountsValue}
              </p>
            )}
          </div>

          {/* Solo Female Discount */}
          <div className="mb-8 border-b pb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Solo Female Discount</h3>
              <div
                className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${
                  soloFemaleEnabled ? "bg-black" : "bg-gray-300"
                }`}
                onClick={() => setSoloFemaleEnabled(!soloFemaleEnabled)}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                    soloFemaleEnabled ? "translate-x-7" : ""
                  }`}
                ></div>
              </div>
            </div>

            {soloFemaleEnabled && (
              <>
                <div className="mb-4">
                  <h4 className="mb-2">Discount per ticket</h4>
                  <div className="border-2 border-black rounded-lg overflow-hidden">
                    <input
                      min={0}
                      value={soloFemaleAmount}
                      onChange={(e) => setSoloFemaleAmount(e.target.value)}
                      className="w-full px-3 py-2 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  {errors.soloFemaleAmount && (
                    <p className="text-brand-error text-sm mt-1">
                      {errors.soloFemaleAmount}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="mb-2 text-gray-500">
                    Number of such discounts
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateCount(soloFemaleCount, setSoloFemaleCount, false)
                      }
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <input
                      min={0}
                      value={soloFemaleCount}
                      onChange={(e) => setSoloFemaleCount(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none text-center"
                    />
                    <button
                      onClick={() =>
                        updateCount(soloFemaleCount, setSoloFemaleCount, true)
                      }
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  {errors.soloFemaleCount && (
                    <p className="text-brand-error text-sm mt-1">
                      {errors.soloFemaleCount}
                    </p>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Used value: Rs.{Number(soloUsedValue).toLocaleString()} | Remaining value: Rs.
                  {Math.max(0, soloTotal - soloUsedValue).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  Used count: {soloUsedCount} | Remaining count:{" "}
                  {Math.max(0, parseCount(soloFemaleCount) - soloUsedCount)}
                </div>
              </>
            )}
          </div>

          {/* Group Discount */}
          <div className="mb-8 border-b pb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Group Discount</h3>
              <div
                className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${
                  groupEnabled ? "bg-black" : "bg-gray-300"
                }`}
                onClick={() => setGroupEnabled(!groupEnabled)}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                    groupEnabled ? "translate-x-7" : ""
                  }`}
                ></div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Group discounts apply to members once all linked members register.
            </p>

            {groupEnabled && (
              <>
                <div className="mb-4">
                  <h4 className="mb-2">Discount per ticket</h4>
                  <div className="border-2 border-black rounded-lg overflow-hidden">
                    <input
                      min={0}
                      value={groupAmount}
                      onChange={(e) => setGroupAmount(e.target.value)}
                      className="w-full px-3 py-2 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  {errors.groupAmount && (
                    <p className="text-brand-error text-sm mt-1">
                      {errors.groupAmount}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="mb-2 text-gray-500">
                    Number of such discounts
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateCount(groupCount, setGroupCount, false)
                      }
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <input
                      min={0}
                      value={groupCount}
                      onChange={(e) => setGroupCount(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none text-center"
                    />
                    <button
                      onClick={() =>
                        updateCount(groupCount, setGroupCount, true)
                      }
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  {errors.groupCount && (
                    <p className="text-brand-error text-sm mt-1">
                      {errors.groupCount}
                    </p>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Used value: Rs.{Number(groupUsedValue).toLocaleString()} | Remaining value: Rs.
                  {Math.max(0, groupTotal - groupUsedValue).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  Used count: {groupUsedCount} | Remaining count:{" "}
                  {Math.max(0, parseCount(groupCount) - groupUsedCount)}
                </div>
              </>
            )}
          </div>

          {/* Musafir Discount */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Musafir Discount</h3>
              <div
                className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${
                  musafirEnabled ? "bg-black" : "bg-gray-300"
                }`}
                onClick={() => setMusafirEnabled(!musafirEnabled)}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                    musafirEnabled ? "translate-x-7" : ""
                  }`}
                ></div>
              </div>
            </div>

            {musafirEnabled && (
              <>
                <div className="mb-4">
                  <h4 className="mb-2">Discount per ticket</h4>
                  <div className="border-2 border-black rounded-lg overflow-hidden">
                    <input
                      min={0}
                      value={musafirAmount}
                      onChange={(e) => setMusafirAmount(e.target.value)}
                      className="w-full px-3 py-2 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  {errors.musafirAmount && (
                    <p className="text-brand-error text-sm mt-1">
                      {errors.musafirAmount}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="mb-2 text-gray-500">
                    Number of such discounts
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateCount(musafirCount, setMusafirCount, false)
                      }
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <input
                      min={0}
                      value={musafirCount}
                      onChange={(e) => setMusafirCount(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none text-center"
                    />
                    <button
                      onClick={() =>
                        updateCount(musafirCount, setMusafirCount, true)
                      }
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  {errors.musafirCount && (
                    <p className="text-brand-error text-sm mt-1">
                      {errors.musafirCount}
                    </p>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Used value: Rs.{Number(musafirUsedValue).toLocaleString()} | Remaining value: Rs.
                  {Math.max(0, musafirTotal - musafirUsedValue).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  Used count: {musafirUsedCount} | Remaining count:{" "}
                  {Math.max(0, parseCount(musafirCount) - musafirUsedCount)}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-brand-primary text-black py-4 rounded-xl font-bold text-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default withAuth(DiscountsPage, { allowedRoles: [ROLES.ADMIN] });
