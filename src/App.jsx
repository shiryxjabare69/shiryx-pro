import React, { useState } from 'react'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [inputUser, setInputUser] = useState('')
  const [inputPass, setInputPass] = useState('')

  const [savedUser, setSavedUser] = useState(() => localStorage.getItem('adminUser') || 'shiryx')
  const [savedPass, setSavedPass] = useState(() => localStorage.getItem('adminPass') || 'shiryx2026')

  // Client form sathi states
  const [showClientForm, setShowClientForm] = useState(false)
  const [clientData, setClientData] = useState({
    indexNo: '', clientName: '', mobile: '', email: '', address: '', packageName: 'Basic', totalPayment: ''
  })

  const handleLogin = (e) => {
    e.preventDefault()
    if (inputUser === savedUser && inputPass === savedPass) {
      setIsLoggedIn(true)
    } else {
      alert('Username kiva Password chuklay bhau!')
    }
  }

  const handleClientFormChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value })
  }

  const submitClientForm = (e) => {
    e.preventDefault()
    document.getElementById('code-upload').click() // Form bharlyavar direct file ughdel
  }

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    // Jar code (client website) asel tar form chi mahiti pan pathav
    if (type === 'code') {
      Object.keys(clientData).forEach(key => formData.append(key, clientData[key]));
    }

    try {
      const response = await fetch(`http://localhost:5000/upload/${type}`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      alert("🔥 " + data.message + "\n\nLive Link:\n" + data.link);
      
      if(type === 'code') {
        setShowClientForm(false); // form band kar
        setClientData({indexNo: '', clientName: '', mobile: '', email: '', address: '', packageName: 'Basic', totalPayment: ''}); // form rikam kar
      }
      
    } catch (error) {
      alert("Error aala bhau! Backend server chalu ahe ka check kar.");
    } finally {
      event.target.value = null; 
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white/[0.02] border border-white/10 text-center">
          <h1 className="text-3xl font-bold mb-8">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" value={inputUser} onChange={(e) => setInputUser(e.target.value)} placeholder="Username" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white" />
            <input type="password" value={inputPass} onChange={(e) => setInputPass(e.target.value)} placeholder="Password" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white" />
            <button type="submit" className="w-full rounded-xl bg-white text-black px-6 py-3 font-bold">Unlock ➔</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 relative">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">SHIRYX Pro Dashboard</h1>

      {/* Client Form Modal */}
      {showClientForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] p-8 rounded-2xl border border-white/10 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Navin Client Mahiti</h2>
            <form onSubmit={submitClientForm} className="space-y-3">
              <input type="text" name="indexNo" value={clientData.indexNo} onChange={handleClientFormChange} placeholder="Index No (e.g. 001)" className="w-full bg-black border border-white/20 p-2 rounded" required />
              <input type="text" name="clientName" value={clientData.clientName} onChange={handleClientFormChange} placeholder="Client Name" className="w-full bg-black border border-white/20 p-2 rounded" required />
              <input type="text" name="mobile" value={clientData.mobile} onChange={handleClientFormChange} placeholder="Mobile Number" className="w-full bg-black border border-white/20 p-2 rounded" required />
              <input type="email" name="email" value={clientData.email} onChange={handleClientFormChange} placeholder="Email ID" className="w-full bg-black border border-white/20 p-2 rounded" required />
              <input type="text" name="address" value={clientData.address} onChange={handleClientFormChange} placeholder="Address" className="w-full bg-black border border-white/20 p-2 rounded" required />
              
              <select name="packageName" value={clientData.packageName} onChange={handleClientFormChange} className="w-full bg-black border border-white/20 p-2 rounded text-white" required>
                <option value="Basic">Basic Package (₹299)</option>
                <option value="Pro">Pro Package (₹799)</option>
              </select>
              
              <input type="number" name="totalPayment" value={clientData.totalPayment} onChange={handleClientFormChange} placeholder="Total Payment Aali (₹)" className="w-full bg-black border border-white/20 p-2 rounded" required />
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowClientForm(false)} className="flex-1 bg-red-500/20 text-red-500 p-2 rounded font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded font-bold">Next: Select Code File ➔</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <input type="file" id="photo-upload" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'photos')} />
      <input type="file" id="audio-upload" accept="audio/*" className="hidden" onChange={(e) => handleFileUpload(e, 'audio')} />
      <input type="file" id="code-upload" accept=".html,.css,.js,.zip" className="hidden" onChange={(e) => handleFileUpload(e, 'code')} />

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => document.getElementById('photo-upload').click()} className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-pink-500/50 hover:bg-white/5 cursor-pointer text-center">
          <div className="text-4xl mb-4">🖼️</div><h3 className="font-bold">Upload Photos</h3>
        </div>

        <div onClick={() => document.getElementById('audio-upload').click()} className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-purple-500/50 hover:bg-white/5 cursor-pointer text-center">
          <div className="text-4xl mb-4">🎵</div><h3 className="font-bold">Upload Audio</h3>
        </div>

        {/* Hya button var click kelyavar aadhi form ughdel */}
        <div onClick={() => setShowClientForm(true)} className="p-8 rounded-3xl bg-blue-600/10 border border-blue-500/30 hover:border-blue-500 hover:bg-blue-600/20 cursor-pointer text-center">
          <div className="text-4xl mb-4">💻</div><h3 className="font-bold text-blue-400">Upload Code (Client)</h3>
        </div>
      </div>
    </div>
  )
}

export default App