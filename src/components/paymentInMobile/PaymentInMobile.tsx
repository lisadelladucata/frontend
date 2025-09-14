import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const PaymentInMobile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    postCode: "",
    shippingAddress: "",
    appointments: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("bankTransfer");

  const { t } = useTranslation();

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Ordered Submitted successfully!");

    router.push("/");
  };

  return (
    <div className="z-20 min-h-screen relative bg-[url('/sell/back_sell.png')] bg-cover bg-center overflow-hidden">
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}

        <div className="p-5">
          <h2 className="text-lg font-semibold text-[#FFFFFF]">
            {t("personalInformation")}
          </h2>

          <div className="w-full mx-auto h-1 border-b-2 border-b-[#FDFDFD] mb-5" />

          <div className="bg-[#FDFDFD] p-3 rounded-lg space-y-3 mb-5">
            <div className="flex items-center gap-6">
              <div className="flex-1 flex flex-col gap-1 w-[45%] max-w-[50%]">
                <label htmlFor="firstName" className="text-sm leading-[21px]">
                  {t("firstName")} <span className="text-red-500">*</span>{" "}
                </label>

                <input
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  value={formData.firstName}
                  id="firstName"
                  className="px-2 py-2 h-10 border-2 rounded-md placeholder:text-sm"
                  placeholder="First Name"
                  required
                />
              </div>

              <div className="flex-1 flex flex-col gap-1 w-[45%] max-w-[50%]">
                <label htmlFor="lastName" className="text-sm leading-[21px]">
                  {t("lastName")} <span className="text-red-500">*</span>{" "}
                </label>

                <input
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  value={formData.lastName} // Bind value to state
                  id="lastName"
                  className="px-2 py-2 border-2 rounded-md placeholder:text-sm"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="email" className="text-sm leading-[21px]">
                {t("email")} <span className="text-red-500">*</span>{" "}
              </label>

              <input
                type="email"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                value={formData.email} // Bind value to state
                id="email"
                className="px-2 py-2 border-2 rounded-md placeholder:text-sm"
                placeholder="Enter email"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="phone" className="text-sm leading-[21px]">
                {t("phoneNumber")} <span className="text-red-500">*</span>{" "}
              </label>

              <input
                type="tel"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                value={formData.phone} // Bind value to state
                id="phone"
                className="px-2 py-2 border-2 rounded-md placeholder:text-sm"
                placeholder="Phone Number"
              />
            </div>
          </div>

          {/* Address */}
          <h2 className="text-lg font-semibold text-[#FFFFFF]">
            {t("address")}
          </h2>
          <div className="w-full mx-auto h-1 border-b-2 border-b-[#FDFDFD] mb-5" />
          <div className="bg-[#FDFDFD] p-3 rounded-lg space-y-3 mb-5">
            <div className="flex items-center gap-6">
              <div className="flex-1 flex flex-col gap-1 w-[45%] max-w-[50%]">
                <label htmlFor="city" className="text-sm leading-[21px]">
                  {t("city")} <span className="text-red-500">*</span>{" "}
                </label>

                <input
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  value={formData.city} // Bind value to state
                  id="city"
                  className="px-2 py-2 border-2 rounded-md placeholder:text-sm"
                  placeholder="City"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1 w-[45%] max-w-[50%]">
                <label htmlFor="postalCode" className="text-sm leading-[21px]">
                  {t("postalCode")} <span className="text-red-500">*</span>{" "}
                </label>

                <input
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, postCode: e.target.value })
                  }
                  value={formData.postCode} // Bind value to state
                  id="postalCode"
                  className="px-2 py-2 border-2 rounded-md placeholder:text-sm"
                  placeholder="Postal Code"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="shippingAddress"
                className="text-sm leading-[21px]"
              >
                {t("shippingAddress")} <span className="text-red-500">*</span>{" "}
              </label>

              <input
                type="text"
                onChange={(e) =>
                  setFormData({ ...formData, shippingAddress: e.target.value })
                }
                value={formData.shippingAddress} // Bind value to state
                id="shippingAddress"
                className="px-2 py-2 border-2 rounded-md placeholder:text-sm"
                placeholder="Shipping Address"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="appointments" className="text-sm leading-[21px]">
                {t("apartmentStaircase")}
              </label>

              <input
                type="text"
                onChange={(e) =>
                  setFormData({ ...formData, appointments: e.target.value })
                }
                value={formData.appointments} // Bind value to state
                id="appointments"
                className="px-2 py-2 border-2 rounded-md placeholder:text-sm"
                placeholder="Apartment, Staircase, etc."
              />
            </div>
          </div>

          {/* Payment */}
          <h2 className="text-lg font-semibold text-[#FFFFFF]">
            {t("payment")}
          </h2>
          <div className="w-full mx-auto h-1 border-b-2 border-b-[#FDFDFD] mb-5" />

          <div className="bg-[#FDFDFD] p-5 rounded-lg space-y-3 mb-5">
            <div
              onClick={() => setPaymentMethod("bankTransfer")}
              className={`h-14 ${
                paymentMethod === "bankTransfer"
                  ? "border-2 border-[#FF9934]"
                  : ""
              } flex items-center justify-between gap-3 rounded-lg p-4`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "bankTransfer"} // Bind checked to state
                  onChange={() => setPaymentMethod("bankTransfer")}
                  className="w-6 h-6"
                />
                <h2 className="text-xs font-medium text-[#101010]">
                  {t("bankTransfer")}
                </h2>
              </div>
              <h3 className="text-sm font-medium text-[#101010]">$5,00</h3>
            </div>
            <div
              onClick={() => setPaymentMethod("payPalFees")}
              className={`h-14 ${
                paymentMethod === "payPalFees"
                  ? "border-2 border-[#FF9934]"
                  : ""
              } flex items-center justify-between gap-3 rounded-lg p-4`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "payPalFees"} // Bind checked to state
                  onChange={() => setPaymentMethod("payPalFees")}
                  className="w-6 h-6"
                />
                <h2 className="text-xs font-medium text-[#101010]">
                  {t("payPalFees")}
                </h2>
              </div>
              <h3 className="text-sm font-medium text-[#101010]">$5,00</h3>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="bg-[#FDFDFD] p-6">
          <button className="w-full h-14 bg-[#FF9934] rounded-lg text-[#FDFDFD] text-base font-semibold">
            {t("continue")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentInMobile;
