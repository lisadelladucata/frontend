"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({ isOpen, onOpenChange }: MobileMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side='left'
        className='w-[299px] sm:w-[400px] bg-[#DAEDF2] text-[#5F5F5F]'
      >
        <SheetHeader>
          <SheetTitle className='text-left'>Menu</SheetTitle>
        </SheetHeader>
        <div className='mt-8 flex flex-col space-y-8'>
          <Link
            href='/'
            className='text-lg font-medium'
            onClick={() => onOpenChange(false)}
          >
            Home
          </Link>
          <Accordion type='single' collapsible className='-my-10 border-none'>
            <AccordionItem value='buy'>
              <AccordionTrigger className='text-lg font-medium'>
                Buy
              </AccordionTrigger>
              <AccordionContent>
                <div className='flex flex-col space-y-6 pl-4 bg-[#FDFDFD] py-3 px-5 rounded-lg'>
                  <Link
                    href='/buy/playstation'
                    className='text-sm'
                    onClick={() => onOpenChange(false)}
                  >
                    PlayStation
                  </Link>
                  <Link
                    href='/buy/xbox'
                    className='text-sm'
                    onClick={() => onOpenChange(false)}
                  >
                    Xbox
                  </Link>
                  <Link
                    href='/buy/nintendo'
                    className='text-sm'
                    onClick={() => onOpenChange(false)}
                  >
                    Nintendo
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Link
            href='/sell'
            className='text-lg font-medium'
            onClick={() => onOpenChange(false)}
          >
            Sell
          </Link>
          <Link
            href='/repair'
            className='text-lg font-medium'
            onClick={() => onOpenChange(false)}
          >
            Repair
          </Link>
          <Link
            href='/about'
            className='text-lg font-medium'
            onClick={() => onOpenChange(false)}
          >
            About
          </Link>
          <Link
            href='/reviews'
            className='text-lg font-medium'
            onClick={() => onOpenChange(false)}
          >
            Reviews
          </Link>
          <Link
            href='/contact'
            className='text-lg font-medium'
            onClick={() => onOpenChange(false)}
          >
            Contact
          </Link>
        </div>

        {/* social links */}
        {/* <div className='absolute bottom-1'>
          <div className='flex items-center justify-between mt-auto'>
            <Image
              src='/social/linkedin.png'
              width={40}
              height={40}
              alt='linkedin'
            />
            <Image
              src='/social/facebook.png'
              width={40}
              height={40}
              alt='facebook'
            />
            <Image
              src='/social/instragram.png'
              width={40}
              height={40}
              alt='instragram'
            />
            <Image src='/social/x.png' width={40} height={40} alt='x' />
          </div>

          <div className='my-2 space-y-3'>
            <div className='flex items-center gap-1.5'>
              <Link
                className='text-sm text-[#404040]'
                href={"returns-and-refunds"}
              >
                Returns & Refunds
              </Link>
              <Link
                className='text-sm text-[#404040]'
                href={"terms-of-services"}
              >
                Terms of Services
              </Link>
            </div>
            <div className='flex items-center gap-2'>
              <Link className='text-sm text-[#404040]' href={"cookie-policy"}>
                Cookie Policy (EU)
              </Link>
              <Link className='text-sm text-[#404040]' href={"privacy-policy"}>
                Privacy Policy
              </Link>
            </div>
          </div>
        </div> */}
      </SheetContent>
    </Sheet>
  );
}
