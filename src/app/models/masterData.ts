export class BusnessPartner {
    CardCode: string;
    CardName: string;
    ListNum: number;
    Currency: string;
    VatGroup: string;
}

export class Item {
    LineNum: number;
    ItemCode: string;
    ItemName: string;
    VATLiable: string;
    TaxCodeAR: string;
    Rate: number;
    IndirctTax: string;
    Stock: number;
    SalUnitMsr: string;
    Price: number;
    ItmsGrpCod: number;
    ItmsGrpNam: string;
    WhsCode: string;
    TaxCode: string;
    Currency: string;
}

export class Vendedor {
    SlpCode: number;
    SlpName: string;
}
