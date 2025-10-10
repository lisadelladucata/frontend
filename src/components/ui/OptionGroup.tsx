// src/components/OptionGroup.tsx
import React from "react";

interface Option {
  value: string;
  label: string;
  description?: string; // Descrizione opzionale sotto il label
}

interface OptionGroupProps {
  title: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  baseColor: string; // Colore base per gli stili (es. 'bg-green-600')
}

export default function OptionGroup({
  title,
  options,
  selectedValue,
  onSelect,
  baseColor,
}: OptionGroupProps) {
  // Helper per ottenere le classi del colore di base
  const getActiveClasses = (value: string) => {
    const isActive = selectedValue === value;
    return isActive
      ? `text-white ${baseColor} shadow-inner shadow-black/20`
      : `bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50`;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold text-[#101010]">{title}</h3>

      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`flex-1 min-w-[80px] p-3 rounded-lg font-medium text-center transition-all duration-150 ease-in-out
                            ${getActiveClasses(option.value)}
                            ${
                              option.description
                                ? "flex flex-col items-center justify-center h-20"
                                : "h-12"
                            }`}>
            {option.label}
            {option.description && (
              <span className="text-xs font-normal mt-1 opacity-80">
                {option.description}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
