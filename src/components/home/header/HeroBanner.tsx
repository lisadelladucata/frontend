"use client";

import Image from "next/image";
import Link from "next/link";

const HeroBanner = () => {
  return (
    <div className='bg-[url(/home/bannermobile1.png)] md:bg-[url(/hero-banner.png)] bg-cover bg-no-repeat min-h-[calc(100vh-70px)]'>
      {/* <Container> */}
      <div className='p-4 flex flex-col md:flex-row min-h-[calc(100vh-80px)] lg:items-center lg:justify-center'>
        {/* Hidden on small screens */}
        <div className='hidden lg:block md:w-1/4 lg:w-1/2'></div>

        {/* Content Section */}
        <div className='relative w-full md:w-1/2 px-4 text-center md:px-0'>
          <h1 className='text-[24px] md:text-4xl lg:text-[70px] font-bold text-left text-white leading-tight md:leading-[84px] mt-3'>
            {/* <Trans i18nKey="heroTitle" components={{ br: <br /> }} /> */}
            DAI ALLA <br /> TUA CONSOLE UNA <br /> SECONDA POSSIBILITÀ!
          </h1>

          <div className='border-b-4 border-gray-50 mt-2 mb-5 hr-line-for-mobile overflow-x-auto'></div>

          <p className='text-white text-left text-sm md:text-lg mb-6 md:mb-8 max-w-[420px] md:mx-0'>
            {/* <Trans i18nKey='heroDescription' components={{ br: <br /> }} /> */}
            Console Locker, fai spazio al nuovo e vendi la tua console usata.
            Risparmia con una console ricondizionata e goditi un'esperienza di
            gioco di prima classe.
          </p>

          {/* for desktop */}
          <div className='w-full lg:max-w-[85%] flex items-center justify-between gap-4 mb-3'>
            <div className='w-full lg:w-auto flex gap-5'>
              <Link
                href={"/buy"}
                className='w-1/2 md:w-auto flex items-center justify-center bg-[#FDFDFD] text-[#E95F00] font-medium px-2.5 sm:px-8 py-3 md:px-10 md:py-4 text-center border rounded-md'
              >
                ACQUISTA ORA
              </Link>
              <Link
                href={"/sell"}
                className='w-1/2 md:w-auto flex items-center justify-center bg-transparent text-[#FDFDFD] font-medium px-2.5 sm:px-8 py-3 md:px-10 md:py-4 text-center border rounded-md'
              >
                VENDI ORA
              </Link>
            </div>

            {/* for desktop */}
            <div className='hidden lg:flex items-end justify-end'>
              <Image
                src={"/home/banner-warranty.png"}
                width={280}
                height={160}
                alt='warranty'
              />
            </div>
          </div>

          {/* for mobile  */}
          <div className='lg:hidden flex items-end justify-end pr-0 md:pr-14'>
            <Image
              src={"/home/banner-warranty.png"}
              width={124}
              height={56}
              alt='warranty'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
