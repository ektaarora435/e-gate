// create a registration form for the hostel e-gate pass system
import { register } from "@/actions/register";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

const Register = () => {
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push("/dashboard");
  }

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    role: "resident",
    password: "",
    profilePicture: "",
  });

  const { name, email, phone, role, password } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const json = await res.json();
      
      if (!res.ok) {
        setError(json.error || res.statusText);
        toast.error(error, { autoClose: 5000 });
      }
      toast.success("Registration successful");
      return router.push("/dashboard");
    } catch (error) {
      setError(error);
      toast.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 text-black">
      <div className="bg-white p-16 rounded-lg shadow-2xl w-1/3">
        <h2 className="text-3xl font-bold mb-10 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600 font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange("name")}
              autoComplete="name"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
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
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-600 font-medium">Phone</label>
            <input type="text"
              id="phone"
              name="phone"
              value={phone}
              onChange={handleChange("phone")}
              autoComplete="phone"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
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
              required
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
              required
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
            Register
          </button>

          <div className="text-center mt-4">
            <Link href={"/auth/login"} className="text-blue-500 hover:text-blue-700">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
