// app/pages/ProductPage.tsx (Componente Completo Aggiornato)

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";

import Container from "@/components/common/Container";
import { useTranslation } from "react-i18next";
// Assicurati che il path sia corretto per la tua implementazione Redux/API
import { useGetAllProductsQuery } from "@/redux/features/products/ProductAPI";
import Loading from "@/app/loading"; // Assicurati che il path sia corretto
import ProductCard from "@/components/buy/ProductCard"; // Importazione default (come nel tuo file fornito)
import ProductSidebar from "@/components/buy/ProductSidebar";
import MobileHeader from "@/components/buy/MobileHeader";
import ReviewCarousel from "@/components/share/review-carousel/ReviewCarousel";
import { useDispatch } from "react-redux";
import { modifiedCart } from "@/redux/features/cart/TrackCartItem";
import { useRouter } from "next/navigation"; // Aggiungi questo se vuoi reindirizzare
import TrustSection from "@/components/buy/TrustSection";
import Accordion from "@/components/accordion/Accordion";

const ProductPage: React.FC = () => {
  // === STATI PRINCIPALI ===
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterView, setFilterView] = useState(false); // Controlla l'overlay filtri mobile
  const { t } = useTranslation(); // === STATI FILTRI ===

  const dispatch = useDispatch();
  const router = useRouter();

  const [searchProduct, setSearchProduct] = useState<string>("");
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [priceRange, setPriceRange] = useState<
    [number | string, number | string]
  >(["", ""]);
  const [condition, setCondition] = useState<string>("");
  const [openAccordion, setOpenAccordion] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>(""); // === CHIAMATA API (Redux Toolkit Query) ===

  const { data: products, isLoading } = useGetAllProductsQuery({
    product_type: searchProduct,
    brand: brandSearch,
    price: priceRange.length ? priceRange : undefined,
    condition: condition,
    sortBy: sortBy,
    limit: 1000, // Esempio di limite prodotti per pagina
    page: currentPage,
  } as any);

  const totalPages = Number(products?.data?.meta?.pagination?.total_pages) || 1; // === GESTIONE CARICAMENTO ===

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  } // === LOGICA CAMBIO PREZZO (Range Selection) ===

  const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    let min = null;
    let max = null;

    switch (value) {
      case "below100":
        min = 0;
        max = 100;
        break;
      case "100to300":
        min = 100;
        max = 300;
        break;
      case "300to500":
        min = 300;
        max = 500;
        break;
      case "up500":
        min = 500;
        break;
      default:
        min = null;
        max = null;
    } // Imposta il range di prezzo

    setPriceRange([min ?? "", max ?? ""]);
  };

  const handleAddToCart = (product: any) => {
    // 1. Notifica Redux dell'azione
    dispatch(modifiedCart({}));

    const existingCart = JSON.parse(localStorage?.getItem("cart") || "[]");

    const newProduct = {
      productId: product._id,
      quantity: 1,
      name: product.name,
      price: product.offer_price,
      // Aggiungi altri campi essenziali per il carrello (es. immagine, slug se necessario)
    };

    // 2. Controllo duplicati e aggiornamento
    const isDuplicate = existingCart.some(
      (item: any) => item.productId === newProduct.productId
    );

    if (isDuplicate) {
      const updatedCart = existingCart.map((item: any) => {
        if (item.productId === newProduct.productId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      localStorage?.setItem("cart", JSON.stringify(updatedCart));
      console.info(
        `Aggiunta un'altra unità di ${newProduct.name} al carrello.`
      );
    } else {
      console.log(`${newProduct.name} aggiunto al carrello!`);
      existingCart.push(newProduct);
      localStorage?.setItem("cart", JSON.stringify(existingCart));
    }
    router.push("/cart");
  };

  /*------------------------------------------------------------------------*/
  return (
    <div className="relative bg-[#F2F5F7] py-8">
      <Container>
        {/* === INTESTAZIONE MOBILE === */}
        <MobileHeader setFilterView={setFilterView} />
        <div className="flex">
          {/* === 1. SIDEBAR (FILTRI/OVERLAY) === */}

          <ProductSidebar
            t={t}
            products={products}
            filterView={filterView}
            setFilterView={setFilterView}
            currentSearchProduct={searchProduct}
            currentBrandSearch={brandSearch}
            currentCondition={condition}
            setSearchProduct={setSearchProduct}
            setBrandSearch={setBrandSearch}
            handlePriceChange={handlePriceChange}
            setCondition={setCondition}
          />
          {/* === 2. GRIGLIA PRODOTTI === */}
          <div className="w-full lg:w-3/4 lg:ml-6">
            {/* View Toggle / Sorting (Solo Desktop) */}
            <div className="hidden lg:flex lg:bg-[#FDFDFD] justify-between items-center p-2.5 rounded-md mb-4">
              {/* view - grid / list */}

              <div className="flex gap-2 items-center cursor-pointer">
                <div
                  onClick={() => setView("grid")}
                  className={`hover:bg-[#DAEDF2] p-3 rounded-lg ${
                    view === "grid" ? "bg-[#DAEDF2]" : ""
                  }`}>
                  <Image
                    src="/sell/grid.svg"
                    width={20}
                    height={20}
                    alt="grid"
                  />
                </div>

                <div
                  onClick={() => setView("list")}
                  className={`hover:bg-[#DAEDF2] p-3 rounded-lg ${
                    view === "list" ? "bg-[#DAEDF2]" : ""
                  }`}>
                  <Image
                    src="/sell/list.svg"
                    width={20}
                    height={20}
                    alt="grid"
                  />
                </div>
              </div>
              {/* sorting */}
              <div className="h-10 relative flex gap-3">
                <select
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-40 md:w-56 px-2.5 py-2 border border-[#101010] rounded-md font-medium text-sm bg-transparent lg:bg-[#FDFDFD] text-[#101010] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer">
                  <option
                    defaultValue={"Sort By"}
                    value={""}
                    className="text-[#101010]">
                    {t("sortBy")}
                  </option>

                  <option value="max_price">{t("highToLow")}</option>
                  <option value="min_price">{t("lowToHigh")}</option>
                </select>

                <div className="absolute inset-y-0 -right-2 flex items-center pr-3 pointer-events-none">
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
            {/* Messaggio Nessun Prodotto */}
            {products?.data?.products?.length < 1 ? (
              <div className="flex items-center justify-center h-[calc(100vh-200px)] text-2xl font-medium">
                Nessuna Console Trovata
              </div>
            ) : null}
            {/* Products (Grid logic) */}
            {/* Nota: L'attuale ProductCard è ottimizzato per il layout 'list' (immagine a sinistra), 
            ma lo riutilizziamo qui per il layout 'grid' */}
            {view === "grid" ? (
              <div className={`grid grid-cols-1 gap-6`}>
                {/* ERA: grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 */}
                {products?.data?.products?.map((product: any) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    layout="grid"
                    handleAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : null}
            {/* Products (List logic) */}
            {/* Già grid-cols-1, ma mantenuto per coerenza */}
            {view === "list" ? (
              <div className={`grid grid-cols-1 gap-4`}>
                {products?.data?.products?.map((product: any) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    layout="list"
                    handleAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : null}
            {/* Paginazione */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 my-12">
                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center bg-transparent mr-2 disabled:opacity-50">
                  <ChevronLeft />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-10 h-10 flex items-center justify-center rounded-md ${
                      currentPage === pageNumber
                        ? "bg-black text-white"
                        : "bg-transparent border-2 border-[#101010]"
                    }`}>
                    {pageNumber}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center bg-transparent ml-2 disabled:opacity-50">
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
        {/* ACCORDION (Descrizione, Garanzia, FAQ) */}
        <div className="px-5 pb-8 mt-6">
          <Accordion
            productName={products.product?.name || ""}
            productType={""}
            productSpecs={products.product?.technical_specs}
            productDescription={
              products.product?.long_description ||
              products.product?.description ||
              ""
            }
            modelDes={products.product?.modelDes}
            controllerDes={products.product?.controllerDes}
            memoryDes={products.product?.memoryDes}
            conditionDes={products.product?.conditionDes}
          />
        </div>
        {/* ------------------------------------------------------------------ */}
        {/* NUOVA SEZIONE: Vantaggi e Pagamento a Rate */}
        {/* ------------------------------------------------------------------ */}
        <TrustSection className="px-5 py-4" innerBlockBgClass="bg-[#FDFDFD]" />{" "}
        <div className="mt-6">
          <ReviewCarousel productName={products.name} theme="white" />
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
