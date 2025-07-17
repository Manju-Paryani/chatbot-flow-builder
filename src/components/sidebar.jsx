// src/components/sidebar.jsx

export default function Sidebar({ selectedNode, setSelectedNode, updateNodeLabel }) {
    if (selectedNode) {
        return (
            <div className="w-1/4 bg-gray-100 p-4 border-r space-y-4">
                <h2 className="font-bold text-lg">Settings Panel</h2>
                <label className="block font-medium">Text</label>
                <input
                    type="text"
                    value={selectedNode.data.label}
                    onChange={(e) => updateNodeLabel(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                />
                <button
                    className="mt-4 text-blue-600 underline"
                    onClick={() => setSelectedNode(null)}
                >
                    ← Back to Node Panel
                </button>
            </div>
        );
    }

    return (
        <div className="w-1/2 bg-gray-100 p-4 border-r">
            <h2 className="font-bold text-lg mb-4">Nodes</h2>
            <div
                className="bg-white p-2 border rounded cursor-move"
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.setData('application/reactflow', 'textNode');
                    e.dataTransfer.effectAllowed = 'move';
                }}
            >
                Text Node
            </div>
        </div>
    );
}
