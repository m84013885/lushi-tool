// 确认弹窗
export default function ConfirmModal({ 
    id = 'confirmModal', 
    title, 
    content, 
    onConfirm, 
    onCancel 
}: { 
    id?: string,
    title: string, 
    content: string, 
    onConfirm: () => void, 
    onCancel: () => void 
}) {
    return (
        <dialog id={id} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{content}</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn mr-4" onClick={onCancel}>取消</button>
                        <button className="btn btn-primary" onClick={onConfirm}>确认</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}