import { configureStore, current } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialBudgetState = { money: 0 };

const authSlice = createSlice({
  name: "auth",
  initialState: { isSignedIn: false, uid: null },
  reducers: {
    alreadyLogedIn(state) {
      state.isSignedIn = true;
    },
    signIn(state, action) {
      state.uid = action.payload;
      state.isSignedIn = true;

      localStorage.setItem("uid", action.payload);
    },
    signOut(state) {
      state.isSignedIn = false;
    },
  },
});

const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
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
  },

  reducers: {
    initialteingExpenses(state, action) {
      state.expenses = action.payload;
    },
    updateExpenses(state, action) {
      for (let i = 0; i < state.expenses.length; i++) {
        for (let j = 0; j < action.payload.length; j++) {
          if (state.expenses[i].id === action.payload[j].id) {
            state.expenses[i].planed = action.payload[j].planed;
          }
        }
      }
    },
    addOwnExpense(state, action) {
      state.expenses.push(action.payload);
    },
    addToAmount(state, action) {
      for (let i = 0; i < state.expenses.length; i++) {
        if (state.expenses[i].id === action.payload.id) {
          state.expenses[i].amount += action.payload.amount;
        }
      }
    },
  },
});

const budgetSlice = createSlice({
  name: "budget",
  initialState: initialBudgetState,
  reducers: {
    changeSum(state, action) {
      state.money = action.payload;
    },
    reduceBudget(state, action) {
      if (state.money > action.payload) {
        state.money = state.money - action.payload;
      } else {
        console.log(state.money - action.payload);
      }
    },
  },
});
const store = configureStore({
  reducer: {
    budget: budgetSlice.reducer,
    expenses: expensesSlice.reducer,
    auth: authSlice.reducer,
  },
});

export const budgetActions = budgetSlice.actions;
export const expensesActions = expensesSlice.actions;
export const authActions = authSlice.actions;

export default store;
