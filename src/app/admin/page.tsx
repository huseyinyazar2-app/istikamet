'use client';

import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import '@/components/components.css';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('kartlar'); 

  const [cards, setCards] = useState<any[]>([]);
  const [newCard, setNewCard] = useState({ text: '', categoryName: 'Sızıntılar', type: 'random', weight: 1, reflection1: '', reflection2: '' });
  const [editingCard, setEditingCard] = useState<any>(null);

  const [takvaList, setTakvaList] = useState<any[]>([]);
  const [newTakva, setNewTakva] = useState({ text: '', categoryName: 'Sevaplar', description: '', weight: 1, reflection1: '', reflection2: '' });
  const [editingTakva, setEditingTakva] = useState<any>(null);

  const [rehberList, setRehberList] = useState([]);
  const [newRehber, setNewRehber] = useState({ title: '', description: '', cure: '' });
  const [editingRehber, setEditingRehber] = useState<any>(null);

  const [arinmaList, setArinmaList] = useState([]);
  const [newArinma, setNewArinma] = useState({ title: '', action: '', isHeavy: false });
  const [editingArinma, setEditingArinma] = useState<any>(null);

  const [feedbackList, setFeedbackList] = useState([]);

  const [akaidList, setAkaidList] = useState<any[]>([]);
  const [newAkaid, setNewAkaid] = useState({ statement: '', isTrue: false, explanation: '', proof: '' });
  const [editingAkaid, setEditingAkaid] = useState<any>(null);

  // Custom Delete Modal State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '', id: null as any });

  const fetchData = async () => {
    fetch('/api/cards').then(r => r.json()).then(d => {
      setCards(d.cards || []);
      setTakvaList(d.takvaCards || []);
    });
    fetch('/api/rehber').then(r => r.json()).then(d => setRehberList(d.data || []));
    fetch('/api/arinma').then(r => r.json()).then(d => setArinmaList(d.data || []));
    fetch('/api/admin/feedback').then(r => r.json()).then(d => setFeedbackList(d.data || []));
    fetch('/api/akaid').then(r => r.json()).then(d => setAkaidList(d.data || []));
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === 'Yazar2023') setIsAuthenticated(true);
    else alert("Yanlış şifre");
  };

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'var(--bg-primary)', color: 'white', marginBottom: '8px' };
  const actionBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', fontSize: '14px', borderRadius: '4px' };

  // --- KARTLAR ---
  const handleAddCard = async () => {
    if (!newCard.text) return;
    const res = await fetch('/api/admin/cards', { method: 'POST', body: JSON.stringify(newCard) });
    if (res.ok) { fetchData(); setNewCard({ ...newCard, text: '', weight: 1, reflection1: '', reflection2: '' }); }
  };
  const handleEditCard = async () => {
    if (!editingCard || !editingCard.text) return;
    const res = await fetch('/api/admin/cards', { method: 'PUT', body: JSON.stringify(editingCard) });
    if (res.ok) { setEditingCard(null); fetchData(); }
  };
  
  // --- TAKVA ---
  const handleAddTakva = async () => {
    if (!newTakva.text) return;
    const res = await fetch('/api/admin/takva', { method: 'POST', body: JSON.stringify(newTakva) });
    if (res.ok) { fetchData(); setNewTakva({ ...newTakva, text: '', description: '', weight: 1, reflection1: '', reflection2: '' }); }
  };
  const handleEditTakva = async () => {
    if (!editingTakva || !editingTakva.text) return;
    const realId = String(editingTakva.id).replace('takva_', '');
    const payload = { ...editingTakva, id: realId };
    const res = await fetch('/api/admin/takva', { method: 'PUT', body: JSON.stringify(payload) });
    if (res.ok) { setEditingTakva(null); fetchData(); }
  };

  // --- REHBER & ARINMA ---
  const handleAddRehber = async () => {
    if (!newRehber.title) return;
    const res = await fetch('/api/rehber', { method: 'POST', body: JSON.stringify(newRehber) });
    if (res.ok) { fetchData(); setNewRehber({ title: '', description: '', cure: '' }); }
  };
  const handleEditRehber = async () => {
    if (!editingRehber || !editingRehber.title) return;
    const res = await fetch('/api/rehber', { method: 'PUT', body: JSON.stringify(editingRehber) });
    if (res.ok) { setEditingRehber(null); fetchData(); }
  };

  const handleAddArinma = async () => {
    if (!newArinma.title) return;
    const res = await fetch('/api/arinma', { method: 'POST', body: JSON.stringify(newArinma) });
    if (res.ok) { fetchData(); setNewArinma({ title: '', action: '', isHeavy: false }); }
  };
  const handleEditArinma = async () => {
    if (!editingArinma || !editingArinma.title) return;
    const res = await fetch('/api/arinma', { method: 'PUT', body: JSON.stringify(editingArinma) });
    if (res.ok) { setEditingArinma(null); fetchData(); }
  };

  // --- AKAID ---
  const handleAddAkaid = async () => {
    if (!newAkaid.statement) return;
    const res = await fetch('/api/admin/akaid', { method: 'POST', body: JSON.stringify(newAkaid) });
    if (res.ok) { fetchData(); setNewAkaid({ statement: '', isTrue: false, explanation: '', proof: '' }); }
  };
  const handleEditAkaid = async () => {
    if (!editingAkaid || !editingAkaid.statement) return;
    const res = await fetch('/api/admin/akaid', { method: 'PUT', body: JSON.stringify(editingAkaid) });
    if (res.ok) { setEditingAkaid(null); fetchData(); }
  };

  // --- DELETE LOGIC ---
  const confirmDelete = (type: string, id: any) => {
    setDeleteModal({ isOpen: true, type, id });
  };

  const executeDelete = async () => {
    const { type, id } = deleteModal;
    if (type === 'card') {
      await fetch(`/api/admin/cards?id=${id}`, { method: 'DELETE' });
    } else if (type === 'takva') {
      const realId = String(id).replace('takva_', '');
      await fetch(`/api/admin/takva?id=${realId}`, { method: 'DELETE' });
    } else if (type === 'rehber') {
      await fetch(`/api/rehber?id=${id}`, { method: 'DELETE' });
    } else if (type === 'arinma') {
      await fetch(`/api/arinma?id=${id}`, { method: 'DELETE' });
    } else if (type === 'feedback') {
      await fetch(`/api/admin/feedback?id=${id}`, { method: 'DELETE' });
    } else if (type === 'akaid') {
      await fetch(`/api/admin/akaid?id=${id}`, { method: 'DELETE' });
    }
    setDeleteModal({ isOpen: false, type: '', id: null });
    fetchData();
  };

  if (!isAuthenticated) {
    return (
      <div className="container dashboard-container">
        <h2 style={{ color: 'var(--accent-gold)' }}>Yönetim Paneli</h2>
        <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} style={{...inputStyle, maxWidth: 300, margin: '20px 0'}} />
        <button className="button button-primary" onClick={handleLogin} style={{ width: '100%', maxWidth: '300px' }}>Giriş Yap</button>
        <BottomNav />
      </div>
    );
  }

  return (
    <>
      <div className="container" style={{ paddingBottom: '100px', paddingTop: '20px' }}>
        <h1 style={{ color: 'var(--accent-gold)', marginBottom: '20px' }}>Admin Paneli</h1>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button className="button" style={{ background: activeTab === 'kartlar' ? 'var(--accent-green)' : 'var(--bg-secondary)', color: 'white' }} onClick={() => setActiveTab('kartlar')}>Ana Kartlar</button>
          <button className="button" style={{ background: activeTab === 'takva' ? 'var(--accent-green)' : 'var(--bg-secondary)', color: 'white' }} onClick={() => setActiveTab('takva')}>Takva Modu</button>
          <button className="button" style={{ background: activeTab === 'rehber' ? 'var(--accent-green)' : 'var(--bg-secondary)', color: 'white' }} onClick={() => setActiveTab('rehber')}>Rehber</button>
          <button className="button" style={{ background: activeTab === 'arinma' ? 'var(--accent-green)' : 'var(--bg-secondary)', color: 'white' }} onClick={() => setActiveTab('arinma')}>Arınma</button>
          <button className="button" style={{ background: activeTab === 'akaid' ? 'var(--accent-green)' : 'var(--bg-secondary)', color: 'white' }} onClick={() => setActiveTab('akaid')}>Akaid Testi</button>
          <button className="button" style={{ background: activeTab === 'mesajlar' ? 'var(--accent-green)' : 'var(--bg-secondary)', color: 'white' }} onClick={() => setActiveTab('mesajlar')}>
            Mesajlar {feedbackList.length > 0 && `(${feedbackList.length})`}
          </button>
        </div>

        {/* KARTLAR */}
        {activeTab === 'kartlar' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Yeni Kart Ekle</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              <select value={newCard.categoryName} onChange={e => setNewCard({...newCard, categoryName: e.target.value})} style={inputStyle}>
                <option value="Ana Kolonlar">Ana Kolonlar</option>
                <option value="Sosyal Hasar">Sosyal Hasar</option>
                <option value="Kalp Hastalıkları">Kalp Hastalıkları</option>
                <option value="Sızıntılar">Sızıntılar</option>
              </select>
              <input type="number" value={newCard.weight} onChange={e => setNewCard({...newCard, weight: parseInt(e.target.value) || 0})} style={{...inputStyle, width: '100px'}} title="Puan" />
            </div>
            <input type="text" placeholder="Kart Metni" value={newCard.text} onChange={e => setNewCard({...newCard, text: e.target.value})} style={inputStyle} />
            <textarea placeholder="Tefekkür Mesajı 1 (Ayet/Hadis)" value={newCard.reflection1} onChange={e => setNewCard({...newCard, reflection1: e.target.value})} style={{...inputStyle, minHeight: '60px'}} />
            <textarea placeholder="Tefekkür Mesajı 2 (Ayet/Hadis)" value={newCard.reflection2} onChange={e => setNewCard({...newCard, reflection2: e.target.value})} style={{...inputStyle, minHeight: '60px'}} />
            <button className="button button-primary" onClick={handleAddCard}>Ekle</button>
            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '10px 0' }}/>
            
            <h3 style={{ color: 'var(--text-primary)' }}>Mevcut Kartlar</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cards.map((c:any) => (
                 <div key={c.id} style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                   {editingCard?.id === c.id ? (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                       <input type="text" value={editingCard.text} onChange={e => setEditingCard({...editingCard, text: e.target.value})} style={inputStyle} />
                       <textarea placeholder="Tefekkür Mesajı 1" value={editingCard.reflection1 || ''} onChange={e => setEditingCard({...editingCard, reflection1: e.target.value})} style={{...inputStyle, minHeight: 60}} />
                       <textarea placeholder="Tefekkür Mesajı 2" value={editingCard.reflection2 || ''} onChange={e => setEditingCard({...editingCard, reflection2: e.target.value})} style={{...inputStyle, minHeight: 60}} />
                       <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                         <span style={{color:'white'}}>Puan:</span>
                         <input type="number" value={editingCard.weight} onChange={e => setEditingCard({...editingCard, weight: parseInt(e.target.value) || 0})} style={{...inputStyle, width: '80px'}} />
                         <button className="button button-primary" onClick={handleEditCard} style={{ flex: 1, padding: '8px' }}>Kaydet</button>
                         <button className="button" style={{ background: 'gray', padding: '8px' }} onClick={() => setEditingCard(null)}>İptal</button>
                       </div>
                     </div>
                   ) : (
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <span style={{ display: 'inline-block', minWidth: '30px', textAlign: 'center', background: c.weight > 0 ? 'var(--accent-green)' : 'var(--accent-danger)', borderRadius: '4px', padding: '2px 4px' }}>{c.weight > 0 ? '+'+c.weight : c.weight}</span> 
                         <div style={{ display: 'flex', flexDirection: 'column' }}>
                           <span style={{ fontSize: '14px' }}>{c.text}</span>
                           {(c.reflection1 || c.reflection2) && <span style={{ fontSize: '11px', color: 'var(--accent-gold)', marginTop: 4 }}>*Tefekkür ekli</span>}
                         </div>
                       </div>
                       <div style={{ display: 'flex', gap: '8px', minWidth: '110px', justifyContent: 'flex-end' }}>
                         <button onClick={() => setEditingCard(c)} style={{ ...actionBtnStyle, color: 'var(--accent-gold)' }}>Düzenle</button>
                         <button onClick={() => confirmDelete('card', c.id)} style={{ ...actionBtnStyle, color: 'var(--accent-danger)' }}>Sil</button>
                       </div>
                     </div>
                   )}
                 </div>
              ))}
            </div>
          </div>
        )}

        {/* TAKVA MODU */}
        {activeTab === 'takva' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Yeni Takva Kartı Ekle</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              <select value={newTakva.categoryName} onChange={e => setNewTakva({...newTakva, categoryName: e.target.value})} style={inputStyle}>
                <option value="Sevaplar">Sevaplar</option>
                <option value="Günahlar">Günahlar</option>
              </select>
              <input type="number" value={newTakva.weight} onChange={e => setNewTakva({...newTakva, weight: parseInt(e.target.value) || 0})} style={{...inputStyle, width: '100px'}} title="Puan" />
            </div>
            <input type="text" placeholder="Kart Metni" value={newTakva.text} onChange={e => setNewTakva({...newTakva, text: e.target.value})} style={inputStyle} />
            <textarea placeholder="Açıklama (Opsiyonel)" value={newTakva.description} onChange={e => setNewTakva({...newTakva, description: e.target.value})} style={{...inputStyle, minHeight: '60px'}} />
            <textarea placeholder="Tefekkür Mesajı 1" value={newTakva.reflection1} onChange={e => setNewTakva({...newTakva, reflection1: e.target.value})} style={{...inputStyle, minHeight: '60px'}} />
            <textarea placeholder="Tefekkür Mesajı 2" value={newTakva.reflection2} onChange={e => setNewTakva({...newTakva, reflection2: e.target.value})} style={{...inputStyle, minHeight: '60px'}} />
            <button className="button button-primary" onClick={handleAddTakva}>Ekle</button>
            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '10px 0' }}/>
            
            <h3 style={{ color: 'var(--text-primary)' }}>Mevcut Takva Kartları</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {takvaList.map((t:any) => (
                 <div key={t.id} style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                   {editingTakva?.id === t.id ? (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                       <input type="text" value={editingTakva.text} onChange={e => setEditingTakva({...editingTakva, text: e.target.value})} style={inputStyle} />
                       <textarea value={editingTakva.description || ''} onChange={e => setEditingTakva({...editingTakva, description: e.target.value})} style={{...inputStyle, minHeight: 60}} />
                       <textarea placeholder="Tefekkür Mesajı 1" value={editingTakva.reflection1 || ''} onChange={e => setEditingTakva({...editingTakva, reflection1: e.target.value})} style={{...inputStyle, minHeight: 60}} />
                       <textarea placeholder="Tefekkür Mesajı 2" value={editingTakva.reflection2 || ''} onChange={e => setEditingTakva({...editingTakva, reflection2: e.target.value})} style={{...inputStyle, minHeight: 60}} />
                       <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                         <span style={{color:'white'}}>Puan:</span>
                         <input type="number" value={editingTakva.weight} onChange={e => setEditingTakva({...editingTakva, weight: parseInt(e.target.value) || 0})} style={{...inputStyle, width: '80px'}} />
                         <button className="button button-primary" onClick={handleEditTakva} style={{ flex: 1, padding: '8px' }}>Kaydet</button>
                         <button className="button" style={{ background: 'gray', padding: '8px' }} onClick={() => setEditingTakva(null)}>İptal</button>
                       </div>
                     </div>
                   ) : (
                     <>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                         <div style={{ color: 'white', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                           <span style={{ display: 'inline-block', minWidth: '30px', textAlign: 'center', background: t.weight > 0 ? 'var(--accent-green)' : 'var(--accent-danger)', borderRadius: '4px', padding: '2px 4px', marginTop: 2 }}>{t.weight > 0 ? '+'+t.weight : t.weight}</span> 
                           <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{t.text}</span>
                             {t.description && <span style={{ fontSize: '12px', color: 'gray', marginTop: 4 }}>{t.description}</span>}
                             {(t.reflection1 || t.reflection2) && <span style={{ fontSize: '11px', color: 'var(--accent-gold)', marginTop: 4 }}>*Tefekkür ekli</span>}
                           </div>
                         </div>
                         <div style={{ display: 'flex', gap: '8px', minWidth: '110px', justifyContent: 'flex-end' }}>
                           <button onClick={() => setEditingTakva(t)} style={{ ...actionBtnStyle, color: 'var(--accent-gold)' }}>Düzenle</button>
                           <button onClick={() => confirmDelete('takva', t.id)} style={{ ...actionBtnStyle, color: 'var(--accent-danger)' }}>Sil</button>
                         </div>
                       </div>
                     </>
                   )}
                 </div>
              ))}
            </div>
          </div>
        )}

        {/* REHBER & ARINMA LİSTESİ */}
        {activeTab === 'rehber' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Rehber Ekle</h3>
            <input type="text" placeholder="Başlık" value={newRehber.title} onChange={e => setNewRehber({...newRehber, title: e.target.value})} style={inputStyle} />
            <textarea placeholder="Açıklama" value={newRehber.description} onChange={e => setNewRehber({...newRehber, description: e.target.value})} style={{...inputStyle, minHeight: '80px'}} />
            <textarea placeholder="Reçete" value={newRehber.cure} onChange={e => setNewRehber({...newRehber, cure: e.target.value})} style={{...inputStyle, minHeight: '80px'}} />
            <button className="button button-primary" onClick={handleAddRehber}>Ekle</button>
            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '10px 0' }}/>
            {rehberList.map((r:any) => (
               <div key={r.id} style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px', marginBottom: 8 }}>
                 {editingRehber?.id === r.id ? (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                     <input type="text" value={editingRehber.title} onChange={e => setEditingRehber({...editingRehber, title: e.target.value})} style={inputStyle} />
                     <textarea value={editingRehber.description} onChange={e => setEditingRehber({...editingRehber, description: e.target.value})} style={{...inputStyle, minHeight: 80}} />
                     <textarea value={editingRehber.cure} onChange={e => setEditingRehber({...editingRehber, cure: e.target.value})} style={{...inputStyle, minHeight: 80}} />
                     <div style={{ display: 'flex', gap: 10 }}>
                       <button className="button button-primary" onClick={handleEditRehber} style={{ flex: 1 }}>Kaydet</button>
                       <button className="button" style={{ background: 'gray' }} onClick={() => setEditingRehber(null)}>İptal</button>
                     </div>
                   </div>
                 ) : (
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                     <span style={{ color: 'white', flex: 1 }}>{r.title}</span>
                     <div style={{ display: 'flex', gap: '8px', minWidth: '110px', justifyContent: 'flex-end' }}>
                       <button onClick={() => setEditingRehber(r)} style={{ ...actionBtnStyle, color: 'var(--accent-gold)' }}>Düzenle</button>
                       <button onClick={() => confirmDelete('rehber', r.id)} style={{ ...actionBtnStyle, color: 'var(--accent-danger)' }}>Sil</button>
                     </div>
                   </div>
                 )}
               </div>
            ))}
          </div>
        )}

        {activeTab === 'arinma' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Arınma Reçetesi Ekle</h3>
            <input type="text" placeholder="Başlık" value={newArinma.title} onChange={e => setNewArinma({...newArinma, title: e.target.value})} style={inputStyle} />
            <textarea placeholder="Aksiyon" value={newArinma.action} onChange={e => setNewArinma({...newArinma, action: e.target.value})} style={{...inputStyle, minHeight: '80px'}} />
            <button className="button button-primary" onClick={handleAddArinma}>Ekle</button>
            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '10px 0' }}/>
            {arinmaList.map((a:any) => (
               <div key={a.id} style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px', marginBottom: 8 }}>
                 {editingArinma?.id === a.id ? (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                     <input type="text" value={editingArinma.title} onChange={e => setEditingArinma({...editingArinma, title: e.target.value})} style={inputStyle} />
                     <textarea value={editingArinma.action} onChange={e => setEditingArinma({...editingArinma, action: e.target.value})} style={{...inputStyle, minHeight: 80}} />
                     <div style={{ display: 'flex', gap: 10 }}>
                       <button className="button button-primary" onClick={handleEditArinma} style={{ flex: 1 }}>Kaydet</button>
                       <button className="button" style={{ background: 'gray' }} onClick={() => setEditingArinma(null)}>İptal</button>
                     </div>
                   </div>
                 ) : (
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                     <span style={{ color: 'white', flex: 1 }}>{a.title}</span>
                     <div style={{ display: 'flex', gap: '8px', minWidth: '110px', justifyContent: 'flex-end' }}>
                       <button onClick={() => setEditingArinma(a)} style={{ ...actionBtnStyle, color: 'var(--accent-gold)' }}>Düzenle</button>
                       <button onClick={() => confirmDelete('arinma', a.id)} style={{ ...actionBtnStyle, color: 'var(--accent-danger)' }}>Sil</button>
                     </div>
                   </div>
                 )}
               </div>
            ))}
          </div>
        )}

        {/* AKAID LİSTESİ */}
        {activeTab === 'akaid' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Yeni İman Esası Ekle</h3>
            <textarea placeholder="İddia (Soru Cümlesi)" value={newAkaid.statement} onChange={e => setNewAkaid({...newAkaid, statement: e.target.value})} style={{...inputStyle, minHeight: '60px'}} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white', marginBottom: 10 }}>
              <span>Doğru Cevap:</span>
              <select value={newAkaid.isTrue ? "true" : "false"} onChange={e => setNewAkaid({...newAkaid, isTrue: e.target.value === "true"})} style={{...inputStyle, width: '120px', marginBottom: 0}}>
                <option value="true">Doğru</option>
                <option value="false">Yanlış</option>
              </select>
            </div>
            <textarea placeholder="Açıklama (Hakikat)" value={newAkaid.explanation} onChange={e => setNewAkaid({...newAkaid, explanation: e.target.value})} style={{...inputStyle, minHeight: '80px'}} />
            <textarea placeholder="Delil (Ayet/Hadis)" value={newAkaid.proof} onChange={e => setNewAkaid({...newAkaid, proof: e.target.value})} style={{...inputStyle, minHeight: '60px'}} />
            <button className="button button-primary" onClick={handleAddAkaid}>Ekle</button>
            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '10px 0' }}/>
            
            {akaidList.map((a:any) => (
               <div key={a.id} style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px', marginBottom: 8 }}>
                 {editingAkaid?.id === a.id ? (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                     <textarea value={editingAkaid.statement} onChange={e => setEditingAkaid({...editingAkaid, statement: e.target.value})} style={{...inputStyle, minHeight: 60}} />
                     <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white' }}>
                        <span>Cevap:</span>
                        <select value={editingAkaid.isTrue ? "true" : "false"} onChange={e => setEditingAkaid({...editingAkaid, isTrue: e.target.value === "true"})} style={{...inputStyle, width: '120px', marginBottom: 0}}>
                          <option value="true">Doğru</option>
                          <option value="false">Yanlış</option>
                        </select>
                     </div>
                     <textarea value={editingAkaid.explanation} onChange={e => setEditingAkaid({...editingAkaid, explanation: e.target.value})} style={{...inputStyle, minHeight: 80}} />
                     <textarea value={editingAkaid.proof} onChange={e => setEditingAkaid({...editingAkaid, proof: e.target.value})} style={{...inputStyle, minHeight: 60}} />
                     <div style={{ display: 'flex', gap: 10 }}>
                       <button className="button button-primary" onClick={handleEditAkaid} style={{ flex: 1 }}>Kaydet</button>
                       <button className="button" style={{ background: 'gray' }} onClick={() => setEditingAkaid(null)}>İptal</button>
                     </div>
                   </div>
                 ) : (
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', color: 'white', gap: 4 }}>
                       <span style={{ fontSize: 14 }}>{a.statement}</span>
                       <span style={{ fontSize: 12, color: a.isTrue ? 'var(--accent-green)' : 'var(--accent-danger)' }}>Cevap: {a.isTrue ? "Doğru" : "Yanlış"}</span>
                     </div>
                     <div style={{ display: 'flex', gap: '8px', minWidth: '110px', justifyContent: 'flex-end' }}>
                       <button onClick={() => setEditingAkaid(a)} style={{ ...actionBtnStyle, color: 'var(--accent-gold)' }}>Düzenle</button>
                       <button onClick={() => confirmDelete('akaid', a.id)} style={{ ...actionBtnStyle, color: 'var(--accent-danger)' }}>Sil</button>
                     </div>
                   </div>
                 )}
               </div>
            ))}
          </div>
        )}

        {/* MESAJLAR */}
        {activeTab === 'mesajlar' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Kullanıcı Mesajları</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Kullanıcıların Hakkında sekmesinden gönderdiği görüş ve öneriler.</p>
            {feedbackList.length === 0 ? (
              <p style={{ color: 'gray', fontStyle: 'italic', marginTop: 10 }}>Henüz bir mesaj yok.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {feedbackList.map((f:any) => (
                   <div key={f.id} style={{ display: 'flex', flexDirection: 'column', padding: '16px', background: 'var(--bg-primary)', borderRadius: '8px', position: 'relative' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                       <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>{f.nickname}</span>
                       <span style={{ color: 'gray', fontSize: 11 }}>{new Date(f.created_at).toLocaleString('tr-TR')}</span>
                     </div>
                     <p style={{ color: 'white', lineHeight: 1.5, fontSize: 15, marginBottom: 12 }}>{f.message}</p>
                     <button onClick={() => confirmDelete('feedback', f.id)} style={{ ...actionBtnStyle, color: 'var(--accent-danger)', alignSelf: 'flex-end', border: '1px solid rgba(255,0,0,0.2)' }}>Mesajı Sil</button>
                   </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '16px', maxWidth: '400px', width: '100%', border: '1px solid var(--accent-danger)' }}>
            <h3 style={{ color: 'white', marginBottom: '16px', fontSize: 20 }}>Kalıcı Olarak Silinecek</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
              Bu kaydı veritabanından kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="button" style={{ flex: 1, backgroundColor: 'var(--accent-danger)', color: 'white', fontWeight: 'bold' }} onClick={executeDelete}>Evet, Sil</button>
              <button className="button" style={{ flex: 1, backgroundColor: 'var(--bg-primary)', color: 'white' }} onClick={() => setDeleteModal({ isOpen: false, type: '', id: null })}>İptal</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}
