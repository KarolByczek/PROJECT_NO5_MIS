import { useEffect, useState } from "react";
import HeadStrip from "../components/HeadStrip";
import Menu from "../components/Menu";
import { Helmet } from "react-helmet-async";
import { getDocs, collection } from "firebase/firestore";
import { DuarealismDb } from "../../AUXILIARY_OBJECTS/DuarealismDB";
import AddCommentModal from "../components/AddCommentModal";
import FooterSection from "../components/FooterSection";
import "./SubPageStyle.scss";

const DuarealismPage = () => {
  const [entries, setEntries] = useState([]);
  const [commentModal, setCommentModal] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ LOAD ALL ENTRY DOCUMENTS
        const entriesRef = collection(DuarealismDb, "DuarealismEntries");
        const entriesSnap = await getDocs(entriesRef);

        const loadedEntries = [];

        // 2️⃣ FOR EACH ENTRY → LOAD ITS COMMENTS
        for (const entryDoc of entriesSnap.docs) {
          const entryData = entryDoc.data();
          const entryId = entryDoc.id;

          const commentsRef = collection(
            DuarealismDb,
            "DuarealismEntries",
            entryId,
            "entry_comments"
          );

          const commentsSnap = await getDocs(commentsRef);

          const commentsMap = {};
          commentsSnap.forEach((c) => {
            commentsMap[c.id] = c.data();
          });

          loadedEntries.push({
            entryId,
            ...entryData,
            entry_comments: commentsMap,
          });
        }

        setEntries(loadedEntries);
      } catch (error) {
        console.error("Error loading entries:", error);
      }
    };

    fetchData();
  }, []);

  const addCommentToEntry = (entryId, newComment, commentId) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.entryId === entryId
          ? {
            ...entry,
            entry_comments: {
              ...entry.entry_comments,
              [commentId]: newComment,
            },
          }
          : entry
      )
    );
  };

  return (
    <>
      <Helmet>
        <title>DUAREALIZM</title>
      </Helmet>
      <HeadStrip />
      <Menu />
      <p className="intro">
        D U A R E A L I Z M to dosyć prostolinijne w swoim stylu malarstwo. Odcienie nie zlewają się tutaj ze sobą, a nawet
        - można powiedzieć - gryzą się. W rezultacie daje to efekt wyrazistości, bijącego po oczach kontrastu barw.
        Tematyką zawsze jest natura i człowiek, który nieświadomie znajduje swoje odbicie w otaczającym go świecie przyrody.
        Nazwa pochodzi od dwóch członów: "dual", czyli "podwójne" (odniesienie do obydwu warstw obrazu: ludzkiej oraz 
        przyrodniczej), i "arealizm", a więc coś nie do końca realistycznego, prymitywnego w swoim warsztacie.
      </p>
      <div className="entries_section">
        {entries.map((entry) => (
          <div className="entry" key={entry.entryId || entry.id}>
            <div className="main_chunk">
              <div className="image_box">
                <img
                  className={
                    entry.entry_position === "vertical"
                      ? "image_vertical"
                      : "image_horizontal"
                  }
                  src={entry.entryURL}
                  alt={entry.entry_name}
                />
              </div>

              <div className="about">
                <p><strong>{entry.entry_name}</strong></p>
                <p>{entry.entry_description}</p>
              </div>
            </div>

            <div className="comments_box">
              {Object.values(entry.entry_comments).length > 0 && (
                <h3>KOMENTARZE:</h3>
              )}

              <div className="comments">
                {Object.values(entry.entry_comments)
                  .sort((a, b) => Number(b.id) - Number(a.id))
                  .map((comment) => (
                    <div className="comment" key={comment.id}>
                      <strong><p className="content">{comment.content}</p></strong>
                      <i><p className="signature">-{comment.signature}</p></i>
                      <small>
                        <p className="date">
                          {new Date(Number(comment.id)).toLocaleString()}
                        </p>
                      </small>
                    </div>
                  ))}
              </div>

              <button
                className="add_button"
                onClick={() => {
                  setCurrentEntry(entry);
                  setCommentModal(true);
                }}
              >
                DODAJ KOMENTARZ
              </button>
            </div>
          </div>
        ))}
      </div>

      {commentModal && currentEntry && (
        <AddCommentModal
          closeModal={() => setCommentModal(false)}
          entry={currentEntry}
          addComment={addCommentToEntry}
          db={DuarealismDb}
          collectionName="DuarealismEntries"
        />
      )}

      <FooterSection />
    </>
  );
};

export default DuarealismPage;