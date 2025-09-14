import Image from "next/image";

export default function WelcomeToConsole() {
  return (
    // <section className="relative min-h-[600px] w-full overflow-hidden bg-gradient-to-r from-[#006241] to-[#00A67E]">
    <section className="relative  w-full overflow-hidden bg-gradient-to-r from-[#006241] to-[#00A67E]">
      <div className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-2 md:items-center">
        {/* Text Content */}
        <div className="space-y-6 text-white">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Welcome to CONSOLE LOCKER:
            <span className="mt-2 block">
              An eco-friendly choice for your entertainment!
            </span>
          </h1>
          <div className="space-y-4 text-sm sm:text-base">
            <p>
              Buying or selling a used console is not only convenient, but it is
              also an environmentally friendly choice.
            </p>
            <p>
              Every Console we recycle helps reduce our environmental impact,
              saving precious resources and decreasing CO2 emissions.
            </p>
            <p>
              Join us and do your part for a greener future, without sacrificing
              fun. Console Locker: where gaming meets sustainability.
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex justify-center md:justify-end">
          <Image
            src="/eco.png"
            alt="Eco-friendly gaming controller with floating grass platform and ECO text"
            width={350}
            height={300}
            className="object-contain absolute bottom-20 right-24"
            priority
          />

          <Image
            src="/game-controller.png"
            alt="Eco-friendly gaming controller with floating grass platform and ECO text"
            width={600}
            height={600}
            className=""
            // priority
          />
        </div>
      </div>
    </section>
  );
}
