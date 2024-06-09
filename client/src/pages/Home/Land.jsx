import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card } from "../../container";
import { useEffect, useState } from "react";
import { getRunners } from "../../api/requests";

export default function Land() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [runners, setRunners] = useState([]);
  const navigate = useNavigate();

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


  const handleClick = (runner) => {
    // Implement the logic you want to execute on click
    console.log("Runner clicked:", runner);
    // For example, navigate to a details page
    // navigate(`/runner/${runner.id}`);
  };


  if (!runners) {
    return <div>Loading...</div>;
  }

  return currentUser.userType == "user" ? (
    <div>
      <h1>Dashboard</h1>
      <div className="flex flex-wrap -m-2">
        {runners.map((runner, index) => (
          <div
            key={index}
            onClick={() => handleClick(runner)}
            className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
          >
            <Card data={runner} />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <Navigate to="/auctions" />
  );
}
