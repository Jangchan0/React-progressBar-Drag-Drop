import React, { useRef, useState } from 'react'
import './DropFileInput.css'

import {ImageConfig} from '../../config/imagesConfig'
import uploadImg from '../../assets/cloud-upload-regular-240.png'

const DropFileInput = () => {

    const [fileList, setFileList] = useState([])

    const wrapperRef = useRef(null)
    const onDragEnter = () => wrapperRef.current.classList.add('dragover')
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover')
    const onDrop = () => wrapperRef.current.classList.remove('dragover')

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if( newFile ) {
            const updatedList = [...fileList, newFile]
            setFileList(updatedList)
        }
    }


  return (
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
            <input type="file" value="" onChange={onFileDrop}/>
        </div>
    </div>
  )
}

DropFileInput.propTypes = {}

export default DropFileInput