import axios from "axios";

const API_GATEWAY_URL = "";

export const getAllClusters = async () => {
    const response = await axios.get(API_GATEWAY_URL);
    return response.data;
};

export const startCluster = async (clusterId: string) => {
    const url = `${API_GATEWAY_URL}/${clusterId}/start`;
    const response = await axios.post(url);
    return response.data;
};

export const stopCluster = async (clusterId: string) => {
    const url = `${API_GATEWAY_URL}/${clusterId}/stop`;
    const response = await axios.post(url);
    return response.data;
};
