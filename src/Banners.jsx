import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  getDocs,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { db } from "./firebaseConfig"; // adjust path to your firebase config
import { useAuth } from "./AuthContext";
import './Banners.css';

const BannersList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { permissions } = useAuth();

  useEffect(() => {
    fetchBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "banners"));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setBanners(data);
    } catch (err) {
      console.error("Error fetching banners:", err);
      alert("Failed to load banners. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/updatebanner/${id}`);
  };

  const handleDelete = async (id) => {
    if (!permissions.includes('delete_banner')) {
      alert("You don't have the necessary permission to delete a banner");
      return;
    }
    const ok = window.confirm("Are you sure you want to delete this banner?");
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "banners", id));
      // refresh list after delete
      setBanners(prev => prev.filter(b => b.id !== id));
      alert("Banner deleted successfully");
    } catch (err) {
      console.error("Error deleting banner:", err);
      alert("Failed to delete banner. See console.");
    }
  };

  return (
    <div className="banners-list">
      <div className="banners-header">
        <h2>Banners</h2>
        <button type="button" className="add-btn" onClick={() => navigate('/addbanner')}>Add Banner</button>
      </div>

      {loading ? (
        <p>Loading banners…</p>
      ) : (
        <table className="banners-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Thumbnail</th>
              <th>Type</th>
              <th>Alt Tag</th>
              <th>Redirect URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map(b => (
              <tr key={b.id}>
                <td className="id-col">{b.id}</td>
                <td className="name-col">{b.name || '—'}</td>
                <td className="thumb-col">
                  {b.bannerUrl ? (
                    <img src={b.bannerUrl} alt={b.altTag || b.name} className="banner-thumb" />
                  ) : (
                    <span className="no-thumb">—</span>
                  )}
                </td>
                <td className="type-col">{b.type || '—'}</td>
                <td className="alt-col">{b.altTag || '—'}</td>
                <td className="redirect-col">
                  {b.redirectUrl ? (
                    <a href={b.redirectUrl} target="_blank" rel="noreferrer" className="redirect-link">{b.redirectUrl}</a>
                  ) : '—'}
                </td>
                <td className="actions-col">
                  <button className="action-btn update-btn" onClick={() => handleUpdate(b.id)}>Update</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(b.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 20 }}>No banners found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BannersList;