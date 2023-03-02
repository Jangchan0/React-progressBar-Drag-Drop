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

  const [progressList, setProgressList] = useState(0);

  const uploadRef = useRef();
  const statusRef = useRef();
  const loadTotalRef = useRef();
  const progressRef = useRef();

  const formData = new FormData();

  ////////////////////////////////////////////////////////////////////////////////////////////

  const selectFiles = async () => {
    setProgressList(Array(uploadRef.current.files.length).fill(0));
    for (let i = 0; i < uploadRef.current.files.length; i++) {
      const file = uploadRef.current.files[i];
      setFileList((prev) => [...prev, file]);
      newFileList.push(file);

      formData.append(`file${i + 1}`, file);

      // 개별 파일에 대한 onUploadProgress 핸들러 설정
      formData[`onUploadProgress${i + 1}`] = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`file${i + 1}:`, percentCompleted, "%");
      };

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
          }
        })
        .catch((error) => console.log(error));
    }

    const updatedList = [...fileList, ...newFileList];
    setFileList(updatedList);
    props.DragDrop(updatedList);
    props.selectFiles(updatedList);
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const DragDrop = async (e) => {
    setProgressList(Array(e.length).fill(0));
    for (let i = 0; i < e.length; i++) {
      const newFile = e[i];
      setFileList((prev) => [...prev, newFile]);
      newFileList.push(newFile);

      formData.append(`file${i + 1}`, newFile);
      formData[`onUploadProgress${i + 1}`] = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`file${i + 1}:`, percentCompleted, "%");
      };

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

    /////////////////////////////////////////////////////////////////////////////////////////
    const updatedList = [...fileList, ...newFileList];
    setFileList(updatedList);
    props.DragDrop(updatedList);
    props.selectFiles(updatedList);
  };

  const sendFormData = async () => {
    const promises = fileList.map((file, index) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("index", index);

      return axios({
        url: `${API.DND}`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmRiZjY4NjdhY2MyZjA1ZmJiMWYyOCIsImlhdCI6MTY3NzU3NDE2N30.jPDFeGXqn-D_SIBNoyGcV1MJjSBBWgy_irsV51XKnDU",
        },
        data: formData,
        maxContentLength: 10000000, // 엑시오스 용량 늘리기
        maxBodyLength: 10000000, // 엑시오스 용량 늘리기
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgressList((prevProgressList) => {
            const updatedProgressList = [...prevProgressList];
            const fileIndex = parseInt(formData.get("index"));
            updatedProgressList[fileIndex] = percentCompleted;
            return updatedProgressList;
          });
        },
      });
    });

    await Promise.all(promises);
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

              {fileList.map((item, i) => {
                const logo = item.name.split(".").pop();
                const imgSrc = logo === "pdf" ? pdfLogo : hwpLogo;

                const getByteSize = (size) => {
                  const byteUnits = ["KB", "MB", "GB", "TB"];

                  for (let i = 0; i < byteUnits.length; i++) {
                    size = Math.floor(size / 1024);

                    if (size < 1024) return size.toFixed(1) + byteUnits[i];
                  }
                };

                return (
                  <>
                    <div
                      key={item.fileName}
                      className="drop-file-preview__item"
                    >
                      <img src={imgSrc} alt="" />
                      <div className="drop-file-preview__item__info">
                        <p
                          style={{
                            marginBottom: "10px",
                          }}
                        >
                          {item.name}
                        </p>
                        <p>{getByteSize(item.size)}</p>
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
                          width: `${progressList[i]}%`,
                          height: "100%",
                          borderRadius: "15px",
                          backgroundColor: "#849ffa",
                          borderRadius: "0 0 20px 20px",
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
      </div>
    </>
  );
};

DropFileInput.propTypes = {
  DragDrop: PropTypes.func,
};

export default DropFileInput;
