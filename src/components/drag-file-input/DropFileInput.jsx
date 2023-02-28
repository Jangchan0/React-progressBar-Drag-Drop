/* eslint-disable*/

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./DropFileInput.css";

import { API } from "../../config";

import { ImgConfigs } from "../../config/imagesConfig";
import uploadImg from "../../assets/cloud-upload-regular-240.png";

const DropFileInput = (props) => {
  const [fileList, setFileList] = useState(() => {
    const savedList = localStorage.getItem("fileList");
    return savedList ? JSON.parse(savedList) : [];
  });

  const handleFileDrop = (e) => {
    e.preventDefault();
    console.log("a", e);
    const newFiles =
      e.dataTransfer.files.length > 0 ? e.dataTransfer.files : e.target.files;
    onFileChange(newFiles);
  };
  const formData = new FormData();
  const newFileList = [];
  const [progressPercent, setProgressPercent] = useState(0);
  const uploadRef = useRef();
  const statusRef = useRef();
  const loadTotalRef = useRef();
  const progressRef = useRef();

  const changeFile = async () => {
    for (let i = 0; i < uploadRef.current.files.length; i++) {
      const file = uploadRef.current.files[i];
      setFileList((prev) => [...prev, file]);
      formData.append("originalname", file.name);
      formData.append("files", file);
      formData.append("mimetype", file.type);
      formData.append("totalAmountData", file.size);
      newFileList.push(file);
    }
  };

  const onFileChange = async (files) => {
    for (let i = 0; i < files.length; i++) {
      console.log("3", files);
      const newFile = files[i];
      const fileInfo = {
        name: newFile.name,
        size: newFile.size,
        type: newFile.type,
        lastModified: newFile.lastModified,
      };
      newFileList.push(newFile);
      console.log("a");
      // formData.append(`file`, fileList);
      formData.append(`file-${i}`, newFile);
      formData.append("originalname", newFile.name);
      formData.append("mimetype", newFile.type);

      console.log(formData);
    }

    const updatedList = [...fileList, ...newFileList];
    setFileList(updatedList);
    props.onFileChange(updatedList);
    props.changeFile(updatedList);
    localStorage.setItem("fileList", JSON.stringify(updatedList));

    // axios({
    //   url: `${API.DND}`,
    //   method: "POST",
    //   headers: { "Content-Type": "multipart/form-data" },
    //   data: formData,
    //   maxContentLength: 10000000,
    //   maxBodyLength: 10000000,
    //   onUploadProgress: (e) => {
    //     // axios의 onUploadProgress 속성은 파일 업로드 진행 상황을 추적할 수 있는 콜백 함수
    //     let percent = (e.loaded / e.total) * 100;
    //     progressRef.current.value = Math.round(percent);
    //     statusRef.current.innerHTML = `${Math.round(percent)}% uploaded...`;
    //     setProgressPercent(progressRef.current.value);
    //     loadTotalRef.current.innerHTML = `uploaded ${e.loaded} bytes of ${e.total}`;
    //   },
    // })
    //   .then((response) => {
    //     alert("통신성공");
    //     console.log(response);
    //     statusRef.current.innerHTML = "업로드 완료";
    //   })
    //   .catch((error) => {
    //     alert("통신실패");
    //     console.log(error);
    //     statusRef.current.innerHTML = "업로드 실패";
    //   });
  };

  const sendFormData = () => {
    axios({
      url: `${API.DND}`,
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      data: fileList,
      maxContentLength: 10000000,
      maxBodyLength: 10000000,
      onUploadProgress: (e) => {
        // axios의 onUploadProgress 속성은 파일 업로드 진행 상황을 추적할 수 있는 콜백 함수
        let percent = (e.loaded / e.total) * 100;
        progressRef.current.value = Math.round(percent);
        statusRef.current.innerHTML = `${Math.round(percent)}% uploaded...`;
        setProgressPercent(progressRef.current.value);
        loadTotalRef.current.innerHTML = `uploaded ${e.loaded} bytes of ${e.total}`;
      },
    })
      .then((response) => {
        alert("통신성공");
        console.log(response);
        statusRef.current.innerHTML = "업로드 완료";
        console.log("b", fileList);
      })
      .catch((error) => {
        alert("통신실패");
        console.log(error);
        statusRef.current.innerHTML = "업로드 실패";
      });
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
    props.onFileChange(updatedList);
    localStorage.setItem("fileList", JSON.stringify(updatedList));
  };

  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem("fileList")) || [];
    setFileList(savedList);
  }, []);

  useEffect(() => {
    localStorage.setItem("fileList", JSON.stringify(fileList));
  }, [fileList]);

  useEffect(() => {
    const handleDrop = (event) => {
      event.preventDefault();
      const newFiles = event.dataTransfer.files;
      onFileChange(newFiles);
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
  }, [wrapperRef, onFileChange, onDragOver, onDragEnter, onDragLeave]);

  return (
    <>
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
                changeFile(e);
                console.log("a");
                return;
              }
              if (wrapperRef.current.files.length > 0) {
                handleFileDrop(e);
                console.log("b");
                return;
              }
            }}
            ref={uploadRef}
          />
        </div>
      </div>
      {fileList.length > 0 ? (
        <div className="drop-file-preview">
          <p className="drop-file-preview__title">READY to Upload</p>
          <div className="progressBarWrapper">
            <div
              className="progressBar"
              ref={progressRef}
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                borderRadius: "15px",
                backgroundColor: "#c0c0c0",
              }}
            />
          </div>
          <p className="progressStatus" ref={statusRef}></p>
          <p ref={loadTotalRef} />
          {fileList.map((item, index) => {
            return (
              <div key={index} className="drop-file-preview__item">
                <img
                  src={
                    ImgConfigs[item.type ? item.type.split("/")[1] : "default"]
                  }
                  alt=""
                />
                <div className="drop-file-preview__item__info">
                  <p>{item.name}</p>
                  <p>{item.size}B</p>
                </div>
                <span
                  className="drop-file-preview__item__delete"
                  onClick={() => fileRemove(item)}
                >
                  X
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
      <div className="sendButtonWrapper">
        <button className="sendButton" onClick={sendFormData}>
          전송
        </button>
      </div>
    </>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;
