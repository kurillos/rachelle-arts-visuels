import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';

const Contact: React.FC = () => {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        email: '',
        telephone: '',
        message: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact'); // Ajuste l'URL selon ta route Laravel
    };

    return (
        <div className="public-site d-flex flex-column min-vh-100 contact-dark-theme">
            <Head title="Contact" />
            <Navbar />
            
            <main className="flex-grow-1 py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h1 className="title-underline text-white">Parlez-moi de vos projets</h1>
                        <p className="mt-4 text-white italic contact-intro">
                            Vous recherchez un photographe ou graphiste freelance ? Ou bien même les deux pour vous accompagner de A à Z
                        </p>
                        <div className="contact-info-text text-white mt-3">
                            <p>Détaillez vos besoins et obtenez un devis gratuitement.</p>
                            <p>Contactez-moi par mail : <span className="text-cyan">rachelle.artsvisuels@gmail.com</span></p>
                            <p className="small">Tout sera mis en œuvre pour assurer vos réalisations en respectant vos délais et cahiers des charges.</p>
                            <p>N'hésitez pas à me contacter pour toute demande d'informations.</p>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-5">
                            <form onSubmit={submit} className="contact-form">
                                <div className="mb-4 text-center">
                                    <label className="text-cyan mb-2">Nom :</label>
                                    <input 
                                        type="text" 
                                        className="form-control-custom"
                                        value={data.nom}
                                        onChange={e => setData('nom', e.target.value)}
                                    />
                                </div>

                                <div className="mb-4 text-center">
                                    <label className="text-cyan mb-2">Email :</label>
                                    <input 
                                        type="email" 
                                        className="form-control-custom"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                </div>

                                <div className="mb-4 text-center">
                                    <label className="text-cyan mb-2">Téléphone :</label>
                                    <input 
                                        type="text" 
                                        className="form-control-custom"
                                        value={data.telephone}
                                        onChange={e => setData('telephone', e.target.value)}
                                    />
                                </div>

                                <div className="mb-4 text-center">
                                    <label className="text-cyan mb-2">Message :</label>
                                    <textarea 
                                        rows={4}
                                        className="form-control-custom"
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                    />
                                </div>

                                <div className="text-center mt-5">
                                    <button type="submit" className="btn-envoyez" disabled={processing}>
                                        Envoyez
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;