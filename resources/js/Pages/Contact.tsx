import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';
import InputError from '@/Components/InputError';

const Contact = (props: { auth: any }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    
    const { flash } = usePage().props as any;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => reset(),
            preserveScroll: true,
        });
    };

    const inputClasses = `form-control form-control-dark bg-dark text-white border-white rounded-0 transition`;

    return (
        <>
            <Head title="Contact" />
            <Navbar auth={props.auth} />
            <main className="main-container-contact" style={{ fontFamily: 'Georgia, serif' }}>
                <h1 className="title-underline-contact text-center display-4 mb-4 mt-3" style={{ fontFamily: 'Dancing Script, cursive', fontSize: '3rem' }}>Parlez-moi de vos projets</h1>
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                        <p className="about-title-contact-text lead">
                            Vous recherchez un photographe ou graphiste freelance ? Ou bien même les deux pour vous accompagner de A à Z
                        </p>
                        <p className="about-title-contact-text">
                            Détaillez vos besoins et obtenez un devis gratuitement.<br />
                            Contactez-moi par mail : <a href="mailto:rachelle.artsvisuels@gmail.com" className="text-info">rachelle.artsvisuels@gmail.com</a><br />
                            Tout sera mis en œuvre pour assurer vos réalisations en respectant vos délais et cahiers des charges.<br />
                            N'hésitez pas à me contacter pour toute demande d'informations.
                        </p>
                        <div className="form-container">
                            <form onSubmit={handleSubmit} className="form-contact" noValidate>
                                 {flash.success && (
                                    <div className="alert alert-success mt-4 text-center" role="alert">
                                        {flash.success}
                                    </div>
                                )}
                                {flash.error && (
                                    <div className="alert alert-danger mt-4 text-center" role="alert">
                                        {flash.error}
                                    </div>
                                )}
                                <div className="form-group mb-3">
                                    <label htmlFor="name" className="form-label text-info">Nom :</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className={`${inputClasses} ${errors.name ? 'is-invalid' : ''}`}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="email" className="form-label text-info">Email :</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className={`${inputClasses} ${errors.email ? 'is-invalid' : ''}`}
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="phone" className="form-label text-info">Téléphone :</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        className={`${inputClasses} ${errors.phone ? 'is-invalid' : ''}`}
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.phone} className="mt-2" />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="message" className="form-label text-info">Message :</label>
                                    <textarea
                                        name="message"
                                        id="message"
                                        className={`${inputClasses} ${errors.message ? 'is-invalid' : ''} resize-none`}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        rows={4}
                                        required
                                    ></textarea>
                                    <InputError message={errors.message} className="mt-2" />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-lg btn-outline-info w-100 mt-4 mb-4"
                                    disabled={processing}
                                >
                                    {processing ? 'Envoi en cours...' : 'Envoyer'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Contact;
