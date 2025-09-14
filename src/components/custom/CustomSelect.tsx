"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const options = [
  { value: "ps5", label: "PlayStation 5" },
  { value: "ps4", label: "PlayStation 4" },
  { value: "ps4pro", label: "PlayStation 4 Pro" },
  { value: "xbox-series-x", label: "Xbox Series X" },
  { value: "xbox-series-s", label: "Xbox Series S" },
  { value: "switch", label: "Nintendo Switch" },
];

export default function CustomSelect() {
  const [selected, setSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full md:w-1/2" ref={selectRef}>
      {/* Select Box */}
      <div
        className="flex justify-between items-center bg-white border border-gray-300 rounded-md px-4 py-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-700">
          {selected
            ? options.find((opt) => opt.value === selected)?.label
            : "Select a console"}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-10">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelected(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
