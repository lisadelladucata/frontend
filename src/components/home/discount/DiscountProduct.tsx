import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function DiscountProduct() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Console Card */}
        <div className="relative flex overflow-hidden rounded-3xl bg-[#B2EBF2] p-6">
          <div className="relative z-10 mr-4 w-[45%] flex-shrink-0">
            <Image
              src="/products/sound-box.png"
              alt="Xbox Series X console with controller"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-black">Save Up to 20% <br /> Off on</h2>
            <p className="mt-2 text-base text-black">Your First Gaming Console Purchase.</p>
            <Button className="mt-4 w-fit rounded-lg bg-black px-6 py-2 text-sm font-medium text-white hover:bg-black/90">
              Purchase Now
            </Button>
          </div>
        </div>

        {/* Headset Card */}
        <div className="relative flex overflow-hidden rounded-3xl bg-[#FFE4E4] p-0">
          <div className="relative z-10 mr-4 w-[45%] flex-shrink-0">
            <Image
              src="/products/premium-headphone.png"
              alt="Gaming headset with blue LED lights"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-black">Save Up to 20% <br /> Off on</h2>
            <p className="mt-2 text-base text-black">Your First Gaming Console Purchase.</p>
            <Button className="mt-4 w-fit rounded-lg bg-black px-6 py-2 text-sm font-medium text-white hover:bg-black/90">
              Purchase Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

