import Container from "@/components/common/Container";
import Image from "next/image";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen py-16 px-4 md:px-6 lg:px-8 bg-[#F2F5F7]">
      <Container>
        <h1 className="text-3xl font-bold text-center mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-[#404040]">
          <p>
            The Data Controller is <strong>Flavio Cipollone</strong>. <br />
            The contact details of the Data Controller are as follows: <br />
            <strong>Address:</strong> Via Ogaden 4, 00199 Rome <br />
            <strong>Tel:</strong> 3924015975 <br />
            <strong>Email:</strong> info@consolelocker.it
          </p>

          <p>
            Our Privacy Policy page is currently being updated. However, the new
            terms will be available soon, which will be fully compliant with the
            regulations on personal data protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Card 1 */}
          <div className="text-center p-6 bg-[#FDFDFD]">
            <div className="bg-[#DAEDF2] w-16 h-16 mx-auto rounded-sm flex items-center justify-center mb-4">
              <Image
                src="/about/a1.png"
                alt="Tools icon"
                width={32}
                height={32}
              />
            </div>
            <h3 className="text-2xl text-[#101010] leading-7 font-semibold mb-2.5">
              Start thinking circular
            </h3>
            <p className="text-base text-[#101010] leading-[24px]">
              Let&apos;s take technology further. It&apos;s good for the planet
              and your wallet.
            </p>
          </div>

          {/* Card 2 */}
          <div className="text-center p-6 bg-[#FDFDFD]">
            <div className="bg-[#DAEDF2] rounded-sm w-16 h-16 mx-auto flex items-center justify-center mb-4">
              <Image
                src="/about/a2.png"
                alt="Gift box icon"
                width={32}
                height={32}
              />
            </div>
            <h3 className="text-2xl text-[#101010] leading-7 font-semibold mb-2.5">
              Performs like new
            </h3>
            <p className="text-base text-[#101010] leading-[24px]">
              Reliable, high-quality phones refurbished by our experts in
              Europe.
            </p>
          </div>

          {/* Card 3 */}
          <div className="text-center p-6 bg-[#FDFDFD]">
            <div className="bg-[#DAEDF2] w-16 h-16 mx-auto rounded-sm flex items-center justify-center mb-4">
              <Image
                src="/about/a3.png"
                alt="Delivery truck icon"
                width={32}
                height={32}
              />
            </div>
            <h3 className="text-2xl text-[#101010] leading-7 font-semibold mb-2.5">
              Fast delivery
            </h3>
            <p className="text-base text-[#101010] leading-[24px]">
              Full, money-back guarantee, free returns & a 12-month warranty.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
