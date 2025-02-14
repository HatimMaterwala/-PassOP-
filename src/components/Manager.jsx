// Internship Proj -2

import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const Manager = () => {
  const refUrl = useRef();
  const refUser = useRef();
  const outlinePass = useRef();
  const refPass = useRef();
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const visibility = document.querySelector(".visibilitySpan");

  const [storage, setStorage] = useState([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    const storedCredentials = JSON.parse(localStorage.getItem("Credentials"));
    if (storedCredentials) {
      setStorage(storedCredentials);
    }
  }, []);

  useEffect(() => {
    if (storage.length > 0) {
      localStorage.setItem("Credentials", JSON.stringify(storage));
      visibility.textContent = "visibility_off";
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
      const isDuplicate = storage.some((item) => item.URL === url && item.Username === username);
  
      if (isDuplicate) {
        toast("⚠️ URL and Username already exist!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return; // Stop execution if duplicate is found
      }
  
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
  
      toast("✅ Saved Successfully!!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      alert("All fields are required!");
    }
  };
  

  const handleCopy = (e, value) => {
    navigator.clipboard.writeText(value);
    toast("🔗 Copied to Clipboard!!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
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
      toast("🗑️ Deleted Successfully!!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
      setIsPasswordVisible(true);
    } else {
      passwordSpan.textContent = "•".repeat(passwordSpan.textContent.length);
      e.currentTarget.textContent = "visibility_off";
      passwordSpan.style.overflow = "hidden";
      passwordSpan.style.textOverflow = "clip";
      setIsPasswordVisible(false);
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
      <ToastContainer />
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="w-[90vw] m-auto my-10">
        <div className="title text-center">
          <h1 className="text-3xl font-bold">
            <span className="text-green-500">&lt;</span>Pass
            <span className="text-green-500">OP/&gt;</span>
          </h1>
          <p>Your Own Password Manager</p>
        </div>

        <div className="text-white flex flex-col gap-3 items-center p-4 w-full h-fit">
          <div className="url w-full md:w-1/2 ">
            <input
              ref={refUrl}
              onChange={handleChange}
              className="w-full border border-green-500 text-black p-2 px-3  rounded-full"
              type="text"
              name="URL"
              placeholder="Enter Website URL"
            />
          </div>

          <div className="relative idPass flex flex-col md:flex-row w-full gap-3 md:w-1/2">
            <input
              ref={refUser}
              onChange={handleChange}
              className="w-full md:w-2/3 border border-green-500 text-black p-2 px-3 md:p-1 md:px-3 rounded-full"
              type="text"
              name="Username"
              placeholder="Enter Username"
            />
            <div ref={outlinePass} className="border relative border-green-500 text-black p-1 md:px-3 md:w-1/3 rounded-full">
              <input
                ref={refPass}
                onChange={handleChange}
                onFocus={()=>{outlinePass.current.style.outline = "2px solid black";
                  outlinePass.current.style.border = '1px solid transparent';
                }}
                onBlur={()=>{outlinePass.current.style.outline = "none";
                  outlinePass.current.style.border = '1px solid #22c55e';
                }}
                className="w-[85%] text-black p-1 px-2 md:px-3 outline-none"
                type="password"
                name="Password"
                placeholder="Enter Password"
              />
              <span
                onClick={(e) => {
                  handleEyeForm(e);
                }}
                
                className="visibilitySpan material-symbols-outlined absolute md:right-3 md:top-2.5 top-2 right-[1rem] cursor-pointer"
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

        <div className="displayPasswords my-5 mx-5 md:m-auto md:w-full">
          <h1 className="text-xl font-semibold">Your Passwords</h1>
          {/* <div className="w-full custom-scrollbar rounded-l-xl my-5 max-h-[26.5vh] md:max-h-[35vh] overflow-y-scroll overflow-x-scroll md:overflow-x-hidden"> */}
          <div className="table-container custom-scrollbar">
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
                    <td className="p-2">
                      <div className="flex justify-around items-center">
                        <div></div>
                        <div className="text-center w-[25vw]">
                          <span className="inline-block w-[80%] overflow-hidden text-ellipsis">
                            {lup.URL}
                          </span>
                        </div>
                        <span
                          onClick={(e) => {
                            handleCopy(e, lup.URL);
                          }}
                          name="URL"
                          className="material-symbols-outlined cursor-pointer"
                        >
                          content_copy
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex justify-evenly items-center">
                        <div></div>
                        <div className="text-center w-[10vw] md:w-[15vw]">
                          <span className="inline-block w-[80%] overflow-hidden text-ellipsis">
                            {lup.Username}
                          </span>
                        </div>
                        <span
                          onClick={(e) => {
                            handleCopy(e, lup.Username);
                          }}
                          name="Username"
                          className="material-symbols-outlined cursor-pointer"
                        >
                          content_copy
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex justify-around items-center gap-2">
                        <div></div>
                        <div className="text-center w-full">
                          <span className="inline-block overflow-hidden">
                            {"•".repeat(lup.Password.length)}
                          </span>
                        </div>
                        <div>
                          <span
                            onClick={(e) => {
                              handleEye(e, lup.ID);
                            }}
                            className="material-symbols-outlined cursor-pointer"
                          >
                            visibility_off
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 space-x-1">
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
