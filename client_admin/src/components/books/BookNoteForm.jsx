// src/components/books/BookNoteForm.jsx
import { useState } from "react";
import StyledInput from "../ui/StyledInput";
import StyledButton from "../ui/StyledButton";

const BookNoteForm = ({ onSave, loading = false }) => {
  const [pageStart, setPageStart] = useState("");
  const [pageEnd, setPageEnd] = useState("");
  const [chapter, setChapter] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [kind, setKind] = useState("note");

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      content: content.trim(),
      chapter: chapter.trim() || undefined,
      pageStart: pageStart === "" ? undefined : Number(pageStart),
      pageEnd: pageEnd === "" ? undefined : Number(pageEnd),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      kind,
    };
    if (!payload.content) return;
    onSave(payload, () => {
      setPageStart("");
      setPageEnd("");
      setChapter("");
      setContent("");
      setTags("");
      setKind("note");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="block text-[11px] text-text-tertiary">Page start</label>
          <StyledInput
            type="number"
            value={pageStart}
            onChange={(e) => setPageStart(e.target.value)}
            className="w-24"
          />
        </div>
        <div>
          <label className="block text-[11px] text-text-tertiary">Page end</label>
          <StyledInput type="number" value={pageEnd} onChange={(e) => setPageEnd(e.target.value)} className="w-24" />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-[11px] text-text-tertiary">Chapter</label>
          <StyledInput value={chapter} onChange={(e) => setChapter(e.target.value)} />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[11px] text-text-tertiary">Tags (comma separated)</label>
          <StyledInput value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[11px] text-text-tertiary">Kind</label>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="w-full rounded-md bg-gray-900/70 border border-gray-700 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="note">Note</option>
            <option value="quote">Quote</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[11px] text-text-tertiary">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full rounded-md bg-gray-900/70 border border-gray-700 p-3 text-sm resize-vertical focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Quote, reflection, analysis, etc."
        />
      </div>
      <div className="flex gap-2">
        <StyledButton type="submit" className="py-2 px-4 text-sm bg-primary" disabled={loading}>
          {loading ? "Saving..." : "Add note"}
        </StyledButton>
      </div>
    </form>
  );
};

export default BookNoteForm;
