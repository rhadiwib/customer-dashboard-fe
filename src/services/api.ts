import axios from 'axios';

const API_BASE_URL = 'http://localhost:9191/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export interface Manager {
  id: number;
  name: string;
  email: string;
  regionName: string;
  regionType: string;
}

export interface ManagerDetails {
  managerId: number;
  managerName: string;
  regionLevel: string;
  regionName: string;
  numberOfCustomers: number;
  numberOfCities: number;
}

export interface CustomerStats {
  totalCustomers: number;
  byRegionLevel: {
    CITY: number;
    PROVINCE: number;
    COUNTRY: number;
  };
}

export interface RegionHierarchy {
  managerId: number;
  managerName: string;
  hierarchy: {
    country: string;
    province: string;
    city: string;
  };
}

apiClient.interceptors.response.use(
    response => response,
    error => {
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );

const api = {
  getAllManagers: () => 
    axios.get<Manager[]>(`${API_BASE_URL}/managers`),
    
  getManagerDetails: (managerId: number) =>
    axios.get<ManagerDetails>(`${API_BASE_URL}/managers/${managerId}/details`),
    
  getManagerStats: (managerId: number) =>
    axios.get<CustomerStats>(`${API_BASE_URL}/managers/${managerId}/stats`),
    
  getManagerHierarchy: (managerId: number) =>
    axios.get<RegionHierarchy>(`${API_BASE_URL}/managers/${managerId}/hierarchy`),
};

export default api;