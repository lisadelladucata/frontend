import Container from "@/components/common/Container";
import Image from "next/image";
import Link from "next/link";

const policy = [
  {
    id: "01",
    name: "Start thinking circular",
    description: "Let's make your business more sustainable and future-proof",
    img: "/sell/free-return.png",
  },
  {
    id: "02",
    name: "Performs the now",
    description: "Solutions right now to make your business more sustainable",
    img: "/sell/fast-delivery.png",
  },
  {
    id: "03",
    name: "Fast delivery",
    description: "Get started right away with our quick and easy solutions",
    img: "/sell/free-shipping.png",
  },
];

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[#F2F5F7] py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
      <Container>
        <h1 className="text-[40px] font-semibold text-[#404040] text-center mb-8">
          Cookie Policy (EU)
        </h1>

        <div className="px-5 lg:px-16 mb-8">
          <p className="text-[#404040] text-lg mb-6">
            This cookie policy was last updated on December 5, 2019 and applies
            to citizens of the European Economic Area.
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#404040] mb-3">
              1. Introduction
            </h2>
            <p className="text-lg text-[#404040] leading-7">
              Our website uses cookies and other similar technologies to
              distinguish you from other users. This helps us provide you with a
              good experience when you browse our website and also allows us to
              improve our site.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#404040] mb-3">
              2. What are cookies?
            </h2>
            <p className="text-lg text-[#404040] leading-7">
              A cookie is a small file of letters and numbers that we store on
              your browser or the hard drive of your computer if you agree.
              Cookies contain information that is transferred to your
              computer&apos;s hard drive.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#404040] mb-3">
              3. What are scripts?
            </h2>
            <p className="text-lg text-[#404040] leading-7">
              A script is a piece of code used to make our website function
              correctly and interactively. This code is executed on our servers
              or on your device.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#404040] mb-3">
              4. What is a web beacon?
            </h2>
            <p className="text-lg text-[#404040] leading-7">
              A web beacon (or pixel tag) is a small, invisible piece of text or
              image on a website that is used to monitor traffic on a website.
              In order to do this, various data about you is stored using web
              beacons.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#404040] mb-3">
              5. Cookie
            </h2>
            <div className="mb-4 pl-4">
              <h2 className="text-xl font-semibold text-[#404040] mb-3">
                5.1 Technical or functional cookies
              </h2>
              <p className="text-lg text-[#404040] leading-7">
                Some cookies ensure that the website works properly and that
                your preferences remain known. By placing functional cookies, we
                make it easier for you to visit our website. This way, you do
                not need to repeatedly enter the same information when visiting
                our website and, for example, the items remain in your shopping
                cart until you have paid. We may place these cookies without
                your consent.
              </p>
            </div>
            <div className="pl-4">
              <h2 className="text-xl font-semibold text-[#404040] mb-3">
                5.2 Statistical cookies
              </h2>
              <p className="text-lg text-[#404040] leading-7">
                We use statistical cookies to optimize the website experience
                for our users. With these statistical cookies we gain insights
                into the use of our website. We ask your permission to place
                statistical cookies.
              </p>
              <p className="text-lg text-[#404040] leading-7">
                5.3 Marketing/Tracking Cookies Marketing/tracking cookies are
                cookies or any other form of local storage, used to create user
                profiles to display advertising or to track the user on this
                website or across different websites for similar marketing
                purposes.
              </p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#404040] mb-3">
              6. Enabling/disabling and deleting cookies
            </h2>
            <p className="text-lg text-[#404040] leading-7">
              You can use your internet browser to automatically or manually
              delete cookies. You can also specify that certain cookies may not
              be placed. Another option is to change the settings of your
              internet browser so that you receive a message each time a cookie
              is placed. For more information about these options, please refer
              to the instructions in the Help section of your browser. Please
              note that our website may not function properly if all cookies are
              disabled. If you delete the cookies in your browser, they will be
              placed again after your consent when you visit our website again.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#404040] mb-3">
              7. Your rights in relation to personal data
            </h2>
            <p className="text-[#404040] text-lg">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside text-[#404040] text-lg pl-4">
              <li>
                You have the right to know when your personal data is needed,
                what happens to it, how long it will be kept.
              </li>
              <li>
                Right of access: You have the right to access the personal data
                we hold about you.
              </li>
              <li>
                Right to rectification: You have the right to complete, correct,
                delete or block your personal data whenever you wish.
              </li>
              <li>
                If you give us consent to process your data, you have the right
                to withdraw this consent and delete your personal data.
              </li>
              <li>
                Right to port your data: You have the right to request all of
                your data from the controller and port it all to another
                controller.
              </li>
              <li>
                Right to object: You have the right to object to the processing
                of your data. We will respect this choice unless there are
                compelling reasons to process it.
              </li>
            </ul>
            <p className="text-[#404040] text-lg mt-4">
              To exercise these rights, please contact us. Please see the
              contact details at the bottom of this Cookie Policy. If you have a
              complaint about how we handle your data, we would like to hear
              from you, but you also have the right to lodge a complaint with
              the supervisory authority (the Data Protection Authority).
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#404040] mb-3">
              8. Contact details
            </h2>
            <p className="text-[#404040] text-lg leading-7">
              For questions and/or comments regarding the Cookie Policy and this
              statement, please contact us using the following contact details:
            </p>
            <p className="text-lg text-[#404040] leading-7">Flavio Cipollone</p>
            <p className="text-lg text-[#404040] leading-7">
              Via Ogaden 4, 00199 Rome
            </p>
            <p className="text-lg text-[#404040] leading-7">
              Website:{" "}
              <Link href="https://consolelocker.it" className="text-blue-500">
                https://consolelocker.it
              </Link>
            </p>
            <p className="text-lg text-[#404040] leading-7">
              Email:{" "}
              <Link
                href="mailto:info@consolelocker.it"
                className="text-blue-500"
              >
                info@consolelocker.it
              </Link>
            </p>
            <p className="text-lg text-[#404040] leading-7">
              Phone number: 3924015975
            </p>
            <p className="text-lg text-[#404040] leading-7">
              This cookie policy was synchronized with{" "}
              <Link
                href="https://www.cookiedatabase.org/"
                className="text-blue-500"
              >
                cookiedatabase.org
              </Link>{" "}
              on January 6, 2025
            </p>
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {policy.map((item) => (
            <div
              key={item.id}
              className="text-center bg-[#FDFDFD] py-8 px-6 rounded-lg shadow-sm"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded bg-blue-100 flex items-center justify-center">
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={36}
                    height={36}
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
