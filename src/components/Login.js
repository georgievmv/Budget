import styles from "./Login.module.css";
import Button from "../UI/Button";
import { useState, useRef } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
const Login = (props) => {
  const [signIn, setSignIn] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    if (signIn) {
      try {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          emailInputRef.current.value,
          passwordInputRef.current.value
        );

        if (userCredentials) {
          await setDoc(doc(db, "users", userCredentials.user.uid), {
            budget: 0,
            expenses: [
              { id: "e1", expense: "Food", amount: 0, planed: 0 },
              { id: "e2", expense: "Bills", amount: 0, planed: 0 },
              { id: "e3", expense: "Home", amount: 0, planed: 0 },
              { id: "e4", expense: "Transport", amount: 0, planed: 0 },
              {
                id: "e5",
                expense: "Medical",
                amount: 0,
                planed: 0,
              },
            ],
            planing: true,
          });
        }
      } catch (e) {
        if (e.message === "Firebase: Error (auth/invalid-email).") {
          setError("Wrong email");
        } else if (e.message === "Firebase: Error (auth/invalid-passiword).") {
          setError("Wrong password");
        } else {
          console.log(e.message);
        }
      }
    } else {
      try {
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          emailInputRef.current.value,
          passwordInputRef.current.value
        );
      } catch (e) {
        if (e.message === "Firebase: Error (auth/invalid-email).") {
          setError("Wrong email");
        } else if (e.message === "Firebase: Error (auth/invalid-passiword).") {
          setError("Wrong password");
        } else {
          console.log(e.message);
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={submitHandler} className={styles.form}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          ref={emailInputRef}
          className={styles.input}
          type="text"
          name="email"
        />
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          ref={passwordInputRef}
          className={styles.input}
          type="password"
          name="password"
        />
        <Button type="submit">{!signIn ? "Log in" : "Sign in"}</Button>
      </form>
      <p>{error}</p>
      <p
        onClick={() => {
          setSignIn((prev) => !prev);
        }}
        className={styles.create_new}
      >
        {!signIn ? "Create new account" : "Login"}
      </p>
    </div>
  );
};

export default Login;
