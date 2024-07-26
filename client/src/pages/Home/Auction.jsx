import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getAuctions } from "../../api/requests";
import { JobCard } from "../../container";

export default function Auction() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const { data } = await getAuctions();
        setAuctions(data);
        // console.log("auctions", data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAuctions();
  }, []);
  console.log(auctions);

  if (!auctions) {
    return <div>Loading...</div>;
  }

  return currentUser.userType == "runner" ? (
    <div>
      <h1>Auction</h1>
      <div className=" min-h-screen flex flex-wrap relative -m-2">
        {auctions.map((auction) => (
          <div
            key={auction._id}
            className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mx-auto"
          >
            <JobCard data={auction} />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <Navigate to="/hero" />
  );
}
