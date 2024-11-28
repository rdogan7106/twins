import axios from 'axios';

const API_URL = 'http://localhost:5000';

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; 
  } catch (error) {
    console.error('Login failed!', error);
    throw error.response ? error.response.data : new Error('Network error');
  }
};
const logout = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            // Eğer logout backend tarafından kontrol ediliyorsa, token ile işlem yapılabilir.
            axios.post(`${API_URL}/logout`, {}, {
                headers: {
                    'Authorization': token
                }
            }).then(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                console.log('Logout successful!');
            });
        } catch (error) {
            console.error('Logout failed!', error);
        }
    }
};
const getProtectedData = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/protected`, {  
            headers: {
                'x-access-token': token  
            }
        });
        console.log(response.data);  
    } catch (error) {
        console.error('Access denied!', error);  
    }
};
const createUser = async (username, password, email) => {
    try {
        const response = await axios.post(`${API_URL}/createuser`, {
            username,
            password,
            email
        }, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};
const DeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/delete-comparison/${id}`, {
        headers: {
          'Authorization': token
        }
      }); 
  
    } catch (error) {
      console.error('Error deleting comparison:', error);
    }
};
const GetUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/user/get-user', {
        headers: {
          'Authorization': token
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
};
const fetchSingleImages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/user-comparisons', {
        headers: {
          'Authorization': token
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchDoubleImages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/comparison-details', {
        headers: {
          'Authorization': token
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

export { login, getProtectedData, createUser, logout, DeleteUser , GetUser ,fetchSingleImages,fetchDoubleImages};
