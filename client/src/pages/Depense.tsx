import React, { useState } from "react";
import { SectionFonctionnement } from "../components/Recette/IndexReq";

interface DepenseProps {
  selectedItem: string | null;  // Accepter selectedItem en tant que prop
}

const Depense: React.FC<DepenseProps> = ({ selectedItem }) => {
  // Créer l'état pour selectedItem et setSelectedItem
  const [item, setItem] = useState<string | null>(selectedItem);

  return (
    <div className="p-5">
      {/* Affichage du composant SectionFonctionnement avec selectedItem et setSelectedItem */}
      <SectionFonctionnement selectedItem={item} setSelectedItem={setItem} />
    </div>
  );
};

export default Depense;
