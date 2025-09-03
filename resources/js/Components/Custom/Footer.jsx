import React from 'react';
import { Link } from '@inertiajs/react';

const Footer = ({ instagramUrl }) => {
    return (
        <footer className="footer">
            <div className="footer-info">
                <p>rachelle.artsvisuels@gmail.com</p>
            </div>

            <div className="icons instagram-icon">
                <Link href="https://www.instagram.com/rachelle.bocage?igsh=MW5tcXN0OHprbGR2OA=="><img src={instagramUrl} alt="instagram_logo" /></Link>
            </div>
        </footer>
    );
};

export default Footer;