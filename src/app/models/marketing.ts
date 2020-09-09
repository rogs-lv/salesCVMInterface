export class DocSAP {
    Header: Document;
    Detail: Array<DocumentLines>;
}

class Document {
    DocEntry: number;
    CardCode: string;
    CardName: string;
    DocDate: string;
    Reference: string;
    Comments: string;
    Status: string;
    DocEntrySAP: number;
    DocNumSAP: number;
}

class DocumentLines {
    DocEntry: number;
    ItemCode: string;
    ItemName: string;
    Quantity: number;
    Price: number;
    UnitePrice: number;
    Discount: number;
    Currency: string;
    TaxCode: string;
}