import React, { useRef, useState, useEffect } from "react";
import { IoIosPersonAdd } from "react-icons/io";
import { MdModeEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import Contact from "./Contact";

function Home() {
  const [addContact, setAddContact] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [searchedUser, setSearchedUser] = useState("");
  const [allSearchedUsers, setAllSearchedUsers] = useState([]);
  const formRef = useRef("");
  const btnRef = useRef("");

  const fetchAllContacts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/contact/all`
      );

      const data = response.data.data;
      setAllContacts(data);
    } catch (error) {
      console.log(error.message);
      return;
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const name = formData.get("name");
      const email = formData.get("@mail");

      const response = await axios.post(
        `http://localhost:5000/api/v1/contact/new`,
        {
          name: name,
          email: email,
        }
      );

      if (response.status == 200) {
        setAllContacts((prev) => [...prev, { name, email }]);

        setAddContact(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const closeForm = (event) => {
      // Add your logic to handle closing the form here
      if (
        formRef.current &&
        !formRef.current.contains(event.target) &&
        btnRef.current &&
        !btnRef.current.contains(event.target)
      ) {
        setAddContact(false);
      }
    };

    document.addEventListener("click", closeForm);

    return () => {
      document.removeEventListener("click", closeForm);
    };
  }, [addContact]); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    const fetchAllSearchedUsers = async () => {
      try {
        const query = searchedUser;
        // console.log(query);

        const response = await axios.get(
          query.length > 0
            ? `http://localhost:5000/api/v1/contact/search/${query}`
            : "http://localhost:5000/api/v1/contact/all"
        );

        setAllSearchedUsers(response.data.data);
      } catch (error) {
        console.log(error.message);
        return;
      }
    };

    fetchAllSearchedUsers();
  }, [searchedUser]);

  useEffect(() => {
    fetchAllContacts();
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-purple-900 flex justify-center ">
      <div className="main w-full sm:w-1/2 md:w-1/2 lg:w-1/2 min-h-screen overflow-scroll bg-slate-800">
        <h1
          className={`text-yellow-500 font-bold text-center pt-10 pb-5 text-2xl ${
            addContact && "blur-sm"
          }`}
        >
          MongoDB Contact App
        </h1>

        {/* SEARCH Section */}
        <div
          className={`search flex justify-center ${addContact && "blur-sm"} `}
        >
          <input
            onChange={(e) => setSearchedUser(e.target.value)}
            type="text"
            placeholder="Search..."
            className="w-1/2 h-10 px-2 rounded-lg"
          />

          <button
            ref={btnRef}
            onClick={() => setAddContact(true)}
            className="bg-red-500 text-white text-sm w-24 rounded-xl mx-2 hover:bg-red-800 hover:border-2"
          >
            Add Contact
          </button>
        </div>

        {addContact && (
          <form
            onSubmit={(e) => handleAddContact(e)}
            ref={formRef}
            className="w-[90%] flex flex-col gap-4 bg-red-600 p-3 rounded-md m-auto"
          >
            <label className="text-xl m-auto">
              Name:
              <input
                type="text"
                name="name"
                className="bg-transparent focus:outline-none border-b-2 border-b-slate-900 mx-4 text-slate-100 text-xl"
              />
            </label>
            <label className="text-xl relative m-auto">
              Email:
              <input
                type="text"
                name="@mail"
                className="bg-transparent focus:outline-none border-b-2 border-b-slate-900 focus:bg-transparent mx-4 text-slate-100 text-xl"
              />
            </label>
            <input
              type="submit"
              value="Add Contact"
              className="bg-blue-500 min-w-1/3 relative m-auto rounded-md text-xl text-white font-semibold hover:text-blue-950 mt-5 px-2 cursor-pointer"
            />
          </form>
        )}

        {allSearchedUsers.length > 0 ? (
          <div className={`${addContact && "blur-sm"}`}>
            {allSearchedUsers.map((item) => (
              <Contact
                key={item._id}
                IoIosPersonAdd={IoIosPersonAdd}
                name={item.name}
                email={item.email}
                MdModeEdit={MdModeEdit}
                MdDelete={MdDelete}
                id={item._id}
                fetchAllContacts={fetchAllContacts}
              />
            ))}
          </div>
        ) : allContacts.length > 0 ? (
          <div className={`${addContact && "blur-sm"}`}>
            {allContacts.map((item) => (
              <Contact
                key={item._id}
                IoIosPersonAdd={IoIosPersonAdd}
                name={item.name}
                email={item.email}
                MdModeEdit={MdModeEdit}
                MdDelete={MdDelete}
                id={item._id}
                fetchAllContacts={fetchAllContacts}
              />
            ))}
          </div>
        ) : (
          <div className="flex my-10 justify-center text-white text-2xl">
            <h1 className="text-center">
              No Users Found, please create users.
            </h1>
          </div>
        )}

        {/* CONTACT Card */}
      </div>
    </div>
  );
}

export default Home;
