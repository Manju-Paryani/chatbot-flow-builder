import { useCallback, useEffect, useState } from 'react';
import {
    addEdge,
    Background,
    Controls,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from 'reactflow';

import { toast } from 'react-toastify';
import 'reactflow/dist/style.css';
import Sidebar from './sidebar';

const initialNodes = [];
const initialEdges = [];

function FlowCanvasInner() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState(null);

    const updateNodeConnectionStatus = useCallback(() => {
        const sources = edges.map(e => e.source);
        const targets = edges.map(e => e.target);

        setNodes(nds =>
            nds.map(node => {
                const hasIncoming = targets.includes(node.id);
                const hasOutgoing = sources.includes(node.id);
                const isIsolated = !hasIncoming || !hasOutgoing;

                return {
                    ...node,
                    className: isIsolated ? 'node-error' : '',
                };
            })
        );
    }, [edges, setNodes]);

    useEffect(() => {
        updateNodeConnectionStatus();
    }, [edges, updateNodeConnectionStatus]);

    const onConnect = useCallback(
        (params) => {
            const existing = edges.some(e => e.source === params.source);
            if (existing) {
                toast.error('Only one outgoing edge allowed per node.');
                return;
            }

            setEdges((eds) => addEdge(params, eds));
        },
        [edges, setEdges]
    );

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const type = event.dataTransfer.getData('application/reactflow');
            if (!type) return;

            const position = { x: event.clientX - 300, y: event.clientY };
            const newNode = {
                id: `${+new Date()}`,
                type: 'default',
                position,
                data: { label: 'Text Node' },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [setNodes]
    );

    const updateNodeLabel = (newLabel) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === selectedNode?.id
                    ? { ...node, data: { ...node.data, label: newLabel } }
                    : node
            )
        );
        setSelectedNode((prev) =>
            prev ? { ...prev, data: { ...prev.data, label: newLabel } } : null
        );
    };

    const validateAndSave = () => {
        if (nodes.length <= 1) {
            console.log('Saved flow:', { nodes, edges });
            toast.success('Flow saved!');
            return;
        }

        const sources = edges.map(e => e.source);
        const targets = edges.map(e => e.target);

        const nodesWithNoOutgoing = nodes.filter(n => !sources.includes(n.id));
        const nodesWithNoIncoming = nodes.filter(n => !targets.includes(n.id));

        if (nodesWithNoOutgoing.length > 1 || nodesWithNoIncoming.length > 1) {
            toast.error('Flow invalid: More than one node is unconnected.');
        }

        nodes.forEach((node) => {
            const hasOutgoing = sources.includes(node.id);
            const hasIncoming = targets.includes(node.id);

            if (!hasOutgoing || !hasIncoming) {
                toast.warn(`Node "${node.data.label}" is not fully connected.`);
            }
        });

        console.log('✅ Saved Flow:', { nodes, edges });
    };

    return (
        <div className="flex h-screen relative">
            <Sidebar
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
                updateNodeLabel={updateNodeLabel}
            />
            <div
                className="w-full h-full"
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={(_, node) => setSelectedNode(node)}
                    fitView
                >
                    <Background />
                    <Controls />
                </ReactFlow>

                <div className="absolute bottom-4 right-4">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow"
                        onClick={validateAndSave}
                    >
                        Save Flow
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function FlowCanvas() {
    return (
        <>
            <style>
                {`
                .react-flow__node-default.node-error {
                    border: 2px solid red !important;
                    border-radius: 6px;
                    background-color: #ffecec;
                }
                `}
            </style>
            <ReactFlowProvider>
                <FlowCanvasInner />
            </ReactFlowProvider>
        </>
    );
}
