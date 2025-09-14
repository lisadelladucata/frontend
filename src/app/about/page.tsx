"use client";

import Container from "@/components/common/Container";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className='min-h-screen pt-10 pb-20 px-4 bg-[#F2F5F7] md:px-6 lg:px-8'>
      <Container>
        <h1 className='text-3xl font-bold text-center mb-8'>Chi Siamo</h1>

        <div className='space-y-6 text-lg text-[#404040]'>
          <p>
            Benvenuto nel nostro sito web, il punto di riferimento per le
            console da gaming ricondizionate in Italia! Siamo un'azienda giovane
            e dinamica, nata dalla passione per i videogiochi e dal desiderio di
            offrire ai nostri clienti un'esperienza di gioco eccellente a prezzi
            accessibili.
          </p>

          <p>
            Il nostro viaggio è iniziato su eBay, dove, grazie alla dedizione e
            alla qualità dei nostri prodotti, siamo rapidamente diventati il
            primo venditore di console ricondizionate in Italia. Il successo
            ottenuto sulla piattaforma ci ha spinti a fare un passo avanti e ad
            aprire il nostro e-commerce, per offrire un servizio ancora migliore
            e più diretto ai nostri clienti. La nostra missione è semplice:
            rendere le console da gaming di qualità accessibili a tutti.
            Crediamo che ogni giocatore meriti di vivere esperienze di gioco
            indimenticabili senza dover spendere una fortuna. Per questo motivo,
            ci impegniamo a selezionare, testare e ricondizionare con cura ogni
            console che vendiamo, garantendo che sia come nuova.
          </p>

          <p>
            Ogni console viene sottoposta a rigorosi controlli di qualità e test
            funzionali per garantire che sia in condizioni ottimali. La nostra
            esperienza come top seller su eBay è una testimonianza della nostra
            affidabilità e del nostro impegno nei confronti dei clienti.
            Mettiamo le esigenze dei nostri clienti al primo posto, offrendo un
            servizio di assistenza rapido e sempre disponibile per qualsiasi
            necessità. Offriamo una garanzia su tutti i nostri prodotti, perché
            siamo certi della qualità del nostro lavoro e vogliamo che i nostri
            clienti acquistino con assoluta tranquillità.
          </p>

          <p>
            Amiamo i videogiochi tanto quanto te, e questo si riflette nella
            cura con cui selezioniamo e ricondizioniamo le nostre console. Ci
            impegniamo costantemente per l'eccellenza in tutto ciò che facciamo,
            dal processo di ricondizionamento all'assistenza clienti. Crediamo
            nel dare una seconda vita alle console, contribuendo così a ridurre
            i rifiuti elettronici e a promuovere un consumo più responsabile.
          </p>

          <p>
            Grazie per averci scelto per le tue esigenze di gaming. Siamo
            entusiasti di accompagnarti nel tuo prossimo viaggio videoludico con
            le nostre console ricondizionate di alta qualità. Gioca di più.
            Spendi meno. Sii felice.
          </p>

          <p>
            Per qualsiasi domanda o necessità, non esitare a contattarci. Siamo
            qui per te!
          </p>
        </div>

        {/* common box */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-16'>
          <div className='h-[265px] flex flex-col items-center justify-center text-center p-6 bg-[#FDFDFD] rounded-lg py-5'>
            <div className='bg-[#DAEDF2] w-[96px] h-[96px] mx-auto rounded-sm flex items-center justify-center mb-4'>
              <Image
                src='/about/a1.png'
                alt='Tools icon'
                width={48}
                height={48}
                className='text-blue-500'
              />
            </div>
            <h3 className='text-2xl text-[#101010] font-semibold mb-2'>
              Inizia a pensare in modo circolare
            </h3>
            <p className='text-base text-[#101010]'>
              Portiamo la tecnologia oltre. Fa bene al pianeta e al tuo
              portafoglio.
            </p>
          </div>

          <div className='h-[265px] flex flex-col items-center justify-center text-center p-6 bg-[#FDFDFD] rounded-lg py-5'>
            <div className='bg-[#DAEDF2] w-[96px] h-[96px] mx-auto rounded-sm flex items-center justify-center mb-4'>
              <Image
                src='/about/a2.png'
                alt='Gift box icon'
                width={48}
                height={48}
                className='text-blue-500'
              />
            </div>
            <h3 className='text-2xl text-[#101010] font-semibold mb-2'>
              Funziona come nuovo
            </h3>
            <p className='text-base text-[#101010]'>
              Telefoni affidabili e di alta qualità, ricondizionati dai nostri
              esperti in Europa.
            </p>
          </div>

          <div className='h-[265px] flex flex-col items-center justify-center text-center p-6 bg-[#FDFDFD] rounded-lg py-5'>
            <div className='bg-[#DAEDF2] w-[96px] h-[96px] mx-auto rounded-sm flex items-center justify-center mb-4'>
              <Image
                src='/about/a3.png'
                alt='Delivery truck icon'
                width={48}
                height={48}
                className='text-blue-500'
              />
            </div>
            <h3 className='text-2xl text-[#101010] font-semibold mb-2'>
              Consegna veloce
            </h3>
            <p className='text-base text-[#101010]'>
              Garanzia di rimborso, reso gratuito e 12 mesi di garanzia
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
