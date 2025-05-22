import { useEffect, useState } from 'react'
import oldclient from '../../lib/oldclient'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase"; // ✅ Adjust path based on your folder structure

const Navbar = () => {
  const [sanity, setSanity] = useState([])
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null);


   useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.warn("User not authenticated");
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
        console.log("finall")
      }
    };

    fetchUserData();
  }, [navigate]);


  useEffect(() =>{
    oldclient.fetch(`*[_type == "nav"]{
      title,
      imageL{
      asset->{
      url,
      },
      },
      imageR{
      asset->{
      url,
      },
      },
      }`).then((data) =>{
      setSanity(data)
      }).catch((error) =>{
      console.log("Error fetching data from Sanity:", error)
      })
  },[])
  return (
    <>
    <div className="navbar bg-[#000000]">
      <div className="navbarbox flex justify-around items-center h-[15vh]">
        <div className="nableft">
          {/* <img src={sanity[0]?.imageL?.asset?.url} alt="logo" className='md:w-[200px] w-[100px]' /> */}
        </div>
        <div className="navright md:h-[80px] md:w-[80px] h-[40px] w-[40px] flex justify-center items-center overflow-hidden rounded-[50%] object-cover">
          <span onClick={() => navigate(`/profile`)}>
            <img src={userData?.image ? userData?.image : sanity[0]?.imageR?.asset?.url} alt="" className='cursor-pointer' />
          </span>
        </div>
      </div>
    </div>
    </>
  )
}

export default Navbar
