export interface PersonaContacto {
    CntctCode: number;
    Name: string;
}
export interface Territorio {
    territryID: number;
    descript: string;
}
export interface Vendedor {
    SlpCode: number;
    SlpName: string;
}

export interface ProyectoSN {
    PrjCode: string;
    PrjName: string;
}
export interface FuenteInformacion {
    Num: number;
    Descript: string;
}
export interface Industria {
    IndCode: number;
    IndName: string;
    IndDesc: string;
}
export interface Etapas {
    Num: number;
    Descript: string;
    StepId: number;
    CloPrcnt: number;
}
export interface OpenDocs {
    DocEntry: number;
    DocNum: number;
    CardCode: string;
    CardName: string;
    DocDueDate: Date;
    DocDate: Date;
}
export class RowEtapas {
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
    Memo: string;
    iPortal: number;
    constructor() {
        this.Line = -1;
        this.ParterId = -1;
        this.Name = '';
        this.OrlCode = -2;
        this.OrlDesc = '';
        this.RelatCard = '';
        this.Memo = '';
        this.iPortal = 0;
    }
}
export interface Relacion {
    OrlCode: number;
    OrlDesc: string;
}
export class Competidores {
    Line: number;
    CompetId: number;
    NameCompet: string;
    ThreatLevi: string;
    Name: string;
    Memo: string;
    Won: boolean;
    iPortal: number;
    constructor() {
        this.Line = -1;
        this.CompetId = -1;
        this.NameCompet = '';
        this.ThreatLevi = '';
        this.Name = '';
        this.Memo = '';
        this.Won = false;
        this.iPortal = 0;
    }
}
export interface PartnerOpp {
    CardCode: string;
    CardName: string;
    SlpCode: number;
}
// Document SAP
export class TableCompet {
    Line: number;
    CompetId: number;
    NameCompet: string;
    ThreatLevi: string;
    Name: string;
    Memo: string;
    Won: boolean;
    iPortal: number;
}
interface ITableEtapa {
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
}
export class TableEtapa {
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
    constructor(obj?: ITableEtapa) {
        this.SlpCode = obj.SlpCode || -1;
        this.SlpName = obj.SlpName || '';
        this.OpenDate = obj.OpenDate || new Date();
        this.CloseDate = obj.CloseDate || new Date();
        this.Step_Id = obj.Step_Id || -1;
        this.Descript = obj.Descript || '';
        this.ClosePrcnt = obj.ClosePrcnt || 0;
        this.WtSumLoc = obj.WtSumLoc || 0;
        this.ObjType = obj.ObjType || -1;
        this.DocNumber = obj.DocNumber || 0;
        this.LineNum = obj.LineNum || -1;
        this.Status = obj.Status || '';
    }
}
export class TablePartner {
    Line: number;
    ParterId: number;
    Name: string;
    OrlCode: number;
    OrlDesc: string;
    RelatCard: string;
    Memo: string;
    iPortal: number;
}
export class TabGeneral {
    PrjCode: string;
    Source: number;
    Industry: number;
    Memo: string;
}

export class TabPotencial {
    PredDate: Date;
    ClosePrev: number;
    MaxSumLoc: number;
}
export class TabResumen {
    Status: string;
    ReasondId: number;
    Descript: string;
    DocType: number;
    Name: string;
    DocNum: number;
}
export class Document {
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
    DocType: number;
    DocNum: number;
    ReasondId: number;
    CloseDate: Date;
    constructor() {
        this.OpprId = -1;
        this.Name = '';
        this.CardCode = '';
        this.CardName = '';
        this.CloPrcnt = 0;
        this.SlpCode = -1;
        this.SlpName = '';
        this.CprCode = -1;
        this.Territory = -2;
        this.OpenDate = new Date();
        this.Status = '';
        this.DocType = 0;
        this.DocNum = -1;
        this.ReasondId = -1;
        this.CloseDate = new Date();
    }
}
export class DocumentTab {
    TabPotencial: TabPotencial;
    TabGeneral: TabGeneral;
    TableEtapas: Array<TableEtapa>;
    TablePartner: Array<TablePartner>;
    TableCompet: Array<TableCompet>;
    TabResumen: TabResumen;
    constructor() {
        this.TabPotencial = new TabPotencial();
        this.TabGeneral = new TabGeneral();
        this.TableEtapas = new Array<TableEtapa>();
        this.TablePartner = new Array<TablePartner>();
        this.TableCompet = new Array<TableCompet>();
        this.TabResumen = new TabResumen();
    }
}
export class Opportunity {
    Header: Document;
    Tabs: DocumentTab;
    constructor() {
        this.Header = new Document();
        this.Tabs = new DocumentTab();
    }
}
