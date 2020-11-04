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
    PicturName: string;

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
        this.PicturName = '';
    }
}

export class Propiedad {
    ItmsTypCod: number;
    ItmsGrpNam: string;
    Status: boolean;
}

export class Inventario {
    WhsCode: string;
    WhsName: string;
    Locked: string;
    OnHand: number;
    IsCommited: number;
    OnOrder: number;
    Disponible: number;
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

export class Permiso {
    Read: string;
    Write: string;
    Edit: string;

    constructor() {
        this.Read = 'Y';
        this.Write = 'N';
        this.Edit = 'N';
    }
}
