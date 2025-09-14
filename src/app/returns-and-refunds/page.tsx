import Container from "@/components/common/Container";
import Image from "next/image";

export default function ReturnAndRefund() {
  return (
    <main className="min-h-screen py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-[#F2F5F7]">
      <Container>
        <h1 className="w-full text-xl lg:text-3xl text-center font-bold mb-8">
          Returns and Refunds
        </h1>

        <div className="space-y-6">
          <p className="text-lg text-[#404040] lg:px-20">
            Terms and Conditions of Service Welcome to [E-commerce Name]
            (hereinafter “Site”). These Terms and Conditions govern the sale and
            purchase of refurbished consoles (hereinafter “Products”) through
            our e-commerce. By using our Site and purchasing our Products, you
            fully accept these conditions. 1. Product Description 1.1. The
            Products sold on the Site are refurbished consoles, tested and
            verified to ensure correct functioning. 1.2. “Refurbished” means
            that the product has been previously used, but has been inspected,
            repaired (if necessary) and brought back to an optimal functional
            state. 1.3. Any minor aesthetic defects do not affect the
            functionality and are specified in the product description. 2.
            Warranty 2.1. All refurbished Products sold on [E-commerce Name]
            include a [specific duration, e.g. 12 months] warranty for lack of
            conformity. 2.2. The warranty covers only hardware defects or
            malfunctions not caused by improper use, accidental damage, or
            unauthorized repairs. 2.3. In the event of a defect covered by the
            warranty, the buyer may request repair, replacement or refund, in
            accordance with the provisions of the law. 3. Right of Withdrawal
            3.1. The buyer has the right to withdraw from the purchase within 14
            days of delivery of the Product, pursuant to Legislative Decree
            206/2005 (“Consumer Code”). 3.2. To exercise the right of
            withdrawal, the customer must contact customer service at [email]
            and provide written communication. 3.3. The Product must be returned
            complete with all accessories and in the original packaging (or
            equivalent), with no damage other than that already declared at the
            time of purchase. 3.4. Return costs are borne by the customer,
            unless otherwise indicated. 4. Conditions of Sale 4.1. The prices
            indicated on the Site are expressed in [currency] and include VAT
            (if applicable). 4.2. [E-commerce Name] reserves the right to change
            prices at any time, but any changes will not affect orders already
            confirmed. 4.3. The availability of the Products is indicated on the
            Site and is updated regularly. However, it is not guaranteed that
            the Product will always be available at the time of purchase. 5.
            Shipping and Delivery 5.1. The Products are shipped to the address
            indicated by the buyer during the purchase process. 5.2. Estimated
            delivery times are indicated on the checkout page and may vary
            depending on the destination. [E-commerce Name] is not responsible
            for delays caused by third parties. 5.3. Upon delivery, the buyer is
            required to check that the Product is intact. Any damage must be
            reported within 48 hours of receipt. 6. Limitations of Liability
            6.1. [E-commerce Name] will not be liable for indirect damages, loss
            of data,or any other damage resulting from improper use of the
            Product. 6.2. The maximum liability of [E-commerce Name] is limited
            to the price paid for the purchased Product. 7. Applicable Law and
            Competent Court 7.1. These Terms and Conditions are governed by
            Italian law. 7.2. For any dispute relating to the sale of the
            Products, the consumer's court will be competent, as provided for by
            current legislation. 8. Contacts For any questions or problems, you
            can contact our customer service at [email] or at [telephone].
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
