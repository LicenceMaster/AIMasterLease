import React, { useState } from "react";

const PartyInfoForm = ({ onNext }) => {
  const [landlord, setLandlord] = useState({ name: "", phone: "", email: "" });
  const [tenant, setTenant] = useState({ name: "", phone: "", email: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ landlord, tenant });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Landlord Information</h2>
      <input placeholder="Full Name" value={landlord.name} onChange={e => setLandlord({ ...landlord, name: e.target.value })} required />
      <input placeholder="Phone" value={landlord.phone} onChange={e => setLandlord({ ...landlord, phone: e.target.value })} required />
      <input placeholder="Email" value={landlord.email} onChange={e => setLandlord({ ...landlord, email: e.target.value })} />

      <h2>Tenant Information</h2>
      <input placeholder="Full Name" value={tenant.name} onChange={e => setTenant({ ...tenant, name: e.target.value })} required />
      <input placeholder="Phone" value={tenant.phone} onChange={e => setTenant({ ...tenant, phone: e.target.value })} required />
      <input placeholder="Email" value={tenant.email} onChange={e => setTenant({ ...tenant, email: e.target.value })} />

      <button type="submit" style={{marginTop: 16}}>Next</button>
    </form>
  );
};

export default PartyInfoForm;