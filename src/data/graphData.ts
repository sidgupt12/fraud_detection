export type NodeKind = "SME" | "Vendor" | "Shell" | "NBFC" | "Bank" | "Customer";
export type EdgeKind = "normal" | "suspicious" | "amber";

export interface GraphNode {
  id: string;
  label: string;
  kind: NodeKind;
  risk: number;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  amount: string;
  kind: EdgeKind;
  label?: string;
}

export interface GraphDataset {
  nodes: GraphNode[];
  edges: GraphEdge[];
  meta: {
    nodeCount: number;
    edgeCount: number;
    suspiciousEdges: number;
    threshold: number;
    gcnSpec: string;
  };
}

/* -------- Q1 FY24 — CLEAR: tight two-vendor procurement, three core customers -------- */
const sample1: GraphDataset = {
  nodes: [
    { id: "F", label: "Apex Retail", kind: "SME", risk: 0.12, x: 0.5, y: 0.5 },
    { id: "V1", label: "Anchor Distributor – North", kind: "Vendor", risk: 0.15, x: 0.18, y: 0.28 },
    { id: "V2", label: "Anchor Distributor – West", kind: "Vendor", risk: 0.16, x: 0.18, y: 0.7 },
    { id: "C1", label: "Flagship Metro", kind: "Customer", risk: 0.11, x: 0.82, y: 0.25 },
    { id: "C2", label: "Tier-1 Franchise", kind: "Customer", risk: 0.13, x: 0.82, y: 0.55 },
    { id: "C3", label: "Modern Trade Partner", kind: "Customer", risk: 0.12, x: 0.82, y: 0.82 },
    { id: "B", label: "HDFC SME", kind: "Bank", risk: 0.07, x: 0.5, y: 0.12 },
  ],
  edges: [
    { source: "V1", target: "F", amount: "₹4,80,000", kind: "normal" },
    { source: "V2", target: "F", amount: "₹3,40,000", kind: "normal" },
    { source: "C1", target: "F", amount: "₹14,20,000", kind: "normal" },
    { source: "C2", target: "F", amount: "₹11,50,000", kind: "normal" },
    { source: "C3", target: "F", amount: "₹9,80,000", kind: "normal" },
    { source: "B", target: "F", amount: "₹50,00,000", kind: "normal" },
  ],
  meta: {
    nodeCount: 7,
    edgeCount: 6,
    suspiciousEdges: 0,
    threshold: 0.05,
    gcnSpec: "2-layer GCN · Input → 128-dim hidden → 64-dim embedding",
  },
};

/* -------- Q2 FY24 — CLEAR: festival / logistics churn (still acyclic) -------- */
const sample2: GraphDataset = {
  nodes: [
    { id: "F", label: "Apex Retail", kind: "SME", risk: 0.11, x: 0.5, y: 0.5 },
    { id: "V1", label: "North Imports", kind: "Vendor", risk: 0.13, x: 0.14, y: 0.28 },
    { id: "V2", label: "West Foods", kind: "Vendor", risk: 0.14, x: 0.14, y: 0.62 },
    { id: "V3", label: "Regional Logistics", kind: "Vendor", risk: 0.18, x: 0.34, y: 0.86 },
    { id: "C1", label: "Metro Wholesale", kind: "Customer", risk: 0.1, x: 0.84, y: 0.2 },
    { id: "C2", label: "Institutional Buyer", kind: "Customer", risk: 0.11, x: 0.88, y: 0.48 },
    { id: "C3", label: "Online Aggregator", kind: "Customer", risk: 0.12, x: 0.82, y: 0.78 },
    { id: "B", label: "HDFC SME", kind: "Bank", risk: 0.07, x: 0.5, y: 0.1 },
  ],
  edges: [
    { source: "V1", target: "F", amount: "₹5,35,000", kind: "normal" },
    { source: "V2", target: "F", amount: "₹3,95,000", kind: "normal" },
    { source: "V3", target: "F", amount: "₹2,42,000", kind: "normal" },
    { source: "C1", target: "F", amount: "₹16,40,000", kind: "normal" },
    { source: "C2", target: "F", amount: "₹13,60,000", kind: "normal" },
    { source: "C3", target: "F", amount: "₹10,55,000", kind: "normal" },
    { source: "B", target: "F", amount: "₹52,00,000", kind: "normal" },
  ],
  meta: {
    nodeCount: 8,
    edgeCount: 7,
    suspiciousEdges: 0,
    threshold: 0.05,
    gcnSpec: "2-layer GCN · Input → 128-dim hidden → 64-dim embedding",
  },
};

/* -------- Q3 FY24 — REVIEW (4 shells appear) -------- */
const sample3: GraphDataset = {
  nodes: [
    { id: "F", label: "Apex Retail", kind: "SME", risk: 0.32, x: 0.5, y: 0.5 },
    { id: "VX", label: "Vendor X", kind: "Vendor", risk: 0.61, x: 0.32, y: 0.28 },
    { id: "S1", label: "Shell 1", kind: "Shell", risk: 0.78, x: 0.14, y: 0.16 },
    { id: "S2", label: "Shell 2", kind: "Shell", risk: 0.74, x: 0.16, y: 0.4 },
    { id: "S3", label: "Shell 3", kind: "Shell", risk: 0.72, x: 0.16, y: 0.62 },
    { id: "S4", label: "Shell 4", kind: "Shell", risk: 0.71, x: 0.18, y: 0.84 },
    { id: "C1", label: "Customer 1", kind: "Customer", risk: 0.11, x: 0.84, y: 0.22 },
    { id: "C2", label: "Customer 2", kind: "Customer", risk: 0.12, x: 0.86, y: 0.5 },
    { id: "C3", label: "Customer 3", kind: "Customer", risk: 0.13, x: 0.84, y: 0.78 },
    { id: "B", label: "HDFC SME", kind: "Bank", risk: 0.07, x: 0.5, y: 0.1 },
  ],
  edges: [
    { source: "F", target: "VX", amount: "₹14,80,000", kind: "amber" },
    { source: "VX", target: "S1", amount: "₹9,60,000", kind: "suspicious" },
    { source: "VX", target: "S2", amount: "₹9,20,000", kind: "suspicious" },
    { source: "VX", target: "S3", amount: "₹9,80,000", kind: "suspicious" },
    { source: "VX", target: "S4", amount: "₹9,80,000", kind: "suspicious" },
    { source: "C1", target: "F", amount: "₹15,40,000", kind: "normal" },
    { source: "C2", target: "F", amount: "₹13,80,000", kind: "normal" },
    { source: "C3", target: "F", amount: "₹10,90,000", kind: "normal" },
    { source: "B", target: "F", amount: "₹50,00,000", kind: "normal" },
  ],
  meta: {
    nodeCount: 10,
    edgeCount: 9,
    suspiciousEdges: 4,
    threshold: 0.05,
    gcnSpec: "2-layer GCN · Input → 128-dim hidden → 64-dim embedding",
  },
};

/* -------- Q4 FY24 — ESCALATE (8 shells, 3 circular cycles) -------- */
const sample4: GraphDataset = {
  nodes: [
    { id: "F", label: "Apex Retail", kind: "SME", risk: 0.55, x: 0.5, y: 0.5 },
    { id: "VX", label: "Vendor X", kind: "Vendor", risk: 0.7, x: 0.3, y: 0.22 },
    { id: "VY", label: "Vendor Y", kind: "Vendor", risk: 0.66, x: 0.3, y: 0.78 },
    { id: "S1", label: "Shell 1", kind: "Shell", risk: 0.84, x: 0.1, y: 0.16 },
    { id: "S2", label: "Shell 2", kind: "Shell", risk: 0.82, x: 0.08, y: 0.36 },
    { id: "S3", label: "Shell 3", kind: "Shell", risk: 0.8, x: 0.08, y: 0.56 },
    { id: "S4", label: "Shell 4", kind: "Shell", risk: 0.78, x: 0.1, y: 0.78 },
    { id: "S5", label: "Shell 5", kind: "Shell", risk: 0.76, x: 0.22, y: 0.92 },
    { id: "S6", label: "Shell 6", kind: "Shell", risk: 0.75, x: 0.5, y: 0.92 },
    { id: "S7", label: "Shell 7", kind: "Shell", risk: 0.74, x: 0.78, y: 0.92 },
    { id: "S8", label: "Shell 8", kind: "Shell", risk: 0.72, x: 0.82, y: 0.7 },
    { id: "C1", label: "Customer 1", kind: "Customer", risk: 0.13, x: 0.86, y: 0.18 },
    { id: "C2", label: "Customer 2", kind: "Customer", risk: 0.14, x: 0.88, y: 0.42 },
    { id: "B", label: "HDFC SME", kind: "Bank", risk: 0.07, x: 0.5, y: 0.1 },
  ],
  edges: [
    { source: "F", target: "VX", amount: "₹18,40,000", kind: "suspicious" },
    { source: "F", target: "VY", amount: "₹14,20,000", kind: "suspicious" },
    { source: "VX", target: "S1", amount: "₹5,00,000", kind: "suspicious" },
    { source: "S1", target: "F", amount: "₹4,80,000", kind: "suspicious", label: "cycle 1" },
    { source: "VX", target: "S2", amount: "₹5,00,000", kind: "suspicious" },
    { source: "S2", target: "F", amount: "₹4,80,000", kind: "suspicious", label: "cycle 2" },
    { source: "VY", target: "S3", amount: "₹5,00,000", kind: "suspicious" },
    { source: "S3", target: "F", amount: "₹4,70,000", kind: "suspicious", label: "cycle 3" },
    { source: "VY", target: "S4", amount: "₹4,80,000", kind: "suspicious" },
    { source: "F", target: "S5", amount: "₹3,40,000", kind: "amber" },
    { source: "F", target: "S6", amount: "₹3,20,000", kind: "amber" },
    { source: "F", target: "S7", amount: "₹2,90,000", kind: "amber" },
    { source: "F", target: "S8", amount: "₹2,60,000", kind: "amber" },
    { source: "C1", target: "F", amount: "₹16,80,000", kind: "normal" },
    { source: "C2", target: "F", amount: "₹14,90,000", kind: "normal" },
    { source: "B", target: "F", amount: "₹50,00,000", kind: "normal" },
  ],
  meta: {
    nodeCount: 14,
    edgeCount: 16,
    suspiciousEdges: 9,
    threshold: 0.05,
    gcnSpec: "2-layer GCN · Input → 128-dim hidden → 64-dim embedding",
  },
};

/* -------- Q1 FY25 — ESCALATE peak (14 shells, 6 cycles) -------- */
const sample5: GraphDataset = {
  nodes: [
    { id: "F", label: "Apex Retail", kind: "SME", risk: 0.71, x: 0.5, y: 0.5 },
    { id: "VX", label: "Vendor X", kind: "Vendor", risk: 0.78, x: 0.3, y: 0.18 },
    { id: "VY", label: "Vendor Y", kind: "Vendor", risk: 0.76, x: 0.3, y: 0.82 },
    { id: "S1", label: "Shell 1", kind: "Shell", risk: 0.92, x: 0.08, y: 0.08 },
    { id: "S2", label: "Shell 2", kind: "Shell", risk: 0.9, x: 0.05, y: 0.26 },
    { id: "S3", label: "Shell 3", kind: "Shell", risk: 0.88, x: 0.05, y: 0.44 },
    { id: "S4", label: "Shell 4", kind: "Shell", risk: 0.86, x: 0.05, y: 0.62 },
    { id: "S5", label: "Shell 5", kind: "Shell", risk: 0.84, x: 0.05, y: 0.8 },
    { id: "S6", label: "Shell 6", kind: "Shell", risk: 0.82, x: 0.18, y: 0.94 },
    { id: "S7", label: "Shell 7", kind: "Shell", risk: 0.81, x: 0.36, y: 0.94 },
    { id: "S8", label: "Shell 8", kind: "Shell", risk: 0.8, x: 0.54, y: 0.94 },
    { id: "S9", label: "Shell 9", kind: "Shell", risk: 0.79, x: 0.72, y: 0.94 },
    { id: "S10", label: "Shell 10", kind: "Shell", risk: 0.78, x: 0.86, y: 0.78 },
    { id: "S11", label: "Shell 11", kind: "Shell", risk: 0.77, x: 0.92, y: 0.6 },
    { id: "S12", label: "Shell 12", kind: "Shell", risk: 0.76, x: 0.9, y: 0.42 },
    { id: "S13", label: "Shell 13", kind: "Shell", risk: 0.75, x: 0.86, y: 0.24 },
    { id: "S14", label: "Shell 14", kind: "Shell", risk: 0.74, x: 0.7, y: 0.08 },
    { id: "C1", label: "Customer 1", kind: "Customer", risk: 0.14, x: 0.96, y: 0.1 },
    { id: "B", label: "HDFC SME", kind: "Bank", risk: 0.08, x: 0.5, y: 0.06 },
  ],
  edges: [
    { source: "F", target: "VX", amount: "₹24,40,000", kind: "suspicious" },
    { source: "F", target: "VY", amount: "₹19,80,000", kind: "suspicious" },
    // 6 circular cycles via VX/VY → Shell → F
    { source: "VX", target: "S1", amount: "₹7,20,000", kind: "suspicious" },
    { source: "S1", target: "F", amount: "₹7,00,000", kind: "suspicious", label: "cycle 1" },
    { source: "VX", target: "S2", amount: "₹7,00,000", kind: "suspicious" },
    { source: "S2", target: "F", amount: "₹6,90,000", kind: "suspicious", label: "cycle 2" },
    { source: "VX", target: "S3", amount: "₹6,80,000", kind: "suspicious" },
    { source: "S3", target: "F", amount: "₹6,70,000", kind: "suspicious", label: "cycle 3" },
    { source: "VY", target: "S4", amount: "₹6,60,000", kind: "suspicious" },
    { source: "S4", target: "F", amount: "₹6,50,000", kind: "suspicious", label: "cycle 4" },
    { source: "VY", target: "S5", amount: "₹6,40,000", kind: "suspicious" },
    { source: "S5", target: "F", amount: "₹6,30,000", kind: "suspicious", label: "cycle 5" },
    { source: "VY", target: "S6", amount: "₹6,20,000", kind: "suspicious" },
    { source: "S6", target: "F", amount: "₹6,10,000", kind: "suspicious", label: "cycle 6" },
    // peripheral fan-out
    { source: "F", target: "S7", amount: "₹2,80,000", kind: "amber" },
    { source: "F", target: "S8", amount: "₹2,60,000", kind: "amber" },
    { source: "F", target: "S9", amount: "₹2,40,000", kind: "amber" },
    { source: "F", target: "S10", amount: "₹2,20,000", kind: "amber" },
    { source: "F", target: "S11", amount: "₹2,00,000", kind: "amber" },
    { source: "F", target: "S12", amount: "₹1,80,000", kind: "amber" },
    { source: "F", target: "S13", amount: "₹1,60,000", kind: "amber" },
    { source: "F", target: "S14", amount: "₹1,40,000", kind: "amber" },
    // a single legitimate inflow
    { source: "C1", target: "F", amount: "₹16,40,000", kind: "normal" },
    { source: "B", target: "F", amount: "₹50,00,000", kind: "normal" },
  ],
  meta: {
    nodeCount: 19,
    edgeCount: 24,
    suspiciousEdges: 14,
    threshold: 0.05,
    gcnSpec: "2-layer GCN · Input → 128-dim hidden → 64-dim embedding",
  },
};

export const GRAPHS: Record<string, GraphDataset> = {
  sample1,
  sample2,
  sample3,
  sample4,
  sample5,
};

export const NODE_KIND_STYLES: Record<
  NodeKind,
  { fill: string; stroke: string; label: string }
> = {
  SME: { fill: "#16161a", stroke: "#00e5ff", label: "SME" },
  Vendor: { fill: "#16161a", stroke: "#9c998f", label: "Vendor" },
  Shell: { fill: "#1c0e0e", stroke: "#d9695a", label: "Shell entity" },
  NBFC: { fill: "#16161a", stroke: "#e0a050", label: "NBFC" },
  Bank: { fill: "#16161a", stroke: "#7eb27e", label: "Bank" },
  Customer: { fill: "#16161a", stroke: "#c8c5be", label: "Customer" },
};
