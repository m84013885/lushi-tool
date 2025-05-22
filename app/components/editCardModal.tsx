"use client"

import { useState } from 'react';
import { HEAR_MAP } from '@/app/page';

interface EditCardModalProps {
  onConfirm: (cardName: string, cardHero: string) => void;
  onCancel: () => void;
  currentName: string;
  currentHero: string;
}

export default function EditCardModal({ onConfirm, onCancel, currentName, currentHero }: EditCardModalProps) {
  const [cardName, setCardName] = useState(currentName);
  const [cardHero, setCardHero] = useState(currentHero);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardName.trim() && cardHero) {
      onConfirm(cardName.trim(), cardHero);
      (document.getElementById('editCardModal') as HTMLDialogElement)?.close();
    }
  };

  const handleCancel = () => {
    onCancel();
    (document.getElementById('editCardModal') as HTMLDialogElement)?.close();
  };

  return (
    <dialog id="editCardModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">编辑卡组</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">卡组名称</span>
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="input input-bordered w-full"
              placeholder="输入卡组名称"
              required
            />
          </div>
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">选择职业</span>
            </label>
            <select
              value={cardHero}
              onChange={(e) => setCardHero(e.target.value)}
              className="select select-bordered w-full"
              required
            >
              {Object.entries(HEAR_MAP).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={handleCancel}>取消</button>
            <button type="submit" className="btn btn-primary">确认</button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleCancel}>关闭</button>
      </form>
    </dialog>
  );
} 