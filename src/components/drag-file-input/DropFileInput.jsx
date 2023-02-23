import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import PropTypes from 'prop-types';
import './DropFileInput.css'

import { API } from '../../config';

import {ImgConfigs} from '../../config/imagesConfig'
import uploadImg from '../../assets/cloud-upload-regular-240.png'



const DropFileInput = (props) => {

    const [fileList, setFileList] = useState(()=>{
        const savedList = localStorage.getItem('fileList')
        return savedList ? JSON.parse(savedList) : []
    })


    const handleFileDrop = (event) => {
        onFileDrop(event)
        onFileChange(event.target.files)
    }

    const onFileChange = (files) => {
        const formData = new FormData();
        const newFile = files[0];
        const fileInfo = {
            name: newFile.name,
            size: newFile.size,
            type: newFile.type,
            lastModified: newFile.lastModified
        }

        formData.append('file', newFile);
        const updatedList = [...fileList, fileInfo]
        setFileList(updatedList);
        props.onFileChange(updatedList);
        localStorage.setItem('fileList', JSON.stringify(updatedList))

        axios({
            url: `${API.DND}`,
            method: 'POST',
            headers: {  'Content-Type' : 'multipart/form-data' },
            data: {
                formData: formData,
                filename: newFile.name
            },
          }).then(response => {
            alert('통신성공');
            console.log(response);
          }).catch((error)=>{
            alert('통신실패')
            console.log(error)
          })
        }

    const wrapperRef = useRef(null)
    const onDragEnter = () => wrapperRef.current.classList.add('dragover')
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover')
    const onDrop = () => wrapperRef.current.classList.remove('dragover')

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if( newFile ) {
            const updatedList = [...fileList, newFile]
            setFileList(updatedList)
            props.onFileChange(updatedList)
            localStorage.setItem('fileList', JSON.stringify(updatedList))
        }
    }

    const fileRemove = (file) => {
            const updatedList = fileList.filter(item => item !== file)
            setFileList(updatedList)
            props.onFileChange(updatedList)
            localStorage.setItem('fileList', JSON.stringify(updatedList))
    }

        useEffect(() => {
            const savedList = JSON.parse(localStorage.getItem('fileList')) || [];
            setFileList(savedList);
        }, []);

        useEffect(()=>{
            localStorage.setItem('fileList',JSON.stringify(fileList))
            console.log(JSON.stringify(fileList))
        },[fileList])


  return (
    <>
        <div 
        ref={wrapperRef}
        className='drop-file-input'
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
    >
        <div className="drop-file-input__label">
            <img src={uploadImg} alt="upload-img" />
            <p>DropFileInput</p>
            <input type="file" value="" onChange={handleFileDrop}/>
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