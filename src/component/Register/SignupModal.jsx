import React, { useState } from 'react';
import './SignupModal.css';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';
import { toast } from 'react-toastify';

const SignupModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    dob: '',
    street: '',
    houseNumber: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    securityQuestion: '',
    securityAnswer: '',
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("No user is logged in.");
        return;
      }
  
      const userId = user.uid;
      const encryptedAnswer = btoa(formData.securityAnswer);
  
      // Prepare Firestore Data
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        dob: formData.dob,
        billingAddress: {
          houseNumber: formData.houseNumber,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        },
        securityQuestion: formData.securityQuestion,
        securityAnswer: encryptedAnswer,
      });
  
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Complete Your Profile</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Date of Birth
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </label>

          <h2>Billing Address ↓</h2>
          {['houseNumber', 'street', 'city', 'state', 'zip', 'country'].map((field) => (
            <label key={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
              <input
                type="text"
                name={field}
                placeholder={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </label>
          ))}

          <h2>Security Questions ↓</h2>
          <label>
            Select a Security Question
            <select
              name="securityQuestion"
              value={formData.securityQuestion}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select a question</option>
              <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
              <option value="What was the name of your first pet?">What was the name of your first pet?</option>
              <option value="What was your first car?">What was your first car?</option>
              <option value="What elementary school did you attend?">What elementary school did you attend?</option>
              <option value="In what city were you born?">In what city were you born?</option>
            </select>
          </label>
          <label>
            Answer
            <input
              type="text"
              name="securityAnswer"
              placeholder="Answer"
              value={formData.securityAnswer}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="sign-in-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
