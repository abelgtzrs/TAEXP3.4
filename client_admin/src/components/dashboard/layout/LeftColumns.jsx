import React from "react";
import { useLayout } from "../../../context/LayoutContext";
import { registry } from "./widgetRegistry";
import DraggableWidgetShell from "./DraggableWidgetShell";

function DropZone({ columnId, index, onDropHere, isActive }) {
  return (
    <div
      className={`h-3 my-1 rounded transition-colors ${isActive ? "bg-emerald-500/60" : "bg-transparent"}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        try {
          const data = JSON.parse(e.dataTransfer.getData("application/json"));
          onDropHere(data.id, data.fromColumn, index);
        } catch {}
      }}
    />
  );
}

function Column({ id: columnId, items, extraProps }) {
  const { editMode, moveWidget } = useLayout();

  const onDragStartItem = (e, itemId) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ id: itemId, fromColumn: columnId }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDropAt = (id, fromColumn, index) => {
    moveWidget(id, columnId, index);
  };

  return (
    <div className="min-w-0 space-y-2" onDragOver={(e) => e.preventDefault()}>
      {items.map((item, i) => {
        const Comp = registry[item.key];
        if (!Comp) return null;
        return (
          <React.Fragment key={item.id}>
            {editMode && <DropZone columnId={columnId} index={i} onDropHere={handleDropAt} />}
            <div
              draggable={editMode}
              onDragStart={(e) => onDragStartItem(e, item.id)}
              className={editMode ? "cursor-move" : ""}
            >
              <DraggableWidgetShell item={item} columnId={columnId} index={i}>
                <Comp {...extraProps} />
              </DraggableWidgetShell>
            </div>
          </React.Fragment>
        );
      })}
      {editMode && <DropZone columnId={columnId} index={items.length} onDropHere={handleDropAt} />}
    </div>
  );
}

export default function LeftColumns({ extraProps }) {
  const { columns } = useLayout();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
      <Column id="col1" items={columns.col1} extraProps={extraProps} />
      <Column id="col2" items={columns.col2} extraProps={extraProps} />
      <Column id="col3" items={columns.col3} extraProps={extraProps} />
    </div>
  );
}
