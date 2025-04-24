import { useContext } from "react";
import SignInForm from "../components/Login/SignInForm"
import { UidContent } from "../components/AppContext";

function Profil() {
  const uid = useContext(UidContent); 
  return (
    <div>
     <div className="">
        {uid ? (
          <h1>Update Page</h1>
        ) : (
          <SignInForm />
        )}
      </div>
    </div>
  )
}

export default Profil