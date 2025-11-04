"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const models = [
  { id: 1, title: "ONE" },
  { id: 2, title: "ONE S" },
  { id: 3, title: "ONE S - DIGITAL" },
  { id: 4, title: "ONE X" },
];

const storages = [
  {
    id: 1,
    title: "500 GB",
  },
  {
    id: 2,
    title: "1 TB",
  },
];

const conditions = [
  {
    id: 1,
    title: "NOT BAD",
  },
  {
    id: 2,
    title: "GOOD",
  },
  {
    id: 3,
    title: "NEW",
  },
];

const functionals = [
  { id: 1, title: "SI" },
  { id: 2, title: "NO" },
];

const controllers = [
  { id: 1, title: "+0" },
  { id: 2, title: "+1" },
  { id: 3, title: "+2" },
];

const accessories = [
  { id: 1, title: "SL" },
  { id: 2, title: "NO" },
];

const MobileProductDetails = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [storage, setStorage] = useState("");
  const [modal, setModal] = useState("");
  const [condition, setCondition] = useState("");
  const [functional, setFunctional] = useState("");
  const [controller, setController] = useState("");
  const [accessory, setAccessory] = useState("");

  return (
    <div>
      <div className="w-full">
        <Image
          src={"/sell/product-detail.png"}
          className="w-full"
          width={700}
          height={800}
          alt="xbox"
        />
      </div>

      {/* Select the Xbox One model */}
      <div>
        <div className="flex items-center justify-center pt-14 space-x-2.5">
          <hr className="flex-1 border-b-2 border-gray-300" />
          <h2
            className={
              "bg-[#FDFDFD] py-4 px-8 rounded-lg shadow-md text-[#101010] text-xl font-semibold text-center whitespace-nowrap"
            }>
            {t("consoleHeaderTitle")}
          </h2>
          <hr className="flex-1 border-b-2 border-gray-300" />
        </div>

        {/* Select the Xbox One model */}

        <div className="flex flex-col gap-4 px-5 py-5">
          {models?.map((mod) => (
            <div
              key={mod?.id}
              onClick={() => setModal(mod.title)}
              className={`h-16 rounded-md flex items-center justify-center ${
                mod.title === modal
                  ? "bg-[#64B95E] text-[#FDFDFD]"
                  : "bg-[#DDDEE3]"
              } border border-[#919191] text-center text-2xl font-semibold leading-[36px]`}>
              {mod?.title}
            </div>
          ))}
        </div>
      </div>

      {/* What is the storage capacity? (Not applicable for Xbox One X) */}
      <div>
        <div className="flex items-center justify-center pt-14 space-x-2.5">
          <hr className="flex-1 border-b-2 border-gray-300" />
          <h2
            className={
              "bg-[#FDFDFD] py-4 px-8 rounded-lg shadow-md text-[#101010] text-lg font-medium text-center whitespace-wrap"
            }>
            {t("storageCapacity")}
          </h2>
          <hr className="flex-1 border-b-2 border-gray-300" />
        </div>

        <div className="p-5 flex items-center gap-4">
          {storages?.map((storg: { id: number; title: string }) => (
            <div
              key={storg.id}
              onClick={() => setStorage(storg.title)}
              className={`${
                storg.title === storage
                  ? "bg-[#64B95E] text-[#FDFDFD]"
                  : "bg-[#DDDEE3]"
              } text-xl text-[#101010] font-semibold w-[98px] h-[106px] text-center flex items-center justify-center rounded-md`}>
              {storg.title}
            </div>
          ))}
        </div>
      </div>

      {/* What is the condition of your console? */}
      <div>
        <div className="flex items-center justify-center pt-14 space-x-2.5">
          <hr className="flex-1 border-b-2 border-gray-300" />
          <h2
            className={
              "bg-[#FDFDFD] py-4 px-8 rounded-lg shadow-md text-[#101010] text-lg font-medium text-center whitespace-wrap"
            }>
            {t("consoleCondition")}
          </h2>
          <hr className="flex-1 border-b-2 border-gray-300" />
        </div>

        <div className="p-5 flex items-center gap-4">
          {conditions?.map((cond: { id: number; title: string }) => (
            <div
              key={cond.id}
              onClick={() => setCondition(cond.title)}
              className={`${
                cond.title === condition
                  ? "bg-[#64B95E] text-[#FDFDFD]"
                  : "bg-[#DDDEE3]"
              } text-xl text-[#101010] font-semibold w-[198px] h-[106px] text-center flex items-center justify-center rounded-md p-4`}>
              {cond.title}
            </div>
          ))}
        </div>
      </div>

      {/* TODO: do it later */}
      {/* BRAND */}
      <div className="p-5">
        <div className="border-2 border-[#64B95E]  p-3 rounded-lg">
          <p className="border-b-2 border-dashed inline-block">
            <span className="text-[#64B95E] inline-block">NEW:</span> The device
            is in perfect condition and has no signs
          </p>
          <p className="border-b-2 border-dashed">
            of wear or scratches. Its functionality is equivalent to a factory-
          </p>
          <p className="border-b-2 border-dashed">
            fresh item, responsiveness to commands is instantaneous, and it
          </p>
          <p className="border-b-2 border-dashed">
            does not have any overheating issues.
          </p>
        </div>
      </div>

      {/* Is the console fully functional and free of technical defects? */}
      <div>
        <div className="flex items-center justify-center pt-14 space-x-2.5">
          <hr className="flex-1 border-b-2 border-gray-300" />
          <h2
            className={
              "bg-[#FDFDFD] py-4 px-[14px] rounded-lg shadow-md text-[#101010] text-lg font-medium text-center whitespace-wrap"
            }>
            {t("consoleFullyFunctional")}
          </h2>
          <hr className="flex-1 border-b-2 border-gray-300" />
        </div>

        <div className="p-5 flex items-center gap-4">
          {functionals?.map((func: { id: number; title: string }) => (
            <div
              key={func.id}
              onClick={() => setFunctional(func.title)}
              className={`${
                func.title === functional
                  ? "bg-[#64B95E] text-[#FDFDFD]"
                  : "bg-[#DDDEE3]"
              } text-xl text-[#101010] font-semibold w-[198px] h-[106px] text-center flex items-center justify-center rounded-md p-4`}>
              {func.title}
            </div>
          ))}
        </div>
      </div>

      {/* How many controllers will you send us? */}
      <div>
        <div className="flex items-center justify-center pt-14 space-x-2.5">
          <hr className="flex-1 border-b-2 border-gray-300" />
          <h2
            className={
              "bg-[#FDFDFD] py-4 px-[14px] rounded-lg shadow-md text-[#101010] text-lg font-medium text-center whitespace-wrap"
            }>
            {t("consoleControllers")}
          </h2>
          <hr className="flex-1 border-b-2 border-gray-300" />
        </div>

        <div className="p-5 flex items-center gap-4">
          {controllers?.map((cont: { id: number; title: string }) => (
            <div
              key={cont.id}
              onClick={() => setController(cont.title)}
              className={`${
                cont.title === controller
                  ? "bg-[#64B95E] text-[#FDFDFD]"
                  : "bg-[#DDDEE3]"
              } text-xl text-[#101010] font-semibold w-[198px] h-[106px] text-center flex items-center justify-center rounded-md p-4`}>
              {cont.title}
            </div>
          ))}
        </div>
      </div>

      {/* How many controllers will you send us? */}
      <div>
        <div className="flex items-center justify-center pt-14 space-x-2.5">
          <hr className="flex-1 border-b-2 border-gray-300" />
          <h2
            className={
              "bg-[#FDFDFD] py-4 px-[14px] rounded-lg shadow-md text-[#101010] text-lg font-medium text-center whitespace-wrap"
            }>
            {t("originalAccessories")}
          </h2>
          <hr className="flex-1 border-b-2 border-gray-300" />
        </div>

        <div className="p-5 flex items-center gap-4">
          {accessories?.map((access: { id: number; title: string }) => (
            <div
              key={access.id}
              onClick={() => setAccessory(access.title)}
              className={`${
                access.title === accessory
                  ? "bg-[#64B95E] text-[#FDFDFD]"
                  : "bg-[#DDDEE3]"
              } text-xl text-[#101010] font-semibold w-[198px] h-[106px] text-center flex items-center justify-center rounded-md p-4`}>
              {access.title}
            </div>
          ))}
        </div>
      </div>

      {/* How many controllers will you send us? */}
      <div>
        <div className="flex items-center justify-center pt-14 space-x-2.5">
          <hr className="flex-1 border-b-2 border-gray-300" />
          <h2
            className={
              "bg-[#FDFDFD] py-4 px-[14px] rounded-lg shadow-md text-[#101010] text-lg font-medium text-center whitespace-wrap"
            }>
            {t("leaveUsANote")}
          </h2>
          <hr className="flex-1 border-b-2 border-gray-300" />
        </div>

        <div className="p-5">
          <div className="border-2 border-[#64B95E] p-3 rounded-lg">
            <p className="border-b-2 border-dashed">
              <span className="text-[#64B95E]">NEW:</span> The device is in
              perfect condition and has no signs
            </p>
            <p className="border-b-2 border-dashed">
              of wear or scratches. Its functionality is equivalent to a
              factory-
            </p>
            <p className="border-b-2 border-dashed">
              fresh item, responsiveness to commands is instantaneous, and it
            </p>
            <p className="border-b-2 border-dashed">
              does not have any overheating issues.
            </p>
          </div>
        </div>
      </div>

      {/* submit button */}

      <div className="p-5 bg-[#FDFDFD]">
        <Link href={"/sell/summary"}>
          <button className="w-full text-[#FDFDFD] font-semibold bg-[#64B95E] h-14 rounded-lg">
            SUBMIT FORM
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MobileProductDetails;
