import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
<<<<<<< HEAD:client/src/Components/Nav/index.js
import Search from '../Search';
import Login from '../Login';
import './index.scss';
=======
import Search from '../Search/Search';
import Login from '../Login/Login';
// import './Nav.css';
import './Nav.scss';
>>>>>>> 316aad747e5df91201bce6ca44960fe7a070a5df:client/src/Components/Nav/Nav.js
import headphone from '../../assets/headphones.png';

function Nav () {
  const [isLoginBtn, setIsLoginBtn] = useState(false);

  const history = useHistory();
  function handleLoginBtn (e) {
    e.preventDefault();
    setIsLoginBtn(true);
  }

  function handleSignUpBtn (e) {
    e.preventDefault();
    history.push('/signup');
  }

  return (
    <header>
      <nav className='navigation'>
        <Link to='/'>
          <h1 className='logo'>Hidden Track</h1>
        </Link>
        <Search />
        <div className='button-list'>
          <button className='login' onClick={(e) => handleLoginBtn(e)}>로그인</button>
          <button className='sign-up' onClick={(e) => handleSignUpBtn(e)}>회원가입</button>
          <button className='player'><img className='player-image' src={headphone} alt='player' /></button>
          <button onClick={console.log('eeee')}>console</button>
        </div>
        {isLoginBtn && <Login visible={isLoginBtn} handleLoginBtn={handleLoginBtn} setIsLoginBtn={setIsLoginBtn} handleSignUpBtn={handleSignUpBtn} />}
      </nav>
    </header>

  );
}
export default Nav;