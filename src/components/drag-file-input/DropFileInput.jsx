/* eslint-disable*/

import React, { useEffect, useRef, useState } from "react";
import axios, { CancelToken } from "axios";
import PropTypes from "prop-types";
import "./DropFileInput.css";
import pdfLogo from "../../assets/images/pdfLogo.png";
import hwpLogo from "../../assets/images/hwpLogo.png";

import { API } from "../../config";

import { ImgConfigs } from "../../config/imagesConfig";
import uploadImg from "../../assets/cloud-upload-regular-240.png";
import UserFileList from "./UserFileList";

const DropFileInput = (props) => {
  const [fileList, setFileList] = useState([]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const newFiles =
      e.dataTransfer.files.length > 0 ? e.dataTransfer.files : e.target.files;
    DragDrop(newFiles);
  };

  const [isSameFile, setIsSameFile] = useState([]);
  const newFileList = [];
  const [progressPercent, setProgressPercent] = useState(0);

  const [progressList, setProgressList] = useState([]);

  const uploadRef = useRef();
  const statusRef = useRef();
  const loadTotalRef = useRef();
  const progressRef = useRef();
  ////////////////////////////////////////////////////////////////////////////////////////////
  const source = CancelToken.source();

  const selectFiles = async () => {
    for (let i = 0; i < uploadRef.current.files.length; i++) {
      const file = uploadRef.current.files[i];
      setFileList((prev) => [...prev, file]);
      newFileList.push(file);

      axios
        .get(
          `http://192.168.0.36:3001/files/checkname/?fileName=${file.name}`,
          {
            headers: {
              Authorization:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmRiZjY4NjdhY2MyZjA1ZmJiMWYyOCIsImlhdCI6MTY3NzU3NDE2N30.jPDFeGXqn-D_SIBNoyGcV1MJjSBBWgy_irsV51XKnDU",
            },
          }
        )
        .then((response) => {
          if (`${response.data.message}`.includes(file.name)) {
            setIsSameFile((prev) => [...prev, `${file.name}`]);

            console.log("isSameFile", isSameFile);
          }
        })
        .catch((error) => console.log(error));
    }

    const updatedList = [...fileList, ...newFileList];
    setFileList(updatedList);
    props.DragDrop(updatedList);
    props.selectFiles(updatedList);
  };

  const DragDrop = async (files) => {
    for (let i = 0; i < files.length; i++) {
      const newFile = files[i];
      setFileList((prev) => [...prev, newFile]);
      newFileList.push(newFile);

      axios
        .get(
          `http://192.168.0.36:3001/files/checkname/?fileName=${newFile.name}`,
          {
            headers: {
              Authorization:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmRiZjY4NjdhY2MyZjA1ZmJiMWYyOCIsImlhdCI6MTY3NzU3NDE2N30.jPDFeGXqn-D_SIBNoyGcV1MJjSBBWgy_irsV51XKnDU",
            },
          }
        )
        .then((response) => {
          if (`${response.data.message}`.includes(newFile.name)) {
            setIsSameFile((prev) => [...prev, newFile.name]);
          }
        })
        .catch((error) => console.log(error));
    }
    const updatedList = [...fileList, ...newFileList];
    setFileList(updatedList);
    props.DragDrop(updatedList);
    props.selectFiles(updatedList);
  };

  /////////////////////////////////////////////////////////////////////////////

  const sendFormData = () => {
    axios({
      url: `${API.DND}`,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmRiZjY4NjdhY2MyZjA1ZmJiMWYyOCIsImlhdCI6MTY3NzU3NDE2N30.jPDFeGXqn-D_SIBNoyGcV1MJjSBBWgy_irsV51XKnDU",
      },
      data: fileList,
      maxContentLength: 10000000, // 엑시오스 용량 늘리기
      maxBodyLength: 10000000, // 엑시오스 용량 늘리기
      cancelToken: source.token, // cancel token 추가

      onUploadProgress: (e) => {
        const percent = (e.loaded / e.total) * 100;
        fileList.map((item, i) => {
          setProgressList((prev) => {
            return [...prev.slice(0, i), percent, ...prev.slice(i + 1)];
          });
        });

        statusRef.current.innerHTML = `${Math.round(percent)}% uploaded...`;
        setProgressPercent(progressRef.current.value);
        loadTotalRef.current.innerHTML = `uploaded ${e.loaded} bytes of ${e.total}`;
      },
    })
      .then((response) => {
        alert(response.data.message);
        console.log(response);
        statusRef.current.innerHTML = "업로드 완료";
        console.log(fileList);
        // setFileList([]);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Upload canceled");
        } else {
          alert("통신실패");
          console.log(error.response);
          statusRef.current.innerHTML = "업로드 실패";
        }
      });
  };

  const AbortHandler = () => {
    source.cancel("User canceled the file upload");
    console.log("Upload aborted");
    statusRef.current.innerHTML = "Upload aborted";
    setProgressPercent(0);
    alert("전송을 중단하였습니다.");
  };

  const wrapperRef = useRef(undefined);
  const onDragOver = (event) => {
    event.preventDefault();
  };
  const onDragEnter = () => wrapperRef.current?.classList.add("dragover");
  const onDragLeave = () => wrapperRef.current?.classList.remove("dragover");
  const onDrop = () => wrapperRef.current?.classList.remove("dragover");

  const fileRemove = (file) => {
    const updatedList = fileList.filter((item) => item !== file);
    setFileList(updatedList);
    props.DragDrop(updatedList);
  };

  useEffect(() => {
    const handleDrop = (event) => {
      event.preventDefault();
      const newFiles = event.dataTransfer.files;
      DragDrop(newFiles);
    };

    const wrapper = wrapperRef.current;

    wrapper.addEventListener("drop", handleDrop);
    wrapper.addEventListener("dragover", onDragOver);
    wrapper.addEventListener("dragenter", onDragEnter);
    wrapper.addEventListener("dragleave", onDragLeave);

    return () => {
      wrapper.removeEventListener("drop", handleDrop);
      wrapper.removeEventListener("dragover", onDragOver);
      wrapper.removeEventListener("dragenter", onDragEnter);
      wrapper.removeEventListener("dragleave", onDragLeave);
    };
  }, [wrapperRef, DragDrop, onDragOver, onDragEnter, onDragLeave]);

  return (
    <>
      <div className="container">
        <div className="fileUploadZone">
          <div
            ref={wrapperRef}
            className="drop-file-input"
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="drop-file-input__label">
              <img src={uploadImg} alt="upload-img" />
              <p>DropFileInput</p>
              <input
                name="file"
                type="file"
                multiple={true}
                value=""
                onChange={(e) => {
                  if (uploadRef.current.files.length > 0) {
                    selectFiles(e);
                    return;
                  }
                  if (wrapperRef.current.files.length > 0) {
                    handleFileDrop(e);
                    return;
                  }
                }}
                ref={uploadRef}
              />
            </div>
          </div>
          <span
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button className="sendButton" onClick={sendFormData}>
              전송
            </button>
            <button className="abortButton" onClick={AbortHandler}>
              중단
            </button>
          </span>
          {fileList.length > 0 ? (
            <div className="drop-file-preview">
              <p className="drop-file-preview__title">READY to Upload</p>

              <p className="progressStatus" ref={statusRef}></p>
              <p ref={loadTotalRef} />

              {fileList.map((item, index) => {
                console.log(fileList);
                const logo = item.name.split(".").pop();
                const imgSrc = logo === "pdf" ? pdfLogo : hwpLogo;
                return (
                  <>
                    <div key={index} className="drop-file-preview__item">
                      <img src={imgSrc} alt="" />
                      <div className="drop-file-preview__item__info">
                        <p
                          style={{
                            marginBottom: "10px",
                          }}
                        >
                          {item.name}
                        </p>
                        <p>{item.size}B</p>
                      </div>

                      <span
                        className="drop-file-preview__item__delete"
                        onClick={() => fileRemove(item)}
                      >
                        X
                      </span>

                      {isSameFile.includes(`${item.name}`) ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            textAlign: "end",
                            width: "200px",
                          }}
                        >
                          <span
                            className="isSame"
                            style={{
                              color: "red",
                              fontSize: "0.7rem",
                            }}
                          >
                            저장되어있는 파일이름입니다
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <div className="progressBarWrapper">
                      <div
                        className="progressBar"
                        ref={progressRef}
                        style={{
                          width: `${progressList[index] ?? 0}%`,
                          height: "100%",
                          borderRadius: "15px",
                          backgroundColor: "#c0c0c0",
                        }}
                      />
                    </div>
                  </>
                );
              })}
            </div>
          ) : null}
          <div className="sendButtonWrapper"></div>
        </div>
        <UserFileList />
        {/* userKey={localStorage.getItem("token")} /> */}
      </div>
    </>
  );
};

DropFileInput.propTypes = {
  DragDrop: PropTypes.func,
};

export default DropFileInput;
