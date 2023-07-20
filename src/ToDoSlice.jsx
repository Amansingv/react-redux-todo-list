import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todoList: [],
  sortCriteria: "All",
};

const ToDoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTodoList: (state, action) => {
      state.todoList = action.payload;
    },
    addTodo: (state, action) => {
      state.todoList.push({
        task: action.payload.task,
        id: action.payload.id,
        date: action.payload.date,
        completed: false,
      });
    },
    sortTodo: (state, action) => {
      state.sortCriteria = action.payload;
    },
    updateTodo: (state, action) => {
      const { id, task, date } = action.payload;
      const index = state.todoList.findIndex((todo) => todo.id === id);
      state.todoList[index].task = task;
      state.todoList[index].date = date;
    },
    toggleCompleted: (state, action) => {
      const { id } = action.payload;
      const index = state.todoList.findIndex((todo) => todo.id === id);
      state.todoList[index].completed = !state.todoList[index].completed;
    },
  },
});

export const { setTodoList, addTodo, sortTodo, updateTodo, toggleCompleted } =
  ToDoSlice.actions;

export default ToDoSlice.reducer;
