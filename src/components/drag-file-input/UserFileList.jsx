import axios from "axios";
import React, { useEffect, useState } from "react";
import "./UserFileList.css";
import pdfLogo from "../../assets/images/pdfLogo.png";
import hwpLogo from "../../assets/images/hwpLogo.png";

const UserFileList = (props) => {
  const [userFile, setUserFile] = useState([]);

  // const userKey = props.userKey;

  const userKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmRiZjY4NjdhY2MyZjA1ZmJiMWYyOCIsImlhdCI6MTY3NzYzNjQzMX0.HxwE6H_cJG-leXwt6PtvdiMELUgM-oaAStj3wSBV1Cw";

  useEffect(() => {
    axios
      .get(`http://192.168.0.36:3001/files/checklist`, {
        headers: {
          Authorization: userKey,
        },
      })
      .then((response) => setUserFile(response.data.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      {userFile.length > 0 ? (
        <div className="fileListWrapper">
          <div className="fileListTitle"> 저장 파일 목록</div>
          <div className="fileList">
            {userFile.map((data, i) => {
              const logo = data.fileName.split(".").pop();
              const imgSrc = logo === "pdf" ? pdfLogo : hwpLogo;
              return (
                <>
                  <div key={i} className="file">
                    <div className="fileInfo">
                      <img src={imgSrc} alt="파일 이미지" />
                      <div className="fileDetail">
                        <span>{data.fileName}</span>
                        <span>{data.size}</span>
                        <span>{data.date}</span>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="fileListWrapper">
          <div className="fileListTitle"> 저장 파일 목록</div>
          <div className="fileListNone">
            <span>저장된 파일이 없습니다</span>
          </div>
        </div>
      )}
    </>
  );
};

export default UserFileList;
