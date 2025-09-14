"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileMenu } from "./Mobile-Menu";
import LanguageSelector from "../languageSelector/LanguageSelector";
import { useTranslation } from "react-i18next";
import { useGetAllProductsQuery } from "@/redux/features/products/ProductAPI";
import { useSelector } from "react-redux";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [filterableProductType, setFilterableProductType] = useState<string[]>(
    []
  );
  const [cartLength, setCartLength] = useState(0);

  const isFirstRender = useRef(true);

  const { data: products } = useGetAllProductsQuery({ limit: 10000 });

  const isAggreed = useSelector((state: any) => state.trackCartSlice.isAggreed);

  useEffect(() => {
    if (isFirstRender.current && products?.data?.products?.length > 0) {
      const filterableProducts = products.data.products.map(
        (product: any) => product.product_type
      );

      isFirstRender.current = false;

      setFilterableProductType([...new Set(filterableProducts)] as string[]);
    }
  }, [products]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show on scroll up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const storedCart = localStorage?.getItem("cart");

    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartLength(parsedCart.length);
      } catch (error) {
        console.error("Error parsing cart data:", error);
        setCartLength(0);
      }
    }
  }, [isAggreed]);

  return (
    <header className='top-0 md:pt-4 w-full  border-b bg-[#F2F5F7]'>
      <div
        className='
       h-14 lg:h-[96px] container mx-auto flex items-center justify-between px-4'
      >
        <div className='flex items-center'>
          <Button
            variant='ghost'
            size='icon'
            className='mr-2 lg:hidden absolute left-2.5'
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={32} className='text-gray-700' />
            <span className='sr-only'>Toggle menu</span>
          </Button>

          <Link
            href='/'
            className='absolute md:static left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 flex items-center space-x-1'
          >
            <div className='relative h-8 w-44 pt-1'>
              <Image
                src='/home/logo.png'
                alt='Console Locker'
                width={700}
                height={200}
                className='object-contain'
              />
            </div>
          </Link>
          <Link href='/cart' className='md:hidden absolute md:static right-5'>
            <div className='relative'>
              <ShoppingCart className='h-6 w-6' />
              <span className='absolute px-2 py-[2px] bg-green-500 text-black rounded-full text-xs -top-3 -right-2.5'>
                {cartLength}
              </span>
            </div>
          </Link>
        </div>

        <nav className='hidden lg:flex items-center space-x-3 lg:space-x-12'>
          <Link href='/' className='text-sm font-medium'>
            Home
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center space-x-1.5 text-sm font-medium'>
              <span>Acquista</span>
              <ChevronDown className='h-4 w-4' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <DropdownMenuItem>
                <Link href='/buy/playstation' className='w-full px-5'>
                  PlayStation
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href='/buy/xbox' className='w-full px-5'>
                  Xbox
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href='/buy/nintendo' className='w-full px-5'>
                  Nintendo
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href='/sell' className='text-sm font-medium'>
            Vendi
          </Link>

          <Link href='/about' className='text-sm font-medium'>
            Chi Siamo
          </Link>
          <Link href='/reviews' className='text-sm font-medium'>
            Recensioni
          </Link>
          <Link href='/contact' className='text-sm font-medium'>
            Contatto
          </Link>
        </nav>

        {/* hide in mobile menu */}
        <div className='hidden lg:flex items-center space-x-4'>
          <Link href='/cart' className='p-2 relative'>
            <ShoppingCart className='h-5 w-5' />
            <span className='absolute px-2 py-[2px] bg-green-500 text-black rounded-full text-xs -top-1 -right-1'>
              {cartLength}
            </span>
          </Link>

          <div className='hidden sm:flex items-center space-x-1 text-sm font-medium cursor-pointer'>
            <LanguageSelector />
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
      />
    </header>
  );
}
