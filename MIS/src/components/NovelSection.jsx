import React from "react";
import { counter01Db } from "../../AUXILIARY_OBJECTS/Counter01";
import "./NovelSection.scss";
import { doc, updateDoc, increment } from "firebase/firestore";

const NovelSection = () => {

  const handleDownload01 = async () => {
    const counterRef = doc(counter01Db, "PortraitData", "NsXOGRWHw71ZuLGxy2BQ");

    try {
      await updateDoc(counterRef, {
        the_unwelcomers_dwnld_counter: increment(1)
      });

    } catch (error) {
      console.error("Error updating counter: ", error);
    }
  };

  return (
    <div className="novel_section">
      <h2 className="headline">POBIERZ DARMOWĄ POWIEŚĆ</h2>
      <p className="description">
        Na rynku mnóstwo jest kryminałów, a trochę za mało thrillerów.
        Postanowiłem nieco to zmienić.
        Pobierzcie za darmo mój autorski thriller z akcją w mieście Lublin.
      </p>
      <a
        href="./MAT_PODST_PODR_MP3_TRACK001.mp3"
        download
        className="download_link"
        onClick={handleDownload01}
      >
        POBIERZ POWIEŚĆ "NIEMILEWIDZIANI"
        <span className="icon">&#8681;</span>
      </a>
    </div>
  );
};

export default NovelSection;
