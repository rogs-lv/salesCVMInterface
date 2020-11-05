export class DocSAP {
    Header: Document;
    Detail: Array<DocumentLines>;
}

export class Document {
    DocEntry: number;
    DocNum: number;
    CardCode: string;
    CardName: string;
    DocDate: string;
    TaxDate: string;
    Reference: string;
    Comments: string;
    Status: string;
    DocEntrySAP: number;
    DocNumSAP: number;
    SlpCode: number;
    ShipToCode: string;
    CntctCode: number;
    TaxCode: string;
    Rate: number;

    constructor() {
        this.DocEntry = 0;
        this.DocNum = 0;
        this.CardCode = '';
        this.CardName = '';
        this.DocDate = '';
        this.Reference = '';
        this.Comments = '';
        this.Status = '';
        this.DocEntrySAP = 0;
        this.DocNumSAP = 0;
        this.SlpCode = 0;
        this.ShipToCode = '';
        this.CntctCode = 0;
        this.TaxCode = '';
        this.Rate = 0;
    }
}

export class DocumentLines {
    DocEntry: number;
    LineNum: number;
    ItemCode: string;
    ItemName: string;
    Quantity: number;
    Price: number;
    UnitePrice: number;
    Discount: number;
    Currency: string;
    TaxCode: string;
}

export class ImpSN {
    TaxCodeAR: string;
    Rate: number;
}
