import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-3">Home</h1>
      <p className="text-base">Welcome to this simple React Router application.</p>
    </div>
  );
}

function About() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-3">About</h1>
      <p className="text-base">
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
      name,
      email,
      message,
    };

    console.log("Submitted Data:", formData);

    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-3xl font-bold mb-3">Contact</h1>
      <p className="text-base mb-4">
        Fill out the form below. This is a controlled form using useState.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            className="w-full border rounded-xl p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            className="w-full border rounded-xl p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Enter your message"
            className="w-full border rounded-xl p-3 h-32"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl shadow bg-black text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="flex gap-4 p-4 border-b bg-white sticky top-0">
      <Link to="/" className="font-medium hover:underline">
        Home
      </Link>
      <Link to="/about" className="font-medium hover:underline">
        About
      </Link>
      <Link to="/contact" className="font-medium hover:underline">
        Contact
      </Link>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
