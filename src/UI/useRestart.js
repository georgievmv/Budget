import { useDispatch, useSelector } from "react-redux";
import { budgetActions } from "../store";

const useRestart = () => {
  conse uid = useSelector((state)=>state.auth.uid)
  const dispatch = useDispatch();

  const budgetRenew = async () => {
    const response = await fetch(
      "https://react-3e8f5-default-rtdb.firebaseio.com/budget.json",
      {
        method: "PUT",
        body: JSON.stringify(0),
      }
    );

    const data = await response.json();
    dispatch(budgetActions.changeSum(0));
  };
  const expensesRenew = async () => {
    const response = await fetch(
      `https://react-3e8f5-default-rtdb.firebaseio.com/${uid}.json`,
      {
        method: "PUT",
        body: JSON.stringify( {budget: 0,
      expenses: [
        { id: "e1", expense: "Храна", amount: 0, planed: 0 },
        { id: "e2", expense: "Сметки", amount: 0, planed: 0 },
        { id: "e3", expense: "Дом", amount: 0, planed: 0 },
        { id: "e4", expense: "Транспорт", amount: 0, planed: 0 },
        {
          id: "e5",
          expense: "Медицински",
          amount: 0,
          planed: 0,
        },
      ],
      planing: true,}),
      }
    );
    if (!response.ok) {
      throw new Error("could not send shit");
    }
    const data = await response.json();
  };
  return [budgetRenew, expensesRenew];
};
export default useRestart;
