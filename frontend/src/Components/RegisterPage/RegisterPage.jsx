import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../lib/firebase";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    phoneNumber: "",
    city: "",
    district: "",
    country: "",
    zipCode: "",
  });
  const [imageFile, setImageFile] = useState(null); // store selected file
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      let imageURL = "";

      if (imageFile) {
        const imageRef = ref(storage, `Profile Image/${user.uid}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageURL = await getDownloadURL(imageRef);
      }

      const userData = {
        ...formData,
        uid: user.uid,
        image: imageURL,
      };

      await setDoc(doc(db, "users", user.uid), userData);
      setIsLoading(false);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <form
        onSubmit={handleRegister}
        className="bg-zinc-900 text-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "fullName", placeholder: "Full Name" },
            { name: "userName", placeholder: "Username", type: "text" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "password", placeholder: "Password", type: "password" },
            { name: "phoneNumber", placeholder: "Phone Number" },
            { name: "city", placeholder: "City" },
            { name: "district", placeholder: "District" },
            { name: "country", placeholder: "Country" },
            { name: "zipCode", placeholder: "Zip Code" },
          ].map(({ name, placeholder, type = "text" }) => (
            <input
              key={name}
              className="bg-zinc-800 p-2 rounded-md"
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              required
            />
          ))}

          <input
            className="bg-zinc-800 p-2 rounded-md"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition cursor-pointer text-white font-semibold py-2 px-4 rounded-lg"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center text-zinc-400 mt-2">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
