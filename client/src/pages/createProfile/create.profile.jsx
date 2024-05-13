import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { TEAlert } from "tw-elements-react";

import { app } from "../../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [filePer, setFilePer] = useState(0);
  const [formData, setFormData] = useState({ username: currentUser.userName });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [specialCharacterError, setSpecialCharacterError] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("starting");

    // Perform the special character check
    const specialCharacters =
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+1234567890/;
    if (formData.password !== formData.cpassword) {
      setPasswordMatch(false);
      console.log("password mismatch");
      return;
    }

    if (formData.firstname && formData.lastname) {
      if (
        specialCharacters.test(formData.firstname) &&
        specialCharacters.test(formData.lastname)
      ) {
        setSpecialCharacterError(true);
        return;
      }
      const username = formData.firstname + " " + formData.lastname;
      setFormData({ ...formData, username });
      console.log("added user name " + username);
    }
    console.log(formData);
    console.log("outside the try catch");
    // Proceed with fetch if all validations pass
    try {
      console.log(formData);
      console.log("in the try catch 1");
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/updateUser/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(formData);
      console.log("in the try catch 2");
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      console.log("sent to back end");
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      console.log(formData);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      console.log("failed to send back to back end");
      console.log(error.message);
      console.log(formData);
    }
  };
  return (
    <>
      <div
        className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3"
        role="alert"
      >
        <p className="font-bold">Informational message</p>
        <p className="text-sm">Some additional text to explain said message.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h1>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>

            <div className="col-span-full pt-3">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Photo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <img
                  src={formData.avatar || currentUser.avatar}
                  alt="profile"
                  className="h-20 w-20 text-gray-300 rounded-full object-cover "
                  aria-hidden="true"
                />

                <button
                  id="file-upload"
                  name="file-upload"
                  type="button"
                  // Change type to "button" to prevent form submission
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => fileRef.current.click()} // Trigger file input click event
                >
                  Change
                </button>
                <p>
                  {fileUploadError ? (
                    <span className=" text-red-700">
                      Image Upload Error: Size too large (2mb max) or wrong file
                      format
                    </span>
                  ) : filePer > 0 && filePer < 100 ? (
                    <span className=" text-gray-800">{`Uploading ${filePer}%`}</span>
                  ) : filePer == 100 ? (
                    <span className=" text-green-700">
                      image successfully uploaded
                    </span>
                  ) : (
                    ""
                  )}
                </p>

                <input
                  ref={fileRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])} // Handle file upload when file is selected
                />
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {currentUser.userType == "runner" ? (
                <div className="col-span-full">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    About
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="about"
                      name="about"
                      onChange={handleChange}
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={""}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write a few sentences about yourself.
                  </p>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12 pt-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Change username and password here.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="firstname"
                    onChange={handleChange}
                    id="firstname"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="lastname"
                    onChange={handleChange}
                    id="lastname"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  New Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    onChange={handleChange}
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label
                  htmlFor="cpassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="cpassword"
                    name="cpassword"
                    onChange={handleChange}
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={currentUser.email}
                    disabled
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Change county
                </label>
                <div className="mt-2">
                  <select
                    id="location"
                    name="location"
                    autoComplete="location-name"
                    onChange={handleChange}
                    placeholder="user location here"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <optgroup label="Baringo">
                      <option value="Baringo Central">Baringo Central</option>
                      <option value="Baringo North">Baringo North</option>
                      <option value="Baringo South">Baringo South</option>
                      <option value="Eldama Ravine">Eldama Ravine</option>
                      <option value="Mogotio">Mogotio</option>
                      <option value="Tiaty">Tiaty</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={() => {
              navigate("/myProfile");
            }}
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={() => {
              console.log("clicked");
            }}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </div>
      </form>
    </>
  );
}
