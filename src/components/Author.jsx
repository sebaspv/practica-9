import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function Author() {
    const { id_author } = useParams();
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    useEffect(() => {
        fetch(`${API_URL}/authors/` + id_author, {
            method: "GET",
            credentials: "include"
        })
            .then((res) => {
                if (res.status === 401) {
                    navigate('/login');
                    return null;
                }
                if (res.status === 404) {
                    throw new Error("Autor no encontrado");
                }
                return res.json();
            })
            .then((data) => {
                if (data) setAuthor(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [id_author, navigate]);

    if (loading) return <p>Cargando autor...</p>;

    if (!author) return <p>No se encontró el autor.</p>;

    return (
        <div>
            <h1>{author.name}</h1>
            <p><strong>ID:</strong> {author.id_author}</p>

            {author.username && (
                <p><strong>Username:</strong> {author.username}</p>
            )}

            <button onClick={() => navigate(-1)}>
                Regresar
            </button>
        </div>
    )
}