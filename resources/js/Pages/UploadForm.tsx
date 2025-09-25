
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function UploadForm({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Upload Image</h2>}
        >
            <Head title="Upload Image" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form action="/carousels" method="POST" encType="multipart/form-data">
                                <div className="form-group">
                                    <label htmlFor="image">Choisir une image :</label>
                                    <input type="file" name="image" id="image" className="form-control" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="title">Titre :</label>
                                    <input type="text" name="title" id="title" className="form-control" />
                                </div>
                                <button type="submit" className="btn btn-primary">Télécharger</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
