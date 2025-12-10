import { useState } from "react";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { DuarealismDb } from "../../AUXILIARY_OBJECTS/DuarealismDB";
import "./AddCommentModal.scss";

const AddCommentModal = ({ closeModal, addComment }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const enableScroll = () => {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  };

  const submitComment = async (event) => {
    event.preventDefault();
    setLoading(true);

    const fd = new FormData(event.target);

    const newComment = {
      id: Date.now().toString(),
      content: fd.get("the_content"),
      signature: fd.get("the_signature"),
    };

    try {
      const commentsRef = collection(
        DuarealismDb,
        "DuarealismEntries",
        "DTlwxRdu5sEIGDXvekSP",
        "entry_comments"
      );

      const docRef = await addDoc(commentsRef, newComment);

      // Update parent counter (required by Firestore rules)
      const entryDocRef = doc(DuarealismDb, "DuarealismEntries", "DTlwxRdu5sEIGDXvekSP");
      const entrySnap = await getDoc(entryDocRef);
      const currentCount = entrySnap.data().entry_comments_count || 0;

      await updateDoc(entryDocRef, {
        entry_comments_count: currentCount + 1
      });

      addComment(newComment, docRef.id);

      setSuccess(true);

      setTimeout(() => {
        closeModal();
        enableScroll();
      }, 1500);

    } catch (error) {
      console.error("Error adding comment: ", error);
    } finally {
      setLoading(false);
      localStorage.setItem("signature", newComment.signature);
    }
  };

  return (
    <div id="add_comment_modal">
      {success ? (
        <div className="success-message">✅ KOMENTARZ DODANY!</div>
      ) : (
        <form className="add_employee_form" onSubmit={submitComment}>
          <label>
            Twój komentarz:
            <textarea name="the_content" required maxLength={300} />
          </label>

          <label>
            Twój podpis:
            <input name="the_signature" type="text" required maxLength={30} />
          </label>

          <button className="add_button" type="submit" disabled={loading}>
            {loading ? "DODAWANIE..." : "DODAJ"}
          </button>

          <button
            className="cancel_button"
            type="button"
            onClick={() => {
              closeModal();
              enableScroll();
            }}
          >
            ALBO ZLITUJ SIĘ :)
          </button>
        </form>
      )}
    </div>
  );
};

export default AddCommentModal;