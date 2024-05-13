import { useEffect } from "react";

const useFormEffect = (
  currentUser,
  formData,
  dispatch,
  setPasswordMatch,
  setSpecialCharacterError,
  setFormData,
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  setUpdateSuccess
) => {
  useEffect(() => {
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    // Check if formData has been successfully updated
    let formDataUpdated = true;

    if (formData.password !== formData.cpassword) {
      setPasswordMatch(false);
      console.log("password mismatch");
      formDataUpdated = false;
    }

    if (formData.firstname && formData.lastname) {
      if (
        specialCharacters.test(formData.firstname) &&
        specialCharacters.test(formData.lastname)
      ) {
        setSpecialCharacterError(true);
        formDataUpdated = false;
      } else {
        const username = formData.firstname + " " + formData.lastname;
        setFormData((prevData) => ({ ...prevData, username }));
        console.log("added user name" + username);
      }
    }

    // Proceed with fetch if all validations pass and formData is updated
    if (currentUser._id && formDataUpdated) {
      const fetchData = async () => {
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
          console.log("sent to back end");
          dispatch(updateUserSuccess(data));
          setUpdateSuccess(true);
        } catch (error) {
          dispatch(updateUserFailure(error.message));
          console.log("failed to send back to back end");
          console.log(error.message);
          console.log(formData);
        }
      };

      fetchData();
    }
  }, [currentUser._id, formData]);

};

export default useFormEffect;
