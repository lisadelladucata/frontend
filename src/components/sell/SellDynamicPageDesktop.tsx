"use client";

// import Container from "@/components/common/Container";
import HowDelivery from "@/components/sell/HowDelivery";
import { useRouter } from "next/navigation";

import { useState } from "react";

const STORAGE_OPTIONS = [
  { value: "128", label: "128GB" },
  { value: "256", label: "256GB" },
  { value: "512", label: "512GB" },
  { value: "1024", label: "1024GB" },
];

export default function SellDynamicPage() {
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const router = useRouter();

  const handleRouter = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStorage) {
      router.push("/sell/next1");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStorage) {
      router.push("/sell/next1");
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F5F7] flex flex-col items-center justify-center mb-24">
      <div className="w-full max-w-[798px] mx-auto my-20">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-base font-medium text-[#101010] mb-3">
              Playstation 4
            </h1>
            <h2 className="text-2xl font-semibold text-[#101010] mb-5">
              What is the storage of your items?
            </h2>
            <p className="text-lg font-medium text-[#101010] bg-[#DAEDF2] p-3 rounded-md">
              You can check the storage by going to &quot;Settings&quot; &gt;
              &quot;General&quot; &gt; &quot;About&quot;
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3 mb-6">
              {STORAGE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`block w-full border-2 border-[#101010] rounded-md p-3 cursor-pointer transition-colors
                    ${
                      selectedStorage === option.value
                        ? "border-blue-500 bg-[#DAEDF2]"
                        : "border-[#101010] hover:border-blue-500"
                    }`}
                >
                  <input
                    type="radio"
                    name="storage"
                    value={option.value}
                    checked={selectedStorage === option.value}
                    onChange={(e) => setSelectedStorage(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!selectedStorage}
                onClick={handleRouter}
                className={`px-6 py-2 border rounded-md text-base font-medium transition-colors
                  ${
                    selectedStorage
                      ? "bg-[#F2F5F7] text-[#101010] border-[#101010] font-semibold"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                CONTINUE
              </button>
            </div>
          </form>
        </div>
      </div>

      <HowDelivery />
    </div>
  );
}
