import { useEffect, useState } from "react";
import HeadStrip from "../components/HeadStrip";
import Menu from "../components/Menu";
import { Helmet } from "react-helmet-async";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { ProEgsDb } from "../../AUXILIARY_OBJECTS/ProegsDB";
import AddCommentModal from "../components/AddCommentModal";
import FooterSection from "../components/FooterSection";
import "./SubPageStyle.scss"

const ProegsistentialismPage = () => {

  const [dbdata, setDbdata] = useState([]);
  const [commentmodal, setCommentModal] = useState(false);
  const [currentPortrait, setCurrentPortrait] = useState(null);
  const [currentRef, setCurrentRef] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const someHeight1 = { height: "14rem" };
  const someHeight2 = { height: "25rem" }
  const noHeight = { height: "0" };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(ProEgsDb, "ProEgsEntries", "cFTgQnvX3DwLJk6uzOd4");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const docData = docSnap.data(); // ✅ This is your big object

          const initArray = [];
          Object.entries(docData).forEach(([key, value]) => {
            initArray.push({ ...value, entryKey: key });
          });

          setDbdata(initArray);
          setCurrentRef(docRef);
          console.log(currentRef);
        } else {
          console.error("Document does not exist!");
        }
      } catch (error) {
        console.error("Error fetching Firestore data: ", error);
      }
    };

    fetchData();
  }, [setDbdata]);


  const getScrollbarWidth = () =>
    window.innerWidth - document.documentElement.clientWidth;

  const disableScroll = () => {
    const scrollBarWidth = getScrollbarWidth();

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    // prevent layout shift when scrollbar disappears
    document.body.style.paddingRight = scrollBarWidth + "px";
  };

  const onClickHandler = (current_one) => {
    disableScroll();
    setCommentModal(true);
    setCurrentPortrait(current_one);
  };

  const styleAdjuster = (entry) => {
    const count = Object.values(entry.entry_comments).length;
    if (count === 0) return noHeight;
    if (count === 1) return someHeight1;
    return someHeight2;
  };

  const addCommentToPortrait = (entryKey, newComment) => {
    const commentKey = `comment_${newComment.id}`;

    setDbdata((prevData) =>
      prevData.map((entry) => {
        if (entry.entryKey === entryKey) {
          return {
            ...entry,
            entry_comments: {
              ...entry.entry_comments,
              [commentKey]: newComment,
            },
          };
        }
        return entry;
      })
    );
  };

  const handleUpdateComment = async (e, commentId, entryKey) => {
    e.preventDefault();

    const updatedPath = `${entryKey}.entry_comments.comment_${commentId}.content`;

    try {
      await updateDoc(doc(ProEgsDb, "ProEgsEntries", "cFTgQnvX3DwLJk6uzOd4"), {
        [updatedPath]: editingContent,
      });

      setDbdata(prevData =>
        prevData.map(entry => {
          if (entry.entryKey === entryKey) {
            const updatedComments = { ...entry.entry_comments };
            const commentKey = Object.keys(updatedComments).find(
              key => updatedComments[key].id === commentId
            );

            if (commentKey) {
              updatedComments[commentKey] = {
                ...updatedComments[commentKey],
                content: editingContent,
              };
            }

            return {
              ...entry,
              entry_comments: updatedComments,
            };
          }
          return entry;
        })
      );

      setEditingCommentId(null);
      setEditingContent("");

    } catch (error) {
      console.error("Failed to update comment: ", error);
    }
  };

  const startEditingComment = (commentId, comment) => {
    console.log("Editing comment:", commentId);
    setEditingCommentId(commentId);
    setEditingContent(comment.content);
  };

  const userSignature = localStorage.getItem("signature"); // or however you're tracking it

  const userIsAuthor = (signature) => {
    return signature === userSignature;
  };


  return (
    <>
      <Helmet>
        <title>PROEGZYSTENCJALIZM</title>
      </Helmet>
      <HeadStrip />
      <Menu />
      <p className="intro">
        <strong>P R O E G Z Y S T E N C J A L I Z M</strong> charakteryzuje się niemałą płynnością kolorów. Jest on próbą przełożenia języka
        światła na język farb. To właśnie światło jest tutaj głównym motywem. To przez nie wyraża się dążenie człowieka
        do kontaktu (a nawet jedności) z jego żyjącym otoczeniem. Bo to ono zamazuje granicę
        pomiędzy homo sapiens a całym jego "rodzeństwem", czy to w świecie zwierząt czy roślin.
        Reszta na temat znaczenia nazwy...
      </p>
      <div className="entries_section">
        {dbdata.map((entry) => {
          return (
            <div className="entry" key={entry.entryKey}>
              <div className="main_chunk">
                <div className="image_box">
                  <img className={entry.entry_position === "vertical" ? "image_vertical" : "image_horizontal"} src={entry.entryURL} alt="apicture" />
                </div>
                <div className="about">
                  <p>
                    <strong>{entry.entry_name}</strong>
                  </p>
                  <p>
                    {entry.entry_description}
                  </p>
                </div>
              </div>
              <div className="comments_box">
                {[...Object.values(entry.entry_comments)].length > 0 ? <h3>KOMENTARZE:</h3> : null}
                <div className="comments" style={styleAdjuster(entry)}>
                  {Object.values(entry.entry_comments)
                    .sort((a, b) => Number(b.id) - Number(a.id)) // ⬅️ Ascending (newest to oldest)
                    .map((acomment) => {
                      return acomment.id === editingCommentId ? (
                        <form className="edit_form" key={acomment.id} onSubmit={(e) => handleUpdateComment(e, acomment.id, entry.entryKey)}>
                          <textarea
                            className="text"
                            autoFocus
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            required
                          />
                          <div className="buttons">
                            <button className="save_button" type="submit">Zapisz</button>
                            <button className="cancel_button" type="button" onClick={() => setEditingCommentId(null)}>
                              Anuluj
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="comment" key={acomment.id}>
                          <strong><p className="content">{acomment.content}</p></strong>
                          <i><p className="signature">-{acomment.signature}</p></i>
                          <small><p className="date">{new Date(Number(acomment.id)).toLocaleString()}</p></small>
                          {userIsAuthor(acomment.signature) && (
                            <button onClick={() => startEditingComment(acomment.id, acomment)}>
                              Edytuj
                            </button>
                          )}
                        </div>
                      )
                    })
                  }
                </div>
                <button className="add_button" onClick={() => onClickHandler(entry)}>
                  DODAJ KOMENTARZ
                </button>
              </div>
            </div>)
        })}
      </div>
      {commentmodal === true ? (
        <AddCommentModal
          setter01={setCommentModal}
          setter02={addCommentToPortrait}
          state01={currentRef}
          state02={currentPortrait}
        />
      ) : null}
      <FooterSection />
    </>
  )
}

export default ProegsistentialismPage;
