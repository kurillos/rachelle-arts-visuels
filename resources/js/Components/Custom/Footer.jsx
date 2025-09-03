import React from 'react';
import { Link } from '@inertiajs/react';

const Footer = ({ instagramUrl }) => {
    return (
        <footer className="footer d-flex justify-content-between align-items-center bg-dark text-secondary">
            <div className="footer-info">
                <p>rachelle.artsvisuels@gmail.com</p>
            </div>

            <div className="icons d-flex align-items-center">
                <Link href="https://www.instagram.com/rachelle.bocage?igsh=MW5tcXN0OHprbGR2OA==" className="ms-2"><img src="/images/instagram.png" alt="instagram_logo" className="instagram-logo"/></Link>
            </div>
        </footer>
    );
};

export default Footer;