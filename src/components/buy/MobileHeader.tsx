// components/MobileHeader.tsx

import React from "react";

interface MobileHeaderProps {
  setFilterView: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ setFilterView }) => {
  return (
    <div className=" w-full">
      {/* Adattato per non avere margini negativi nel layout del container */}
      <div className=" p-4 rounded-md">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-[#101010]">
            Le nostre disponibilità
          </h3>
          {/* Bottone "Filtri" che togglea la visibilità della sidebar in-linea */}
          <button
            onClick={() => setFilterView((prev) => !prev)}
            className="bg-white px-4 py-2 rounded-lg font-medium shadow-md">
            Filtri
          </button>
        </div>
        {/* Linea orizzontale */}
        <hr className="mt-4 border-gray-300" />
      </div>
    </div>
  );
};

export default MobileHeader;
