"use client";

import dynamic from "next/dynamic";

const CartPage = dynamic(() => import("./CartPage"), {
  ssr: false,
});

export default CartPage;
