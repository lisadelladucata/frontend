// components/ProductSidebar.tsx

import React from "react";
import { X } from "lucide-react";

interface ProductSidebarProps {
  t: (key: string) => string;
  products: any; // Dati dei prodotti/meta
  filterView: boolean; // Stato: se i filtri mobile sono aperti (overlay)
  setFilterView: (view: boolean) => void; // Funzione per chiudere i filtri

  // Stati attuali del filtro (necessari per controllare il valore della select)
  currentSearchProduct: string;
  currentBrandSearch: string;
  currentCondition: string;

  setSearchProduct: (value: string) => void;
  setBrandSearch: (value: string) => void;
  handlePriceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setCondition: (value: string) => void;
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({
  t,
  products,
  filterView,
  setFilterView,
  setSearchProduct,
  setBrandSearch,
  handlePriceChange,
  setCondition,
  currentSearchProduct,
  currentBrandSearch,
  currentCondition,
}) => {
  // Funzione di utilità per capitalizzare la prima lettera dei filtri
  const capitalize = (s: string) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  // Estrai i dati meta
  const productMeta = products?.data?.meta?.product_meta;

  // LOGICA PER ELIMINARE I DUPLICATI
  const uniqueBrands = Array.from(new Set(productMeta?.brands || []));
  const uniqueProductTypes = Array.from(
    new Set(productMeta?.product_types || [])
  );
  const uniqueConditions = Array.from(new Set(productMeta?.conditions || []));

  return (
    <>
      {/* === Sidebar per Desktop / Overlay per Mobile === */}
      <div
        className={`
          w-full lg:w-1/4 lg:block
          ${filterView ? "fixed inset-0 z-50 overflow-y-auto" : "hidden"}
        `}>
        {/* Contenitore Sidebar con sfondo bianco e scroll (per mobile overlay) */}
        <div className={`bg-white rounded-md h-full pb-5`}>
          {/* Titolo Filtri (Solo Desktop) */}
          <h3 className="hidden lg:flex text-[32px] text-[#101010] px-5 pt-4 pb-3 border-b font-semibold mb-4">
            {t("filter")}
          </h3>

          {/* Filtri per Mobile (Overlay) */}
          {filterView && (
            <div className="p-5 lg:hidden">
              {/* Intestazione Overlay Semplice con bottone di chiusura X */}
              <div className="flex items-center justify-between mb-4 pt-4 border-b pb-3">
                <h4 className="font-semibold text-xl">{t("filter")}</h4>
                <X
                  onClick={() => setFilterView(false)}
                  className="cursor-pointer w-6 h-6"
                />
              </div>

              {/* Controlli Filtri Mobile */}
              {/* 1. Products Select Mobile */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2">{t("products")}</h4>
                <select
                  // USA LO STATO CORRENTE
                  value={currentSearchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="w-full text-[#6B6B6B] border border-gray-300 rounded-md outline-none px-4 py-2">
                  <option value="">{t("all")}</option>
                  {uniqueProductTypes.map((productType, ind) => {
                    // Type Guard per gestire 'unknown'
                    if (typeof productType !== "string") return null;
                    return (
                      <option key={ind} value={productType}>
                        {capitalize(productType)}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* 2. Brand Select Mobile */}
              <div className="mb-4">
                <h4 className="text-[#101010] text-xl font-semibold mb-2">
                  {t("brand")}
                </h4>
                <select
                  // USA LO STATO CORRENTE
                  value={currentBrandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full text-[#6B6B6B] border border-gray-300 rounded-md outline-none px-4 py-2">
                  <option value="">{t("all")}</option>
                  {uniqueBrands.map((brand, ind) => {
                    // Type Guard per gestire 'unknown'
                    if (typeof brand !== "string") return null;
                    return (
                      <option key={ind} value={brand}>
                        {capitalize(brand)}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* 3. Price Range Select Mobile */}
              <div className="mb-4">
                <h4 className="text-[#101010] text-xl font-semibold mb-2">
                  {t("priceRange")}
                </h4>
                <select
                  onChange={handlePriceChange}
                  className="w-full text-[#6B6B6B] border border-gray-300 rounded-md outline-none px-4 py-2">
                  <option value="">{t("all")}</option>
                  <option value="below100">{t("below100")}</option>
                  <option value="100to300">{t("100to300")}</option>
                  <option value="300to500">{t("300to500")}</option>
                  <option value="up500">{t("upFiveHundread")}</option>
                </select>
              </div>

              {/* 4. Condition Select Mobile */}
              <div className="mb-4">
                <h4 className="text-[#101010] text-xl font-semibold mb-2">
                  {t("condition")}
                </h4>
                <select
                  // USA LO STATO CORRENTE
                  value={currentCondition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full text-[#6B6B6B] border border-gray-300 rounded-md outline-none px-4 py-2">
                  <option value="">{t("all")}</option>
                  {uniqueConditions.map((condition, ind) => {
                    // Type Guard per gestire 'unknown'
                    if (typeof condition !== "string") return null;
                    return (
                      <option key={ind} value={condition}>
                        {capitalize(condition)}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                onClick={() => setFilterView(false)}
                className="bg-black text-white text-lg w-full rounded-xl py-3 mt-4">
                {t("filter")}
              </button>
            </div>
          )}

          {/* Filtri per Desktop (Visibili solo su schermi grandi) */}
          <div className="hidden lg:block pb-3 mx-4 pt-2">
            {/* 1. Products Select Desktop */}
            <div className="relative mb-5 border-b-[.75px] border-[#969696]">
              <h4 className="text-[#101010] text-xl font-semibold mb-2 px-4">
                {t("products")}
              </h4>
              <select
                // USA LO STATO CORRENTE
                value={currentSearchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="w-full text-[#6B6B6B] appearance-none border-none outline-none p-4">
                <option value="">{t("all")}</option>
                {uniqueProductTypes.map((productType, idx) => {
                  // Type Guard per gestire 'unknown'
                  if (typeof productType !== "string") return null;
                  return (
                    <option key={idx} value={productType}>
                      {capitalize(productType)}
                    </option>
                  );
                })}
              </select>
              {/* Icona Freccia (Down) */}
              <div className="absolute bottom-4 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-6 h-6 text-[#101010]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* 2. Brand Select Desktop */}
            <div className="relative mb-5 border-b-[.75px] border-[#969696]">
              <h4 className="text-[#101010] text-xl font-semibold mb-2 px-4">
                {t("brand")}
              </h4>
              <select
                // USA LO STATO CORRENTE
                value={currentBrandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="w-full text-[#6B6B6B] appearance-none border-none outline-none p-4">
                <option value="">{t("all")}</option>
                {uniqueBrands.map((brand, ind) => {
                  // Type Guard per gestire 'unknown'
                  if (typeof brand !== "string") return null;
                  return (
                    <option key={ind} value={brand}>
                      {capitalize(brand)}
                    </option>
                  );
                })}
              </select>
              {/* Icona Freccia (Down) */}
              <div className="absolute bottom-4 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-6 h-6 text-[#101010]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* 3. Price Range Select Desktop */}
            <div className="relative mb-5 border-b-[.75px] border-[#969696]">
              <h4 className="text-[#101010] text-xl font-semibold mb-2 px-4">
                {t("priceRange")}
              </h4>
              <select
                onChange={handlePriceChange}
                className="w-full text-[#6B6B6B] appearance-none border-none outline-none p-4">
                <option value="">{t("all")}</option>
                <option value="below100">{t("below100")}</option>
                <option value="100to300">{t("100to300")}</option>
                <option value="300to500">{t("300to500")}</option>
                <option value="up500">{t("upFiveHundread")}</option>
              </select>
              {/* Icona Freccia (Down) */}
              <div className="absolute bottom-4 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-6 h-6 text-[#101010]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* 4. Condition Select Desktop */}
            <div className="relative mb-5 border-b-[.75px] border-[#969696]">
              <h4 className="text-[#101010] text-xl font-semibold mb-2 px-4">
                {t("condition")}
              </h4>
              <select
                // USA LO STATO CORRENTE
                value={currentCondition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full text-[#6B6B6B] appearance-none border-none outline-none p-4">
                <option value="">{t("all")}</option>
                {uniqueConditions.map((condition, ind) => {
                  // Type Guard per gestire 'unknown'
                  if (typeof condition !== "string") return null;
                  return (
                    <option key={ind} value={condition}>
                      {capitalize(condition)}
                    </option>
                  );
                })}
              </select>
              {/* Icona Freccia (Down) */}
              <div className="absolute bottom-4 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-6 h-6 text-[#101010]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay scuro per mobile quando il filtro è aperto */}
      {filterView && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setFilterView(false)}
        />
      )}
    </>
  );
};

export default ProductSidebar;
