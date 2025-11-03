import React from "react";

const LS_KEY = "dashboardLayoutV1";

const defaultLayout = {
  col1: [
    { id: "calendar", key: "calendar", size: "md" },
    { id: "habit", key: "habit", size: "lg" },
    { id: "book", key: "book", size: "md" },
  ],
  col2: [
    { id: "chart-coherence", key: "chart-coherence", size: "lg" },
    { id: "chart-anomaly", key: "chart-anomaly", size: "lg" },
    { id: "chart-drift", key: "chart-drift", size: "lg" },
    { id: "chart-status", key: "chart-status", size: "lg" },
    { id: "workout", key: "workout", size: "md" },
    { id: "security", key: "security", size: "md" },
  ],
  col3: [
    { id: "strokes", key: "strokes", size: "md" },
    { id: "goals", key: "goals", size: "md" },
    { id: "recent", key: "recent", size: "md" },
    { id: "top", key: "top", size: "md" },
    { id: "currency", key: "currency", size: "md" },
    { id: "quick-notes", key: "quick-notes", size: "md" },
    { id: "quick-links", key: "quick-links", size: "md" },
    { id: "focus-timer", key: "focus-timer", size: "sm" },
    { id: "daily-quote", key: "daily-quote", size: "sm" },
    { id: "countdown", key: "countdown", size: "sm" },
  ],
};

export const LayoutContext = React.createContext(null);

export function LayoutProvider({ children }) {
  const [editMode, setEditMode] = React.useState(false);
  const sizeToPx = (size) => {
    switch (size) {
      case "sm":
        return 192; // 12rem
      case "md":
        return 256; // 16rem
      case "lg":
        return 320; // 20rem
      case "xl":
        return 448; // 28rem
      default:
        return 256;
    }
  };

  const withHeights = (layout) => {
    const copy = { col1: [], col2: [], col3: [] };
    for (const c of ["col1", "col2", "col3"]) {
      copy[c] = (layout[c] || []).map((it) => ({ ...it, height: it.height ?? sizeToPx(it.size || "md") }));
    }
    return copy;
  };

  const ensureNewItems = (layout) => {
    // Ensure additional widgets exist if user had an older saved layout
    const present = new Set([
      ...layout.col1.map((i) => i.id),
      ...layout.col2.map((i) => i.id),
      ...layout.col3.map((i) => i.id),
    ]);
    const toAdd = [
      { id: "quick-notes", key: "quick-notes", size: "md" },
      { id: "quick-links", key: "quick-links", size: "md" },
      { id: "focus-timer", key: "focus-timer", size: "sm" },
      { id: "daily-quote", key: "daily-quote", size: "sm" },
      { id: "countdown", key: "countdown", size: "sm" },
    ].filter((it) => !present.has(it.id));
    if (toAdd.length === 0) return layout;
    return { ...layout, col3: [...layout.col3, ...toAdd] };
  };

  const [columns, setColumns] = React.useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return withHeights(ensureNewItems(JSON.parse(raw)));
    } catch {}
    return withHeights(defaultLayout);
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(columns));
    } catch {}
  }, [columns]);

  const toggleEditMode = () => setEditMode((v) => !v);

  const findItem = (id) => {
    for (const colId of Object.keys(columns)) {
      const idx = columns[colId].findIndex((i) => i.id === id);
      if (idx !== -1) return { colId, idx, item: columns[colId][idx] };
    }
    return null;
  };

  const moveWidget = (id, toColId, toIndex) => {
    setColumns((prev) => {
      const loc = (() => {
        for (const c of Object.keys(prev)) {
          const i = prev[c].findIndex((x) => x.id === id);
          if (i !== -1) return { colId: c, idx: i };
        }
        return null;
      })();
      if (!loc) return prev;
      const item = prev[loc.colId][loc.idx];
      const next = { col1: [...prev.col1], col2: [...prev.col2], col3: [...prev.col3] };
      next[loc.colId].splice(loc.idx, 1);
      const insertIndex = Math.max(0, Math.min(toIndex ?? next[toColId].length, next[toColId].length));
      next[toColId].splice(insertIndex, 0, item);
      return next;
    });
  };

  const reorderWithinColumn = (colId, fromIndex, toIndex) => {
    setColumns((prev) => {
      const list = [...prev[colId]];
      const [it] = list.splice(fromIndex, 1);
      list.splice(Math.max(0, Math.min(toIndex, list.length)), 0, it);
      return { ...prev, [colId]: list };
    });
  };

  const resizeWidget = (id, size) => {
    setColumns((prev) => {
      const next = { col1: [...prev.col1], col2: [...prev.col2], col3: [...prev.col3] };
      for (const c of Object.keys(next)) {
        const i = next[c].findIndex((x) => x.id === id);
        if (i !== -1) {
          next[c][i] = { ...next[c][i], size, height: sizeToPx(size) };
          break;
        }
      }
      return next;
    });
  };

  const adjustHeight = (id, deltaPx) => {
    setColumns((prev) => {
      const next = { col1: [...prev.col1], col2: [...prev.col2], col3: [...prev.col3] };
      for (const c of Object.keys(next)) {
        const i = next[c].findIndex((x) => x.id === id);
        if (i !== -1) {
          const cur = next[c][i].height ?? sizeToPx(next[c][i].size || "md");
          const nh = Math.max(120, Math.min(cur + deltaPx, 1200));
          next[c][i] = { ...next[c][i], height: nh };
          break;
        }
      }
      return next;
    });
  };

  const moveWidgetToAdjacentColumn = (id, direction) => {
    setColumns((prev) => {
      const order = ["col1", "col2", "col3"];
      // locate
      let fromCol = null;
      let fromIdx = -1;
      for (const c of order) {
        const i = prev[c].findIndex((x) => x.id === id);
        if (i !== -1) {
          fromCol = c;
          fromIdx = i;
          break;
        }
      }
      if (!fromCol) return prev;
      const fromPos = order.indexOf(fromCol);
      const toPos = fromPos + (direction === "right" ? 1 : -1);
      if (toPos < 0 || toPos >= order.length) return prev;
      const toCol = order[toPos];
      const next = { col1: [...prev.col1], col2: [...prev.col2], col3: [...prev.col3] };
      const [item] = next[fromCol].splice(fromIdx, 1);
      next[toCol].splice(next[toCol].length, 0, item);
      return next;
    });
  };

  const resetLayout = () => setColumns(withHeights(defaultLayout));

  const value = {
    editMode,
    toggleEditMode,
    columns,
    moveWidget,
    reorderWithinColumn,
    resizeWidget,
    adjustHeight,
    moveWidgetToAdjacentColumn,
    resetLayout,
    findItem,
  };

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export function useLayout() {
  const ctx = React.useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used within LayoutProvider");
  return ctx;
}
