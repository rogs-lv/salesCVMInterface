export class BP {
    Header: SocioNegocios;
    TabDireccion: Direcciones;
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
    Address: string;
    AdresType: string;
    Country: string;
    County: string;
    State: string;
    Block: string;
    Street: string;
    StreetNo: string;
    ZipCode: number;

}
