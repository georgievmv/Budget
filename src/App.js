import "./App.css";
import Loading from "./UI/Loading";
import { useState } from "react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux/es/exports";
import Home from "./components/Home";
import ExpensesPlaning from "./components/ExpensesPlaning";
import Expenses from "./components/Expenses";
import { useEffect } from "react";
import Login from "./components/Login";
import { budgetActions, expensesActions } from "./store";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { authActions } from "./store";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const initialExpenses = [
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
];
function App() {
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const uid = useSelector((state) => state.auth.uid);
  const [loading, setLoading] = useState(false);
  const cash = useSelector((state) => state.budget.money);
  const [planing, setPlaning] = useState(true);
  const [initialLogin, setInitialLogin] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("loggedIn")) {
      setInitialLogin(true);
    }
  }, []);
  //SignInAndOutHandler
  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(authActions.signIn(user.uid));
        localStorage.setItem("loggedIn", "1");
      } else {
        dispatch(authActions.signOut());
        setInitialLogin(false);
        localStorage.removeItem("loggedIn");
      }
    });
    setLoading(false);
  }, []);
  const signOutHandler = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      alert(e);
    }
  };

  const newBudgetHandleClick = () => {};

  //----------
  //getting expenses data
  const fetchExpensesData = async () => {
    setLoading(true);
    const userRef = doc(db, "users", uid);
    const user = await getDoc(userRef);
    dispatch(expensesActions.initialteingExpenses(user.data().expenses));
    setLoading(false);
  };

  //--------------------
  //SENDING PLANING BOOLEAN INFO TO BACKEND

  //------------------------------
  //GETTING PLANING BOOLEAN INFO FROM BACKEND
  const fetchPlaning = async () => {
    setLoading(true);
    const userRef = doc(db, "users", uid);
    const user = await getDoc(userRef);
    setPlaning(user.data().planing);
    setLoading(false);
  };

  //-----------------------------------
  //cheking if firebase already has stored data for budget
  const fetchBudgetData = async () => {
    setLoading(true);
    const userRef = doc(db, "users", uid);
    const user = await getDoc(userRef);
    dispatch(budgetActions.changeSum(user.data().budget));
    setLoading(false);
  };

  useEffect(() => {
    if (uid) {
      console.log("yes");
      fetchBudgetData();
      fetchPlaning();
      fetchExpensesData();
    }
  }, [uid]);
  //---------------------------------------------

  return (
    <Fragment>
      {loading && <Loading />}
      {!initialLogin && !isSignedIn && <Login />}
      {isSignedIn && !loading && planing && cash < 1 && (
        <Home signOutHandler={signOutHandler} />
      )}
      {isSignedIn && !loading && planing && cash > 0 ? (
        <ExpensesPlaning
          signOutHandler={signOutHandler}
          newBudgetHandleClick={newBudgetHandleClick}
          onSetPlaning={setPlaning}
        />
      ) : (
        ""
      )}
      {isSignedIn && !loading && !planing && (
        <Expenses signOutHandler={signOutHandler} setPlaning={setPlaning} />
      )}{" "}
    </Fragment>
  );
}

export default App;
