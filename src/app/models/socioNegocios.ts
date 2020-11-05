export class BP {
    Header: SocioNegocios;
    TabDireccion: Array<Direcciones>;
    TabContacto: Array<Contacto>;
    constructor() {
        this.TabDireccion = new Array<Direcciones>();
        this.TabContacto = new Array<Contacto>();
    }
}

export class SocioNegocios {
    Serie: string;
    CardCode: string;
    CardName: string;
    CardType: string;
    LicTradNum: string;
    Currency: string;
    E_Mail: string;
    Balance: number;
    IntrntSite: string;
    FormaPago: string;
    MetodoPago: string;
    TaxCode: string;
    Rate: number;
}

export class Direcciones {
    LineNum: number;
    Address: string;
    AdresType: string;
    Country: string;
    County: string;
    State: string;
    Block: string;
    Street: string;
    StreetNo: string;
    ZipCode: string;
    constructor() {
        this.LineNum = -1;
    }
}
export class DocumentNumbering {
    Series: number;
    SeriesName: string;
    NextNumber: number;
    Code: string;
    NumSize: number;
}

export class Contacto {
    CntctCode: number;
    Name: string;
    FirstName: string;
    Title: string;
    MiddleName: string;
    Position: string;
    LastName: string;
    Address: string;
    Tel1: string;
    Cellolar: string;
    E_MailL: string;
}

export class FormaPago {
    IdFormaPago: string;
    DescFormaPago: string;
}

export class MetodoPago {
    IdMetodoPago: string;
    DescMetodoPago: string;
}
