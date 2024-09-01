"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

const Login = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    router.push("/dashboard")
  }

  const [error, setError] = useState("");
  const [values, setValues] = useState({
    email: "",
    password: "",
    role: "resident",
  });

  const { email, password, role } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      role,
      redirect: false,
    });

    if (res.error) {
      setError(res.error);
      alert(res.error);
    }

    if (res?.ok) {
      alert("Login successful");
      return router.push("/dashboard");
    }
};

  return (

    <div className="flex justify-center items-center h-screen bg-gray-200 text-black">
      <div className="bg-white p-16 rounded-lg shadow-2xl md:w-1/3 sm:w-full sm:mx-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange("email")}
              autoComplete="email"
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600 font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange("password")}
              autoComplete="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-600 font-medium">Role</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={handleChange("role")}
              className="w-full p-2 border border-gray-300 text-black rounded mt-1"
            >
              <option value="resident">Resident</option>
              <option value="visitor">Visitor</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-medium p-3 rounded mt-4"
          >
            Login
          </button>

          <div className="text-center mt-4">
            <Link href={"/auth/register"} className="text-blue-500 hover:text-blue-700">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
