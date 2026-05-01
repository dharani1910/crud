import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [editId, setEditId] = useState(null);

  const backendUrl = "http://localhost:5000/users";

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(backendUrl);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
//use effect
  useEffect(() => {
    fetchUsers();
  }, []);

  // Add new user
  const addUser = async () => {
    if (!name || age === "") return alert("Name and Age required");
    try {
      await axios.post(backendUrl, { name, age: Number(age) });
      setName("");
      setAge("");
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit user
  const startEdit = (user) => {
    setEditId(user._id);
    setName(user.name);
    setAge(user.age);
  };

  const updateUser = async () => {
    try {
      await axios.put(`${backendUrl}/${editId}`, {
        name,
        age: Number(age),
      });
      setEditId(null);
      setName("");
      setAge("");
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${backendUrl}/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>CRUD App with React & Node.js</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        {editId ? (
          <button onClick={updateUser}>Update</button>
        ) : (
          <button onClick={addUser}>Add</button>
        )}
      </div>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>
                  <button onClick={() => startEdit(user)}>Edit</button>
                  <button onClick={() => deleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No Users Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;