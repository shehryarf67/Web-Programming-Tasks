import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";

function Home() {
  return (
    <div className="container">
      <h1>Home</h1>
      <p>Welcome to this simple React Router application.</p>
    </div>
  );
}

function About() {
  return (
    <div className="container">
      <h1>About</h1>
      <p>
        This application shows how to use client-side routing with React Router
        and how to build a controlled contact form using useState.
      </p>
    </div>
  );
}

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const formData = {
      name: name,
      email: email,
      message: message,
    };

    console.log("Submitted Data:", formData);

    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="container">
      <h1>Contact</h1>
      <p>Fill out the form below.</p>

      <form onSubmit={handleSubmit} className="form">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your name"
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          required
        />

        <label>Message</label>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Enter your message"
          required
        ></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;