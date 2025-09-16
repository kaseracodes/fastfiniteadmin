// src/UpdateBanner.jsx
import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebaseConfig"; // adjust path if needed
import "./UpdateVehicle.css"; // reuse existing CSS you already have

const UpdateBanner = () => {
  const { id } = useParams(); // banner id from route
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const ref = doc(db, "banners", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          alert("Banner not found");
          navigate("/banners");
          return;
        }
        const data = snap.data();
        setInitialValues({
          type: data.type || "homepage_top",
          name: data.name || "",
          altTag: data.altTag || "",
          redirectUrl: data.redirectUrl || "",
          bannerFile: null, // local file placeholder
          _storagePath: data.storagePath || "", // keep storage path for possible deletion
          _currentBannerUrl: data.bannerUrl || "",
        });
        setPreviewUrl(data.bannerUrl || "");
      } catch (err) {
        console.error("Error fetching banner:", err);
        alert("Failed to load banner. See console.");
        navigate("/banners");
      }
    };

    fetchBanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const uploadImage = async (file, filenamePrefix = "banner") => {
    const filename = `${Date.now()}_${filenamePrefix}_${file.name}`.replace(/\s+/g, "_");
    const path = `banners/${filename}`;
    const r = storageRef(storage, path);
    await uploadBytes(r, file);
    const url = await getDownloadURL(r);
    return { downloadUrl: url, storagePath: path };
  };

  const handleSubmit = async (values) => {
    try {
      setUploading(true);

      const updates = {
        type: values.type,
        name: values.name,
        altTag: values.altTag || "",
        redirectUrl: values.redirectUrl || "",
        updatedAt: serverTimestamp(),
      };

      // If a new file is chosen, upload it and update bannerUrl + storagePath
      if (values.bannerFile) {
        const { downloadUrl, storagePath } = await uploadImage(values.bannerFile, values.name || "banner");
        updates.bannerUrl = downloadUrl;
        updates.storagePath = storagePath;

        // delete old storage file (best-effort)
        if (initialValues?._storagePath) {
          try {
            await deleteObject(storageRef(storage, initialValues._storagePath));
          } catch (err) {
            console.warn("Failed to delete old banner file:", err);
            // not fatal
          }
        }
      }

      // perform update
      await updateDoc(doc(db, "banners", id), updates);

      alert("Banner updated successfully");
      navigate("/banners");
    } catch (err) {
      console.error("Error updating banner:", err);
      alert("Failed to update banner. See console.");
    } finally {
      setUploading(false);
    }
  };

  if (!initialValues) return <div style={{ padding: 24 }}>Loading banner…</div>;

  return (
    <div className="admin-panel-container" style={{ width: "60%", marginTop: 24 }}>
      <h1 style={{ textAlign: "center" }}>Update Banner</h1>

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ setFieldValue, values, isSubmitting }) => (
          <Form>
            <div className="identification-location">
              <h2>Banner Details</h2>

              <div className="form-group type-group">
                <label htmlFor="type">Type</label>
                <Field as="select" name="type">
                  <option value="homepage_top">Homepage Top</option>
                  <option value="homepage_mid">Homepage Mid</option>
                  <option value="vehicles">Vehicles Page</option>
                  <option value="promo_strip">Promo Strip</option>
                </Field>
              </div>

              <div className="form-group name-group">
                <label htmlFor="name">Name</label>
                <Field name="name" type="text" />
              </div>

              <div className="form-group alt-tag-group">
                <label htmlFor="altTag">Alt Tag</label>
                <Field name="altTag" type="text" />
              </div>

              <div className="form-group redirect-group">
                <label htmlFor="redirectUrl">Redirect URL (optional)</label>
                <Field name="redirectUrl" type="text" placeholder="https://..." />
              </div>

              <div className="form-group image-group">
                <label htmlFor="bannerFile">Replace Banner Image (optional)</label>
                <input
                  id="bannerFile"
                  name="bannerFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0] || null;
                    setFieldValue("bannerFile", file);
                    if (file) {
                      const localPreview = URL.createObjectURL(file);
                      setPreviewUrl(localPreview);
                    } else {
                      setPreviewUrl(initialValues._currentBannerUrl || "");
                    }
                  }}
                />
                {previewUrl && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Preview</div>
                    <img src={previewUrl} alt="banner preview" style={{ width: "100%", maxWidth: 560, height: "auto", borderRadius: 6, objectFit: "cover" }} />
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
              <button type="button" className="submit-btn" onClick={() => navigate("/banners")} disabled={uploading}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={isSubmitting || uploading}>
                {uploading || isSubmitting ? "Saving…" : "Update Banner"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdateBanner;