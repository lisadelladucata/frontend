"use client";

import dynamic from "next/dynamic";

const Component = dynamic(() => import("./Component"), {
  ssr: false,
});

export default Component;
