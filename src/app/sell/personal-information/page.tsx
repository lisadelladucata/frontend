"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/Container";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useGetASingleProductQuery,
  useSellUltimateProductMutation,
} from "@/redux/features/sell/SellProductAPI";
import Loading from "@/app/loading";
import { useCreateCustomerMutation } from "@/redux/features/customer/CustomerAPI";
import { useRouter } from "next/navigation";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  city: string;
  address: string;
  apartment: string;
  country: string;
  paymentMethod: "bank" | "paypal";
  paypalEmail: string;
  iban: string;
  acceptTerms: boolean;
}

interface UserSelectedOption {
  quesId: string;
  optionId: string;
}

export default function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [priceEstimate, setPriceEstimate] = useState<number>(0);
  const [productId, setProductId] = useState<string | null>(null);
  const [customerEmailOnlocalStorage, setCustomerEmailOnlocalStorage] =
    useState<string | null>(null);
  const [customerIdOnlocalStorage, setCustomerIdOnlocalStorage] = useState<
    string | null
  >(null);

  const [userSelectedOptions, setUserSelectedOptions] = useState<
    UserSelectedOption[]
  >([]);
  const router = useRouter();

  const [sellProduct] = useSellUltimateProductMutation();
  const [createCustomer] = useCreateCustomerMutation();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    zipCode: "",
    city: "",
    address: "",
    apartment: "",
    country: "",
    paymentMethod: "paypal",
    paypalEmail: "",
    iban: "",
    acceptTerms: false,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const { t } = useTranslation();

  const transformedData = userSelectedOptions.map((item) => ({
    quesId: item.quesId,
    optionId: item.optionId,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = {
      name: formData.firstName + " " + formData.lastName,
      email: formData.email,
      address: {
        address: formData.address,
        zip_code: formData.zipCode,
        city: formData.city,
        country: formData.country,
      },
      phone: formData.phone,
    };

    // if has nota customer, create a new customer first
    if (!customerIdOnlocalStorage || !productId) {
      const response = await createCustomer(newUser).unwrap();

      if (response?.success) {
        localStorage?.setItem("customer", JSON.stringify(response?.data));
        setCustomerIdOnlocalStorage(response?.data?._id);

        if (formData.paypalEmail || formData.iban) {
          const data = {
            customer: response?.data?._id,
            product: productId,
            questions: transformedData,
            payment: {
              paypal: formData.paypalEmail,
            },
          };

          const res = await sellProduct(data).unwrap();

          if (res?.success) {
            toast.success(res?.message);
          } else {
            toast.error(res?.message);
          }
        }
      }
    }

    if (
      (customerEmailOnlocalStorage && formData.paypalEmail) ||
      formData.iban
    ) {
      const data = {
        customer: customerIdOnlocalStorage,
        product: productId,
        questions: transformedData,
        payment: {
          paypal: formData.paypalEmail,
        },
      };

      const res = await sellProduct(data).unwrap();

      if (res?.success) {
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    }

    // set bank and paypal in localStrorage
    localStorage?.setItem("bank", JSON.stringify(formData.iban));
    localStorage?.setItem("paypal", JSON.stringify(formData.paypalEmail));

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      zipCode: "",
      city: "",
      address: "",
      apartment: "",
      country: "",
      paymentMethod: "paypal",
      paypalEmail: "",
      iban: "",
      acceptTerms: false,
    });

    setTimeout(() => {
      router.push("/sell");
    }, 400);
  };

  // get customer data from localStorage?
  useEffect(() => {
    const customerData = JSON.parse(
      localStorage?.getItem("customer") || "null"
    );

    if (customerData) {
      setFormData((prev) => ({
        ...prev,
        firstName: customerData.name.split(" ")[0],
        lastName: customerData.name.split(" ")[1] || "",
        address: customerData.address.address,
        zipCode: customerData.address.zip_code,
        city: customerData.address.city,
        country: customerData.address.country || "",
        email: customerData.email,
        phone: customerData.phone,
      }));

      setCustomerEmailOnlocalStorage(customerData.email);
      setCustomerIdOnlocalStorage(customerData._id);
    }
  }, []);

  // get product id from localStorage?
  useEffect(() => {
    const storedProductId = localStorage?.getItem("getEstimateProductId");
    if (storedProductId) {
      try {
        setProductId(JSON.parse(storedProductId));
      } catch {
        setProductId(null);
      }
    }
  }, []);

  // get product price from localStorage?
  useEffect(() => {
    const storedPrice = localStorage?.getItem("getEstimatePrice");
    if (storedPrice) {
      try {
        setPriceEstimate(JSON.parse(storedPrice));
      } catch {
        setPriceEstimate(0);
      }
    }
  }, []);

  // get user selected options from localStorage?
  useEffect(() => {
    const storedUserSelectedOptions = localStorage?.getItem(
      "userSelectedOptions"
    );
    if (storedUserSelectedOptions) {
      try {
        setUserSelectedOptions(JSON.parse(storedUserSelectedOptions));
      } catch {
        setUserSelectedOptions([]);
      }
    }
  }, []);

  const handlePayment = (method: string) => {
    setPaymentMethod(method);
  };

  const { data: product, isLoading } = useGetASingleProductQuery(
    productId as string
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {/* Desktop */}
      <div className='hidden md:block min-h-screen bg-[#F2F5F7] py-8'>
        <Container>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 py-12'>
            {/* Main Form */}
            <form onSubmit={handleSubmit} className='lg:col-span-2 space-y-8'>
              {/* Personal Information */}
              <div className='bg-white p-6 rounded-lg shadow-sm'>
                <h2 className='text-[32px] font-semibold text-[#101010] mb-6'>
                  {t("personalInformation")}
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label
                      htmlFor='firstName'
                      className='block text-lg font-medium text-[#101010] mb-1'
                    >
                      {t("firstName")}
                      <span className='text-red-500 font-semibold'>*</span>
                    </label>
                    <input
                      type='text'
                      id='firstName'
                      name='firstName'
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='lastName'
                      className='block text-lg font-medium text-[#101010] mb-1'
                    >
                      {t("lastName")}
                      <span className='text-red-500 font-semibold'>*</span>
                    </label>
                    <input
                      type='text'
                      id='lastName'
                      name='lastName'
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='email'
                    className='block text-lg font-medium text-[#101010] mb-1'
                  >
                    {t("email")}{" "}
                    <span className='text-red-500 font-semibold'>*</span>
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='phone'
                    className='block text-lg font-medium text-[#101010] mb-1'
                  >
                    {t("phone")}
                  </label>
                  <div className='flex'>
                    <div className='w-20 mr-2'>
                      <button
                        type='button'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md flex items-center justify-between'
                      >
                        <Image
                          src='/germany.png'
                          alt='German flag'
                          width={20}
                          height={15}
                          className='mr-1'
                        />
                        +42
                      </button>
                    </div>
                    <input
                      type='tel'
                      id='phone'
                      name='phone'
                      className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className='text-sm text-[#6B6B6B] mt-1'>
                    Please provide a mobile phone number in case we need to
                    contact you about your order.
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className='bg-white p-6 rounded-lg shadow-sm'>
                <h2 className='text-xl font-semibold mb-6'>{t("Address")}</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label
                      htmlFor='zipCode'
                      className='block text-lg font-medium text-[#101010] mb-1'
                    >
                      Postcode{" "}
                      <span className='text-red-500 font-semibold'>*</span>
                    </label>
                    <input
                      type='text'
                      id='zipCode'
                      name='zipCode'
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='city'
                      className='block text-lg font-medium text-[#101010] mb-1'
                    >
                      {t("townCity")}
                      <span className='text-red-500 font-semibold'>*</span>
                    </label>
                    <input
                      type='text'
                      id='city'
                      name='city'
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='address
'
                    className='block text-lg font-medium text-[#101010] mb-1'
                  >
                    {t("streetName")}{" "}
                    <span className='text-red-500 font-semibold'>*</span>
                  </label>
                  <input
                    type='text'
                    id='address'
                    name='address'
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='apartment'
                    className='block text-lg font-medium text-[#101010] mb-1'
                  >
                    {t("appointment")}
                  </label>
                  <input
                    type='text'
                    id='apartment'
                    name='apartment'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                    value={formData.apartment}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor='country'
                    className='block text-lg font-medium text-[#101010] mb-1'
                  >
                    Country{" "}
                    <span className='text-red-500 font-semibold'>*</span>
                  </label>
                  <select
                    id='country'
                    name='country'
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                    value={formData.country}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                  >
                    <option value=''>Select a country</option>
                    <option value='Italy'>Italy</option>
                    <option value='Germany'>Germany</option>
                    <option value='France'>France</option>
                    <option value='United Kingdom'>United Kingdom</option>
                  </select>
                </div>
              </div>

              {/* Payment */}
              <div className='bg-white p-6 rounded-lg shadow-sm'>
                <h2 className='text-xl font-semibold mb-6'>{t("payment")}</h2>
                <div className='space-y-4 mb-8'>
                  <label
                    onClick={() => handlePayment("bank")}
                    className='flex items-center justify-between p-4 border rounded-md'
                  >
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        name='paymentMethod'
                        value='bank'
                        checked={paymentMethod === "bank"}
                        onChange={handleInputChange}
                        className='h-4 w-4 text-blue-600 focus:ring-blue-500'
                      />
                      <span className='ml-2 text-[#101010] text-xl font-semibold'>
                        Bank transfer (IBAN)
                      </span>
                    </div>
                    <span className='font-medium'>${priceEstimate}</span>
                  </label>

                  {/* {formData.paymentMethod === "paypal" && ( */}
                  {paymentMethod === "bank" && (
                    <div className='pl-6'>
                      <label
                        htmlFor='iban'
                        className='block text-lg font-medium text-[#101010] mb-1'
                      >
                        Bank details, IBAN{" "}
                        <span className='text-red-500 font-semibold'>*</span>
                      </label>
                      <input
                        type='text'
                        id='iban'
                        name='iban'
                        required
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                        placeholder='Example: FI14 1009 3000 1234 58'
                        value={formData.iban}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>

                {/* Paypal Payment */}
                <div>
                  <div className='space-y-4'>
                    <label
                      onClick={() => handlePayment("paypal")}
                      className='flex items-center justify-between p-4 border rounded-md'
                    >
                      <div className='flex items-center'>
                        <input
                          type='radio'
                          name='paymentMethod'
                          value='bank'
                          checked={paymentMethod === "paypal"}
                          onChange={handleInputChange}
                          className='h-4 w-4 text-blue-600 focus:ring-blue-500'
                        />
                        <span className='ml-2 text-[#101010] text-xl font-semibold'>
                          PayPal: $5,00 minus $0,10 fees
                        </span>
                      </div>
                      <span className='font-medium'>${priceEstimate}</span>
                    </label>

                    {/* {formData.paymentMethod === "paypal" && ( */}
                    {paymentMethod === "paypal" && (
                      <div className='pl-6'>
                        <label
                          htmlFor='iban'
                          className='block text-lg font-medium text-[#101010] mb-1'
                        >
                          Email
                          <span className='text-red-500 font-semibold'>*</span>
                        </label>
                        <input
                          type='text'
                          id='iban'
                          name='iban'
                          required
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                          placeholder='Enter your paypal email'
                          value={formData.paypalEmail}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              paypalEmail: e.target.value,
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms and Submit */}
                <div className='space-y-4 mt-6'>
                  <button
                    type='submit'
                    className='w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors'
                  >
                    {t("send")}
                  </button>

                  <p className='ml-2 text-base text-[#2B2B2B]'>
                    {t("next5TermsOfSale1")}{" "}
                    <Link
                      href='#'
                      className='text-[#222C9B] font-medium hover:underline'
                    >
                      {t("next5TermsOfSale2")}
                    </Link>{" "}
                    {t("next5TermsOfSale3")}{" "}
                    <Link
                      href='#'
                      className='text-[#222C9B] font-medium hover:underline'
                    >
                      {t("next5TermsOfSale4")}
                    </Link>
                  </p>
                </div>
              </div>
            </form>

            {/* Summary */}
            <div className='lg:col-span-1'>
              <div className='bg-white p-6 rounded-lg shadow-sm sticky top-4'>
                <h2 className='text-2xl text-[#101010] font-semibold mb-6'>
                  {t("summary")}
                </h2>
                <div className='flex items-start space-x-4'>
                  <div className='w-20 h-20 relative flex-shrink-0'>
                    <Image
                      src={`${API_URL}${
                        product?.data?.image ? product?.data?.image : ""
                      }`}
                      // src={''}
                      alt='Playstation 4'
                      width={300}
                      height={300}
                      className='w-[127px] h-[120px] object-contain'
                    />
                  </div>
                  <div>
                    <h3 className='text-xl text-[#101010] font-medium mb-6'>
                      {product?.data?.name}
                    </h3>
                    <p className='text-lg text-[#2B2B2B]'>
                      {t("yourPriceEstimate")}
                    </p>
                    <p className='text-2xl text-[#101010] font-semibold'>
                      ${priceEstimate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* only for mobile */}
      <div className='md:hidden'>
        <div className="z-20 min-h-screen relative bg-[url('/sell/back_sell.png')] bg-cover bg-center overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className='p-5'>
              <h2 className='text-lg font-semibold text-[#FFFFFF]'>
                {t("personalInformation")}
              </h2>

              <div className='w-full mx-auto h-1 border-b-2 border-b-[#FDFDFD] mb-5' />

              <div className='bg-[#FDFDFD] p-3 rounded-lg space-y-3 mb-5'>
                <div className='flex items-center gap-6'>
                  <div className='flex-1 flex flex-col gap-1 w-[45%] max-w-[50%]'>
                    <label
                      htmlFor='firstName'
                      className='text-sm leading-[21px]'
                    >
                      {t("firstName")} <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      name='firstName'
                      onChange={handleInputChange}
                      value={formData.firstName}
                      id='firstName'
                      className='px-2 py-2 h-10 border-2 rounded-md placeholder:text-sm'
                      placeholder='First Name'
                      required
                    />
                  </div>

                  <div className='flex-1 flex flex-col gap-1 w-[45%] max-w-[50%]'>
                    <label
                      htmlFor='lastName'
                      className='text-sm leading-[21px]'
                    >
                      {t("lastName")} <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      name='lastName'
                      onChange={handleInputChange}
                      value={formData.lastName}
                      id='lastName'
                      className='px-2 py-2 border-2 rounded-md placeholder:text-sm'
                      placeholder='Last Name'
                      required
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-1 w-full'>
                  <label htmlFor='email' className='text-sm leading-[21px]'>
                    {t("email")} <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='email'
                    name='email'
                    onChange={handleInputChange}
                    value={formData.email}
                    id='email'
                    className='px-2 py-2 border-2 rounded-md placeholder:text-sm'
                    placeholder='Enter email'
                    required
                  />
                </div>

                <div className='flex flex-col gap-1 w-full'>
                  <label htmlFor='phone' className='text-sm leading-[21px]'>
                    {t("phoneNumber")} <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    onChange={handleInputChange}
                    value={formData.phone}
                    id='phone'
                    className='px-2 py-2 border-2 rounded-md placeholder:text-sm'
                    placeholder='Phone Number'
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <h2 className='text-lg font-semibold text-[#FFFFFF]'>
                {t("address")}
              </h2>

              <div className='w-full mx-auto h-1 border-b-2 border-b-[#FDFDFD] mb-5' />
              <div className='bg-[#FDFDFD] p-3 rounded-lg space-y-3 mb-5'>
                <div className='flex items-center gap-6'>
                  <div className='flex-1 flex flex-col gap-1 w-[45%] max-w-[50%]'>
                    <label htmlFor='city' className='text-sm leading-[21px]'>
                      {t("city")} <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      name='city'
                      onChange={handleInputChange}
                      value={formData.city}
                      id='city'
                      className='px-2 py-2 border-2 rounded-md placeholder:text-sm'
                      placeholder='City'
                      required
                    />
                  </div>

                  <div className='flex-1 flex flex-col gap-1 w-[45%] max-w-[50%]'>
                    <label htmlFor='zipCode' className='text-sm leading-[21px]'>
                      {t("postalCode")} <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      name='zipCode'
                      onChange={handleInputChange}
                      value={formData.zipCode}
                      id='zipCode'
                      className='px-2 py-2 border-2 rounded-md placeholder:text-sm'
                      placeholder='Postal Code'
                      required
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-1 w-full'>
                  <label htmlFor='address' className='text-sm leading-[21px]'>
                    {t("shippingAddress")}{" "}
                    <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='address'
                    name='address'
                    required
                    onChange={handleInputChange}
                    value={formData.address}
                    className='px-2 py-2 border-2 rounded-md placeholder:text-sm'
                    placeholder='Shipping Address'
                  />
                </div>

                <div className='flex flex-col gap-1 w-full'>
                  <label htmlFor='apartment' className='text-sm leading-[21px]'>
                    {t("apartmentStaircase")}
                  </label>
                  <input
                    type='text'
                    id='apartment'
                    name='apartment'
                    className='px-2 py-2 border-2 rounded-md placeholder:text-sm'
                    placeholder='Apartment, Staircase, etc.'
                    value={formData.apartment}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor='country'
                    className='block text-sm font-medium text-[#101010] mb-1'
                  >
                    Country{" "}
                    <span className='text-red-500 font-semibold'>*</span>
                  </label>
                  <select
                    id='country'
                    name='country'
                    required
                    aria-required='true'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                    value={formData.country}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                  >
                    {!formData.country && (
                      <option value='' disabled>
                        Select a country
                      </option>
                    )}
                    <option value='Italy'>Italy</option>
                    <option value='Germany'>Germany</option>
                    <option value='France'>France</option>
                    <option value='United Kingdom'>United Kingdom</option>
                  </select>
                </div>
              </div>

              {/* Payment */}
              <h2 className='text-lg font-semibold text-[#FFFFFF]'>
                {t("payment")}
              </h2>
              <div className='w-full mx-auto h-1 border-b-2 border-b-[#FDFDFD] mb-5' />

              <div className='bg-[#FDFDFD] p-5 rounded-lg space-y-3 mb-5'>
                <div
                  onClick={() => {
                    setPaymentMethod("bank");
                    setFormData((prev) => ({ ...prev, paymentMethod: "bank" }));
                  }}
                  className={`h-14 ${
                    paymentMethod === "bank" ? "border-2 border-[#FF9934]" : ""
                  } flex items-center justify-between gap-3 rounded-lg p-4`}
                >
                  <div className='flex items-center gap-3'>
                    <input
                      type='radio'
                      checked={paymentMethod === "bank"}
                      onChange={() => {
                        setPaymentMethod("bank");
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: "bank",
                        }));
                      }}
                      className='w-6 h-6'
                    />
                    <h2 className='text-xs font-medium text-[#101010]'>
                      {t("bankTransfer")}
                    </h2>
                  </div>
                  <h3 className='text-sm font-medium text-[#101010]'>
                    ${priceEstimate}
                  </h3>
                </div>

                {paymentMethod === "bank" && (
                  <div className='pl-6'>
                    <label
                      htmlFor='iban'
                      className='block text-sm font-medium text-[#101010] mb-1'
                    >
                      IBAN <span className='text-red-500 font-semibold'>*</span>
                    </label>
                    <input
                      type='text'
                      id='iban'
                      name='iban'
                      required={paymentMethod === "bank"}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                      placeholder='Example: FI14 1009 3000 1234 58'
                      value={formData.iban}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div
                  onClick={() => {
                    setPaymentMethod("paypal");
                    setFormData((prev) => ({
                      ...prev,
                      paymentMethod: "paypal",
                    }));
                  }}
                  className={`h-14 ${
                    paymentMethod === "paypal"
                      ? "border-2 border-[#FF9934]"
                      : ""
                  } flex items-center justify-between gap-3 rounded-lg p-4`}
                >
                  <div className='flex items-center gap-3'>
                    <input
                      type='radio'
                      checked={paymentMethod === "paypal"}
                      onChange={() => {
                        setPaymentMethod("paypal");
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: "paypal",
                        }));
                      }}
                      className='w-6 h-6'
                    />
                    <h2 className='text-xs font-medium text-[#101010]'>
                      {t("payPalFees")}
                    </h2>
                  </div>
                  <h3 className='text-sm font-medium text-[#101010]'>
                    ${priceEstimate}
                  </h3>
                </div>

                {paymentMethod === "paypal" && (
                  <div className='pl-6'>
                    <label
                      htmlFor='paypalEmail'
                      className='block text-sm font-medium text-[#101010] mb-1'
                    >
                      PayPal Email{" "}
                      <span className='text-red-500 font-semibold'>*</span>
                    </label>
                    <input
                      type='email'
                      id='paypalEmail'
                      name='paypalEmail'
                      required={paymentMethod === "paypal"}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                      placeholder='Enter your PayPal email'
                      value={formData.paypalEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Continue Button */}
            <div className='bg-[#FDFDFD] p-6'>
              <button
                type='submit'
                className='w-full h-14 bg-[#FF9934] rounded-lg text-[#FDFDFD] text-base font-semibold'
              >
                {t("continue")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
