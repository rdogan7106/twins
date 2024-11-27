import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Burada form gönderme işlemi yapılabilir (API çağrısı vb.)
    alert('Message Sent!');
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div>
        <label>Your Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Your Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Subject</label>
        <input type="text" name="subject" value={formData.subject} onChange={handleChange} />
      </div>
      <div>
        <label>Message</label>
        <textarea name="message" value={formData.message} onChange={handleChange} required></textarea>
      </div>
      <button type="submit">Send Message</button>
    </form>
  );
};

export default ContactForm;
