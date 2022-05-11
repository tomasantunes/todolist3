import {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  function loadTasks() {
    setTasks([]);
    axios.get("http://localhost:4000/tasks/list")
    .then(function(response) {
      setTasks(response['data']);
    });
  }

  function changeNewTask(e) {
    setNewTask(e.target.value);
  }

  function addTask() {
    axios.post("http://localhost:4000/tasks/add", {task: newTask})
    .then(function(response) {
      if (response['data']['status'] == "OK") {
        setNewTask("");
        loadTasks();
      }
    })
  }

  function deleteTask(e) {
    var id = e.target.value;

    axios.post("http://localhost:4000/tasks/delete", {id: id})
    .then(function(response) {
      if (response['data']['status'] == "OK") {
        loadTasks();
      }
    });
  }

  function checkTask(e) {
    var id = e.target.value;
    var is_done = e.target.checked == true ? 1 : 0;

    axios.post("http://localhost:4000/tasks/check", {id: id, is_done: is_done})
    .then(function(response) {
      if (response['data']['status'] == "OK") {
        loadTasks();
      }
    });
  }

  useEffect(() => {
    loadTasks();
  }, [])

  return (
    <div className="container">
      <h1>To-Do List</h1>

      <table className="table">
        <thead>
          <tr>
            <th style={{width: "75%"}}>Task</th>
            <th style={{width: "25%"}}>Actions</th>
          </tr>
        </thead>
        <tbody>
            {tasks.map((task) =>
            <tr key={task['id']}>
                <td>{task['task']}</td>
                <td>
                  <input type="checkbox" className="me-2" checked={task['is_done'] == 1 ? true : false} value={task['id']} onChange={checkTask} style={{width: "35px", height: "35px"}}/>
                  <button className="btn btn-danger" value={task['id']} onClick={deleteTask} style={{marginTop: "-25px"}}>X</button>
                </td>
            </tr>
            )}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <input type="text" className="form-control" value={newTask} onChange={changeNewTask} />
            </td>
            <td>
              <button className="btn btn-success" onClick={addTask}>+</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
