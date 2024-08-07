import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card } from "../../container";
import { useEffect, useState } from "react";
import { getRunners } from "../../api/requests";

export default function Land() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [runners, setRunners] = useState([]);  

  useEffect(() => {
    const fetchRunners = async () => {
      try {
        const { data } = await getRunners();
        setRunners(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRunners();
  }, []);


  if (!runners) {
    return <div>Loading...</div>;
  }

  return currentUser.userType == "user" ? (
    <div>
      <h1>All Runners</h1>
      <h1>Runners near me</h1>
      <div className=" min-h-screen flex flex-wrap -m-2 relative">
        {runners.map((runner, index) => (
          <div key={index} className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mx-auto">
            <Card data={runner} />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <Navigate to="/auctions" />
  );
}
