import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save } from 'lucide-react';

const DebtTracker = () => {
  const [debts, setDebts] = useState([]);
  const [debtName, setDebtName] = useState('');
  const [debtBalance, setDebtBalance] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Load debts from localStorage
  useEffect(() => {
    const storedDebts = localStorage.getItem('debts');
    if (storedDebts) {
      setDebts(JSON.parse(storedDebts));
    }
  }, []);

  // Save debts to localStorage
  useEffect(() => {
    localStorage.setItem('debts', JSON.stringify(debts));
  }, [debts]);

  const handleAddDebt = (e) => {
    e.preventDefault();
    if (!debtName.trim() || !debtBalance.trim()) return;
    const newDebt = {
      id: Date.now(),
      name: debtName,
      balance: parseFloat(debtBalance),
    };
    setDebts([...debts, newDebt]);
    setDebtName('');
    setDebtBalance('');
  };

  const handleDeleteDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const handleEdit = (debt) => {
    setEditingId(debt.id);
    setEditingText(debt.balance.toString());
  };

  const handleUpdateDebt = (id) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, balance: parseFloat(editingText) } : debt
    ));
    setEditingId(null);
    setEditingText('');
  };

  const totalDebt = debts.reduce((acc, debt) => acc + debt.balance, 0);

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <h2 className="text-lg font-bold text-white mb-4">Debt Tracker</h2>
      
      <form onSubmit={handleAddDebt} className="flex gap-2 mb-4">
        <input 
          type="text"
          value={debtName}
          onChange={(e) => setDebtName(e.target.value)}
          placeholder="Debt Name (e.g., Credit Card)"
          className="flex-grow bg-gray-900 text-white rounded-md px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="number"
          value={debtBalance}
          onChange={(e) => setDebtBalance(e.target.value)}
          placeholder="Balance"
          className="w-32 bg-gray-900 text-white rounded-md px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md flex items-center justify-center">
          <Plus size={20} />
        </button>
      </form>

      <div className="space-y-2">
        {debts.map(debt => (
          <div key={debt.id} className="flex items-center justify-between bg-gray-900 p-2 rounded-md">
            <span className="font-semibold text-white">{debt.name}</span>
            <div className="flex items-center gap-2">
              {editingId === debt.id ? (
                <input 
                  type="number"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-32 bg-gray-700 text-white rounded-md px-2 py-1 border border-gray-600"
                  autoFocus
                />
              ) : (
                <span className="text-red-400 font-bold">${debt.balance.toFixed(2)}</span>
              )}
              {editingId === debt.id ? (
                <button onClick={() => handleUpdateDebt(debt.id)} className="text-gray-400 hover:text-white">
                  <Save size={16} />
                </button>
              ) : (
                <button onClick={() => handleEdit(debt)} className="text-gray-400 hover:text-white">
                  <Edit size={16} />
                </button>
              )}
              <button onClick={() => handleDeleteDebt(debt.id)} className="text-gray-400 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {debts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
          <span className="text-white font-bold">Total Debt:</span>
          <span className="text-red-400 text-xl font-bold">${totalDebt.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
};

export default DebtTracker;
