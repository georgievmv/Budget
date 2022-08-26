import { getDoc, addDocs, useDoc, updateDoc, doc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../../firebase";
import { authActions } from "../../store";

const useFireStore = () => {
  const dispatch = useDispatch();
  const uid = useSelector((state) => state.auth.uid);

  const userRef = doc(db, "users", uid);
  const sendRequest = async (task, payload) => {
    if (task === "updateDoc") {
      try {
        const response = await updateDoc(userRef, payload);

        return response;
      } catch (e) {
        alert(e);
      }
    } else if (task === "getDoc") {
      try {
        const response = await getDoc(userRef);

        return response;
      } catch (e) {
        alert(e);
      }
    }
  };

  return sendRequest;
};

export default useFireStore;
