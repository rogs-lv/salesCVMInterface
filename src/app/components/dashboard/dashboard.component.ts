import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { DashService } from '../../services/dashboard/dash.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import Swal from 'sweetalert2';
import { Anuncio, Cotizacion } from 'src/app/models/dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  DtsNoticas: Array<Anuncio>;
  DtsPromo: Array<Anuncio>;
  DtsCotizaciones: Array<Cotizacion>;
  // Valores para llenar la tabla
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Cuotas' },
    { data: [], label: 'Ventas' }
  ];
  // public lineChartData: ChartDataSets[] = [];
  // Linea X
  public lineChartLabels: Label[] = ['Enero', 'Febrero', 'Marzo', 'April', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  // Pendiente
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(0,0,0,0.3)',
          },
          ticks: {
            fontColor: 'black',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  // Colores a las lineas y sombras
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(92,181,66,0.3)',
      borderColor: 'rgba(23,102,35,0.5)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: 'rgba(230,154,16,0.3)',
      borderColor: 'rgba(138,106,20,0.5)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  public lineChartLegend = true;
  public lineChartType = 'line';

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  // Metodo de prueba para generar numeros aleatorios
  public randomize(): void {
    for (let i = 0; i < this.lineChartData.length; i++) {
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        this.lineChartData[i].data[j] = this.generateNumber(i);
      }
    }
    this.chart.update();
  }
  // Metodo de prueba para devolver numero
  private generateNumber(i: number) {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  constructor(
    private services: DashService,
    private auth: AuthService
  ) {
    this.DtsNoticas = new Array<Anuncio>();
    this.DtsPromo = new Array<Anuncio>();
    this.DtsCotizaciones = new Array<Cotizacion>();
  }

  ngOnInit() {
    this.getProm();
    this.getNot();
    this.getGrafica();
    this.getCoti();
  }

  getProm() {
    const usr = this.auth.getDataToken();
    this.services.getPromociones(this.auth.getToken(), usr.Sucursal).subscribe(response => {
      if (response.codigo === 0) {
        this.DtsPromo = response.mensaje;
      } else {
        return;
      }
    }, (err) => {
      Swal.fire({
        title: 'Error al obtener las promociones',
        icon: 'error',
        text: err.error.ExceptionMessage ? err.error.ExceptionMessage : err.error.Message
      });
    });
  }

  getNot() {
    const usr = this.auth.getDataToken();
    this.services.getNoticias(this.auth.getToken(), usr.Sucursal).subscribe(response => {
      if (response.codigo === 0) {
        this.DtsNoticas = response.mensaje;
      } else {
        return;
      }
    }, (err) => {
      Swal.fire({
        title: 'Error al obtener las ultimas noticias',
        icon: 'error',
        text: err.error.ExceptionMessage ? err.error.ExceptionMessage : err.error.Message
      });
    });
  }

  getGrafica() {
    const usr = this.auth.getDataToken();
    this.services.getDtsGrafica(this.auth.getToken(), usr.Code).subscribe(response => {
      if (response.codigo === 0) {
        // tslint:disable-next-line: forin
        for (const key in response.mensaje) {
          this.lineChartData[0].data.push(response.mensaje[key].U_Cuota);
        }
        // tslint:disable-next-line: forin
        for (const key in response.mensaje) {
          this.lineChartData[1].data.push(response.mensaje[key].Ventas);
        }
      } else {
        return;
      }
    }, (err) => {
      Swal.fire({
        title: 'Error al obtener datos para la grafica',
        icon: 'error',
        text: err.error.ExceptionMessage ? err.error.ExceptionMessage : err.error.Message
      });
    });
  }

  getCoti() {
    const usr = this.auth.getDataToken();
    this.services.getCoti(this.auth.getToken(), usr.Code).subscribe(response => {
      if (response.codigo === 0) {
        this.DtsCotizaciones = response.mensaje;
      } else {
        return;
      }
    }, (err) => {
      Swal.fire({
        title: 'Error al obtener las promociones',
        icon: 'error',
        text: err.error.ExceptionMessage ? err.error.ExceptionMessage : err.error.Message
      });
    });
  }
  actualizarGrafica() {
    this.getGrafica();
  }
}
