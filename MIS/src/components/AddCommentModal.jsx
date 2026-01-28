import { useState } from "react";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import "./AddCommentModal.scss";

const AddCommentModal = ({ closeModal, entry, addComment, db, collectionName }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const enableScroll = () => {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  };

  const submitComment = async (event) => {
    event.preventDefault();
    setLoading(true);

    const form = event.target;
    const fd = new FormData(form);

    const newComment = {
      id: Date.now().toString(),
      content: fd.get("the_content"),
      signature: fd.get("the_signature"),
    };

    try {
      // 1️⃣ Add comment document to Firestore
      const commentsRef = collection(db, collectionName, entry.entryId, "entry_comments");
      await addDoc(commentsRef, newComment);

      // 2️⃣ Increase comment count in the parent document
      const parentRef = doc(db, collectionName, entry.entryId);
      const parentSnap = await getDoc(parentRef);
      const currentCount = parentSnap.data().entry_comments_count || 0;
      await updateDoc(parentRef, {
        entry_comments_count: currentCount + 1,
      });

      // 3️⃣ Immediately update frontend
      addComment(entry.entryId, newComment, newComment.id);

      // 4️⃣ UI feedback
      setSuccess(true);
      form.reset();

      setTimeout(() => {
        closeModal();
        enableScroll();
      }, 1500);
    } catch (error) {
      console.error("Error adding comment: ", error);
      alert("Nie udało się dodać komentarza!");
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
        <>
          <form className="add_comment_form" onSubmit={submitComment}>
            <label>
              Twój komentarz:
              <textarea name="the_content" required maxLength={300} placeholder="Do 300 znaków."/>
            </label>

            <label>
              Twój podpis:
              <input name="the_signature" type="text" required maxLength={30} placeholder="Do 30 znaków."/>
            </label>

            <button className="add_button" type="submit" disabled={loading}>
              {loading ? "DODAWANIE..." : "DODAJ KOMENTARZ"}
            </button>

            <button
              className="cancel_button"
              type="button"
              onClick={() => {
                closeModal();
                enableScroll();
              }}
            >
              ...ALBO NIE :)
            </button>
          </form>

          <div className="image_box">
            <img
              className={entry.entry_position === "vertical" ? "image_vertical" : "image_horizontal"}
              src={entry.entryURL}
              alt="preview"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AddCommentModal;