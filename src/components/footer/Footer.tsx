"use client";

import { Layout } from "antd";
import Image from "next/image";
import Link from "next/link";
import Container from "../common/Container";
import { useTranslation } from "react-i18next";

export function ConsoleFooter() {
  const { t } = useTranslation();

  return (
    // <Footer style={{ background: "#000000", padding: "60px 0 20px" }}>
    <footer className='bg-[#101010]'>
      <Container>
        {/* Newsletter Section */}
        <div className='flex flex-col md:flex-row gap-8 justify-between items-center mb-20 pt-12'>
          <div className='w-full flex items-center'>
            <div className='relative flex items-center md:gap-4'>
              <Image
                src='/footer-img.png'
                alt='Xbox Series X'
                width={150}
                height={150}
                style={{ objectFit: "contain" }}
                className='hidden lg:inline-block absolute -top-28 left-0'
              />
              <div className='ml-0 lg:ml-52'>
                <h2 className='text-left text-[#FDFDFD] text-2xl md:text-[40px] font-semibold'>
                  Iscriviti alla nostra Newsletter
                </h2>
              </div>
            </div>
          </div>

          {/* for mobile */}
          <div className='w-full lg:hidden flex items-center justify-between border border-gray-800 rounded-md'>
            <input
              className='w-[60%] text-sm border-none outline-none bg-transparent text-[#FDFDFD] px-2.5 py-3'
              type='text'
              placeholder='Enter your email'
            />
            <button className='w-[40%] place-items-end bg-[#FDFDFD] text-[#101010] text-base font-medium rounded py-2.5 px-4 md:px-8'>
              Iscriviti
            </button>
          </div>

          {/* for desktop */}
          <div className='w-full lg:w-[50%] hidden lg:flex items-center justify-between border border-gray-800 rounded-md'>
            <input
              className='border-none text-sm outline-none bg-transparent text-[#FDFDFD] px-2.5 py-3'
              type='text'
              placeholder='Enter your email'
            />
            <button className='place-items-end bg-[#FDFDFD] text-[#101010] text-base font-medium rounded py-2.5 px-4 md:px-8'>
              Iscriviti
            </button>
          </div>
        </div>
        {/* Main Footer Content */}
        <div className='lg:flex grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-between gap-8 md:mb-16 px-3 lg:p-0 pb-6'>
          {/* Payment Methods */}
          <div>
            <h4 className='text-[#FDFDFD] text-[32px] font-semibold mb-6'>
              Metodi di pagamento:
            </h4>
            <div className='flex items-center flex-wrap gap-2 mb-12'>
              <Image
                src='/payments/paypal.png'
                className='cursor-pointer'
                alt='PayPal'
                width={50}
                height={48}
              />
              <Image
                src='/payments/visa.svg'
                className='cursor-pointer'
                alt='Visa'
                width={50}
                height={70}
              />
              <Image
                src='/payments/mastercard.png'
                className='cursor-pointer'
                alt='Mastercard'
                width={50}
                height={48}
              />
              <Image
                src='/payments/g-pay.png'
                className='cursor-pointer'
                alt='Google Pay'
                width={50}
                height={48}
              />
            </div>

            {/* Social Links */}
            <div>
              <h4 className='text-white text-2xl font-semibold mt-6 mb-6'>
                Link social
              </h4>
              <div className='flex gap-4'>
                <Link
                  href='https://linkedin.com'
                  className='text-white hover:text-gray-300'
                >
                  <Image
                    src={"/social/f-linkedin.png"}
                    width={40}
                    height={40}
                    alt='linkedin'
                  />
                </Link>
                <Link
                  href='https://linkedin.com'
                  className='text-white hover:text-gray-300'
                >
                  <Image
                    src={"/social/f-facebook.png"}
                    width={40}
                    height={40}
                    alt='linkedin'
                  />{" "}
                </Link>
                <Link
                  href='https://linkedin.com'
                  className='text-white hover:text-gray-300'
                >
                  <Image
                    src={"/social/f-instragram.png"}
                    width={40}
                    height={40}
                    alt='linkedin'
                  />{" "}
                </Link>
                <Link
                  href='https://linkedin.com'
                  className='text-white hover:text-gray-300'
                >
                  <Image
                    src={"/social/f-x.png"}
                    width={40}
                    height={40}
                    alt='linkedin'
                  />{" "}
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-white text-lg font-semibold mb-6'>
              Link rapidi
            </h4>
            <ul className='space-y-6'>
              <li>
                <Link href='/' className='text-[#FDFDFD] text-lg'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/buy' className='text-[#FDFDFD] text-lg'>
                  Acquista
                </Link>
              </li>
              <li>
                <Link href='/sell' className='text-[#FDFDFD] text-lg'>
                  Vendi
                </Link>
              </li>
              <li>
                <Link href='/about' className='text-[#FDFDFD] text-lg'>
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link href='reviews' className='text-[#FDFDFD] text-lg'>
                  Recensioni
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className='text-white text-lg font-semibold mb-6'>Contatto</h4>
            <div className='space-y-6'>
              <div>
                <strong className='text-[#FDFDFD] text-lg block'>Email</strong>
                <p className='text-[#FDFDFD]'>info@consolelocker.it</p>
              </div>
              <div>
                <strong className='text-[#FDFDFD] text-lg block'>Phone</strong>
                <p className='text-[#FDFDFD] text-base'>+1 234 567 890</p>
              </div>
            </div>
          </div>

          {/* Privacy & Policy */}
          <div>
            <h4 className='text-[#FDFDFD] text-[32px] font-semibold mb-6'>
              Privacy e Politica
            </h4>
            <ul className='space-y-6'>
              <li>
                <Link
                  href='/returns-and-refunds'
                  className='text-lg text-[#FDFDFD]'
                >
                  Resi e rimborsi
                </Link>
              </li>
              <li>
                <Link
                  href='/terms-of-services'
                  className='text-lg text-[#FDFDFD]'
                >
                  Termini di servizio
                </Link>
              </li>
              <li>
                <Link href='/cookie-policy' className='text-lg text-[#FDFDFD]'>
                  Politica sui cookie (UE)
                </Link>
              </li>
              <li>
                <Link href='/privacy-policy' className='text-lg text-[#FDFDFD]'>
                  Informativa sulla privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        5
      </Container>

      {/* Copyright */}
      <div className='h-[80px] flex items-center justify-center text-center bg-[#FDFDFD] border-t border-gray-800'>
        <p className='text-[#101010] px-2 text-sm lg:text-lg'>
          © Tutti i diritti riservati 2024 | Partita IVA IT17743751004 | Via
          Ogaden 4, 00199 Roma
        </p>
      </div>
    </footer>
  );
}
