"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import useFlagshipHook from "@/hooks/useFlagshipHandler";
import { currentFlagship } from "@/store";
import { Flagship } from "@/interfaces/flagship";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ROLES, ROUTES_CONSTANTS, steps } from "@/config/constants";
import { showAlert } from "@/pages/alert";
import { HttpStatusCode } from "axios";
import withAuth from "@/hoc/withAuth";
import ProgressBar from "@/components/progressBar";
import { mapErrorToUserMessage } from "@/utils/errorMessages";
import { FlagshipService } from "@/services/flagshipService";
import { getEditIdFromSearch, withEditId } from "@/lib/flagship-edit";

function DiscountsPage() {
  const activeStep = 5;
  const router = useRouter();
  const action = useFlagshipHook();
  const flagshipData: Flagship = useRecoilValue(currentFlagship);
  const setCurrentFlagship = useSetRecoilState(currentFlagship);
  const [editId, setEditId] = useState<string | null | undefined>(undefined);
  const isEditMode = Boolean(editId);
  // Total values
  const [totalSeats, setTotalSeats] = useState("");
  const [totalDiscountsValue, setTotalDiscountsValue] = useState("");

  // Partial Team Discount
  const [partialTeamEnabled, setPartialTeamEnabled] = useState(true);
  const [partialTeamAmount, setPartialTeamAmount] = useState("");
  const [partialTeamCount, setPartialTeamCount] = useState("");

  // Solo Female Discount
  const [soloFemaleEnabled, setSoloFemaleEnabled] = useState(true);
  const [soloFemaleAmount, setSoloFemaleAmount] = useState("");
  const [soloFemaleCount, setSoloFemaleCount] = useState("");

  // Group Discount
  const [groupEnabled, setGroupEnabled] = useState(true);
  const [groupValue, setGroupValue] = useState("");
  const [groupAmount, setGroupAmount] = useState("");
  const [groupCount, setGroupCount] = useState("");

  // Musafir Discount
  const [musafirEnabled, setMusafirEnabled] = useState(true);
  const [musafirBudget, setMusafirBudget] = useState("");
  const [musafirCount, setMusafirCount] = useState("");

  // Error state for validations
  const [errors, setErrors] = useState({
    totalSeats: "",
    totalDiscountsValue: "",
    partialTeamAmount: "",
    partialTeamCount: "",
    soloFemaleAmount: "",
    soloFemaleCount: "",
    groupValue: "",
    groupAmount: "",
    groupCount: "",
    musafirBudget: "",
    musafirCount: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    setEditId(getEditIdFromSearch(window.location.search));
  }, []);

  useEffect(() => {
    const loadFlagship = async () => {
      if (!editId) return;
      if (flagshipData?._id === editId) return;
      try {
        const data = await FlagshipService.getFlagshipByID(editId);
        setCurrentFlagship(data);
      } catch (error) {
        console.error("Failed to load flagship for edit:", error);
        showAlert(mapErrorToUserMessage(error), "error");
        router.push(ROUTES_CONSTANTS.ADMIN_DASHBOARD);
      }
    };
    loadFlagship();
  }, [editId, flagshipData?._id, router, setCurrentFlagship]);

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
        if (flagshipData.discounts.partialTeam) {
          setPartialTeamEnabled(flagshipData.discounts.partialTeam.enabled);
          setPartialTeamAmount(flagshipData.discounts.partialTeam.amount || "");
          setPartialTeamCount(flagshipData.discounts.partialTeam.count || "");
        } else {
          setPartialTeamEnabled(false);
        }
        if (flagshipData.discounts.soloFemale) {
          setSoloFemaleEnabled(flagshipData.discounts.soloFemale.enabled);
          setSoloFemaleAmount(flagshipData.discounts.soloFemale.amount || "");
          setSoloFemaleCount(flagshipData.discounts.soloFemale.count || "");
        } else {
          setSoloFemaleEnabled(false);
        }
        if (flagshipData.discounts.group) {
          setGroupEnabled(flagshipData.discounts.group.enabled);
          setGroupValue(flagshipData.discounts.group.value || "");
          setGroupAmount(flagshipData.discounts.group.amount || "");
          setGroupCount(flagshipData.discounts.group.count || "");
        } else {
          setGroupEnabled(false);
        }
        if (flagshipData.discounts.musafir) {
          setMusafirEnabled(flagshipData.discounts.musafir.enabled);
          setMusafirBudget(flagshipData.discounts.musafir.budget || "");
          setMusafirCount(flagshipData.discounts.musafir.count || "");
        } else {
          setMusafirEnabled(false);
        }
      }
    }
  }, [flagshipData]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors = {
      totalSeats: "",
      totalDiscountsValue: "",
      partialTeamAmount: "",
      partialTeamCount: "",
      soloFemaleAmount: "",
      soloFemaleCount: "",
      groupValue: "",
      groupAmount: "",
      groupCount: "",
      musafirBudget: "",
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
    // if (partialTeamEnabled) {
    //   if (!partialTeamAmount.trim()) {
    //     newErrors.partialTeamAmount = 'Partial team discount amount is required';
    //     isValid = false;
    //   }
    //   if (!partialTeamCount.trim()) {
    //     newErrors.partialTeamCount = 'Partial team discount count is required';
    //     isValid = false;
    //   }
    // }
    // if (soloFemaleEnabled) {
    //   if (!soloFemaleAmount.trim()) {
    //     newErrors.soloFemaleAmount = 'Solo female discount amount is required';
    //     isValid = false;
    //   }
    //   if (!soloFemaleCount.trim()) {
    //     newErrors.soloFemaleCount = 'Solo female discount count is required';
    //     isValid = false;
    //   }
    // }
    // if (groupEnabled) {
    //   if (!groupValue.trim()) {
    //     newErrors.groupValue = 'Group discount value is required';
    //     isValid = false;
    //   }
    //   if (!groupAmount.trim()) {
    //     newErrors.groupAmount = 'Group discount amount is required';
    //     isValid = false;
    //   }
    //   if (!groupCount.trim()) {
    //     newErrors.groupCount = 'Group discount count is required';
    //     isValid = false;
    //   }
    // }
    // if (musafirEnabled) {
    //   if (!musafirBudget.trim()) {
    //     newErrors.musafirBudget = 'Musafir discount budget is required';
    //     isValid = false;
    //   }
    //   if (!musafirCount.trim()) {
    //     newErrors.musafirCount = 'Musafir discount count is required';
    //     isValid = false;
    //   }
    // }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = {
      discounts: {
        totalDiscountsValue,
        partialTeam: partialTeamEnabled
          ? {
              amount: partialTeamAmount,
              count: partialTeamCount,
              enabled: partialTeamEnabled,
            }
          : undefined,
        soloFemale: soloFemaleEnabled
          ? {
              amount: soloFemaleAmount,
              count: soloFemaleCount,
              enabled: soloFemaleEnabled,
            }
          : undefined,
        group: groupEnabled
          ? {
              value: groupValue,
              amount: groupAmount,
              count: groupCount,
              enabled: groupEnabled,
            }
          : undefined,
        musafir: musafirEnabled
          ? {
              budget: musafirBudget,
              count: musafirCount,
              enabled: musafirEnabled,
            }
          : undefined,
      },
      updatedAt: flagshipData?.updatedAt,
    };
    try {
      const flagshipId = flagshipData._id || "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await action.update(flagshipId, formData);
      if (res.statusCode === HttpStatusCode.Ok) {
        showAlert("Discounts Added!", "success");
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
                placeholder="50000"
                onChange={(e) => setTotalDiscountsValue(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
            {errors.totalDiscountsValue && (
              <p className="text-brand-error text-sm mt-1">
                {errors.totalDiscountsValue}
              </p>
            )}
          </div>

          {/* Partial Team Discount */}
          <div className="mb-8 border-b pb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Partial Team Discount</h3>
              <div
                className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${
                  partialTeamEnabled ? "bg-black" : "bg-gray-300"
                }`}
                onClick={() => setPartialTeamEnabled(!partialTeamEnabled)}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                    partialTeamEnabled ? "translate-x-7" : ""
                  }`}
                ></div>
              </div>
            </div>

            {partialTeamEnabled && (
              <>
                <div className="mb-4">
                  <h4 className="mb-2">Total Discount Amount</h4>
                  <div className="border-2 border-black rounded-lg overflow-hidden">
                    <input
                      min={0}
                      value={partialTeamAmount}
                      onChange={(e) => setPartialTeamAmount(e.target.value)}
                      className="w-full px-3 py-2 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  {errors.partialTeamAmount && (
                    <p className="text-brand-error text-sm mt-1">
                      {errors.partialTeamAmount}
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
                        updateCount(
                          partialTeamCount,
                          setPartialTeamCount,
                          false
                        )
                      }
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <input
                      min={0}
                      value={partialTeamCount}
                      onChange={(e) => setPartialTeamCount(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none text-center"
                    />
                    <button
                      onClick={() =>
                        updateCount(partialTeamCount, setPartialTeamCount, true)
                      }
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  {errors.partialTeamCount && (
                    <p className="text-brand-error text-sm mt-1">
                      {errors.partialTeamCount}
                    </p>
                  )}
                </div>
              </>
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

            {groupEnabled && (
              <>
                <div className="mb-4">
                  <h4 className="mb-2">Total Value</h4>
                  <div className="border-2 border-black rounded-lg overflow-hidden p-3">
                    <input
                      min={0}
                      value={groupValue}
                      placeholder="45"
                      onChange={(e) => setGroupValue(e.target.value)}
                      className="w-full bg-transparent focus:outline-none"
                    />
                  </div>
                  {errors.groupValue && (
                    <p className="text-brand-error text-sm mt-1">
                      {errors.groupValue}
                    </p>
                  )}
                </div>

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
                  <h4 className="mb-2">Total Discount Budget</h4>
                  <div className="border-2 border-black rounded-lg overflow-hidden">
                    <input
                      min={0}
                      value={musafirBudget}
                      onChange={(e) => setMusafirBudget(e.target.value)}
                      className="w-full px-3 py-2 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  {errors.musafirBudget && (
                    <p className="text-brand-error text-sm mt-1">
                      {errors.musafirBudget}
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
