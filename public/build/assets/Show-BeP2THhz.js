import{j as e}from"./app-B9MpKsul.js";import{a as d,H as A,L as P,b as R,r as S}from"./inertia-vendor-DQDtisbi.js";import{A as F,U as H,E as V}from"./AuthenticatedLayout--oFXowT6.js";import{s as N}from"./index-BsxvijQw.js";import{C as $,M as v}from"./message-square-i1N6HPhX.js";import{C as B}from"./calendar-CDgLAEKD.js";import{c as p}from"./createLucideIcon-Cn1Wg9O6.js";import{C as G}from"./cloud-upload-BQUgKIvC.js";import{L as X}from"./loader-circle-S3V5PDo0.js";import{C as Y}from"./circle-check-big-DyjmU59k.js";import{H as k}from"./heart-B8vS0pm7.js";import{X as W}from"./x-BdXZWyPt.js";import{C as J}from"./chevron-right-COVr6zzX.js";import"./react-vendor-Y7T1HomI.js";/* empty css            *//**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],O=p("circle-x",K);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]],T=p("download",Q);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],ee=p("layers",Z);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]],te=p("share-2",se);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=[["path",{d:"M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",key:"2acyp4"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],ne=p("square-check-big",ae);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]],le=p("timer",ie),x={color:"#00e5ff",bgLight:"rgba(0, 229, 255, 0.1)",border:"2px dashed #00e5ff",progressBg:"#00e5ff"};function Ne({auth:U,gallery:t}){const[o,C]=d.useState(!1),[i,h]=d.useState(null),l=o?t.photos.filter(s=>s.is_selected):t.photos,I=s=>h(s),u=()=>h(null),g=d.useCallback(()=>{i!==null&&h((i-1+l.length)%l.length)},[i,l.length]),f=d.useCallback(()=>{i!==null&&h((i+1)%l.length)},[i,l.length]);d.useEffect(()=>{if(i===null)return;const s=n=>{n.key==="ArrowLeft"&&g(),n.key==="ArrowRight"&&f(),n.key==="Escape"&&u()};return window.addEventListener("keydown",s),()=>window.removeEventListener("keydown",s)},[i,g,f]);const[a,b]=d.useState({isUploading:!1,filesToUpload:[],currentIndex:0,successCount:0,errorCount:0}),j=d.useRef(null),D=async s=>{const n=Array.from(s.target.files||[]);if(n.length===0)return;b({isUploading:!0,filesToUpload:n,currentIndex:0,successCount:0,errorCount:0});let m=0,z=0;for(let c=0;c<n.length;c++){b(y=>({...y,currentIndex:c}));const L=new FormData;L.append("photo",n[c]);try{await R.post(N("admin.galleries.upload",t.id),L,{headers:{"Content-Type":"multipart/form-data"}}),m++}catch(y){console.error(`Erreur photo ${n[c].name}`,y),z++}}b(c=>({...c,isUploading:!1,successCount:m,errorCount:z,currentIndex:n.length})),S.reload({only:["gallery"]}),j.current&&(j.current.value="")},w=t.photos.filter(s=>s.is_selected).length,_=t.photos.filter(s=>s.client_comment).length,E=()=>t.expires_at?Math.max(0,Math.ceil((new Date(t.expires_at).getTime()-Date.now())/864e5)):0,M=()=>{navigator.clipboard.writeText(`${window.location.origin}/client/gallery/${t.slug}`),alert("Lien copié !")},q=()=>{confirm(`Valider la sélection de ${w} photo(s) pour ${t.client_name} ?`)&&S.post(N("admin.galleries.send",t.id))},r=i!==null?l[i]:null;return e.jsxs(F,{auth:U,children:[e.jsx(A,{title:`Galerie - ${t.title}`}),e.jsxs("div",{className:"admin-show-gallery",children:[e.jsx("div",{className:"mb-4",children:e.jsxs(P,{href:N("admin.galleries.index"),className:"text-muted text-decoration-none d-flex align-items-center small",children:[e.jsx($,{size:16,className:"me-1"})," Retour aux galeries"]})}),e.jsx("div",{className:"card admin-card border-0 shadow-sm mb-5",children:e.jsx("div",{className:"card-body p-4 p-md-5",children:e.jsxs("div",{className:"row align-items-center",children:[e.jsxs("div",{className:"col-lg-8",children:[e.jsx("h1",{className:"admin-title-cursive h2 text-purple mb-3",children:t.title}),e.jsxs("div",{className:"d-flex flex-wrap gap-4 text-muted small",children:[e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx(H,{size:16,className:"me-2 text-purple"}),t.client_name||"Client inconnu"]}),e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx(B,{size:16,className:"me-2 text-purple"}),t.event_date?new Date(t.event_date).toLocaleDateString():"Date non définie"]}),e.jsxs("div",{className:"d-flex align-items-center text-purple fw-bold",children:[e.jsx(ee,{size:16,className:"me-2"}),t.photos.length," photos"]}),e.jsxs("div",{className:"d-flex align-items-center text-danger fw-bold bg-danger-light px-2 py-1 rounded",children:[e.jsx(le,{size:16,className:"me-2"}),t.expires_at?e.jsxs(e.Fragment,{children:["Expire le ",new Date(t.expires_at).toLocaleDateString()," ",e.jsxs("span",{className:"ms-1",children:["(",E()," j. restants)"]})]}):"Pas d'expiration"]})]})]}),e.jsxs("div",{className:"col-lg-4 text-lg-end mt-4 mt-lg-0 d-flex flex-wrap gap-2 justify-content-lg-end",children:[w>0&&e.jsxs("button",{onClick:q,className:"btn btn-success d-flex align-items-center gap-2",children:[e.jsx(ne,{size:18})," Valider Sélection"]}),e.jsxs("button",{onClick:M,className:"btn btn-outline-purple",children:[e.jsx(te,{size:18,className:"me-2"})," Partager"]}),e.jsxs("a",{href:`/client/gallery/${t.slug}`,target:"_blank",className:"btn btn-admin-action",children:[e.jsx(V,{size:18,className:"me-2"})," Aperçu"]})]})]})})}),e.jsxs("div",{className:"row g-4",children:[e.jsx("div",{className:"col-lg-4",children:e.jsx("div",{className:"card border-0 shadow-sm rounded-4 h-100 bg-white",children:e.jsxs("div",{className:"card-body p-4 text-center",children:[e.jsx("h5",{className:"fw-bold mb-4",children:"Uploader des photos"}),a.isUploading?e.jsxs("div",{className:"p-4 rounded-4 bg-light",children:[e.jsx(X,{size:40,className:"spin mb-3 mx-auto",style:{color:x.color}}),e.jsx("h6",{className:"fw-bold mb-1",children:"Traitement en cours..."}),e.jsxs("div",{className:"d-flex justify-content-between small fw-bold mt-4 mb-2",children:[e.jsx("span",{className:"text-muted text-truncate",style:{maxWidth:"70%"},children:a.filesToUpload[a.currentIndex]?.name}),e.jsxs("span",{style:{color:x.color},children:[a.currentIndex," / ",a.filesToUpload.length]})]}),e.jsx("div",{className:"progress",style:{height:"12px",borderRadius:"10px"},children:e.jsx("div",{className:"progress-bar progress-bar-striped progress-bar-animated",style:{width:`${a.currentIndex/a.filesToUpload.length*100}%`,backgroundColor:x.progressBg}})})]}):e.jsxs("label",{className:"d-block p-5 rounded-4 pointer",style:{backgroundColor:x.bgLight,border:x.border},children:[e.jsx("input",{type:"file",multiple:!0,accept:"image/jpeg,image/png,image/webp",className:"d-none",onChange:D,ref:j}),e.jsx(G,{size:48,style:{color:x.color},className:"mb-3 mx-auto"}),e.jsx("h6",{className:"fw-bold text-dark",children:"Glissez les photos ici"}),e.jsx("p",{className:"small text-muted mb-0",children:"Traitement asynchrone sécurisé"})]}),a.filesToUpload.length>0&&!a.isUploading&&e.jsxs("div",{className:"mt-4 p-3 rounded-3 bg-light text-start small",children:[e.jsx("div",{className:"fw-bold mb-2",children:"Dernier transfert :"}),e.jsxs("div",{className:"text-success d-flex align-items-center mb-1",children:[e.jsx(Y,{size:14,className:"me-2"})," ",a.successCount," réussies"]}),a.errorCount>0&&e.jsxs("div",{className:"text-danger d-flex align-items-center",children:[e.jsx(O,{size:14,className:"me-2"})," ",a.errorCount," échecs"]})]})]})})}),e.jsxs("div",{className:"col-lg-8",children:[e.jsx("div",{className:"d-flex justify-content-between align-items-center mb-4",children:e.jsxs("div",{className:"btn-group bg-white shadow-sm p-1 rounded-3",children:[e.jsx("button",{onClick:()=>C(!1),className:`btn btn-sm px-4 ${o?"btn-light":"btn-purple text-white shadow-sm"}`,children:"Toutes les photos"}),e.jsxs("button",{onClick:()=>C(!0),className:`btn btn-sm px-4 d-flex align-items-center gap-2 ${o?"btn-purple text-white shadow-sm":"btn-light"}`,children:[e.jsx(k,{size:14,fill:o?"white":"none",stroke:o?"white":"currentColor"}),"Sélection (",w,")",_>0&&e.jsxs("span",{className:`badge rounded-pill ${o?"bg-white text-purple":"bg-info text-white"}`,style:{fontSize:"0.65rem"},children:[e.jsx(v,{size:10,className:"me-1"}),_]})]})]})}),e.jsx("div",{className:"row g-3",children:l.length>0?l.map((s,n)=>e.jsx("div",{className:"col-6 col-md-4",children:e.jsxs("div",{className:`admin-photo-card rounded-4 shadow-sm overflow-hidden border-0 h-100 ${s.is_selected?"admin-selected-ring":""}`,style:{cursor:"pointer"},onClick:()=>I(n),children:[e.jsxs("div",{className:"position-relative",children:[e.jsx("div",{style:{aspectRatio:"3/4",overflow:"hidden",background:"#f0f0f0"},children:e.jsx("img",{src:s.full_url,alt:s.title,className:"w-100 h-100 object-fit-cover",onError:m=>{m.currentTarget.src=`https://placehold.co/400x533/f3f0ff/6366f1?text=${s.id}`}})}),e.jsxs("div",{className:"position-absolute top-0 end-0 m-2 d-flex flex-column gap-1",children:[s.is_selected&&e.jsx("span",{className:"admin-badge-heart",children:e.jsx(k,{size:12,fill:"white",stroke:"white"})}),s.client_comment&&e.jsx("span",{className:"admin-badge-comment",title:s.client_comment,children:e.jsx(v,{size:12,fill:"white",stroke:"white"})})]}),s.client_comment&&e.jsx("div",{className:"position-absolute bottom-0 start-0 end-0 px-2 py-1",style:{background:"linear-gradient(transparent, rgba(0,0,0,0.6))"},children:e.jsxs("p",{className:"small text-white mb-0 text-truncate",style:{fontSize:"0.7rem",fontStyle:"italic"},children:["💬 ",s.client_comment]})})]}),e.jsxs("div",{className:"p-2 bg-white border-top d-flex justify-content-between align-items-center",children:[e.jsx("p",{className:"small fw-bold mb-0 text-truncate text-dark",style:{fontSize:"0.72rem"},title:s.title,children:s.title}),e.jsx("a",{href:s.full_url,target:"_blank",rel:"noreferrer",className:"btn btn-link btn-sm p-0 text-purple ms-2",onClick:m=>m.stopPropagation(),title:"Télécharger",children:e.jsx(T,{size:14})})]})]})},s.id)):e.jsx("div",{className:"col-12 text-center py-5 bg-white rounded-4 shadow-sm",children:e.jsx("p",{className:"text-muted mb-0",children:o?"Le client n'a pas encore fait de sélection.":"Aucune photo dans cette galerie."})})})]})]})]}),r&&e.jsxs("div",{className:"carousel-overlay",onClick:u,children:[e.jsx("button",{className:"carousel-close",onClick:u,children:e.jsx(W,{size:28})}),e.jsx("button",{className:"carousel-nav carousel-prev",onClick:s=>{s.stopPropagation(),g()},children:e.jsx($,{size:36})}),e.jsxs("div",{className:"carousel-content",onClick:s=>s.stopPropagation(),children:[e.jsx("img",{src:r.full_url,className:"carousel-img",alt:r.title}),e.jsxs("div",{className:"carousel-toolbar",children:[e.jsxs("div",{className:"d-flex align-items-center gap-3",children:[e.jsxs("span",{className:"text-white small opacity-75",children:[i+1," / ",l.length]}),e.jsx("span",{className:"text-white small fw-bold",children:r.title})]}),e.jsxs("div",{className:"d-flex gap-2 align-items-center",children:[r.is_selected&&e.jsxs("span",{className:"badge bg-purple-solid d-flex align-items-center gap-1 px-3 py-2",children:[e.jsx(k,{size:14,fill:"white",stroke:"white"})," Sélectionné"]}),r.client_comment&&e.jsxs("span",{className:"badge bg-info d-flex align-items-center gap-1 px-3 py-2",title:r.client_comment,children:[e.jsx(v,{size:14})," ",r.client_comment]}),e.jsxs("a",{href:r.full_url,target:"_blank",rel:"noreferrer",className:"btn btn-light btn-sm rounded-pill px-3 d-flex align-items-center gap-2",children:[e.jsx(T,{size:14})," Télécharger"]})]})]})]}),e.jsx("button",{className:"carousel-nav carousel-next",onClick:s=>{s.stopPropagation(),f()},children:e.jsx(J,{size:36})})]}),e.jsx("style",{children:`
                .btn-purple { background-color:#a855f7; color:white; border:none; }
                .btn-purple:hover { background-color:#9333ea; color:white; }
                .btn-outline-purple { border:1px solid #a855f7; color:#a855f7; background:transparent; }
                .btn-outline-purple:hover { background:#a855f7; color:white; }
                .bg-purple-solid { background-color:#a855f7 !important; }

                /* Carte photo style client dans l'admin */
                .admin-photo-card { background:white; transition:transform 0.2s ease, box-shadow 0.2s ease; }
                .admin-photo-card:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(168,85,247,0.18)!important; }
                .admin-selected-ring { outline:3px solid #a855f7; outline-offset:-3px; }

                /* Petits badges ronds (style client) */
                .admin-badge-heart {
                    display:inline-flex; align-items:center; justify-content:center;
                    width:26px; height:26px; border-radius:50%;
                    background:#ef4444; box-shadow:0 2px 6px rgba(0,0,0,0.3);
                }
                .admin-badge-comment {
                    display:inline-flex; align-items:center; justify-content:center;
                    width:26px; height:26px; border-radius:50%;
                    background:#0ea5e9; box-shadow:0 2px 6px rgba(0,0,0,0.3);
                }

                .spin { animation:spin 1s linear infinite; }
                @keyframes spin { to { transform:rotate(360deg); } }

                /* Lightbox */
                .carousel-overlay {
                    position:fixed; inset:0;
                    background:rgba(0,0,0,0.93);
                    display:flex; align-items:center; justify-content:center;
                    z-index:3000; animation:fadeIn 0.2s ease;
                }
                @keyframes fadeIn { from{opacity:0} to{opacity:1} }
                .carousel-close {
                    position:absolute; top:16px; right:20px;
                    background:rgba(255,255,255,0.15); color:white; border:none;
                    border-radius:50%; width:48px; height:48px;
                    display:flex; align-items:center; justify-content:center;
                    cursor:pointer; transition:background 0.2s; z-index:10;
                }
                .carousel-close:hover { background:rgba(255,255,255,0.3); }
                .carousel-nav {
                    position:absolute; top:50%; transform:translateY(-50%);
                    background:rgba(255,255,255,0.12); color:white; border:none;
                    border-radius:50%; width:56px; height:56px;
                    display:flex; align-items:center; justify-content:center;
                    cursor:pointer; transition:background 0.2s; z-index:10;
                }
                .carousel-nav:hover { background:rgba(255,255,255,0.28); }
                .carousel-prev { left:16px; }
                .carousel-next { right:16px; }
                .carousel-content {
                    display:flex; flex-direction:column; align-items:center;
                    max-height:90vh; max-width:calc(100vw - 160px);
                }
                .carousel-img {
                    max-height:82vh; max-width:100%;
                    object-fit:contain; border-radius:12px; display:block;
                }
                .carousel-toolbar {
                    display:flex; align-items:center; justify-content:space-between;
                    width:100%; padding:12px 4px 0; flex-wrap:wrap; gap:8px;
                }
            `})]})}export{Ne as default};
