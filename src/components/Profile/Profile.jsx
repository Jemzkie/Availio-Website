import React, { useState, useEffect } from "react";
import Cat from "../../assets/images/Cat.jpg";
import { MdOutlineFileUpload } from "react-icons/md";
import { updateUserProfile } from "../../hooks/profileService";
import { ClipLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import { toast, Bounce } from "react-toastify";
import { VscUnverified } from "react-icons/vsc";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../config/firebaseConfig";
import { MdVerified } from "react-icons/md";

const Profile = ({ user, userData }) => {
  const [previewBusinessProfile, setPreviewBusinessProfile] = useState(null);
  const [previewPersonalProfile, setPreviewPersonalProfile] = useState(null);
  const [businessName, setBusinessName] = useState(
    userData?.businessName || ""
  );
  const [businessAddress, setBusinessAddress] = useState(
    userData?.businessAddress || ""
  );
  const [businessEmail, setBusinessEmail] = useState(
    userData?.businessEmail || ""
  );
  const [contactNumber, setContactNumber] = useState(
    userData?.contactNumber || ""
  );
  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [selectedBusinessImage, setSelectedBusinessImage] = useState(null);
  const [selectedPersonalImage, setSelectedPersonalImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([false, false, false]);
  const [uploadProgress, setUploadProgress] = useState([0, 0, 0]);
  const [filePreviews, setFilePreviews] = useState([null, null, null]);
  const [verificationUrls, setVerificationUrls] = useState([null, null, null]);

  const documentMappings = [
    { label: "DTI", key: "DTI" },
    { label: "DIR", key: "DIR" },
    { label: "Business Permit", key: "BusinessPermit" },
  ];

  useEffect(() => {
    if (userData) {
      return;
    }
  }, []);

  useEffect(() => {
    if (userData?.verificationDocs) {
      const uploaded = documentMappings.map(({ key }) =>
        Boolean(userData.verificationDocs[key])
      );
      setUploadedFiles(uploaded);
    }
  }, [userData]);

  const handleBusinessProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedBusinessImage(file);
      setPreviewBusinessProfile(URL.createObjectURL(file));
    }
  };

  const handlePersonalProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPersonalImage(file);
      setPreviewPersonalProfile(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    const updatedData = {};

    if (businessName.trim()) updatedData.businessName = businessName.trim();
    if (businessAddress.trim())
      updatedData.businessAddress = businessAddress.trim();
    if (businessEmail.trim()) updatedData.businessEmail = businessEmail.trim();
    if (contactNumber.trim()) updatedData.contactNumber = contactNumber.trim();
    if (selectedBusinessImage)
      updatedData.businessProfile = selectedBusinessImage;
    if (selectedPersonalImage)
      updatedData.personalProfile = selectedPersonalImage;
    if (firstName.trim()) updatedData.firstName = firstName.trim();
    if (lastName.trim()) updatedData.lastName = lastName.trim();

    if (Object.keys(updatedData).length === 0) {
      toast.error("No Changes To Update", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setIsUpdating(false);
      return;
    }

    if (verificationUrls.every(Boolean)) {
      updatedData.verificationDocs = {
        DTI: verificationUrls[0],
        DIR: verificationUrls[1],
        BusinessPermit: verificationUrls[2],
      };
    }

    if (selectedBusinessImage) {
      updatedData.businessProfile = selectedBusinessImage;
    }

    if (selectedPersonalImage) {
      updatedData.personalProfile = selectedPersonalImage;
    }

    const result = await updateUserProfile(user.uid, updatedData);

    if (result.success) {
      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      window.location.reload();
      setIsUpdating(false);
    } else {
      toast.error("Failed to update profile", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Failed to update profile" + result.error);
      setIsUpdating(false);
    }
  };

  const handleFileUpload = (index, file) => {
    const { key } = documentMappings[index];
    const storageRef = ref(storage, `verification_docs/${user.uid}/${key}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Set local preview
    if (file.type.startsWith("image/")) {
      const previewURL = URL.createObjectURL(file);
      setFilePreviews((prev) => {
        const updated = [...prev];
        updated[index] = previewURL;
        return updated;
      });
    }

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress((prev) => {
          const updated = [...prev];
          updated[index] = progress;
          return updated;
        });
      },
      (error) => {
        console.error("Upload error:", error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setUploadedFiles((prev) => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });
        setVerificationUrls((prev) => {
          const updated = [...prev];
          updated[index] = downloadUrl;
          return updated;
        });
      }
    );
  };

  return (
    <div className="flex flex-row flex-1 font-inter">
      <div className="w-full h-auto flex flex-row gap-10">
        <div className="w-full h-auto flex flex-col p-16 gap-5 ">
          <div className="flex flex-col gap-5">
            <div className="flex flex-row items-center gap-2 border-b border-gray-400 pb-2">
              <img
                className="w-[50px] h-[50px] rounded-full object-cover border border-gray-400"
                src={userData?.personalProfile || user.photoURL || Cat}
              />
              <div className="flex flex-col">
                <label className="text-lg font-semibold">
                  {userData?.firstName + " " + userData?.lastName + " "}
                  <label className="text-gray-500">
                    ({user.displayName || userData.userName})
                  </label>
                </label>
                <label className="text-xs text-gray-600">
                  Your Personal Account Details
                </label>
              </div>
            </div>

            <div className="w-full flex flex-row gap-20 border-b border-gray-400 pb-5">
              <div className="flex flex-col w-1/2">
                <label className="text-lg ">Business Profile</label>
                <label className="text-xs text-gray-600">
                  These Information Will Be Instead Displayed On The Mobile
                  Application.
                </label>

                <div className="mt-5 flex flex-col gap-1">
                  <label>Business Name</label>
                  <input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder={userData?.businessName || "Add Business Name"}
                    className="py-1 px-4 border border-gray-400 rounded-sm"
                  />
                </div>

                <div className="mt-3 flex flex-col gap-1">
                  <label>Business Address</label>
                  <input
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder={
                      userData?.businessAddress || "Add Business Address"
                    }
                    className=" py-1 px-4 border border-gray-400 rounded-sm"
                  />
                </div>

                <div className="mt-3 flex flex-col gap-1">
                  <label>Business Email</label>
                  <input
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    placeholder={
                      userData?.businessEmail || "Add Business Email"
                    }
                    className=" py-1 px-4 border border-gray-400 rounded-sm"
                  />
                </div>

                <div className="mt-5 flex flex-col gap-1">
                  <label>Contact Number</label>
                  <input
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder={
                      userData?.contactNumber || "Add Contact Number"
                    }
                    className=" py-1 px-4 border border-gray-400 rounded-sm"
                  />
                </div>
              </div>
              <div className="w-1/2 flex flex-col space-y-2">
                <label className="font-medium">Business Profile Image</label>

                {previewBusinessProfile ? (
                  <div className="relative w-52 h-52 overflow-hidden">
                    <img
                      src={previewBusinessProfile}
                      alt="Preview Business Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <label className="absolute inset-0 rounded-full bg-[#E60000] bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBusinessProfileChange}
                      />
                      <MdOutlineFileUpload className="text-white text-3xl" />
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      className="h-52 w-52 object-contain rounded-full border border-gray-400"
                      src={userData?.businessProfile}
                    />
                    <label className="cursor-pointer hover:bg-[#E60000] duration-300 -translate-y-8 transform absolute mt-2 flex flex-row gap-2 items-center text-white justify-center w-20 h-8 bg-[#141414] rounded-md">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBusinessProfileChange}
                      />
                      <label className="text-sm -z-10 cursor-pointer">
                        Edit
                      </label>
                      <MdOutlineFileUpload className="text-lg text-white" />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="w-full flex flex-row gap-20 border-b border-gray-400 pb-5">
                <div className="flex flex-col w-1/2">
                  <label className="text-lg ">Personal Profile</label>
                  <label className="text-xs text-gray-600">
                    These Information Will Be Only Displayed On This Website.
                  </label>

                  <div className="mt-5 flex flex-row gap-5 w-full">
                    <div className="w-1/2 flex flex-col">
                      <label>First Name</label>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder={userData?.firstName || "Add Business Name"}
                        className="py-1 px-4 border border-gray-400 rounded-sm"
                      />
                    </div>
                    <div className="w-1/2 flex flex-col">
                      <label>Last Name</label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={userData?.lastName || "Add Business Name"}
                        className="py-1 px-4 border border-gray-400 rounded-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex-1 items-end flex justify-end">
                    {isUpdating ? (
                      <button className="bg-[#E60000] cursor-pointer items-center flex text-white px-8 py-2 rounded-md">
                        <ClipLoader size={24} color="#FFFFFF" />
                      </button>
                    ) : (
                      <button
                        onClick={handleUpdate}
                        className="px-4 py-2 cursor-pointer text-white rounded-md bg-[#141414] text-sm duration-300 hover:bg-[#E60000]"
                      >
                        Update Details
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-1/2 flex flex-col space-y-2">
                  <label className="font-medium">Personal Profile Image</label>

                  {previewPersonalProfile ? (
                    <div className="relative w-52 h-52 overflow-hidden">
                      <img
                        src={previewPersonalProfile}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                      <label className="absolute inset-0 rounded-full bg-[#E60000] bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePersonalProfileChange}
                        />
                        <MdOutlineFileUpload className="text-white text-3xl" />
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        className="h-52 w-52 object-cover rounded-full border border-gray-400"
                        src={userData?.personalProfile}
                      />
                      <label className="cursor-pointer hover:bg-[#E60000] duration-300 -translate-y-8 transform absolute mt-2 flex flex-row gap-2 items-center text-white justify-center w-20 h-8 bg-[#141414] rounded-md">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePersonalProfileChange}
                        />
                        <label className="text-sm -z-10 cursor-pointer">
                          Edit
                        </label>
                        <MdOutlineFileUpload className="text-lg text-white" />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="w-full flex flex-row gap-20 border-b border-gray-400 pb-5">
                <div className="flex flex-row justify-between w-full">
                  <div className="flex flex-col">
                    <label className="text-lg">Verify Account</label>
                    <label className="text-xs text-gray-600">
                      Submit Your Details To Be Verified By The Platform
                    </label>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-gray-400 px-4">
                    {userData?.businessVerified ? (
                      <>
                        <label>Verified</label>
                        <MdVerified className="text-red-400 w-7 h-7" />
                      </>
                    ) : (
                      <>
                        <label>Unverified</label>
                        <VscUnverified className="w-7 h-7" />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-5 mt-5">
                {documentMappings.map(({ label, key }, index) => {
                  const uploadedUrl = userData?.verificationDocs?.[key];
                  const hasUploaded = !!uploadedUrl;

                  return (
                    <div
                      key={index}
                      className="relative flex-1 h-40 border border-black rounded-lg flex flex-col items-center justify-center p-2"
                    >
                      <label className="mb-2 text-sm absolute top-2 left-2 font-semibold">
                        {label}
                      </label>

                      {!hasUploaded ? (
                        <>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            id={`file-upload-${index}`}
                            onChange={(e) =>
                              handleFileUpload(index, e.target.files[0])
                            }
                          />
                          <label
                            htmlFor={`file-upload-${index}`}
                            className="cursor-pointer flex flex-col items-center"
                          >
                            {filePreviews[index] ? (
                              <img
                                src={filePreviews[index]}
                                alt={label}
                                className="w-20 h-20 object-cover rounded-md mb-1"
                              />
                            ) : (
                              <MdOutlineFileUpload className="text-3xl text-black" />
                            )}
                          </label>
                          <progress
                            value={uploadProgress[index]}
                            max="100"
                            className="w-full mt-1 h-2"
                          ></progress>
                        </>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-green-600 font-medium">
                            Uploaded
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {userData?.businessVerified === false ? (
                uploadedFiles.every(Boolean) && (
                  <div className="mt-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm text-center">
                    Please wait for review. All documents uploaded.
                  </div>
                )
              ) : (
                <div className="mt-4 px-4 py-2 bg-green-100 text-green-800 rounded-md text-sm text-center">
                  You Are Fully Verified!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
