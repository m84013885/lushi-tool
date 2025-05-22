import { useState } from 'react';

export default function AddCardModal({ onConfirm, onCancel }: { onConfirm: (cardName: string, cardHero: string) => void, onCancel: () => void }) {

    const [cardName, setCardName] = useState('');
    const [cardHero, setCardHero] = useState('');

    const handleConfirm = () => {
        onConfirm(cardName, cardHero);
    }

    return (
        <dialog id="addCardModal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">添加卡组</h3>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">请输入卡组名称</legend>
                    <input type="text" className="input" placeholder="Type here" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                </fieldset>
                <select defaultValue="Pick a text editor" className="select select-primary" value={cardHero} onChange={(e) => setCardHero(e.target.value)}>
                    <option disabled={true}>请选择职业</option>
                    <option value="dl">德鲁伊</option>
                    <option value="lr">猎人</option>
                    <option value="fs">法师</option>
                    <option value="ms">牧师</option>
                    <option value="sqs">圣骑士</option>
                    <option value="zd">盗贼</option>
                    <option value="sm">萨满</option>
                    <option value="ss">术士</option>
                    <option value="zs">战士</option>
                    <option value="em">恶魔猎手</option>
                    <option value="sw">死亡骑士</option>
                </select>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn mr-4" onClick={onCancel}>Close</button>
                        <button className="btn" onClick={handleConfirm}>Confirm</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}