import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { buildImageUrl, formatDate } from "./Cards";

export default function Post() {
    const { id_post } = useParams();
    const [post, setPost] = useState({});
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    useEffect(() => {
        fetch(`${API_URL}/posts/` + id_post)
            .then((res) => res.json())
            .then((data) => setPost(data));
    }, [id_post]);
    return (
        <div className='post'>
            <img src={buildImageUrl(post.image)} alt="Imagen del post"></img>
            <h1>{post.title}</h1>
            <h2>Escrito por: {post.id_author}</h2>
            <h2>{formatDate(post.date)}</h2>
            <p>{post.text}</p>
        </div>
    );
}