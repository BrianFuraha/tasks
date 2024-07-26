import React, { useEffect, useState } from "react";
import { getUser } from "../api/requests";
import { format } from "timeago.js";
import {
  Card,
  CardBody,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
} from "@material-tailwind/react";
import { Bidder } from ".";

export default function jCard({ data, userType }) {
  const [user, setUser] = useState();
  const [open, setOpen] = useState(false);

  const userId = data.ownerId;
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await getUser(userId);
      setUser(data);
    };
    fetchUser();
  }, [userId]);

  const handleOpen = () => setOpen(!open);
  const handleClick = () => {};
  // console.log(data.ownerId);
  if (!user) {
    return <div>Loading...</div>;
  }
  console.log(user);

  return (
    <Card className=" relative max-w-sm bg-white shadow-lg rounded-3xl mx-auto my-3 overflow-hidden hover:shadow-2xl transition duration-500 transform hover:scale-105 cursor-pointer">
      <CardBody className=" -my-5 -mx-5 ">
        <div className=" h-20 w-full flex items-center justify-between bg-purple-50 rounded-t-3xl">
          <Avatar size="sm" src={user.avatar} alt="pic" />
          {/* <p className=" text-white mr-20 text-lg">{user.username}</p> */}
          <Typography className=" text-white mr-20 text-lg">
            {user.email}
          </Typography>
        </div>

        <h1 className=" py-6 text-lg tracking-wide ">
          Description:
          <p className=" text-sm text-gray-500">{data.description}</p>
        </h1>
        <h1 className=" text-lg tracking-wide flex">
          Location: <p className=" text-lg text-gray-500"> {data.Location}</p>
        </h1>
        <h1 className=" text-lg tracking-wide flex">
          category: <p className=" text-lg text-gray-500"> {data.category}</p>
        </h1>
        <span className=" size-3 text-[#888] self-start mb-10">
          created: {format(data.createdAt)}
        </span>
        {userType === "runner" ? (
          <div className=" items-center justify-center">
            <button className="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2">
              Place bid
            </button>
          </div>
        ) : (
          <div className=" items-center justify-center">
            <Button
              onClick={handleOpen}
              className="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2"
            >
              View bids
            </Button>
            <Dialog
              size="xs"
              open={open}
              handler={handleOpen}
              className="bg-transparent shadow-none"
            >
              <Card>
                <CardBody className="overflow-y-auto hide-scrollbar">
                  <div className="mb-4 flex items-center justify-between">
                    <Typography variant="h5" color="blue-gray" className="">
                      Latest Customers
                    </Typography>
                    <IconButton
                      color="blue-gray"
                      size="sm"
                      variant="text"
                      onClick={handleOpen}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </IconButton>
                  </div>
                  <div className="divide-y divide-gray-200 ">
                    {data.bids.map((bid) => (
                      <div
                        key={bid._id}
                        className="flex items-center justify-between pb-3 pt-3 last:pb-0"
                      >
                        <Bidder />
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </Dialog>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

// export function CardWithList() {
//   return (
//
//   );
// }
