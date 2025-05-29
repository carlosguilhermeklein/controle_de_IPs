import axios from 'axios';
import { Subnet, User } from '../types';

const API_URL = 'http://localhost:3000/api';

export const Database = {
  // Subnets
  getSubnets: async (): Promise<Subnet[]> => {
    try {
      const response = await axios.get(`${API_URL}/subnets`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subnets:', error);
      return [];
    }
  },

  saveSubnets: async (subnets: Subnet[]): Promise<void> => {
    try {
      await Promise.all(subnets.map(subnet => 
        axios.put(`${API_URL}/subnets/${subnet.id}`, subnet)
      ));
    } catch (error) {
      console.error('Error saving subnets:', error);
    }
  },

  addSubnet: async (subnet: Subnet): Promise<void> => {
    try {
      await axios.post(`${API_URL}/subnets`, subnet);
    } catch (error) {
      console.error('Error adding subnet:', error);
    }
  },

  deleteSubnet: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/subnets/${id}`);
    } catch (error) {
      console.error('Error deleting subnet:', error);
    }
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  saveUsers: async (users: User[]): Promise<void> => {
    try {
      await Promise.all(users.map(user => 
        axios.put(`${API_URL}/users/${user.id}`, user)
      ));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  },

  addUser: async (user: User): Promise<void> => {
    try {
      await axios.post(`${API_URL}/users`, user);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};