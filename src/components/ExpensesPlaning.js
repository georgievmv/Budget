import { useSelector } from "react-redux/es/exports";
import { expensesActions } from "../store";
import { useDispatch } from "react-redux/es/exports";
import { useState, useEffect, useRef, useCallback } from "react";
import Button from "../UI/Button";
import styles from "./ExpensesPlaning.module.css";
import useFireStore from "../UI/hooks/useFireStore";

const ExpensesPlaning = (props) => {
  const expenses = useSelector((state) => state.expenses.expenses);
  const [expensesObj, setExpensesObj] = useState([]);
  const dispatch = useDispatch();
  const nalichni = useSelector((state) => state.budget.money);
  const customExpense = useRef();
  const sendData = useFireStore();

  const [leftAfterPlan, setLeftAfterPlan] = useState(nalichni);

  //FORMING OWN EXPENSE OBJ
  const customExpenseSubmitHandler = (event) => {
    event.preventDefault();
    if (customExpense.current.value) {
      let idArr = expenses.map((elem) => elem.id);
      idArr = idArr.join("").split("");
      let newId = `e${Number(idArr[idArr.length - 1]) + 1}`;
      const customExpenseObj = {
        id: newId,
        expense: customExpense.current.value,
        amount: 0,
        planed: 0,
      };
      dispatch(expensesActions.addOwnExpense(customExpenseObj));
      customExpense.current.value = "";
    } else {
      return;
    }
  };
  //-------------------------------------------------
  //FORMING EXPENSES ARR BEFORE UPDATING THE STATE IN STORE
  const changeHandler = (event) => {
    const expenseIsPresent = expensesObj.find(
      (elem) => elem.id === event.target.id
    );

    const objToBePushed = {
      id: event.target.id,
      planed: Number(event.target.value),
    };
    if (expenseIsPresent) {
      setExpensesObj((prevState) => {
        const presentIndex = prevState.indexOf(expenseIsPresent);

        prevState.splice(presentIndex, 1, objToBePushed);
        return prevState;
      });
    } else if (!expenseIsPresent) {
      setExpensesObj((prevState) => {
        const newState = [...prevState, objToBePushed];
        return newState;
      });
    }
    //-----------------------------------------------------
    /*  id: event.target.id, planed: event.target.value  */
  };
  //UPDATING BUDGET AND EXPENSES STATES
  const formChangeHandler = (event) => {
    dispatch(expensesActions.updateExpenses(expensesObj));
  };
  useEffect(() => {
    setLeftAfterPlan(nalichni);
    const sumOfExpenses = expensesObj.reduce((sum, elem) => {
      return sum + Number(elem.planed);
    }, 0);
    setLeftAfterPlan((prevState) => {
      return prevState - sumOfExpenses; //OnClick Change za promqnata na budgeta 4e me kefi pove4e tei
    });
  }, [formChangeHandler]);

  //----------------------------------------------
  //SENDING EXPENSESN TO BACKEND

  useEffect(() => {
    sendData("updateDoc", { expenses: expenses });
  }, [expenses]);
  //-----------------------------------------------------
  //NEW BUDGET

  const newBudgetHandleClick = () => {
    props.newBudgetHandleClick();
  };

  //-----------------------------------------------------

  //----------------------------------------------------------
  const endPlaningHandler = () => {
    props.onSetPlaning(false);
    sendData("updateDoc", { planing: false });
  };

  return (
    <div className={styles.container}>
      <Button className={styles.signOutButton} onClick={props.signOutHandler}>
        Sign Out
      </Button>
      <form
        className={styles.form}
        onChange={formChangeHandler}
        id={"planing_form"}
      >
        {expenses.map((elem) => {
          return (
            <div key={elem.id}>
              <span>{elem.expense}</span>
              <input
                className={styles.inputText}
                placeholder={elem.expense}
                onChange={changeHandler}
                id={elem.id}
                type="number"
                name={elem.expense}
              />
            </div>
          );
        })}
        <div className={styles.new_expense_container}>
          <input
            placeholder="Добави свой разход"
            ref={customExpense}
            type="text"
          />
          <Button
            className={styles.add_button}
            onClick={customExpenseSubmitHandler}
            type="submit"
          >
            Добави
          </Button>
        </div>
      </form>
      <div className={styles.end_planing}>
        <h1>Остатък след планиране {leftAfterPlan}</h1>
        <div className={styles.buttons_container}>
          <Button
            className={styles.end_planing_button}
            onClick={endPlaningHandler}
          >
            Завърши планиране
          </Button>
          <Button
            className={styles.new_budget_button}
            onClick={newBudgetHandleClick}
          >
            Нов бюджет
          </Button>
        </div>
      </div>
      <div className={styles.filler}></div>
    </div>
  );
};

export default ExpensesPlaning;
