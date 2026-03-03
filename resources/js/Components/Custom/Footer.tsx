import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer mt-auto py-3">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <div className="footer-info">
                    <p className="mb-0">© {new Date().getFullYear()} Rachelle Arts Visuels</p>
                    <small>rachelle.artsvisuels@gmail.com</small>
                </div>
                
                <div className="icons">
                    <a href="https://www.instagram.com/rachelle_arts_visuels/" target="_blank" rel="noopener noreferrer">
                        <img src="/images/instagram.png" alt="Instagram" className="instagram-icon" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;