import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './login.css'; 


function Login() {
  const [username, setUserName] = useState('');
  const [password, setPassWord] = useState('');
  const [outputMessage, setOutputMessage] = useState('');
  const navigate = useNavigate();

  const handleClick = () => {
    setOutputMessage(`Username: ${username}, Password: ${password}`);
    navigate('/main'); 
  };


return (
 <div> 
<div className="button-containers2">
    <h1 className="login-title"> Login Page</h1>
    <button className="forgot-button " onClick={() => navigate('/main')}>Forgot Password</button>
</div>
<div className="login-container2">
    <div className="input">
        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
        />
    </div>

    <div className="input">
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassWord(e.target.value)}
        />
    </div>

    <div>
        <button className="submitButton" onClick={handleClick}>Submit</button>
    </div>

    <div>
        {outputMessage && <p>{outputMessage}</p>}
    </div>
</div>
</div>

   

 
  );
}

export default Login;
