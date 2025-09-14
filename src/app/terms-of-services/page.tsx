import Container from "@/components/common/Container";
import Image from "next/image";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-[#F2F5F7]">
      <Container>
        <h1 className="text-3xl font-bold text-center">
          Terms of Services
        </h1>

        <div className="min-h-screen py-5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto p-2 sm:p-8">
            {/* <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-8">
              Terms of Service
            </h1> */}

            <div className="space-y-6 text-sm sm:text-base text-gray-700">
              <p className="text-sm">
                This cookie policy was last updated on December 3, 2024 and
                applies to citizens and legal permanent residents of the
                European Economic Area and Switzerland.
              </p>

              <section className="space-y-2">
                <h2 className="font-semibold">1. Introduction</h2>
                <p>
                  Our website, https://consolelocker.it (hereinafter: "the
                  website") uses cookies and other related technologies (for
                  convenience all technologies are referred to as "cookies").
                  Cookies are also placed by third parties we have engaged. In
                  the document below we inform you about the use of cookies on
                  our website.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold">2. What are cookies?</h2>
                <p>
                  Cookies are small files that are sent along with pages of this
                  website and stored by your browser on the hard drive of your
                  computer or other devices. The information stored in them may
                  be sent back to our servers or to the servers of the relevant
                  third parties during your next visit.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold">3. What are scripts?</h2>
                <p>
                  A script is a piece of code used to make our website function
                  correctly and interactively. This code is executed on our
                  servers or on your device.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold">4. What is a web beacon?</h2>
                <p>
                  A web beacon (or pixel tag) is a small, invisible piece of
                  text or image on a website that is used to monitor traffic on
                  a website. In order to do this, various data about you is
                  stored using web beacons.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-semibold">5. Cookie</h2>
                <div className="space-y-3 pl-4">
                  <h3 className="font-medium">
                    5.1 Technical or functional cookies
                  </h3>
                  <p>
                    Some cookies ensure that the website works properly and that
                    your preferences remain known. By placing functional
                    cookies, we make it easier for you to visit our website.
                    This way, you do not need to repeatedly enter the same
                    information when visiting our website and, for example, the
                    items remain in your shopping cart until you have paid.
                  </p>

                  <h3 className="font-medium">5.2 Statistical cookies</h3>
                  <p>
                    We use statistical cookies to optimize the website
                    experience for our users. With these statistical cookies we
                    gain insights into the use of our website. We ask your
                    permission to place statistical cookies.
                  </p>

                  <h3 className="font-medium">
                    5.3 Marketing/Tracking Cookies
                  </h3>
                  <p>
                    Marketing/tracking cookies are cookies or any other form of
                    local storage, used to create user profiles to display
                    advertising or to track the user on this website or across
                    different websites for similar marketing purposes.
                  </p>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold">
                  6. Enabling/disabling and deleting cookies
                </h2>
                <p>
                  You can use your internet browser to automatically or manually
                  delete cookies. You can also specify that certain cookies may
                  not be placed. Another option is to change the settings of
                  your internet browser so that you receive a message each time
                  a cookie is placed. For more information about these options,
                  please refer to the instructions in the Help section of your
                  browser.
                </p>
                <p className="italic">
                  Please note that our website may not function properly if all
                  cookies are disabled. If you delete the cookies in your
                  browser, they will be placed again after your consent when you
                  visit our website again.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold">
                  7. Your rights in relation to personal data
                </h2>
                <p>
                  You have the following rights regarding your personal data:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Right to know when your personal data is needed, what
                    happens to it, how long it will be kept.
                  </li>
                  <li>
                    Right of access: You have the right to access the personal
                    data we hold about you.
                  </li>
                  <li>
                    Right to rectification: You have the right to complete,
                    correct, delete or block your personal data whenever you
                    wish.
                  </li>
                  <li>
                    If you give us consent to process your data, you have the
                    right to withdraw this consent and delete your personal
                    data.
                  </li>
                  <li>
                    Right to port your data: You have the right to request all
                    of your data from the controller and port it all to another
                    controller.
                  </li>
                  <li>
                    Right to object: You have the right to object to the
                    processing of your data. We will respect this choice unless
                    there are compelling reasons to process it.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="font-semibold">10. Contact details</h2>
                <p>
                  For questions and/or comments regarding the Cookie Policy and
                  this statement, please contact us using the following contact
                  details:
                </p>
                <div className="pl-4 space-y-1">
                  <p>Flavio Cipollone</p>
                  <p>Via Ogaden 4, 00199 Rome</p>
                  <p>Italy</p>
                  <p>
                    Website:{" "}
                    <Link
                      href="https://consolelocker.it"
                      className="text-[#222C9B] hover:underline"
                    >
                      https://consolelocker.it
                    </Link>
                  </p>
                  <Link
                    href="https://consolelocker.it"
                    className="text-[#222C9B] hover:underline"
                  >
                    Email: info@consolelocker.it
                  </Link>
                  <p>Phone number: 392.0515775</p>
                </div>
              </section>
            </div>
          </div>
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
