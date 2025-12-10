import { useEffect, useState } from "react";
import HeadStrip from "../components/HeadStrip";
import Menu from "../components/Menu";
import { Helmet } from "react-helmet-async";
import { getDoc, getDocs, doc, collection } from "firebase/firestore";
import { DuarealismDb } from "../../AUXILIARY_OBJECTS/DuarealismDB";
import AddCommentModal from "../components/AddCommentModal";
import FooterSection from "../components/FooterSection";
import "./SubPageStyle.scss";

const DuarealismPage = () => {
  const [entry, setEntry] = useState(null);
  const [comments, setComments] = useState({});
  const [commentModal, setCommentModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(DuarealismDb, "DuarealismEntries", "DTlwxRdu5sEIGDXvekSP");
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.error("Entry document does not exist!");
          return;
        }

        const entryData = docSnap.data();
        setEntry(entryData);

        const commentsRef = collection(
          DuarealismDb,
          "DuarealismEntries",
          "DTlwxRdu5sEIGDXvekSP",
          "entry_comments"
        );

        const commentsSnap = await getDocs(commentsRef);

        const mapped = {};
        commentsSnap.forEach((c) => {
          mapped[c.id] = c.data();
        });

        setComments(mapped);

      } catch (error) {
        console.error("Error fetching Firestore data: ", error);
      }
    };

    fetchData();
  }, []);

  const addCommentToEntry = (newComment, id) => {
    setComments((prev) => ({
      ...prev,
      [id]: newComment
    }));
  };

  if (!entry) return <p>Loading…</p>;

  return (
    <>
      <Helmet>
        <title>DUAREALIZM</title>
      </Helmet>

      <HeadStrip />
      <Menu />

      <p className="intro">
        <strong>D U A R E A L I Z M</strong> to dosyć prostolinijne w swoim stylu malarstwo...
      </p>

      <div className="entries_section">
        <div className="entry">
          <div className="main_chunk">
            <div className="image_box">
              <img
                className={entry.entry_position === "vertical" ? "image_vertical" : "image_horizontal"}
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
            {Object.values(comments).length > 0 && <h3>KOMENTARZE:</h3>}

            <div className="comments">
              {Object.values(comments)
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

            <button className="add_button" onClick={() => setCommentModal(true)}>
              DODAJ KOMENTARZ
            </button>
          </div>
        </div>
      </div>

      {commentModal && (
        <AddCommentModal
          closeModal={() => setCommentModal(false)}
          addComment={addCommentToEntry}
        />
      )}

      <FooterSection />
    </>
  );
};

export default DuarealismPage;