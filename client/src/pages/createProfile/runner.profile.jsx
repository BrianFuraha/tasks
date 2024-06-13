import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Comments, MyWorks } from "../../components";
import { comment, getUser } from "../../api/requests";
import { useNavigate, useParams } from "react-router-dom";
import { Fbutton, FileUploader } from "../../container";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  Input,
  Typography,
} from "@material-tailwind/react";

export default function RunnerProfile() {
  const { userId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [newComment, setNewComment] = useState("");

  console.log(currentUser)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleClick = () => {
    navigate("/profile");
  };

  const handleSelect = () => {};

  const handleChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleButtonClick = async (e) => {
    e.preventDefault();

    const commentData = {
      userId: currentUser._id,
      comment: newComment,
      images: images,
      // rate: rate, // Uncomment and implement if you have rate functionality
    };

    try {
      await comment(commentData, userId);
      setOpen(!open);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
    console.log(images.url);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
          <div className="col-span-4 sm:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-col items-center">
                <img
                  src={userData.avatar}
                  alt="profilePic"
                  className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                />
                <h1 className="text-xl font-bold">{userData.username}</h1>
                <p className="text-gray-700 uppercase">{userData.userType}</p>
                <div className="mt-6 justify-center">
                  {currentUser.userType === "runner" ? (
                    <button
                      onClick={handleClick}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleSelect}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Select and Chat
                    </button>
                  )}
                </div>
                <div className="flex flex-col">
                  <hr className="my-6 border-t border-b-gray-600" />
                  <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">
                    Information
                  </span>
                  <ul>
                    <li className="mb-2">Email: {userData.email}</li>
                    <li className="mb-2">Location: {userData.location}</li>
                    <li className="mb-2">Categories: {userData.category}</li>
                    <li className="mb-2">Ratings: {userData.ratings}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4 sm:col-span-9">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">About Me:</h2>
              <p className="text-gray-700">{userData.about}</p>
              <hr className="my-6 border-t border-b-gray-600" />
              <h2 className="text-xl font-bold mt-6 mb-4">My works</h2>
              <div className="mb-6 flex gap-10">
                {currentUser.images.map((img) => ( <div key={img._id} className=" relative w-32 h-32 object-cover rouded">
                  <img src={img.image} alt="images" className=" w-32 h-32 object-cover rounded"/>
                </div>))}
              </div>
              <h2 className="text-xl font-bold mt-6 mb-4">Comments:</h2>
              <div className="max-h-64 overflow-y-auto hide-scrollbar">
                <Comments data={userData} />
              </div>
              {currentUser.userType === "user" && (
                <>
                  <Fbutton
                    label="Comment & rate"
                    onClick={() => setOpen(true)}
                  />
                  <Dialog
                    size="xs"
                    open={open}
                    handler={() => setOpen(!open)}
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0.9, y: -100 },
                    }}
                    className="bg-transparent shadow-none"
                  >
                    <Card className="mx-auto w-full max-w-[28rem]">
                      <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="blue-gray">
                          Comment & rate the runner
                        </Typography>
                        <Typography className="-mb-2" variant="h6">
                          Rate runner
                        </Typography>
                        {/* Add rating component here if any */}
                        <Typography className="-mb-2" variant="h6">
                          Comment
                        </Typography>
                        <Input
                          label="Comment"
                          value={newComment}
                          onChange={handleChange}
                          size="lg"
                        />
                        <Typography className="-mb-2" variant="h6">
                          File (optional)
                        </Typography>
                        <FileUploader setImages={setImages} images={images} />
                        <p>Wait till the images load befor posting</p>
                      </CardBody>
                      <CardFooter className="pt-0">
                        <Button
                          variant="gradient"
                          onClick={handleButtonClick}
                          fullWidth
                        >
                          Post
                        </Button>
                      </CardFooter>
                    </Card>
                  </Dialog>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
