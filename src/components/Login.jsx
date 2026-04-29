import { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    }

    function handlePassswordChange(e) {
        setPassword(e.target.value);
    }

    function handleSubmit() {
        const formInfo = new FormData();
        formInfo.append("username", username);
        formInfo.append("password", password);

        fetch(`${API_URL}/login`, {
            method: "POST",
            credentials: "include",
            body: formInfo,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                navigate("/autores/" + data.id_author)
            })
            .catch((error) => { console.log(error); })
    }
    return (
        <div className="login">
            <h1>Login</h1>
            <label>Usuario:</label>
            <input type="text" value={username} onChange={handleUsernameChange}></input>
            <label>Contraseña:</label>
            <input type="password" value={password} onChange={handlePassswordChange}></input>
            <input type="submit" value="Entrar" onClick={handleSubmit} className="submit"></input>
        </div>
    )
}