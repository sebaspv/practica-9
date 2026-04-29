import { useState } from "react";
export default function NewPost() {
    const [title, setTitle] = useState('');
    const [img, setImg] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    function handleTitleChange(e) {
        setTitle(e.target.value);
    }
    function handleFile(e) {
        const fileInfo = {
            file: e.target.files[0],
            filename: e.target.files[0].name
        };
        setImg(fileInfo);
    }
    function handleSubmit() {
        const formInfo = new FormData();
        formInfo.append('title', title);
        formInfo.append('img', img.file, img.filename);
        fetch(`${API_URL}/posts/new`, {
            method: "POST",
            body: formInfo,
        })
            .then((res) => { console.log(res); })
            .catch((error) => { console.log(error); })
    }
    return (
        <div className="form">
            <input type='text' value={title} onChange={handleTitleChange}></input>
            <input type='text'></input>
            <input type='file' onChange={handleFile}></input>
            <input type='submit' value='Agregar' onClick={handleSubmit}></input>
        </div>
    );
}