import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const Manager = () => {
  const refUrl = useRef();
  const refUser = useRef();
  const refPass = useRef();
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const visibility = document.querySelector('.visibilitySpan');

  const [storage, setStorage] = useState([]);

  useEffect(() => {
    const storedCredentials = JSON.parse(localStorage.getItem("Credentials"));
    if (storedCredentials) {
      setStorage(storedCredentials);
    }
  }, []);
  

  useEffect(() => {
    if (storage.length > 0) {
      localStorage.setItem("Credentials", JSON.stringify(storage));
      visibility.textContent = 'visibility_off'
    }
  }, [storage]);

  const handleChange = (e) => {
    if (e.target.name === "URL") {
      setUrl(e.target.value);
    } else if (e.target.name === "Username") {
      setUsername(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = () => {
    if (url && password && username) {
      setStorage([
        ...storage,
        { ID: uuidv4(), URL: url, Username: username, Password: password },
      ]);
      setUrl("");
      setUsername("");
      setPassword("");
      refUrl.current.value = "";
      refUser.current.value = "";
      refPass.current.value = "";
      refUrl.current.focus();
    } else {
      alert("All fields are required!");
    }
  };

  const handleCopy = (e, value) => {
    navigator.clipboard.writeText(value);
    const fieldName = e.currentTarget.getAttribute("name");
    alert(`${fieldName} copied to clipboard`);
  };

  const handleEdit = (id) => {
    const filtered = storage.filter((i) => {
      return i.ID === id;
    });
    const unfiltered = storage.filter((i) => {
      return i.ID !== id;
    });
    if (filtered.length > 0) {
      setUrl(filtered[0].URL);
      setUsername(filtered[0].Username);
      setPassword(filtered[0].Password);
      refUrl.current.value = filtered[0].URL;
      refUser.current.value = filtered[0].Username;
      refPass.current.value = filtered[0].Password;
      setStorage(unfiltered);
    }
  };

  const handleDelete = (id) => {
    let c = confirm("Are you sure you want to delete your credentials ?");
    if (c) {
      const updatedStorage = storage.filter((i) => {
        return i.ID !== id;
      });
      setStorage(updatedStorage);
    }
  };

  const handleEye = (e, id) => {
    const tdElement = e.currentTarget.closest("td");
    const passwordSpan = tdElement.querySelector("span");

    if (
      passwordSpan.textContent === "•".repeat(passwordSpan.textContent.length)
    ) {
      const password = storage.find((item) => item.ID === id).Password;
      passwordSpan.textContent = password;
      passwordSpan.style.overflow = "visible";
      passwordSpan.style.textOverflow = "clip";
      e.currentTarget.textContent = "visibility";
    } else {
      passwordSpan.textContent = "•".repeat(8);
      e.currentTarget.textContent = "visibility_off";
    }
  };

  const handleEyeForm = (e) => {
    const passwordInput = e.currentTarget
      .closest("div")
      .querySelector("input[name='Password']");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      e.currentTarget.textContent = "visibility";
    } else {
      passwordInput.type = "password";
      e.currentTarget.textContent = "visibility_off";
    }
  };

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="container w-full m-auto my-10">
        <div className="title text-center">
          <h1 className="text-3xl font-bold">
            <span className="text-green-500">&lt;</span>Pass
            <span className="text-green-500">OP/&gt;</span>
          </h1>
          <p>Your Own Password Manager</p>
        </div>

        <div className="text-white flex flex-col gap-3 items-center p-4 w-full">
          <div className="url w-1/2 ">
            <input
              ref={refUrl}
              onChange={handleChange}
              className="w-full border border-green-500 text-black p-2 px-3 rounded-full"
              type="text"
              name="URL"
              placeholder="Enter Website URL"
            />
          </div>

          <div className="relative idPass flex gap-3 w-1/2">
            <input
              ref={refUser}
              onChange={handleChange}
              className="w-2/3 border border-green-500 text-black p-1 px-3 rounded-full"
              type="text"
              name="Username"
              placeholder="Enter Username"
            />
            <div className="border border-green-500 text-black p-1 px-3 rounded-full">
              <input
                ref={refPass}
                onChange={handleChange}
                className="w-[85%] text-black p-1 px-3 outline-none"
                type="password"
                name="Password"
                placeholder="Enter Password"
              />
              <span
                onClick={(e) => {
                  handleEyeForm(e);
                }}
                className="visibilitySpan material-symbols-outlined absolute right-3 top-2.5 cursor-pointer"
              >
                visibility_off
              </span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="flex gap-1 border border-black cursor-pointer hover:bg-green-400 text-black bg-green-500 px-6 font-bold py-2 rounded-full "
          >
            <span className="material-symbols-outlined invert-1">save</span>
            <span>Save</span>
          </button>
        </div>

        <div className="displayPasswords my-5 m-auto w-full">
          <h1 className="text-xl font-semibold">Your Passwords</h1>
          <div className="divTable rounded-t-xl my-5 max-h-[35vh] overflow-y-scroll overflow-x-hidden">
            <table className="w-full text-center">
              <thead>
                {storage.length > 0 ? (
                  <tr className="bg-gradient-to-r from-green-600 to-green-800 text-white">
                    <th className="p-2">Website URL</th>
                    <th className="p-2">Username</th>
                    <th className="p-2">Password</th>
                    <th className="p-2">Actions</th>
                  </tr>
                ) : (
                  <tr>
                    <td className="text-center">Nothing to show yet !!</td>
                  </tr>
                )}
              </thead>
              <tbody>
                {storage.map((lup) => (
                  <tr key={lup.ID} className="bg-green-100 hover:bg-green-200">
                    <td className="p-2 space-x-3 relative">
                      <span className="inline-block w-[30vw] px-2 overflow-hidden text-ellipsis">
                        {lup.URL}
                      </span>
                      <span
                        onClick={(e) => {
                          handleCopy(e, lup.URL);
                        }}
                        name="URL"
                        className="material-symbols-outlined absolute right-8 cursor-pointer"
                      >
                        content_copy
                      </span>
                    </td>
                    <td className="p-2 space-x-3 relative">
                      <span className="inline-block w-[15vw] px-2 overflow-hidden text-ellipsis">
                        {lup.Username}
                      </span>
                      <span
                        onClick={(e) => {
                          handleCopy(e, lup.Username);
                        }}
                        name="Username"
                        className="material-symbols-outlined absolute -right-1.5 cursor-pointer"
                      >
                        content_copy
                      </span>
                    </td>
                    <td className="p-2 space-x-1 relative">
                      <span className="inline-block w-[15vw] overflow-hidden text-ellipsis">
                        {"•".repeat(8)}
                      </span>
                      <span
                        onClick={(e) => {
                          handleEye(e, lup.ID);
                        }}
                        className="material-symbols-outlined absolute right-3 cursor-pointer"
                      >
                        visibility_off
                      </span>
                    </td>
                    <td className="p-2 space-x-1 relative">
                      <span
                        onClick={() => handleEdit(lup.ID)}
                        className="material-symbols-outlined cursor-pointer"
                      >
                        edit
                      </span>
                      <span
                        onClick={() => handleDelete(lup.ID)}
                        className="material-symbols-outlined cursor-pointer"
                      >
                        delete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Manager;
