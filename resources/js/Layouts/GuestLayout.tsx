import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';

export default function GuestLayout({ children }) {
    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Navbar />
            <main className="flex-grow-1 d-flex justify-content-center align-items-center">
                {children}
            </main>
            <Footer />
        </div>
    );
}
