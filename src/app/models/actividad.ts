export interface DropDownActivity {
    Code: number;
    Name: string;
}
export interface OportunidadAct {
    OpprId: number;
    Name: string;
    CardCode: string;
}
export interface SocioNegocioAct {
    CardCode: string;
    CardName: string;
}
export interface Actividad {
    ClgCode: number;
    CardCode: string;
    CardName: string;
    Action: string;
}
export interface Stage {
  Line: number;
  SlpName: string;
  Descript: string;
  ClosePrcnt: string;
}
export interface PersonasAct {
    CntctCode: number;
    Name: string;
    Tel1: string;
}
export class ActivitySAP {
    OprId: number;
    OprLine: number;
    ClgCode: number;
    Action: string;
    CntctType: number;
    CntctSbjct: number;
    CntctCode: number;
    CardCode: string;
    CardName: string;
    Tel: string;
    Recontact: string;
    endDate: string;
    BeginTime: string;
    ENDTime: string;
    Priority: number;
    Location: number;
    Notes: string;
    constructor() {
      this.Recontact = '';
      this.endDate = '';
      this.BeginTime = '';
      this.ENDTime = '';
      /* this.OprId = 0; */
      /* this.OprLine = -1; */
      this.ClgCode = -1;
      this.Action = '';
      this.CntctType = 0;
      this.CntctSbjct = -1;
      this.CntctCode = -1;
      this.CardCode = '';
      this.Tel = '';
      this.Priority = -1;
      this.Location = -1;
      this.Notes = '';
    }
}

