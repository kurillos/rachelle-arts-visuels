import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function CreateCarousel({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        image: null,
        title: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('carousels.store'));
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <div className="container mt-5">
                <div className="card shadow-sm">
                    <div className="card-header text-center">
                        <h1 className="h4 mb-0">Ajouter une image au carrousel</h1>
                    </div>
                    <div className="card-body">
                        <form onSubmit={submit}>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Image:</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                    onChange={(e) => setData('image', e.target.files[0])}
                                />
                                {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Titre:</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={data.title}
                                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description:</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    rows="4"
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    onChange={(e) => setData('description', e.target.value)}
                                ></textarea>
                                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                            </div>

                            <div className="d-grid gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
