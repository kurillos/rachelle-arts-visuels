import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#AA11DD', '#13D4F5', '#a855f7', '#06b6d4', '#8b5cf6'];

const fetchOpts = {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    credentials: 'include' as RequestCredentials,
};

export default function Stats({ auth }: { auth: any }) {
    const [summary, setSummary]     = useState<any>(null);
    const [pageviews, setPageviews] = useState<any[]>([]);
    const [pages, setPages]         = useState<any[]>([]);
    const [devices, setDevices]     = useState<any[]>([]);
    const [countries, setCountries] = useState<any[]>([]);
    const [loading, setLoading]     = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [s, pv, pg, dv, co] = await Promise.all([
                    fetch('/api/stats/summary',   fetchOpts).then(r => r.json()),
                    fetch('/api/stats/pageviews', fetchOpts).then(r => r.json()),
                    fetch('/api/stats/pages',     fetchOpts).then(r => r.json()),
                    fetch('/api/stats/devices',   fetchOpts).then(r => r.json()),
                    fetch('/api/stats/countries', fetchOpts).then(r => r.json()),
                ]);
                setSummary(s);
                setPageviews((pv.pageviews || []).map((d: any) => ({
                    date: new Date(d.x).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
                    vues: d.y,
                    visiteurs: (pv.sessions || []).find((s: any) => s.x === d.x)?.y || 0,
                })));
                setPages(Array.isArray(pg) ? pg.slice(0, 8) : []);
                setDevices(Array.isArray(dv) ? dv.map((d: any) => ({ name: d.x, value: d.y })) : []);
                setCountries(Array.isArray(co) ? co.slice(0, 8) : []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const StatCard = ({ label, value, sub }: { label: string; value: any; sub?: string }) => (
        <div className="col-md-3 col-6 mb-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                <div className="card-body text-center py-4">
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#AA11DD' }}>
                        {value ?? '—'}
                    </div>
                    <div className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>{label}</div>
                    {sub && <small className="text-muted">{sub}</small>}
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Statistiques" />
            <div className="container py-4">
                <h1 className="admin-title-cursive display-5 mb-4">Statistiques du site</h1>
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: '#AA11DD' }} />
                        <p className="mt-3 text-muted">Chargement des statistiques…</p>
                    </div>
                ) : (
                    <>
                        <div className="row mb-4">
                            <StatCard label="Pages vues (30j)"  value={summary?.pageviews?.value?.toLocaleString('fr-FR')} />
                            <StatCard label="Visiteurs (30j)"   value={summary?.visitors?.value?.toLocaleString('fr-FR')} />
                            <StatCard label="Visites (30j)"     value={summary?.visits?.value?.toLocaleString('fr-FR')} />
                            <StatCard label="Taux de rebond"    value={summary?.bounces?.value ? `${Math.round(summary.bounces.value)}%` : '—'} />
                        </div>

                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4" style={{ color: '#AA11DD' }}>
                                    Pages vues & visiteurs — 30 derniers jours
                                </h5>
                                <ResponsiveContainer width="100%" height={280}>
                                    <LineChart data={pageviews}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="vues"      stroke="#AA11DD" strokeWidth={2} dot={false} name="Pages vues" />
                                        <Line type="monotone" dataKey="visiteurs" stroke="#13D4F5" strokeWidth={2} dot={false} name="Visiteurs" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                                    <div className="card-body p-4">
                                        <h5 className="fw-bold mb-4" style={{ color: '#AA11DD' }}>Top pages</h5>
                                        {pages.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart data={pages} layout="vertical">
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis type="number" tick={{ fontSize: 11 }} />
                                                    <YAxis type="category" dataKey="x" width={120} tick={{ fontSize: 10 }} />
                                                    <Tooltip />
                                                    <Bar dataKey="y" fill="#AA11DD" radius={[0, 6, 6, 0]} name="Vues" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : <p className="text-muted">Aucune donnée</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 mb-4">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                                    <div className="card-body p-4">
                                        <h5 className="fw-bold mb-4" style={{ color: '#AA11DD' }}>Appareils</h5>
                                        {devices.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={250}>
                                                <PieChart>
                                                    <Pie data={devices} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name"
                                                        label={({ name, percent }: any) => `${name ?? ''} ${Math.round((percent ?? 0) * 100)}%`}
                                                        labelLine={false}>
                                                        {devices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : <p className="text-muted">Aucune donnée</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 mb-4">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                                    <div className="card-body p-4">
                                        <h5 className="fw-bold mb-4" style={{ color: '#AA11DD' }}>Pays</h5>
                                        {countries.length > 0 ? (
                                            <div style={{ maxHeight: 250, overflowY: 'auto' }}>
                                                {countries.map((c, i) => (
                                                    <div key={i} className="d-flex justify-content-between align-items-center mb-2">
                                                        <span style={{ fontSize: '0.9rem' }}>🌍 {c.x}</span>
                                                        <span className="badge" style={{ background: '#AA11DD', borderRadius: 20 }}>{c.y}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : <p className="text-muted">Aucune donnée</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}