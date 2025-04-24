import React, { useState, useEffect } from "react";
import { SectionFonctionnement } from "../components/Recette/IndexReq";

interface RecetteProps {
  selectedItem: string | null; // Accepter selectedItem en tant que prop
}

const Recette: React.FC<RecetteProps> = ({ selectedItem }) => {
  const [item, setItem] = useState<string | null>(selectedItem);

  // Synchroniser l'état local item avec la prop selectedItem
  useEffect(() => {
    setItem(selectedItem);
  }, [selectedItem]); // Si selectedItem change dans le parent, on met à jour item

  return (
    <div className="p-5">
      {/* Passer l'état local item et setItem au composant SectionFonctionnement */}
      <SectionFonctionnement selectedItem={item} setSelectedItem={setItem} />
    </div>
  );
};

export default Recette;
