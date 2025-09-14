"use client";

import Image from "next/image";
import { useState, useRef } from "react";
// import { useTranslation } from "react-i18next";

const languages = [
  // { code: "en", name: "English", flag: "/flag/usa.png" },
  { code: "it", name: "Italy", flag: "/flag/italy.png" },
];

// interface LanguageType {
//   code: string;
//   name: string;
//   flag: string;
// }

const LanguageSelector = () => {
  // const [selectedLang, setSelectedLang] = useState<LanguageType>(languages[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // const { i18n } = useTranslation(); // Use i18n directly from useTranslation hook
  // const [selectedLanguageOnlocalStorage, setSelectedLanguageOnlocalStorage] =
  //   useState<string | null>("");

  // const handleSelectLanguage = (lang: LanguageType) => {
  //   setSelectedLang(lang);
  //   setIsOpen(false);
  //   changeLanguage(lang.code);
  // };

  // const changeLanguage = async (language: string) => {
  //   try {
  //     if (i18n.changeLanguage) {
  //       await i18n.changeLanguage(language);
  //     } else {
  //       console.error("i18n.changeLanguage is not available");
  //     }
  //   } catch (error) {
  //     console.error("Error changing language:", error);
  //   }
  // };

  // Close dropdown when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  // useEffect(() => {
  //   const i18nextLng = localStorage?.getItem("i18nextLng");
  //   setSelectedLanguageOnlocalStorage(i18nextLng);
  //   console.log(typeof i18nextLng);
  // }, [selectedLang]);

  return (
    <div className='relative z-50' ref={dropdownRef}>
      {/* Selected Language Display */}
      <button
        className='flex items-center gap-2 w-24 h-9 bg-transparent'
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src={
            languages[0].flag
            // selectedLanguageOnlocalStorage !== "en"
            //   ? languages[0].flag
            //   : languages[1].flag
          }
          width={24}
          height={24}
          alt={"Italy"}
        />
        <span className='text-sm'>
          {languages[0].name}
          {/* {selectedLanguageOnlocalStorage === "en"
            ? languages[0].name
            : languages[1].name} */}
        </span>
      </button>

      {/* Dropdown Menu */}
      {/* {isOpen && (
        <div className='absolute top-full w-28  flex flex-col items-center justify-left py-1.5 left-0 mt-2 bg-white border rounded-lg shadow-md'>
          {languages.map((lang) => (
            <button
              key={lang.code}
              className='flex items-center justify-start w-full py-2 px-2 cursor-pointer hover:bg-gray-100'
              onClick={() => handleSelectLanguage(lang)}
            >
              <Image src={lang.flag} width={24} height={24} alt={lang.name} />
              <span className='ml-1.5 text-sm'>{lang.name}</span>
            </button>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default LanguageSelector;
