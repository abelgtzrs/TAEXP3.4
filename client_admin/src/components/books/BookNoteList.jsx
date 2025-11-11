// src/components/books/BookNoteList.jsx
import StyledButton from "../ui/StyledButton";

const BookNoteList = ({ notes, onDelete, onUpdate }) => {
  if (!notes || notes.length === 0) {
    return <p className="text-text-tertiary text-sm">No structured notes yet.</p>;
  }
  return (
    <div className="space-y-4">
      {notes.map((n) => {
        const range =
          n.pageStart != null && n.pageEnd != null
            ? `${n.pageStart}-${n.pageEnd}`
            : n.pageStart != null
            ? `${n.pageStart}`
            : n.pageEnd != null
            ? `${n.pageEnd}`
            : "—";
        return (
          <div
            key={n._id}
            className={`group border border-gray-700/50 rounded-md p-3 bg-gray-900/50 hover:border-primary/40 transition-colors relative ${
              n.kind === "quote" ? "ring-1 ring-primary/30" : ""
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-text-tertiary mb-1">
                  <span>Range: {range}</span>
                  {n.chapter && <span>Chapter: {n.chapter}</span>}
                  <span>
                    Added: {new Date(n.createdAt).toLocaleDateString()} {" "}
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className={n.kind === "quote" ? "text-primary/80" : "text-text-tertiary"}>Type: {n.kind}</span>
                </div>
                <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{n.content}</p>
                {n.tags?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {n.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-full bg-gray-700/60 text-[10px] tracking-wide uppercase text-text-tertiary group-hover:bg-primary/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <StyledButton
                  onClick={() => onDelete(n._id)}
                  className="py-1 px-2 text-xs bg-status-danger/80 hover:bg-status-danger"
                >
                  Delete
                </StyledButton>
              </div>
            </div>
            {n.kind === "quote" && (
              <div className="absolute -top-2 -left-2 text-primary text-xl select-none">“</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BookNoteList;
