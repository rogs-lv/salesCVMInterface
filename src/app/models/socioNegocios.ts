export class BP {
    Header: SocioNegocios;
    TabDireccion: Array<Direcciones>;
    constructor() {
        this.TabDireccion = new Array<Direcciones>();
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
    ZipCode: number;
    constructor() {
        this.LineNum = -1;
    }
}
