export class OpenDocs {
    DocEntry: number;
    DocNum: number;
    CardCode: string;
    CardName: string;
    DocDueDate: Date;
    DocDate: Date;

    constructor() {
        this.DocEntry = 0;
        this.DocNum = 0;
        this.CardCode = '';
        this.CardName = '';
        this.DocDueDate = new Date();
        this.DocDate = new Date();
    }
}
export class Opportunity {
    OpprId: number;
    Name: string;
    CardCode: string;
    CardName: string;
    CloPrcnt: number;
    SlpCode: number;
    SlpName: string;
    CprCode: number;
    Territory: number;
    OpenDate: Date;
    Status: string;
    DocType: string;
    DocNum: number;
    ReasondId: number;
    CloseDate: Date;
    constructor() {
        this.OpprId = 0;
        this.Name = '';
        this.CardCode = '';
        this.CardName = '';
        this.CloPrcnt = 0;
        this.SlpCode  = 0;
        this.SlpName  = '';
        this.CprCode  = 0;
        this.Territory = 0;
        this.OpenDate = new Date();
        this.Status = 'O';
        this.DocType = '';
        this.DocNum = 0;
        this.ReasondId = -1;
        this.CloseDate = new Date();
    }
}

export class Potencial {
    PredDate: Date;
    ClosePrev: number;
    MaxSumLoc: number;

    constructor() {
        this.PredDate = new Date();
        this.ClosePrev = 0;
        this.MaxSumLoc = 0;
    }
}

export class General {
    PrjCode: string;
    Source: number;
    Industry: number;
    Memo: string;

    constructor() {
        this.PrjCode = '';
        this.Source = 0;
        this.Industry = 0;
        this.Memo = '';
    }
}

export class Etapas {
    SlpCode: number;
    SlpName: string;
    OpenDate: Date;
    CloseDate: Date;
    Step_Id: number;
    Descript: string;
    ClosePrcnt: number;
    WtSumLoc: number;
    ObjType: number;
    DocNumber: number;
    LineNum: number;
    Status: string;
    constructor() {
        this.SlpCode = 0;
        this.SlpName = '';
        this.OpenDate = new Date();
        this.CloseDate = new Date();
        this.Step_Id = 0;
        this.Descript = '';
        this.ClosePrcnt = 0;
        this.WtSumLoc = 0;
        this.ObjType = 0;
        this.DocNumber = 0;
        this.LineNum = -1;
        this.Status = '';
    }
}

export class Partner {
    Line: number;
    ParterId: number;
    Name: string;
    OrlCode: number;
    OrlDesc: string;
    RelatCard: string;
    Memo: string ;

    constructor() {
        this.Line = -1;
        this.ParterId = 0;
        this.Name = '';
        this.OrlCode = 0;
        this.RelatCard = '';
        this.Memo = '';
    }
}

export class Competidores {
    Line: number;
    CompetId: number;
    NameCompet: string;
    ThreatLevi: string;
    Name: string;
    Memo: string;
    Won: boolean;

    constructor() {
        this.Line       = -1;
        this.CompetId   = 0;
        this.NameCompet = '';
        this.ThreatLevi = '';
        this.Name       = '';
        this.Memo       = '';
        this.Won        = false;
    }
}

export class Resumen {
    Status: string;
    ReasondId: number;
    Descript: string;
    DocType: number;
    Name: string;
    DocNum: number;
    constructor() {
        this.Status = '';
        this.ReasondId = 0;
        this.Descript = '';
        this.DocType = 0;
        this.Name = '';
        this.DocNum = 0;
    }
}

export class PersonaContacto {
    CntctCode: number;
    Name: string;
    constructor() {
        this.CntctCode = -1;
        this.Name = '';
    }
}
export class Territorio {
    territryID: number;
    descript: string;
    constructor() {
        this.territryID = -1;
        this.descript = '';
    }
}
export class Vendedor {
    SlpCode: number;
    SlpName: string;
    constructor() {
        this.SlpCode = -1;
        this.SlpName = '';
    }
}

export class ProyectoSN {
    PrjCode: string;
    PrjName: string;

    constructor() {
        this.PrjCode = '';
        this.PrjName = '';
    }
}
export class FuenteInformacion {
    Num: number;
    Descript: string;

    constructor() {
        this.Num = 0;
        this.Descript = '';
    }
}
export class Industria {
    IndCode: number;
    IndName: string;
    IndDesc: string;

    constructor()  {
        this.IndCode = 0;
        this.IndName = '';
        this.IndDesc = '';
    }
}

export class OptionsHeaderOpp {
    ListPrsContacto: Array<PersonaContacto>;
    ListTerritorio: Array<Territorio>;
    ListVendedor: Array<Vendedor>;

    constructor() {
        this.ListPrsContacto = new Array<PersonaContacto>();
        this.ListTerritorio  = new Array<Territorio>();
        this.ListVendedor    = new Array<Vendedor>();
    }
}
export class Razones {
    Num: number;
    Descript: string;
    constructor() {
        this.Num = 0;
        this.Descript = '';
    }
}
export class Relacion {
    OrlCode: number;
    OrlDesc: string;
    constructor() {
        this.OrlCode = 0;
        this.OrlDesc = '';
    }
}
export class OptionsTabGralOpp {
    ListProyectoSN: Array<ProyectoSN>;
    ListaInformacion: Array<FuenteInformacion>;
    ListIndustria: Array<Industria>;
    ListVendedor: Array<Vendedor>;
    ListEtapa: Array<OptsEtapas>;
    ListRelacion: Array<Relacion>;
    ListCompetidor: Array<Competidores>;
    ListPartner: Array<Partner>;
    ListRazones: Array<Razones>;
    constructor() {
        this.ListProyectoSN = new Array<ProyectoSN>();
        this.ListaInformacion = new Array<FuenteInformacion>();
        this.ListIndustria = new Array<Industria>();
        this.ListVendedor = new Array<Vendedor>();
        this.ListEtapa = new Array<OptsEtapas>();
        this.ListRelacion = new Array<Relacion>();
        this.ListCompetidor = new Array<Competidores>();
        this.ListPartner = new Array<Partner>();
    }
}

class TabsOpportunity {
    TabPotencial: Potencial;
    TabGeneral: General;
    TabEtapa: Etapas;
    TabPartner: Partner;
    TabCompetidor: Competidores;
    TabResumen: Resumen;
    TableEtapas: Array<Etapas>;
    TablePartner: Array<Partner>;
    TableCompet: Array<Competidores>;

    constructor() {
        this.TabPotencial = new Potencial();
        this.TabGeneral = new General();
        this.TabEtapa = new Etapas();
        this.TabPartner = new Partner();
        this.TabCompetidor = new Competidores();
        this.TabResumen = new Resumen();
        this.TableEtapas = new Array<Etapas>();
        this.TablePartner = new Array<Partner>();
        this.TableCompet = new Array<Competidores>();
    }
}

export class OpportunitySAP {
    Header: Opportunity;
    Detail: TabsOpportunity;
    constructor() {
        this.Header = new Opportunity();
        this.Detail = new TabsOpportunity();
    }
}

export class BusinessP {
    CardCode: string;
    CardName: string;
    SlpCode: number;
    constructor() {
        this.CardCode = '';
        this.CardName = '';
        this.SlpCode = 0;
    }
}

export class OptsEtapas {
    Num: number;
    Descript: string;
    StepId: number;
    CloPrcnt: number;
    constructor() {
        this.Num = 0;
        this.Descript = '';
        this.StepId = 0;
        this.CloPrcnt = 0;
    }
}
