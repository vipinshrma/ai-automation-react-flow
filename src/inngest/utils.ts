import { Connection, Node } from '@/generated/prisma';
import toposort from 'toposort';

export const topologicalSort = (nodes: Node[], connections: Connection[]) => {
    if (connections.length === 0) return nodes;

    //create edges array for toposort

    const edges: [string, string][] = connections.map((connection) => [connection.fromNodeId, connection.toNodeId]);

    // add nodes with no connections as selft-edges to ensure they're included
    const connectedNodeIds = new Set<string>();
    for (const conn of connections) {
        connectedNodeIds.add(conn.fromNodeId);
        connectedNodeIds.add(conn.toNodeId);
    }

    for (const node of nodes) {
        if (!connectedNodeIds.has(node.id)) {
            edges.push([node.id, node.id] as [string, string]);
        }
    }

    // Perform topological sort
    let sortedNodeIds: string[] = [];
    try {
        sortedNodeIds = toposort(edges);
        sortedNodeIds = [...new Set(sortedNodeIds)];
    } catch (error) {
        if (error instanceof Error && error.message.includes('Cyclic')) {
            throw new Error('Failed to sort nodes topologically');
        }
        throw error;
    }

    // Use a Map for efficient node lookup by ID
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    return sortedNodeIds.map(id => nodeMap.get(id)!).filter(Boolean)
}