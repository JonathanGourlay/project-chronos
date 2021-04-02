import ApiClient from "./apiClient";
import "bootstrap/dist/css/bootstrap.min.css";

const apiClient = new ApiClient({
    baseUrl: "https://localhost:44349",
});

export default apiClient;