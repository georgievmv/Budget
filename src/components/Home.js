import { useDispatch } from "react-redux";
import { useRef } from "react";
import Button from "../UI/Button";
import { budgetActions } from "../store";
import styles from "./Home.module.css";
import useFireStore from "../UI/hooks/useFireStore";
const Home = (props) => {
  const cashRef = useRef();
  const updateData = useFireStore();
  const dispatch = useDispatch();

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(budgetActions.changeSum(Number(cashRef.current.value)));
    updateData("updateDoc", { budget: Number(cashRef.current.value) });
  };

  return (
    <div className={styles.container_of_container}>
      <div className={styles.home_container}>
        <Button onClick={props.signOutHandler} className={styles.signOutButton}>
          Sign Out
        </Button>
        <form className={styles.form} onSubmit={submitHandler}>
          <label className={styles.label}>Enter your budget</label>
          <input
            className={styles.input}
            ref={cashRef}
            name="cash"
            type="number"
          />
          <Button className={styles.button} type="submit">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Home;
