import axios from "axios";
import baseUPL from "../common/baseURL";
import SummaryApi from "../common/SummaryApi";

const Axios = axios.create({
  baseURL: baseUPL,
  withCredentials: true,
});

// sending access token in header of every request if exist
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accesstoken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            const newAccessToken=await refershAccessToken(refreshToken);
            if(newAccessToken){
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return Axios(originalRequest);
            }
        }
      } catch (err) {
        console.log("Refresh failed", err);
      }
    }
    return Promise.reject(error);
  },
);

const refershAccessToken = async (refreshToken) => {
  try {
    const response = await Axios({
      ...SummaryApi.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    const accessToken = response.data.data.accessToken;
    localStorage.setItem("accesstoken", accessToken);
    return accessToken;
   
  } catch (error) {
    console.log(error);
  }
};

//extend the expiry time of access token if refresh token is valid
export default Axios;
