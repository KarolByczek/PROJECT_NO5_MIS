import { useEffect, useState } from "react";
import HeadStrip from "../components/HeadStrip";
import Menu from "../components/Menu";
import { Helmet } from "react-helmet-async";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { DuarealismDb } from "../../AUXILIARY_OBJECTS/DuarealismDB";
import AddCommentModal from "../components/AddCommentModal";
import FooterSection from "../components/FooterSection";
import "./SubPageStyle.scss"

const UniformismPage = () => {

  const [dbdata, setDbdata] = useState([]);
  const [commentmodal, setCommentModal] = useState(false);
  const [currentPortrait, setCurrentPortrait] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [currentRef, setCurrentRef] = useState(null);
  const [editingContent, setEditingContent] = useState("");
<<<<<<< HEAD
=======
  const styleVertical = { maxHeight: "100%" };
  const styleHorizontal = { maxWidth: "100%" };
>>>>>>> f86956241ba7ba0c647a9e2eb5f7bce8fceb42b1
  const someHeight1 = { height: "25vh" };
  const someHeight2 = { height: "35vh" }
  const someHeight3 = {height: "80vh"};
  const noHeight = { height: "0" };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(DuarealismDb, "DuarealismEntries", "XkDAMBaYWifBr5JTKPr9");
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


  const onClickHandler = (current_one) => {
    setCommentModal(true);
    setCurrentPortrait(current_one);
    console.log(currentPortrait);
  };

  const styleAdjuster = (entry) => {
    const count = Object.values(entry.entry_comments).length;
    if (count === 0) return noHeight;
<<<<<<< HEAD
    if (count === 1 && screenX > 1200) return someHeight1;
    if (screenX < 1200) return someHeight3;
=======
    if (count === 1) return someHeight1;
>>>>>>> f86956241ba7ba0c647a9e2eb5f7bce8fceb42b1
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
      await updateDoc(currentRef, {
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
        <title>DUAREALIZM</title>
      </Helmet>
      <HeadStrip />
      <Menu />
      <h1>
        DUAREALIZM
      </h1>
      <div className="entries_section">
        {dbdata.map((entry) => {
          return (
            <div className="entry" key={entry.entryKey}>
              <div className="main_chunk">
<<<<<<< HEAD
                <div className="image_box">
                  <img className={entry.entry_position === "vertical" ? "image_vertical" : "image_horizontal"} src={entry.entryURL} alt="apicture" />
=======
                <div className={`image-wrapper ${entry.entry_position === "horizontal" ? "full-bleed" : ""}`}>
                  <img
                    className="image"
                    src={entry.entryURL}
                    alt="apicture"
                    data-orientation={entry.entry_position}
                    style={entry.entry_position === "vertical" ? styleVertical : styleHorizontal}
                  />
>>>>>>> f86956241ba7ba0c647a9e2eb5f7bce8fceb42b1
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
                {[...Object.values(entry.entry_comments)].length > 0 ? <h3>COMMENTS:</h3> : null}
                <div className="comments" style={styleAdjuster(entry)}>
                  {Object.values(entry.entry_comments)
                    .sort((a, b) => Number(b.id) - Number(a.id)) // ⬅️ Ascending (newest to oldest)
                    .map((acomment) => {
                      return acomment.id === editingCommentId ? (
                        <form key={acomment.id} onSubmit={(e) => handleUpdateComment(e, acomment.id, entry.entryKey)}>
                          <textarea
                            autoFocus
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            required
                          />
                          <button type="submit">Save</button>
                          <button type="button" onClick={() => setEditingCommentId(null)}>
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <div className="comment" key={acomment.id}>
                          <strong><p className="content">{acomment.content}</p></strong>
                          <i><p className="signature">-{acomment.signature}</p></i>
                          <small><p className="date">{new Date(Number(acomment.id)).toLocaleString()}</p></small>
                          {userIsAuthor(acomment.signature) && (
                            <button onClick={() => startEditingComment(acomment.id, acomment)}>
                              Edit
                            </button>
                          )}
                        </div>
                      )
                    })
                  }
                </div>
                <button className="add_button" onClick={() => onClickHandler(entry)}>
                  ADD A COMMENT
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

export default UniformismPage;
