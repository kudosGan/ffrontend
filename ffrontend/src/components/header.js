import React from 'react';
import './header.css'; 
import logo from './img/logo.png'; 

function Header() {
   
    return (
        <div className="header-box">
            <div className="header-top">
                <div className="header-content">
                    
                    <div >
                        <a href="/en.html">
                            <img src={logo} alt="Government of Canada" className="logo" />
                        </a>
                    </div>
                    <div className="language-switcher">
                        <a lang="fr" href="/fr/emploi-developpement-social/services/mon-dossier.html" className="french-button">
                            Français
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
