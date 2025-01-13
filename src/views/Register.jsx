import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINT } from "../config/constans";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
    rol: "",
    lenguage: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (
      !user.email.trim() ||
      !user.password.trim() ||
      user.rol === "" ||
      user.lenguage === ""
    ) {
      return alert("Todos los campos son obligatorios.");
    }

    if (!emailRegex.test(user.email)) {
      return alert("El formato del email no es correcto.");
    }

    try {
      const response = await axios.post(ENDPOINT.users, user);
      alert("Usuario registrado con éxito. 😀");
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message || "Error al registrar el usuario. 🙁"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="col-10 col-sm-6 col-md-3 m-auto mt-5">
      <h1>Registrar nuevo usuario</h1>
      <hr />
      <div className="form-group mt-1">
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Ingrese su email"
          value={user.email}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
      <div className="form-group mt-1">
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Ingrese su contraseña"
          value={user.password}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
      <div className="form-group mt-1">
        <label>Rol</label>
        <select
          name="rol"
          value={user.rol}
          onChange={handleInputChange}
          className="form-select"
        >
          <option value="">Seleccione un rol</option>
          <option value="Full Stack Developer">Full Stack Developer</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Backend Developer">Backend Developer</option>
        </select>
      </div>
      <div className="form-group mt-1">
        <label>Lenguaje</label>
        <select
          name="lenguage"
          value={user.lenguage}
          onChange={handleInputChange}
          className="form-select"
        >
          <option value="">Seleccione un lenguaje</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="Ruby">Ruby</option>
        </select>
      </div>
      <button type="submit" className="btn btn-light mt-3">
        Registrarme
      </button>
    </form>
  );
};

export default Register;
