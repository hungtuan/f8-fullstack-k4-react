import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "../config.json";
import request from "../utils/request";

const { API_URL } = config;

const Todolist = () => {
  const [apiKey, setApiKey] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  // autofocus
  const emailInput = useCallback((inputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  useEffect(() => {
    const existingApiKey = Cookies.get("apiKey");
    const email = Cookies.get("email");

    if (existingApiKey) {
      setApiKey(existingApiKey);
      alert(`Chào mừng ${email} đã quay trở lại`);
    } else {
      const userEmail = prompt("Nhập email:");
      if (userEmail) {
        Cookies.set("email", userEmail);
        axios
          .get(`${API_URL}/api-key?email=${userEmail}`)
          .then((response) => {
            console.log(response.data);
            const { code, data } = response.data;
            if (code === 200 && data && data.apiKey) {
              Cookies.set("apiKey", data.apiKey);
              setApiKey(data.apiKey);
              window.location.reload();

              handleGetTodo();
            }
          })
          .catch((error) => {
            console.error(error);
            alert("Email không đúng");
            window.location.reload();
          });
      } else {
        window.location.reload();
      }
    }
  }, []);

  // Handle Event

  // Add
  const handleAddTodo = async (e) => {
    e.preventDefault();

    try {
      console.log(inputValue);
      const response = await request.post("/todos", {
        todo: inputValue,
      });
      console.log(response.data);
      setInputValue("");
      handleGetTodo();
    } catch (error) {
      console.error(error);
      alert("Tài khoản đăng nhập ở nơi khác");

      Cookies.remove("apiKey");

      window.location.reload();
    }
  };

  const handleRefeshApiKey = () => {
    const email = Cookies.get("email");
    axios
      .get(`${API_URL}/api-key?email=${email}`)
      .then((response) => {
        console.log(response.data);
        const { code, data } = response.data;
        if (code === 200 && data && data.apiKey) {
          Cookies.set("apiKey", data.apiKey);
          setApiKey(data.apiKey);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // Get
  const handleGetTodo = async () => {
    try {
      const response = await request.get("/todos");
      console.log(response.data);

      const { data } = response.data;
      if (data && data.listTodo) {
        setTodos(data.listTodo);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetTodo();
  }, []);

  // Delete
  const handleDeleteTodo = async (todoId) => {
    try {
      const response = await request.delete(`/todos/${todoId}`);
      console.log(response.data);
      alert(response.data.message);

      handleGetTodo();
    } catch (error) {
      console.error(error);
    }
  };

  return apiKey ? (
    <div className="main">
      <div className="inner">
        <h1 className="title">Welcome to Todo App !</h1>
        <form>
          <div className="form">
            <input
              className="text-input"
              type="text"
              name="todo"
              ref={emailInput}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Thêm một việc làm mới"
            />
            <button className="add-btn" type="submit" onClick={handleAddTodo}>
              Thêm mới
            </button>
          </div>
        </form>
        <ul className="todo-lists">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <li key={todo._id} className="list-item">
                <input
                  className="text-content"
                  value={todo.todo}
                  readOnly
                ></input>
                <div className="btn-todo">
                  <button className="edit-btn" type="button">
                    Sửa
                  </button>
                  <button
                    className="delete-btn"
                    type="button"
                    onClick={() => handleDeleteTodo(todo._id)}
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="list-item">Không có todo</li>
          )}
        </ul>
      </div>
    </div>
  ) : null;
};

export default Todolist;
