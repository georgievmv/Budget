import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux/es/exports";
import Button from "../UI/Button";
import ProgressBar from "../UI/ProgressBar";
import styles from "./Expenses.module.css";
import { budgetActions, expensesActions } from "../store";
import useFireStore from "../UI/hooks/useFireStore";
import { initialExpenses } from "../App";
const Expenses = (props) => {
  const uid = useSelector((state) => state.auth.uid);
  const [isInitial, setIsinitial] = useState(true);
  const [addedExpense, setAddedExpense] = useState({});
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.expenses);
  const sendData = useFireStore();

  const newBudgetHandler = () => {
    sendData("updateDoc", {
      budget: 0,
      expenses: initialExpenses,
      planing: true,
    });
    props.setPlaning(true);
    dispatch(budgetActions.changeSum(0));
    dispatch(expensesActions.initialteingExpenses(initialExpenses));
  };
  // GETTING DATA FROM FIREBASE
  const getData = async () => {
    const user = await sendData("getDoc");
    dispatch(expensesActions.initialteingExpenses(user.data().expenses));
  };
  useEffect(() => {
    if (uid) {
      getData();
    }
  }, [uid]);
  //----------------------------------------
  const addExpenseChangeHandler = (event) => {
    setAddedExpense({
      id: event.target.id,
      amount: Number(event.target.value),
    });
  };

  const submitExpenseHandler = (event) => {
    event.preventDefault();
    for (let i = 0; i < expenses.length; i++) {
      if (expenses[i].id === addedExpense.id) {
        if (
          expenses[i].planed < addedExpense.amount &&
          expenses[i].amount < addedExpense.amount
        ) {
          alert("Not enough money 1");
          return;
        } else {
          dispatch(expensesActions.addToAmount(addedExpense));
        }
      }
    }
    event.target.reset();
  };

  // UPDATING POHARCHENI V FIREBASE

  useEffect(() => {
    const sendDataHandler = () => {
      sendData("updateDoc", { expenses: expenses });
    };
    if (isInitial) {
      setIsinitial((prevState) => !prevState);
    } else if (!isInitial) {
      for (let i in expenses) {
        if (expenses[i].planed < expenses[i].amount) {
          alert("Not enough money 2");
          return;
        }
      }
    }
    sendDataHandler();
    //-----------------------------
  }, [expenses]);
  //-----------------------------

  return (
    <div className={styles.expenses_container}>
      <Button onClick={props.signOutHandler} className={styles.signOutButton}>
        Sign out
      </Button>
      <div className={styles.second_container}>
        {expenses.map((expense) => {
          if (expense.planed > 0) {
            return (
              <div className={styles.expenses_section} key={expense.id}>
                <div>
                  <h3>{expense.expense}</h3>
                </div>
                <form
                  onSubmit={submitExpenseHandler}
                  className={styles.add_expense_section}
                >
                  <input
                    onChange={addExpenseChangeHandler}
                    className={styles.input}
                    placeholder={"Добави разход"}
                    type="number"
                    id={expense.id}
                  />
                  <Button type="submit">Добави</Button>
                </form>

                <div className={styles.expenses}>
                  <p>Планирани {expense.planed}</p>
                  <p>Похарчени {expense.amount}</p>

                  <p>Остващи {Number(expense.planed) - expense.amount}</p>
                </div>
                <ProgressBar
                  bgcolor="blue"
                  completed={((expense.amount * 100) / expense.planed).toFixed(
                    1
                  )}
                />
              </div>
            );
          } else {
            return "";
          }
        })}
        <Button className={styles.button} onClick={newBudgetHandler}>
          Нов Бюджет
        </Button>
      </div>
    </div>
  );
};
export default Expenses;
