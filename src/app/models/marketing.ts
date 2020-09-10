export class DocSAP {
    Header: Document;
    Detail: Array<DocumentLines>;
}

export class Document {
    DocEntry: number;
    CardCode: string;
    CardName: string;
    DocDate: string;
    Reference: string;
    Comments: string;
    Status: string;
    DocEntrySAP: number;
    DocNumSAP: number;

    constructor() {
        this.DocEntry = 0;
        this.CardCode = '';
        this.CardName = '';
        this.DocDate = '';
        this.Reference = '';
        this.Comments = '';
        this.Status = '';
        this.DocEntrySAP = 0;
        this.DocNumSAP = 0;
    }
}

export class DocumentLines {
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