import React, { useState } from "react";
import axios from "axios";

function Contact({
  IoIosPersonAdd,
  name,
  email,
  MdModeEdit,
  MdDelete,
  id,
  fetchAllContacts,
}) {
  const [edit, setEdit] = useState(false);

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const updatedName = formData.get("name");
      const updatedEmail = formData.get("email");

      const response = await axios.put(
        `http://localhost:5000/api/v1/contact/${id}/update`,
        {
          name: updatedName,
          email: updatedEmail,
        }
      );

      if (response.status == 200) {
        fetchAllContacts();
        setEdit(false);
      }
    } catch (error) {
      console.log(error.message);
      return;
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v1/contact/${id}/delete`
      );

      if (response.status == 200) fetchAllContacts();
    } catch (error) {
      console.log(error.message);
      return;
    }
  };

  return (
    <>
      <div className="contact flex bg-orange-300 justify-between mx-5 rounded-xl my-5">
        <IoIosPersonAdd className="text-yellow-400 bg-orange-500 rounded-lg min-h-12 min-w-10" />
        <div className="details w-[80%] px-3">
          <h1 className="font-bold">{name}</h1>
          <p>{email}</p>
        </div>

        <div className="icons flex items-center">
          <MdModeEdit
            onClick={() => setEdit(true)}
            className={`text-2xl cursor-pointer ${edit && "hover:text-white"}`}
          />
          <MdDelete
            onClick={() => handleDelete()}
            className="text-2xl cursor-pointer hover:text-white text-orange-500"
          />
        </div>
      </div>
      {edit && (
        <form
          onSubmit={(e) => handleEdit(e)}
          className="bg-white flex flex-col gap-2 mx-5 rounded-md px-3 py-2"
        >
          <label>
            Name:
            <input
              type="text"
              name="name"
              placeholder="update name.."
              className="mx-2 outline-none focus:border-b-2"
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              placeholder="update@mail.com"
              className="mx-2 outline-none focus:border-b-2"
            />
          </label>
          <button className="bg-slate-500 w-1/3 relative m-auto rounded-full text-white hover:bg-slate-950 mt-3">
            Update
          </button>
        </form>
      )}
    </>
  );
}

export default Contact;
