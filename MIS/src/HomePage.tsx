import HeadStrip from './components/HeadStrip';
import Menu from './components/Menu';
import Carousel from "./components/Carousel";
import NovelSection from "./components/NovelSection.tsx";
import FooterSection from "./components/FooterSection.tsx";
import "./HomePage.scss"
import { Link } from 'react-router';


function HomePage() {

  return (
    <>
      <title>STRONA GŁÓWNA</title>
      <section>
        <HeadStrip />
        <Menu />
        <h1 className='expo_header'>Dzień dobry, dobry wieczór<span className='ending'>&nbsp;lub dobranoc :) &#128075;</span> </h1>
        <Carousel />
        <div className='grid_menu_section'>
          <h1>N U R T Y :</h1>
          <div className='entries'>
            <Link to="/duarealizm">
              <div className='entry entry_duarealism'>
                D U A R E A L I Z M to dosyć prostolinijne w swoim stylu malarstwo. Odcienie tutaj nie zlewają się ze sobą, a wręcz - można powiedzieć - gryzą się.
                W konsekwencji daje to efekt wyrazistości, bijącego po oczach kontrastu barw. Tematyką zawsze jest natura i człowiek, który nieświadomie znajduje
                swoje odbicie w otaczającym go świecie przyrody. Reszta na temat znaczenia samej nazwy...
              </div>
            </Link>
            <Link to="/proegzystencjalizm">
              <div className='entry entry_proexistentialism'>
                P R O E G Z Y S T E N C J A L I Z M charakteryzuje się niemałą płynnością kolorów. Jest on próbą przełożenia języka światła na język farb. To właśnie
                światło jest tutaj głównym motywem. To przez nie wyraża się dążenie człowieka do kontaktu (a nawet jedności) z jego żyjącym otoczeniem. Bo to ono zamazuje granicę
                pomiędzy homo sapiens a całym jego "rodzeństwem", czy to w świecie zwierząt czy roślin. Reszta na temat znaczenia nazwy...
              </div>
            </Link>
            <Link to="/uniformizm">
              <div className='entry entry_uniformism'>
                U N I F O R M I Z M ma na celu komentowanie konkretnego rodzaju zachowań społecznych, jakich, delikatnie mówiąc, nie brakuje we współczesnym świecie.
                Stąd przewijającymi się na obrazach postaciami będą bardzo przypominające siebie nawzajem manekiny. Bez ubrań, bez wyrazu twarzy, a może nawet - jak to manekiny - bez życia.
                Reszta na temat znaczenia nazwy.
              </div>
            </Link>
          </div>
        </div>
        <NovelSection />
        <FooterSection />
      </section>
    </>
  )
}

export default HomePage
