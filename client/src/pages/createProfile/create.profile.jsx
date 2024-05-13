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
  const { currentUser, loading, error } = useSelector((state) => state.user);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform the special character check
    const specialCharacters =
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+1234567890/;
    if (formData.password !== formData.cpassword) {
      setPasswordMatch(false);
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
    }
    // Proceed with fetch if all validations pass
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/updateUser/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      navigate("/profile");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  return (
    <>
      <div>
        {error ? (
          <div
            className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3"
            role="alert"
          >
            <p className="font-bold">Informational message</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : updateSuccess ? (
          <div
            className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3"
            role="alert"
          >
            <p className="font-bold">Informational message</p>
            <p className="text-sm">Updated Successfully</p>
          </div>
        ) : (
          ""
        )}
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
                ""
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
                    <optgroup label="Bomet">
                      <option value="Bomet Central">Bomet Central</option>
                      <option value="Bomet East">Bomet East</option>
                      <option value="Chepalungu">Chepalungu</option>
                      <option value="Konoin">Konoin</option>
                      <option value="Sotik">Sotik</option>
                    </optgroup>
                    <optgroup label="Bungoma">
                      <option value="Bumula">Bumula</option>
                      <option value="Kanduyi">Kanduyi</option>
                      <option value="Kimilili">Kimilili</option>
                      <option value="Mount Elgon">Mount Elgon</option>
                      <option value="Sirisia">Sirisia</option>
                      <option value="Tongaren">Tongaren</option>
                      <option value="Webuye East">Webuye East</option>
                      <option value="Webuye West">Webuye West</option>
                    </optgroup>
                    <optgroup label="Busia">
                      <option value="Budalangi">Budalangi</option>
                      <option value="Butula">Butula</option>
                      <option value="Funyula">Funyula</option>
                      <option value="Nambele">Nambele</option>
                      <option value="Teso North">Teso North</option>
                      <option value="Teso South">Teso South</option>
                    </optgroup>
                    <optgroup label="Elgeyo-Marakwet">
                      <option value="Keiyo North">Keiyo North</option>
                      <option value="Keiyo South">Keiyo South</option>
                      <option value="Marakwet East">Marakwet East</option>
                      <option value="Marakwet West">Marakwet West</option>
                    </optgroup>
                    <optgroup label="Embu">
                      <option value="Manyatta">Manyatta</option>
                      <option value="Mbeere North">Mbeere North</option>
                      <option value="Mbeere South">Mbeere South</option>
                    </optgroup>
                    <optgroup label="Garissa">
                      <option value="Dadaab">Dadaab</option>
                      <option value="Fafi">Fafi</option>
                      <option value="Garissa Township">Garissa Township</option>
                      <option value="Ijara">Ijara</option>
                      <option value="Lagdera">Lagdera</option>
                    </optgroup>
                    <optgroup label="Homa Bay">
                      <option value="Homa Bay Town">Homa Bay Town</option>
                      <option value="Kasipul">Kasipul</option>
                      <option value="Kabondo Kasipul">Kabondo Kasipul</option>
                      <option value="Ndhiwa">Ndhiwa</option>
                      <option value="Rachuonyo North">Rachuonyo North</option>
                      <option value="Rachuonyo East">Rachuonyo East</option>
                      <option value="Rachuonyo South">Rachuonyo South</option>
                      <option value="Suba North">Suba North</option>
                      <option value="Suba South">Suba South</option>
                    </optgroup>
                    <optgroup label="Isiolo">
                      <option value="Isiolo North">Isiolo North</option>
                      <option value="Isiolo South">Isiolo South</option>
                      <option value="Garbatulla">Garbatulla</option>
                    </optgroup>
                    <optgroup label="Kajiado">
                      <option value="Kajiado Central">Kajiado Central</option>
                      <option value="Kajiado East">Kajiado East</option>
                      <option value="Kajiado North">Kajiado North</option>
                      <option value="Kajiado West">Kajiado West</option>
                      <option value="Loitokitok">Loitokitok</option>
                      <option value="Mashuuru">Mashuuru</option>
                    </optgroup>
                    <optgroup label="Kakamega">
                      <option value="Butere/Mumias East">
                        Butere/Mumias East
                      </option>
                      <option value="Butsotso East">Butsotso East</option>
                      <option value="Kabuchai">Kabuchai</option>
                      <option value="Khwisero">Khwisero</option>
                      <option value="Lugari">Lugari</option>
                      <option value="Lurambi">Lurambi</option>
                    </optgroup>
                    <optgroup label="Kericho">
                      <option value="Ainamoi">Ainamoi</option>
                      <option value="Belgut">Belgut</option>
                      <option value="Bureti">Bureti</option>
                      <option value="Kipkelion East">Kipkelion East</option>
                      <option value="Kipkelion West">Kipkelion West</option>
                    </optgroup>
                    <optgroup label="Kiambu">
                      <option value="Gatundu North">Gatundu North</option>
                      <option value="Gatundu South">Gatundu South</option>
                      <option value="Githunguri">Githunguri</option>
                      <option value="Juja">Juja</option>
                      <option value="Kabete">Kabete</option>
                      <option value="Kiambaa">Kiambaa</option>
                      <option value="Kiambu">Kiambu</option>
                      <option value="Kikuyu">Kikuyu</option>
                      <option value="Lari">Lari</option>
                      <option value="Limuru">Limuru</option>
                      <option value="Ruiru">Ruiru</option>
                      <option value="Thika East">Thika East</option>
                      <option value="Thika West">Thika West</option>
                      <option value="Turkana Central">Turkana Central</option>
                      <option value="Turkana East">Turkana East</option>
                      <option value="Turkana North">Turkana North</option>
                      <option value="Turkana South">Turkana South</option>
                      <option value="Turkana West">Turkana West</option>
                    </optgroup>
                    <optgroup label="Kilifi">
                      <option value="Kaloleni">Kaloleni</option>
                      <option value="Kilifi North">Kilifi North</option>
                      <option value="Kilifi South">Kilifi South</option>
                      <option value="Malindi">Malindi</option>
                      <option value="Magarini">Magarini</option>
                      <option value="Rabai">Rabai</option>
                    </optgroup>
                    <optgroup label="Kirinyaga">
                      <option value="Gichugu">Gichugu</option>
                      <option value="Kirinyaga Central">
                        Kirinyaga Central
                      </option>
                      <option value="Kirinyaga East">Kirinyaga East</option>
                      <option value="Kirinyaga South">Kirinyaga South</option>
                    </optgroup>
                    <optgroup label="Kisii">
                      <option value="Bobasi">Bobasi</option>
                      <option value="Bomachoge Borabu">Bomachoge Borabu</option>
                      <option value="Bomachoge Chache">Bomachoge Chache</option>
                      <option value="Bonchari">Bonchari</option>
                      <option value="Kitutu Chache North">
                        Kitutu Chache North
                      </option>
                      <option value="Kitutu Chache South">
                        Kitutu Chache South
                      </option>
                      <option value="Nyamira North">Nyamira North</option>
                      <option value="Nyamira South">Nyamira South</option>
                    </optgroup>
                    <optgroup label="Kisumu">
                      <option value="Kisumu Central">Kisumu Central</option>
                      <option value="Kisumu East">Kisumu East</option>
                      <option value="Kisumu West">Kisumu West</option>
                      <option value="Seme">Seme</option>
                      <option value="Nyando">Nyando</option>
                    </optgroup>
                    <optgroup label="Kitui">
                      <option value="Kitui Central">Kitui Central</option>
                      <option value="Kitui East">Kitui East</option>
                      <option value="Kitui Rural">Kitui Rural</option>
                      <option value="Kitui South">Kitui South</option>
                      <option value="Kitui West">Kitui West</option>
                    </optgroup>
                    <optgroup label="Kwale">
                      <option value="Kinango">Kinango</option>
                      <option value="Lunga Lunga">Lunga Lunga</option>
                      <option value="Matuga">Matuga</option>
                      <option value="Msambweni">Msambweni</option>
                    </optgroup>
                    <optgroup label="Laikipia">
                      <option value="Laikipia East">Laikipia East</option>
                      <option value="Laikipia North">Laikipia North</option>
                      <option value="Laikipia West">Laikipia West</option>
                    </optgroup>
                    <optgroup label="Lamu">
                      <option value="Lamu East">Lamu East</option>
                      <option value="Lamu West">Lamu West</option>
                    </optgroup>
                    <optgroup label="Machakos">
                      <option value="Athi River">Athi River</option>
                      <option value="Kangundo">Kangundo</option>
                      <option value="Kathiani">Kathiani</option>
                      <option value="Masinga">Masinga</option>
                      <option value="Matungulu">Matungulu</option>
                      <option value="Mavoko">Mavoko</option>
                      <option value="Mwala">Mwala</option>
                      <option value="Yatta">Yatta</option>
                    </optgroup>
                    <optgroup label="Makueni">
                      <option value="Kaiti">Kaiti</option>
                      <option value="Kibwezi East">Kibwezi East</option>
                      <option value="Kibwezi West">Kibwezi West</option>
                      <option value="Kilome">Kilome</option>
                      <option value="Makueni">Makueni</option>
                      <option value="Mbooni">Mbooni</option>
                    </optgroup>
                    <optgroup label="Mandera">
                      <option value="Banissa">Banissa</option>
                      <option value="Lafey">Lafey</option>
                      <option value="Mandera East">Mandera East</option>
                      <option value="Mandera North">Mandera North</option>
                      <option value="Mandera South">Mandera South</option>
                    </optgroup>
                    <optgroup label="Marsabit">
                      <option value="Laisamis">Laisamis</option>
                      <option value="Loiyangalani">Loiyangalani</option>
                      <option value="Marsabit Central">Marsabit Central</option>
                      <option value="Moyale">Moyale</option>
                      <option value="North Horr">North Horr</option>
                      <option value="Saku">Saku</option>
                    </optgroup>
                    <optgroup label="Meru">
                      <option value="Buuri">Buuri</option>
                      <option value="Igembe Central">Igembe Central</option>
                      <option value="Igembe North">Igembe North</option>
                      <option value="Igembe South">Igembe South</option>
                      <option value="Imenti Central">Imenti Central</option>
                      <option value="Imenti North">Imenti North</option>
                      <option value="Imenti South">Imenti South</option>
                      <option value="Meru Central">Meru Central</option>
                      <option value="Meru North">Meru North</option>
                      <option value="Meru South">Meru South</option>
                      <option value="Tigania East">Tigania East</option>
                      <option value="Tigania West">Tigania West</option>
                      <option value="Tharaka">Tharaka</option>
                    </optgroup>
                    <optgroup label="Migori">
                      <option value="Awendo">Awendo</option>
                      <option value="Kuria East">Kuria East</option>
                      <option value="Kuria West">Kuria West</option>
                      <option value="Migori">Migori</option>
                      <option value="Nyatike">Nyatike</option>
                      <option value="Rongo">Rongo</option>
                      <option value="Suna East">Suna East</option>
                      <option value="Suna West">Suna West</option>
                    </optgroup>
                    <optgroup label="Mombasa">
                      <option value="Changamwe">Changamwe</option>
                      <option value="Jomvu">Jomvu</option>
                      <option value="Kisauni">Kisauni</option>
                      <option value="Nyali">Nyali</option>
                      <option value="Likoni">Likoni</option>
                      <option value="Mvita">Mvita</option>
                    </optgroup>
                    <optgroup label="Murang'a">
                      <option value="Gatanga">Gatanga</option>
                      <option value="Kahuro">Kahuro</option>
                      <option value="Kandara">Kandara</option>
                      <option value="Kangema">Kangema</option>
                      <option value="Kigumo">Kigumo</option>
                      <option value="Maragua">Maragua</option>
                      <option value="Mathioya">Mathioya</option>
                      <option value="Kiharu">Kiharu</option>
                      <option value="Kigumo">Kigumo</option>
                      <option value="Kiharu">Kiharu</option>
                    </optgroup>
                    <optgroup label="Nairobi">
                      <option value="Dagoretti North">Dagoretti North</option>
                      <option value="Dagoretti South">Dagoretti South</option>
                      <option value="Embakasi Central">Embakasi Central</option>
                      <option value="Embakasi East">Embakasi East</option>
                      <option value="Embakasi North">Embakasi North</option>
                      <option value="Embakasi South">Embakasi South</option>
                      <option value="Embakasi West">Embakasi West</option>
                      <option value="Kamukunji">Kamukunji</option>
                      <option value="Kasarani">Kasarani</option>
                      <option value="Kibra">Kibra</option>
                      <option value="Lang'ata">Lang'ata</option>
                      <option value="Makadara">Makadara</option>
                      <option value="Mathare">Mathare</option>
                      <option value="Nairobi West">Nairobi West</option>
                      <option value="Roysambu">Roysambu</option>
                      <option value="Ruaraka">Ruaraka</option>
                      <option value="Starehe">Starehe</option>
                      <option value="Westlands">Westlands</option>
                    </optgroup>
                    <optgroup label="Nakuru">
                      <option value="Bahati">Bahati</option>
                      <option value="Gilgil">Gilgil</option>
                      <option value="Kuresoi North">Kuresoi North</option>
                      <option value="Kuresoi South">Kuresoi South</option>
                      <option value="Molo">Molo</option>
                      <option value="Naivasha">Naivasha</option>
                      <option value="Nakuru East">Nakuru East</option>
                      <option value="Nakuru North">Nakuru North</option>
                      <option value="Nakuru West">Nakuru West</option>
                      <option value="Njoro">Njoro</option>
                      <option value="Rongai">Rongai</option>
                      <option value="Subukia">Subukia</option>
                    </optgroup>
                    <optgroup label="Nandi">
                      <option value="Aldai">Aldai</option>
                      <option value="Chesumei">Chesumei</option>
                      <option value="Emgwen">Emgwen</option>
                      <option value="Mosop">Mosop</option>
                      <option value="Tindiret">Tindiret</option>
                    </optgroup>
                    <optgroup label="Narok">
                      <option value="Narok East">Narok East</option>
                      <option value="Narok North">Narok North</option>
                      <option value="Narok South">Narok South</option>
                      <option value="Narok West">Narok West</option>
                      <option value="Transmara East">Transmara East</option>
                      <option value="Transmara West">Transmara West</option>
                    </optgroup>
                    <optgroup label="Nyamira">
                      <option value="Borabu">Borabu</option>
                      <option value="Manga">Manga</option>
                      <option value="Masaba North">Masaba North</option>
                      <option value="Masaba South">Masaba South</option>
                    </optgroup>
                    <optgroup label="Nyandarua">
                      <option value="Kinangop">Kinangop</option>
                      <option value="Kipipiri">Kipipiri</option>
                      <option value="Ndaragwa">Ndaragwa</option>
                      <option value="Ol Kalou">Ol Kalou</option>
                    </optgroup>
                    <optgroup label="Nyeri">
                      <option value="Kieni East">Kieni East</option>
                      <option value="Kieni West">Kieni West</option>
                      <option value="Mathira East">Mathira East</option>
                      <option value="Mathira West">Mathira West</option>
                      <option value="Mukurweini">Mukurweini</option>
                      <option value="Nyeri Central">Nyeri Central</option>
                      <option value="Tetu">Tetu</option>
                    </optgroup>
                    <optgroup label="Samburu">
                      <option value="Samburu Central">Samburu Central</option>
                      <option value="Samburu East">Samburu East</option>
                      <option value="Samburu North">Samburu North</option>
                      <option value="Samburu West">Samburu West</option>
                    </optgroup>
                    <optgroup label="Siaya">
                      <option value="Alego Usonga">Alego Usonga</option>
                      <option value="Bondo">Bondo</option>
                      <option value="Gem">Gem</option>
                      <option value="Rarieda">Rarieda</option>
                      <option value="Ugenya">Ugenya</option>
                      <option value="Ugunja">Ugunja</option>
                    </optgroup>
                    <optgroup label="Taita-Taveta">
                      <option value="Mwatate">Mwatate</option>
                      <option value="Taveta">Taveta</option>
                      <option value="Voi">Voi</option>
                      <option value="Wundanyi">Wundanyi</option>
                    </optgroup>
                    <optgroup label="Tana River">
                      <option value="Bura">Bura</option>
                      <option value="Galole">Galole</option>
                      <option value="Garsen">Garsen</option>
                    </optgroup>
                    <optgroup label="Tharaka Nithi">
                      <option value="Chuka">Chuka</option>
                      <option value="Maara">Maara</option>
                      <option value="Tharaka">Tharaka</option>
                    </optgroup>
                    <optgroup label="Trans-Zoia">
                      <option value="Cherang'any">Cherang'any</option>
                      <option value="Endebess">Endebess</option>
                      <option value="Kiminini">Kiminini</option>
                      <option value="Kwanza">Kwanza</option>
                      <option value="Saboti">Saboti</option>
                    </optgroup>
                    <optgroup label="Turkana">
                      <option value="Turkana Central">Turkana Central</option>
                      <option value="Turkana East">Turkana East</option>
                      <option value="Turkana North">Turkana North</option>
                      <option value="Turkana South">Turkana South</option>
                      <option value="Turkana West">Turkana West</option>
                    </optgroup>
                    <optgroup label="Uasin Gishu">
                      <option value="Ainabkoi">Ainabkoi</option>
                      <option value="Kapseret">Kapseret</option>
                      <option value="Kesses">Kesses</option>
                      <option value="Moiben">Moiben</option>
                      <option value="Soy">Soy</option>
                      <option value="Turbo">Turbo</option>
                    </optgroup>
                    <optgroup label="Vihiga">
                      <option value="Emuhaya">Emuhaya</option>
                      <option value="Hamisi">Hamisi</option>
                      <option value="Luanda">Luanda</option>
                      <option value="Sabatia">Sabatia</option>
                      <option value="Vihiga">Vihiga</option>
                    </optgroup>
                    <optgroup label="Wajir">
                      <option value="Eldas">Eldas</option>
                      <option value="Tarbaj">Tarbaj</option>
                      <option value="Wajir East">Wajir East</option>
                      <option value="Wajir North">Wajir North</option>
                      <option value="Wajir South">Wajir South</option>
                      <option value="Wajir West">Wajir West</option>
                    </optgroup>
                    <optgroup label="West Pokot">
                      <option value="Chepareria">Chepareria</option>
                      <option value="Kacheliba">Kacheliba</option>
                      <option value="Kapenguria">Kapenguria</option>
                      <option value="Pokot Central">Pokot Central</option>
                      <option value="Pokot North">Pokot North</option>
                      <option value="Pokot South">Pokot South</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className=" text-red-700 mt-5">
            {!passwordMatch
              ? "Password does not match!"
              : specialCharacterError
              ? "Usage of speacial characters is forbiden"
              : ""}
          </p>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <p className=" text-xs">Click update twice</p>
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
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </div>
      </form>
    </>
  );
}
