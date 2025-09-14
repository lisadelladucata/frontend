"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function HowDelivery() {
  const { t } = useTranslation();

  return (
    <main className='bg-[#DAEDF2] w-full  px-4 md:px-6 lg:px-8'>
      <h1 className='text-3xl md:text-4xl pt-12 font-bold text-center text-gray-900'>
        {t("howDeliver")}
      </h1>

      <div className=''>
        <div className='relative flex items-center justify-center py-12 '>
          {/* <Container> */}
          <div className='max-w-[718px] bg-white rounded-2xl shadow-sm z-40 p-10'>
            <div className={`flex gap-6 mb-8`}>
              <div className='flex-shrink-0'>
                <div className='text-2xl text-[#101010] font-semibold'>1</div>
              </div>
              <div className='space-y-2'>
                <h2 className='font-semibold text-lg text-[#101010]'>
                  Ottieni una stima del prezzo per il tuo dispositivo
                </h2>

                <p className='text-base text-[#404040]'>
                  Valuta rapidamente il tuo telefono e ottieni un'offerta di
                  prezzo in 2 minuti.
                </p>
              </div>
            </div>

            <div className={`flex gap-6 mb-8`}>
              <div className='flex-shrink-0'>
                <div className='text-2xl text-[#101010] font-semibold'>2</div>
              </div>
              <div className='space-y-2'>
                <h2 className='font-semibold text-lg text-[#101010]'>
                  Consegna il tuo dispositivo al negozio più vicino o spediscilo
                  gratuitamente
                </h2>

                <p className='text-base text-[#404040]'>
                  Ti invieremo un pacco di vendita entro 1-3 giorni lavorativi.
                  Il pacco contiene tutto il necessario per spedire il
                  dispositivo gratuitamente.
                </p>
              </div>
            </div>

            <div className={`flex gap-6`}>
              <div className='flex-shrink-0'>
                <div className='text-2xl text-[#101010] font-semibold'>3</div>
              </div>
              <div className='space-y-2'>
                <h2 className='font-semibold text-lg text-[#101010]'>
                  Ricevi il pagamento direttamente sul tuo conto
                </h2>

                <p className='text-base text-[#404040]'>
                  Dopo aver ricevuto il tuo telefono, saranno necessari 2-3
                  giorni lavorativi per l'ispezione. Successivamente,
                  trasferiremo il tuo denaro lo stesso giorno o ti invieremo
                  un'email con un'offerta di prezzo aggiornata.
                </p>
              </div>
            </div>
          </div>
          {/* </Container> */}

          <div className='hidden lg:inline-block absolute right-3 bottom-0 order-last md:z-20'>
            <Image
              // src="/sell/sell.png"
              src='/sell/sell.svg'
              alt='Delivery person with laptop'
              width={560}
              height={560}
              className='object-cover -ml-0 lg:-ml-20'
              priority
            />
          </div>

          {/* <div></div> */}
        </div>
      </div>
    </main>
  );
}
