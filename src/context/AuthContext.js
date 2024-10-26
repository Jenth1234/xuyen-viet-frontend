import React, { createContext } from 'react';

const AuthContext = createContext();

export class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      token: null,
      userInfo: null,
    };
  }

  componentDidMount() {
    const storedToken = localStorage.getItem('token');
    const storedUserInfo = localStorage.getItem('userInfo');

    if (storedToken) {
      this.setState({
        isLoggedIn: true,
        token: storedToken,
        userInfo: JSON.parse(storedUserInfo),
      });



    }
  }

  login = (token) => {
    this.setState({
      isLoggedIn: true,
      token: token,

    });
    localStorage.setItem('token', token);




  };

  logout = () => {
    this.setState({
      isLoggedIn: false,
      token: null,

    });
    localStorage.removeItem('token');
  };

  isTokenExists = () => {
    const storedToken = localStorage.getItem('token');

    return storedToken !== null; 
  };

  render() {
    return (
      <AuthContext.Provider 
        value={{
          ...this.state, 
          login: this.login, 
          logout: this.logout, 
          isTokenExists: this.isTokenExists // Thêm hàm kiểm tra token vào provider
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
