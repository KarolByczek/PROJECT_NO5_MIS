import HeadStrip from './components/HeadStrip';
import Menu from './components/Menu';
import Carousel from "./components/Carousel";
import NovelSection from "./components/NovelSection.tsx";
import FooterSection from "./components/FooterSection.tsx";
import "./HomePage.scss"
import { Link } from 'react-router';
import { Helmet } from 'react-helmet-async';


function HomePage() {

  return (
    <>
      <Helmet>
        <title>STRONA GŁÓWNA</title>
      </Helmet>
      <section>
        <HeadStrip />
        <Menu />
        <h1 className='expo_header'>Dzień dobry, dobry wieczór<span className='ending'>&nbsp;lub dobranoc :) &#128075;</span></h1>
        <Carousel />
        <div className='grid_menu_section'>
          <h1>N U R T Y :</h1>
          <div className='entries'>
            <Link to="/duarealizm">
              <div className='entry entry_duarealism'>
                D U A R E A L I Z M to dosyć prostolinijne w swoim stylu malarstwo. Odcienie nie zlewają się tutaj ze sobą, a nawet
                - można powiedzieć - gryzą się. W rezultacie daje to efekt wyrazistości, bijącego po oczach kontrastu barw.
                Tematyką zawsze jest natura i człowiek, który nieświadomie znajduje swoje odbicie w otaczającym go świecie przyrody...
              </div>
            </Link>
            <Link to="/proegzystencjalizm">
              <div className='entry entry_proexistentialism'>
                P R O E G Z Y S T E N C J A L I Z M charakteryzuje się niemałą płynnością kolorów. Jest próbą przetłumaczenia języka
                światła na język farb. Bo to właśnie ostre światło jest tutaj głównym narzędziem. To przez nie wyraża się
                dążenie człowieka do kontaktu (a nawet jedności) z naturą, czyli główny motyw tego nurtu. To światło zamazuje granicę pomiędzy
                człowiekiem a jego "kuzynami", czy to w świecie zwierząt czy roślin....
              </div>
            </Link>
            <Link to="/uniformizm">
              <div className='entry entry_uniformism'>
                U N I F O R M I Z M komentuje zachowania społeczne, jakich, delikatnie mówiąc, nie brakuje we współczesnym świecie.
                Stąd przewijającymi się na obrazach postaciami będą bardzo przypominające siebie nawzajem manekiny. Bez ubrań, bez wyrazu 
                twarzy, a może nawet - jak to manekiny - bez życia... Coś na temat stylu...
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
