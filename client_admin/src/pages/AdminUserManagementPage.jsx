import { useEffect, useState } from 'react';
import { adminUserService } from '../services/adminUserService';
import { FiRefreshCcw, FiEdit2, FiSave, FiX, FiKey } from 'react-icons/fi';

const roleOptions = ['user','wife_of_the_year','admin'];

const AdminUserManagementPage = () => {
  const [users,setUsers] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [editingId,setEditingId] = useState(null);
  const [draft,setDraft] = useState({});
  const [pwModal,setPwModal] = useState({ open:false, userId:null, password:'' });
  const [saving,setSaving] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    try { const data = await adminUserService.list(); setUsers(data); } catch(e){ setError('Failed to load users'); }
    setLoading(false);
  };
  useEffect(()=>{ load(); },[]);

  const startEdit = (u)=>{ setEditingId(u._id); setDraft({ username:u.username, role:u.role, level:u.level, experience:u.experience }); };
  const cancelEdit = ()=>{ setEditingId(null); setDraft({}); };
  const saveEdit = async ()=>{
    setSaving(true);
    try { const updated = await adminUserService.update(editingId, draft); setUsers(prev=>prev.map(u=>u._id===updated._id?updated:u)); cancelEdit(); }
    catch(e){ setError(e.response?.data?.message || 'Update failed'); }
    setSaving(false);
  };
  const openPw = (id)=> setPwModal({ open:true, userId:id, password:'' });
  const closePw = ()=> setPwModal({ open:false, userId:null, password:'' });
  const submitPw = async ()=>{
    if(pwModal.password.length < 6) { setError('Password too short'); return; }
    try { await adminUserService.resetPassword(pwModal.userId, pwModal.password); closePw(); }
    catch(e){ setError(e.response?.data?.message || 'Password reset failed'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">User Management</h1>
        <div className="flex gap-2">
          <button onClick={load} className="px-3 py-1 text-xs rounded bg-primary/30 hover:bg-primary/50 flex items-center gap-1"><FiRefreshCcw size={14}/> Refresh</button>
        </div>
      </div>
      {error && <div className="text-status-danger text-xs bg-status-danger/10 border border-status-danger/30 px-3 py-2 rounded">{error}</div>}
      {loading ? <div className="text-xs">Loading users...</div> : (
        <div className="overflow-auto border border-white/10 rounded-lg">
          <table className="w-full text-xs">
            <thead className="bg-white/5">
              <tr className="text-left">
                <th className="p-2">Email</th>
                <th className="p-2">Username</th>
                <th className="p-2">Role</th>
                <th className="p-2">Lvl</th>
                <th className="p-2">XP</th>
                <th className="p-2">Login Streak</th>
                <th className="p-2">Created</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u=>{
                const editing = editingId === u._id;
                return (
                  <tr key={u._id} className="odd:bg-white/0 even:bg-white/5 hover:bg-primary/10 transition">
                    <td className="p-2 font-mono">{u.email}</td>
                    <td className="p-2">
                      {editing ? (
                        <input value={draft.username} onChange={e=>setDraft(d=>({...d, username:e.target.value}))} className="bg-black/30 border border-white/20 px-2 py-1 rounded w-28" />
                      ) : u.username}
                    </td>
                    <td className="p-2">
                      {editing ? (
                        <select value={draft.role} onChange={e=>setDraft(d=>({...d, role:e.target.value}))} className="bg-black/30 border border-white/20 px-2 py-1 rounded">
                          {roleOptions.map(r=> <option key={r} value={r}>{r}</option>)}
                        </select>
                      ) : u.role}
                    </td>
                    <td className="p-2 w-14">
                      {editing ? (
                        <input type="number" value={draft.level} onChange={e=>setDraft(d=>({...d, level:Number(e.target.value)}))} className="bg-black/30 border border-white/20 px-2 py-1 rounded w-14" />
                      ) : u.level}
                    </td>
                    <td className="p-2 w-20">
                      {editing ? (
                        <input type="number" value={draft.experience} onChange={e=>setDraft(d=>({...d, experience:Number(e.target.value)}))} className="bg-black/30 border border-white/20 px-2 py-1 rounded w-20" />
                      ) : u.experience}
                    </td>
                    <td className="p-2">{u.currentLoginStreak}/{u.longestLoginStreak}</td>
                    <td className="p-2 whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 text-right space-x-1">
                      {editing ? (
                        <>
                          <button disabled={saving} onClick={saveEdit} className="inline-flex items-center px-2 py-1 bg-green-600/60 hover:bg-green-600 rounded text-white"><FiSave size={12}/></button>
                          <button onClick={cancelEdit} className="inline-flex items-center px-2 py-1 bg-red-600/60 hover:bg-red-600 rounded text-white"><FiX size={12}/></button>
                        </>
                      ) : (
                        <>
                          <button onClick={()=>startEdit(u)} className="inline-flex items-center px-2 py-1 bg-primary/40 hover:bg-primary/60 rounded text-white"><FiEdit2 size={12}/></button>
                          <button onClick={()=>openPw(u._id)} className="inline-flex items-center px-2 py-1 bg-amber-600/50 hover:bg-amber-600 rounded text-white"><FiKey size={12}/></button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pwModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface/90 border border-white/10 rounded-lg p-4 w-full max-w-sm space-y-3">
            <h2 className="font-semibold text-sm flex items-center gap-2"><FiKey/> Reset Password</h2>
            <input type="password" value={pwModal.password} onChange={e=>setPwModal(m=>({...m, password:e.target.value}))} placeholder="New password" className="w-full bg-black/40 border border-white/20 px-3 py-2 rounded text-sm" />
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={closePw} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Cancel</button>
              <button onClick={submitPw} className="px-3 py-1 rounded bg-primary/50 hover:bg-primary/70 text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagementPage;
