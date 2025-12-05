import React from "react";
import "./NovelSection.scss";

const NovelSection: React.FC = () => {
  return (
    <div className="novel_section">
      <h2 className="headline">POBIERZ  DARMOWĄ  POWIEŚĆ</h2>

      <p className="description">
        Na rynku mnóstwo jest kryminałów, a trochę za mało thrillerów.
        Postanowiłem nieco to zmienić.
        Pobierzcie za darmo mój autorski thriller z akcją w mieście Lublin.
      </p>

      <a href="/MAT_PODST_PODR_MP3_TRACK001.mp3" download className="download_link">
        POBIERZ POWIEŚĆ "NIEMILEWIDZIANI"
        <span className="icon">⬇</span>
      </a>
    </div>
  );
};

export default NovelSection;
