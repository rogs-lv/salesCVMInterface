export class DocArticulo {
    Header: Articulo;
    TabsProps: Array<Propiedad>;
}

export class Articulo {
    ItemCode: string;
    ItemName: string;
    ItmsGrpCod: string;
    UgpEntry: string;
    ListNum: number;
    Price: number;
    InvntItem: boolean;
    SellItem: boolean;
    PrchseItem: boolean;
    WTLiable: boolean;
    VATLiable: boolean;
    validFor: boolean;
    CodeBars: string;

    constructor() {
        this.ItemCode = '';
        this.ItemName = '';
        this.ItmsGrpCod = '';
        this.UgpEntry = '';
        this.ListNum = -2;
        this.Price = null;
        this.InvntItem = false;
        this.SellItem = false;
        this.PrchseItem = false;
        this.WTLiable = false;
        this.VATLiable = false;
        this.validFor = null;
        this.CodeBars = '';
    }
}

export class Propiedad {
    ItmsTypCod: number;
    ItmsGrpNam: string;
    Status: boolean;
}

export class PriceList {
    ListNum: number;
    ListName: string;
}

export class PrecioArticulo {
    Price: number;
    ItemCode: string;
}

export class UoM {
    UgpEntry: number;
    UgpCode: string;
    UgpName: string;
}

export class GrupoArticulos {
    ItmsGrpCod: number;
    ItmsGrpNam: string;
}
