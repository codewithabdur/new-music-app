import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase"; // ✅ Adjust path based on your folder structure

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.warn("User not authenticated");
          navigate("/login"); // or show a message
          return;
        }

        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.error("No such user in Firestore");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);


  const handleLogout = async () => {
  try {
    await auth.signOut();
    navigate("/login");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        No user data found.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-zinc-900 shadow-2xl rounded-2xl p-8  md:w-[90vw] w-full text-center text-white">
        <img
          src={userData.image}
          alt={userData.fullName}
          className="w-32 h-32 mx-auto rounded-full border-4 border-blue-500 shadow-md mb-4 object-cover"
        />
        <h2 className="text-2xl font-bold my-2">{userData.fullName}</h2>
        <p className="text-sm text-zinc-400 mb-4 italic">@{userData.userName}</p>

   <div className="flex flex-wrap gap-4 justify-center text-zinc-300 mb-6">
  <div className="bg-zinc-800 rounded-lg p-4 w-full sm:w-[45%] md:w-[40%]">
    <p><span className="font-semibold">Email:</span><br />{userData.email}</p>
  </div>
  <div className="bg-zinc-800 rounded-lg p-4 w-full sm:w-[45%] md:w-[40%]">
    <p><span className="font-semibold">Phone:</span><br />{userData.phoneNumber}</p>
  </div>
  <div className="bg-zinc-800 rounded-lg p-4 w-full sm:w-[45%] md:w-[40%]">
    <p><span className="font-semibold">City:</span><br />{userData.city}</p>
  </div>
  <div className="bg-zinc-800 rounded-lg p-4 w-full sm:w-[45%] md:w-[40%]">
    <p><span className="font-semibold">District:</span><br />{userData.district}</p>
  </div>
  <div className="bg-zinc-800 rounded-lg p-4 w-full sm:w-[45%] md:w-[40%]">
    <p><span className="font-semibold">Country:</span><br />{userData.country}</p>
  </div>
  <div className="bg-zinc-800 rounded-lg p-4 w-full sm:w-[45%] md:w-[40%]">
    <p><span className="font-semibold">Zip Code:</span><br />{userData.zipCode}</p>
  </div>
</div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white py-2 cursor-pointer px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Go Home
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 cursor-pointer px-4 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
