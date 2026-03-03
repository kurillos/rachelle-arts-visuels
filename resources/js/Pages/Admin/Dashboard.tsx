import React from 'react';
import { Head } from '@inertiajs/react';
import { 
  UploadCloud, 
  LayoutDashboard, 
  Image as ImageIcon,
  CheckCircle2,
  Database
} from "lucide-react";

const Dashboard = ({ auth, 作品 = [] }) => {
  return (
    <div className="admin-dashboard-wrapper min-vh-100 pb-5">
      <Head title="Administration - Portfolio" />

      {/* Navbar stylisée avec ton dégradé signature */}
      <nav className="navbar navbar-dark shadow-lg mb-5 admin-nav-gradient">
        <div className="container py-2">
          <span className="navbar-brand d-flex align-items-center fw-bold brand-cursive">
            <LayoutDashboard className="me-2 text-info" /> 
            Espace Créateur — Rachelle Arts
          </span>
          <div className="d-flex align-items-center text-white">
            <div className="text-end me-3 d-none d-sm-block">
              <small className="d-block opacity-75">Administrateur</small>
              <span className="fw-bold text-info">{auth.user.name}</span>
            </div>
            <div className="bg-info rounded-circle p-2 shadow-sm text-dark">
               {auth.user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      <main className="container">
        <header className="mb-5 text-center text-lg-start">
          <h1 className="admin-title-cursive display-4 mb-2">Gestion du Portfolio HD</h1>
          <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
            <span className="badge-s3 d-flex align-items-center px-3 py-2">
                <Database size={16} className="me-2" />
                Infrastructure Amazon S3 Connectée
            </span>
          </div>
        </header>

        <div className="row g-4">
          {/* Section Ajout d'œuvre */}
          <div className="col-lg-5">
            <div className="card admin-card border-0 shadow-lg overflow-hidden h-100">
              <div className="admin-card-header py-3">
                <h5 className="mb-0 d-flex align-items-center justify-content-center text-white">
                  <UploadCloud className="me-2" /> Publier une nouvelle pépite
                </h5>
              </div>
              <div className="card-body p-4">
                <form>
                  <label className="upload-zone-styled mb-4 d-block">
                    <input type="file" className="d-none" />
                    <div className="zone-content p-5 text-center border-2 rounded-4">
                        <ImageIcon size={48} className="text-primary mb-3" />
                        <h6 className="fw-bold">Glissez votre œuvre ici</h6>
                        <p className="small text-muted mb-0">HD autorisée (JPEG, PNG, WebP)</p>
                    </div>
                  </label>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-2">Titre de l'œuvre</label>
                    <input 
                      type="text" 
                      className="form-control admin-input p-3" 
                      placeholder="Ex: Reflets d'Émeraude" 
                    />
                  </div>

                  <button className="btn btn-admin-action w-100 py-3 shadow-sm fw-bold text-uppercase">
                    Envoyer vers le nuage
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Section Galerie Actuelle */}
          <div className="col-lg-7">
            <div className="card admin-card border-0 shadow-lg h-100">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-0">
                <h5 className="mb-0 fw-bold text-dark">Ma Galerie Cloud</h5>
                <span className="badge rounded-pill bg-info text-dark px-3 py-2 fw-bold">0 Œuvres</span>
              </div>
              <div className="card-body d-flex flex-column align-items-center justify-content-center py-5 text-center">
                <div className="empty-state-icon mb-4">
                    <ImageIcon size={60} className="text-light-subtle" />
                </div>
                <h4 className="text-dark fw-bold mb-2">Votre galerie est vide</h4>
                <p className="text-muted mb-0 mx-auto" style={{maxWidth: '300px'}}>
                    Donnez vie à votre site en envoyant votre première création haute définition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        /* Intégration de tes polices */
        @import url('https://fonts.googleapis.com/css2?family=Charm:wght@400;700&family=Charmonman:wght@400;700&display=swap');

        .admin-dashboard-wrapper {
          background-color: #fcfcfc;
          font-family: 'Charm', sans-serif !important;
        }

        /* Navbar avec ton dégradé */
        .admin-nav-gradient {
          background: linear-gradient(90deg, rgba(170,17,221,1) 0%, rgba(19,212,245,1) 100%) !important;
        }

        .brand-cursive {
          font-family: 'Charmonman', cursive !important;
          font-size: 1.5rem;
        }

        /* Titres */
        .admin-title-cursive {
          font-family: 'Charmonman', cursive !important;
          color: #AA11DD;
          border-bottom: 3px solid #13D4F5;
          display: inline-block;
          padding-bottom: 10px;
        }

        .badge-s3 {
          background-color: #e3faff;
          color: #0b7c8f;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: bold;
        }

        /* Cards */
        .admin-card {
          border-radius: 20px !important;
          background: white;
        }

        .admin-card-header {
          background: #AA11DD;
          color: white;
        }

        /* Zone d'upload interactive */
        .upload-zone-styled {
          cursor: pointer;
        }

        .zone-content {
          border: 3px dashed #13D4F5;
          background-color: #f8fdff;
          transition: all 0.3s ease;
        }

        .zone-content:hover {
          background-color: #eefbff;
          border-color: #AA11DD;
          transform: translateY(-2px);
        }

        /* Inputs et Boutons */
        .admin-input {
          border: 2px solid #eee !important;
          border-radius: 12px !important;
          font-family: sans-serif; /* Plus lisible pour la saisie */
        }

        .admin-input:focus {
          border-color: #13D4F5 !important;
          box-shadow: 0 0 10px rgba(19, 212, 245, 0.2) !important;
        }

        .btn-admin-action {
          background-color: #AA11DD;
          color: white;
          border: none;
          border-radius: 12px;
          transition: all 0.3s;
        }

        .btn-admin-action:hover {
          background-color: #8e0eba;
          color: white;
          transform: scale(1.02);
          box-shadow: 0 5px 15px rgba(170, 17, 221, 0.3);
        }

        .empty-state-icon {
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;