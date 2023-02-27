import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import PropTypes from 'prop-types';
import './DropFileInput.css'

import { API } from '../../config';

import {ImgConfigs} from '../../config/imagesConfig'
import uploadImg from '../../assets/cloud-upload-regular-240.png'


const DropFileInput = (props) => {
    const [fileList, setFileList] = useState(() => {
        const savedList = localStorage.getItem('fileList');
        return savedList ? JSON.parse(savedList) : [];
    });

    const handleFileDrop = (event) => {
        event.preventDefault();
        const newFiles = event.dataTransfer.files.length > 0 ? event.dataTransfer.files : event.target.files;
        onFileChange(newFiles);
    };

    const onFileChange = (files) => {
        const formData = new FormData();
        const newFileList = [];

        for (let i = 0; i < files.length; i++) {
            const newFile = files[i];
            const fileInfo = {
                name: newFile.name,
                size: newFile.size,
                type: newFile.type,
                lastModified: newFile.lastModified
            };

            formData.append(`file-${i}`, newFile);
            newFileList.push(fileInfo);
        }

        const updatedList = [...fileList, ...newFileList];
        setFileList(updatedList);
        props.onFileChange(updatedList);
        localStorage.setItem('fileList', JSON.stringify(updatedList));

        axios({
            url: `${API.DND}`,
            method: 'POST',
            headers: { 'Content-Type' : 'multipart/form-data' },
            data: formData,
            maxContentLength: 10000000,
            maxBodyLength: 10000000,
        }).then(response => {
            alert('통신성공');
            console.log(response);
        }).catch((error)=>{
            alert('통신실패');
            console.log(error);
        });
    };

    const wrapperRef = useRef(undefined);
    const onDragOver = (event) => {
        event.preventDefault();
    };
    const onDragEnter = () => wrapperRef.current?.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current?.classList.remove('dragover');
    const onDrop = () => wrapperRef.current?.classList.remove('dragover');

    const fileRemove = (file) => {
        const updatedList = fileList.filter(item => item !== file);
        setFileList(updatedList);
        props.onFileChange(updatedList);
        localStorage.setItem('fileList', JSON.stringify(updatedList));
    };

    useEffect(() => {
        const savedList = JSON.parse(localStorage.getItem('fileList')) || [];
        setFileList(savedList);
    }, []);

    useEffect(() => {
        localStorage.setItem('fileList', JSON.stringify(fileList));
    }, [fileList]);

    useEffect(() => {
        const handleDrop = (event) => {
          event.preventDefault();
          const newFiles = event.dataTransfer.files;
          onFileChange(newFiles);
        };
        
        const wrapper = wrapperRef.current;
      
        wrapper.addEventListener('drop', handleDrop);
        wrapper.addEventListener('dragover', onDragOver);
        wrapper.addEventListener('dragenter', onDragEnter);
        wrapper.addEventListener('dragleave', onDragLeave);
      
        return () => {
          wrapper.removeEventListener('drop', handleDrop);
          wrapper.removeEventListener('dragover', onDragOver);
          wrapper.removeEventListener('dragenter', onDragEnter);
          wrapper.removeEventListener('dragleave', onDragLeave);
        };
      }, [wrapperRef, onFileChange, onDragOver, onDragEnter, onDragLeave]);



  return (
    <>
        <div 
        ref={wrapperRef}
        className='drop-file-input'
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
    >
        <div className="drop-file-input__label">
            <img src={uploadImg} alt="upload-img" />
            <p>DropFileInput</p>
            <input type="file" multiple={true} value="" onChange={handleFileDrop}/>
        </div>
    </div>
    {
        fileList.length > 0 ? (
            <div className="drop-file-preview">
                <p className="drop-file-preview__title">
                    READY to Upload
                </p>
                {
                    fileList.map((item,index)=> {
                        return(
                            <div key={index} className="drop-file-preview__item">
                                <img src={ImgConfigs[item.type ? item.type.split('/')[1] : 'default']} alt="" />
                                <div className='drop-file-preview__item__info'>
                                    <p>{item.name}</p>
                                    <p>{item.size}B</p>
                                </div>
                                <span className='drop-file-preview__item__delete' onClick={()=> fileRemove(item) }>
                                    X
                                </span>
                            </div>
                        )
                    })
                }
            </div>
        ) : null

    }
    </>
  )
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput