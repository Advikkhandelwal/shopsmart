import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-section">
                        <h4>Get to Know Us</h4>
                        <ul>
                            <li>About Us</li>
                            <li>Careers</li>
                            <li>Press Releases</li>
                            <li>ShopSmart Science</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Connect with Us</h4>
                        <ul>
                            <li>Facebook</li>
                            <li>Twitter</li>
                            <li>Instagram</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Make Money with Us</h4>
                        <ul>
                            <li>Sell on ShopSmart</li>
                            <li>Supply to ShopSmart</li>
                            <li>Become an Affiliate</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Let Us Help You</h4>
                        <ul>
                            <li>COVID-19 and ShopSmart</li>
                            <li>Your Account</li>
                            <li>Returns Centre</li>
                            <li>100% Purchase Protection</li>
                            <li>Help</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} ShopSmart.com, Inc. or its affiliates</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
