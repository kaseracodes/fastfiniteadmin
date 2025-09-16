import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { v4 as uuidv4 } from "uuid";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebaseConfig"; // adjust path if needed
import "./AddVehicle.css"; // reuse your admin styles (you provided earlier)

const AddBanner = ({ existingBanner = null, onDone = () => {} }) => {
  const [imageUrl, setImageUrl] = useState(existingBanner?.bannerUrl || "");
  const [uploading, setUploading] = useState(false);

  const initialValues = {
    type: existingBanner?.type || "",
    name: existingBanner?.name || "",
    altTag: existingBanner?.altTag || "",
    redirectUrl: existingBanner?.redirectUrl || "",
    bannerFile: null, // used only locally by Formik
  };

  // Upload image to storage and return download URL + storagePath
  const uploadBannerImage = async (file, filenamePrefix = "banner") => {
    const filename = `${Date.now()}_${filenamePrefix}_${file.name}`.replace(/\s+/g, "_");
    const path = `banners/${filename}`;
    const r = storageRef(storage, path);
    await uploadBytes(r, file);
    const url = await getDownloadURL(r);
    return { downloadUrl: url, storagePath: path };
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      setUploading(true);

      // if user selected a new file, upload it and get the URL
      let bannerUrl = imageUrl;
      let storagePath = existingBanner?.storagePath || null;
      if (values.bannerFile) {
        const { downloadUrl, storagePath: sp } = await uploadBannerImage(values.bannerFile, values.name || "banner");
        bannerUrl = downloadUrl;
        storagePath = sp;
      }

      // require name and bannerUrl (if you want bannerUrl optional remove check)
      if (!values.name) {
        alert("Please provide a name for the banner.");
        return;
      }
      if (!bannerUrl) {
        alert("Please upload a banner image.");
        return;
      }

      // build payload
      const id = existingBanner?.id || uuidv4();
      const payload = {
        id,
        type: values.type,
        bannerUrl,
        storagePath: storagePath || "",
        name: values.name,
        altTag: values.altTag || "",
        redirectUrl: values.redirectUrl || "",
        hasButton: !!values.redirectUrl,
        priority: existingBanner?.priority ?? 0,
        createdAt: existingBanner?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // write to Firestore (setDoc ensures upsert)
      await setDoc(doc(collection(db, "banners"), id), payload);

      alert(`Banner ${existingBanner ? "updated" : "created"} successfully.`);
      resetForm();
      setImageUrl("");
      onDone(); // callback for parent (optional)
    } catch (err) {
      console.error("Error saving banner:", err);
      alert("Failed to save banner. See console for details.");
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-panel-container" style={{ width: "60%", marginTop: 24 }}>
      <h1 style={{ textAlign: "center" }}>{existingBanner ? "Update Banner" : "Add New Banner"}</h1>

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ setFieldValue, values, isSubmitting }) => (
          <Form>
            <div className="identification-location">
              <h2>Banner Details</h2>

              <div className="form-group type-group">
  <label htmlFor="type">Type</label>
  <Field as="select" name="type">
    <option value="" disabled>
      Select Banner Type
    </option>
    <option value="homepage_top">Homepage Top</option>
    <option value="homepage_mid">Homepage Mid</option>
    <option value="about_us_page">About Us Page</option>
    <option value="tours_travels_top">Tours & Travels Top</option>
    <option value="tours_travels_mid">Tours & Travels Mid</option>
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
                <label htmlFor="bannerFile">Banner Image {existingBanner ? "(leave empty to keep existing)" : ""}</label>
                <input
                  id="bannerFile"
                  name="bannerFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0] || null;
                    setFieldValue("bannerFile", file);
                    if (file) {
                      // quick preview via local URL
                      const preview = URL.createObjectURL(file);
                      setImageUrl(preview);
                    }
                  }}
                />
                {imageUrl && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Preview</div>
                    <img src={imageUrl} alt="preview" style={{ width: "100%", maxWidth: 560, height: "auto", borderRadius: 6, objectFit: "cover" }} />
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={isSubmitting || uploading}>
              {uploading || isSubmitting ? (existingBanner ? "Saving..." : "Uploading...") : (existingBanner ? "Update Banner" : "Add Banner")}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddBanner;