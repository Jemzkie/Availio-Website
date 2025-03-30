import React from "react";
import Cat from "../../assets/images/Cat.jpg";

const Profile = () => {
  return (
    <div className="flex flex-row flex-1">
      <div className="w-full h-screen flex flex-row gap-10 p-20">
        <div className="w-full h-auto flex flex-col p-16 gap-5 border border-gray-400 rounded-lg">
          <div className="flex flex-col justify-center items-center">
            <img
              className="w-[150px] mt-5 rounded-full flex flex-col"
              src={Cat}
            />
            <div className="text-2xl font-semibold">El Gato</div>
            <div className="text-xl">elgato@gmail.com</div>
          </div>
          <div className="flex flex-col justify-center items-center debug">
            <label className="text-xl font-semibold">Email</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
