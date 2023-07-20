import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  setTodoList,
  addTodo,
  updateTodo,
  sortTodo,
  toggleCompleted,
} from "../ToDoSlice";
import { TiPencil } from "react-icons/ti";
import { BsTrash } from "react-icons/bs";
import { BsXLg } from "react-icons/bs";

const schema = yup.object({
  todo: yup.string().required("Task is required"),
  date: yup.string().required("date is required"),
});

function TodoList() {
  const dispatch = useDispatch();
  const todoList = useSelector((state) => state.todo.todoList);
  const sortCriteria = useSelector((state) => state.todo.sortCriteria);
  const [showModal, setShowModal] = useState(false);

  const [mode, setMode] = useState("add");
  const [id, setId] = useState(null);
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    if (mode === "add") {
      handleAddTodo(data.todo, data.date);
    } else {
      handleUpdateToDoList(id, data.todo, data.date);
    }
    setShowModal(false);
    setMode("add");
    setValue("todo", "");
    reset();
  };

  useEffect(() => {
    if (todoList.length > 0) {
      localStorage.setItem("todoList", JSON.stringify(todoList));
    }
  }, [todoList]);

  useEffect(() => {
    const localTodoList = JSON.parse(localStorage.getItem("todoList"));
    if (localTodoList) {
      dispatch(setTodoList(localTodoList));
    }
  }, []);

  const handleAddTodo = (task, date) => {
    if (task.trim().length === 0) {
      alert("Please enter a task");
    } else {
      dispatch(addTodo({ task: task, id: Date.now(), date: date }));
      setShowModal(true);
    }
  };
  const handleUpdateToDoList = (id, task, date) => {
    if (task.trim().length === 0) {
      alert("Please enter a task");
    } else {
      dispatch(updateTodo({ task: task, id: id, date: date }));
      setShowModal(false);
    }
  };
  const handleDeleteToDo = (id) => {
    const updatedToDoList = todoList.filter((todo) => todo.id != id);
    dispatch(setTodoList(updatedToDoList));
    localStorage.setItem("todoList", JSON.stringify(updatedToDoList));
  };

  function handleSort(sortCriteria) {
    dispatch(sortTodo(sortCriteria));
  }

  function getCurrentDate() {
    const date = new Date();

    let currentDay = String(date.getDate()).padStart(2, "0");

    let currentMonth = String(date.getMonth() + 1).padStart(2, "0");

    let currentYear = date.getFullYear();

    // we will display the date as DD-MM-YYYY
    let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;
    return currentDate;
  }

  const sortToDoList = todoList
    .filter((todo) => {
      if (sortCriteria === "All") return true;
      if (sortCriteria === "Completed" && todo.completed) return true;
      if (
        sortCriteria === "Not Completed" &&
        !todo.completed &&
        new Date(getCurrentDate()) < new Date(todo.date)
      )
        return true;
      if (
        sortCriteria === "overdue" &&
        new Date(getCurrentDate()) > new Date(todo.date)
      )
        return true;
      return false;
    })
    .filter((todo) => {
      if (search !== "") {
        return todo.task.toLowerCase().includes(search.toLowerCase());
      } else return true;
    });

  const handleToggleCompleted = (id) => {
    dispatch(toggleCompleted({ id }));
  };

  console.log("serch: ", search);
  console.log("sort todo list; ", sortToDoList);

  const handleSearch = (value) => {
    const timer = setTimeout(() => {
      setSearch(value);
    }, 500);
    return () => clearTimeout(timer);
  };

  return (
    <div>
      <div className="text-center text-4xl font-bold">Todo List</div>
      {showModal && (
        <div className="fixed w-full left-0 top-0 h-full bg-transparentBlack z-10 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-full max-w-xl">
            <div className="flex justify-end items-center">
              <span
                className="text-zinc-700 text-xs cursor-pointer"
                onClick={() => {
                  setShowModal(false), clearErrors(), reset();
                }}
              >
                <BsXLg />
              </span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="todo" className="ml-1 font-medium">
                  Enter Todo
                </label>
                <br />
                <textarea
                  {...register("todo")}
                  rows={4}
                  id="todo"
                  name="todo"
                  className="border p-2 rounded-md mt-1 outline-none w-full"
                  placeholder={
                    mode === "edit"
                      ? "Update your task here"
                      : "Enter your task here"
                  }
                />
                <p className="text-sm text-red-600">{errors.todo?.message}</p>
              </div>
              <div className="mt-2">
                <label htmlFor="date" className="ml-1 font-medium">
                  Completed by
                </label>
                <br />
                <input
                  {...register("date")}
                  type="date"
                  id="date"
                  placeholder="Enter completion date"
                  name="date"
                  className="border p-2 rounded-md mt-1 outline-none w-full"
                />
                <p className="text-sm text-red-600">{errors.date?.message}</p>
              </div>
              <div className="flex justify-end items-center gap-2 mt-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white duration-150 px-3 py-1.5 rounded-md"
                >
                  {mode === "add" ? "Submit" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className=" flex items-center justify-center flex-col">
        {todoList.length === 0 ? (
          <div className="mb-6">
            <p className="text-center text-Gray mt-6">
              You have no todo's, please add one.
            </p>
          </div>
        ) : (
          <div className="container mx-auto mt-6">
            <div className="flex justify-center gap-6 mb-6 mx-auto w-full md:w-[75%]">
              <div className="w-full">
                <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 pl-10 outline-none text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
                    placeholder="Search..."
                    required
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
              <select
                onChange={(e) => handleSort(e.target.value)}
                className=" outline-none text-sm border border-gray-300 bg-gray-50 rounded-md px-4 py-2"
              >
                <option value="All" className="text-sm">
                  All
                </option>
                <option value="Completed" className="text-sm">
                  Completed
                </option>
                <option value="Not Completed" className="text-sm">
                  Not Completed
                </option>
                <option value="overdue" className="text-sm">
                  Over Due
                </option>
              </select>
            </div>
            <div>
              {sortToDoList.length === 0 && <div className="flex justify-start items-center mb-4 text-zinc-600">There are no tasks matching your search input and filter....</div>}
              {sortToDoList.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between mb-6 bg-zinc-200 mx-auto w-full md:w-[75%] rounded-md p-4"
                >
                  <div>
                    <div
                      className={`${
                        todo.completed
                          ? "line-through text-greenTeal cursor-pointer"
                          : "text-zinc-800 cursor-pointer"
                      }`}
                      onClick={() => {
                        handleToggleCompleted(todo.id);
                      }}
                    >
                      {todo.task}
                    </div>
                    <div className="text-sm mt-2">Done by: {todo.date}</div>
                  </div>
                  <div>
                    <button
                      title="edit"
                      className="bg-blue-500 text-white p-1 rounded-md ml-2"
                      onClick={() => {
                        setMode("edit");
                        setShowModal(true);
                        setId(todo.id);
                        setValue("todo", todo.task);
                        setValue("date", todo.date);
                      }}
                    >
                      <TiPencil />
                    </button>
                    <button
                      title="delete"
                      className="bg-sunsetOrange text-white p-1 rounded-md ml-2"
                      onClick={() => handleDeleteToDo(todo.id)}
                    >
                      <BsTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          className="bg-blue-600 text-center text-white py-3 px-10 rounded-md"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Add Task
        </button>
      </div>
    </div>
  );
}

export default TodoList;
