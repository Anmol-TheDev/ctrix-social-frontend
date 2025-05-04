import axios from "axios";
const Api = axios.create({
    baseURL: "https://ctrix-social-go-backend.onrender.com/api/",
})

export default Api;