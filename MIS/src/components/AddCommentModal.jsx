import { updateDoc } from "firebase/firestore";
import { useState } from "react";
import "./AddCommentModal.scss";

const AddCommentModal = (props) => {
    const entryKey = props.state02.entryKey;
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!entryKey) {
        console.error("No portraitKey found in currentPortrait");
        return null;
    }

    function makeComment(formdata) {
        return {
            id: Date.now().toString(),
            content: formdata.get("the_content"),
            signature: formdata.get("the_signature")
        };
    }

    const enableScroll = () => {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
        document.body.style.paddingRight = "";
    };

    const handleAddComment = async (event) => {
        event.preventDefault();
        enableScroll();
        window.scroll(false);
        setLoading(true);

        const form = event.target;
        const specformdata = new FormData(form);
        const specComment = makeComment(specformdata);

        const CommentRef = props.state01;
        const commentKey = `comment_${Date.now()}`;

        try {
            await updateDoc(CommentRef, {
                [`${entryKey}.entry_comments.${commentKey}`]: specComment
            });

            props.setter02(entryKey, specComment);
            console.log("Comment added successfully!");
            setSuccess(true);
            form.reset(); // ✅ Clear form after success

            setTimeout(() => {
                props.setter01(false);
            }, 2000);
        } catch (error) {
            console.error("Error adding comment: ", error);
        } finally {
            setLoading(false);
            localStorage.setItem("signature", specComment.signature);
        }
    };

    const handleCancel = () => {
        props.setter01(false);
        enableScroll();
    }

    return (
        <div id='add_comment_modal'>
            {success ? (
                <div className="success-message">
                    ✅ KOMENTARZ DODANY!
                </div>
            ) : (
                <>
                    <form className="add_employee_form" onSubmit={handleAddComment}>
                        <label htmlFor="the_content">
                            Twój komentarz:
                            <textarea name='the_content' required />
                        </label>
                        <label htmlFor="the_signature">
                            Twój podpis:
                            <input
                                name='the_signature'
                                type="text"
                                required
                                placeholder="Twoje imię albo pseudonim (max. 30 znaków)"
                                maxLength={30}
                            />
                        </label>
                        <button className="add_button" type="submit" disabled={loading}>
                            {loading ? "DODAWANIE..." : "DODAJ"}
                        </button>
                        <button className="cancel_button" onClick={() => handleCancel()}>
                            ALBO ZLITUJ SIĘ :)
                        </button>
                    </form>
                    <div className="image_box">
                        <img className={props.state02.entry_position === "vertical" ? "image_vertical" : "image_horizontal"} src={props.state02.entryURL} alt="...." />
                    </div>
                </>
            )}
        </div>
    );
};

export default AddCommentModal;