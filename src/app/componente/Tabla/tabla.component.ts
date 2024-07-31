import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ServicioService } from 'src/app/servicio/servicio.service';

declare var $: any;

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit, OnDestroy {
  dataTable: any;
  private searchQuery = new BehaviorSubject<string>(''); // Consulta por defecto vacía

  constructor(private ServicioService: ServicioService) {}

  ngOnInit(): void {
    this.initializeDataTable();

    // Configurar debounce para la entrada de búsqueda
    this.searchQuery.pipe(
      debounceTime(300) // Esperar 300ms después de que el usuario deje de escribir
    ).subscribe(query => {
      this.loadTableData(query);
    });
  }

  // Inicializar la DataTable
  initializeDataTable(): void {
    this.dataTable = $('#example').DataTable({
      data: [],
      columns: [
        { title: 'Marca', data: 'make' },
        { title: 'Modelo', data: 'model' },
        { title: 'Año', data: 'year' },
        { title: 'City MPG', data: 'city_mpg' },
        { title: 'Highway MPG', data: 'highway_mpg' },
        { title: 'Comb. MPG', data: 'combination_mpg' },
        { title: 'Cilindrada', data: 'cylinders' },
        { title: 'Desplazamiento', data: 'displacement' },
        { title: 'Tracción', data: 'drive' },
        { title: 'Tipo de Combustible', data: 'fuel_type' },
        { title: 'Transmisión', data: 'transmission' },
        {
          title: 'Acciones',
          data: null,
          defaultContent: '<button class="btn btn-info">Detalles</button>',
          orderable: false
        }
      ],
      dom: 'Bfrtip', // Ajustar según sea necesario
      buttons: [], // Eliminar botones predeterminados (por ejemplo, imprimir, excel)
      searching: false, // Deshabilitar la caja de búsqueda predeterminada
      paging: true,
      pageLength: 20, // Configurar el número de registros por página
      info: true,
      processing: true,
      language: {
        // Traducción al español
        sEmptyTable: "No hay datos disponibles en la tabla",
        sInfo: "Mostrando _START_ a _END_",
        sInfoEmpty: "Mostrando 0 a 0 ",
        sInfoFiltered: "(filtrado de _MAX_ entradas en total)",
        sInfoPostFix: "",
        sInfoThousands: ",",
        sLengthMenu: "Mostrar _MENU_ entradas",
        sLoadingRecords: "Cargando...",
        sProcessing: "Procesando...",
        sSearch: "Buscar:",
        sZeroRecords: "No se encontraron resultados",
        oPaginate: {
          sFirst: "Primero",
          sLast: "Último",
          sNext: "Siguiente",
          sPrevious: "Anterior"
        },
        oAria: {
          sSortAscending: ": Activar para ordenar la columna en orden ascendente",
          sSortDescending: ": Activar para ordenar la columna en orden descendente"
        },
        scrollX: true, // Activa el scroll horizontal
        responsive: true, // Hace que la tabla sea responsive
        paging: true, // Habilita la paginación
        searching: true // Habilita la búsqueda
      }
    });

    // Manejar el evento de clic para los botones
    $('#example tbody').on('click', 'button', (event: any) => {
      const data = this.dataTable.row($(event.target).parents('tr')).data();
      this.handleButtonClick(data);
    });
  }

  // Cargar datos de la tabla desde la API
  loadTableData(query: string): void {  
    if (query) {
      this.ServicioService.getCars(query).subscribe((data: any) => {
        this.dataTable.clear().rows.add(data).draw();
      });
    }
  }

  // Manejar eventos de entrada del campo de búsqueda
  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery.next(inputElement.value); // Actualizar el BehaviorSubject con la nueva consulta
  }

  // Manejar el clic en el botón de acción
  handleButtonClick(data: any): void {
    alert(`Detalles:\nMarca: ${data.make}\nModelo: ${data.model}\nAño: ${data.year}\nCity MPG: ${data.city_mpg}\nHighway MPG: ${data.highway_mpg}\nComb. MPG: ${data.combination_mpg}\nCilindrada: ${data.cylinders}\nDesplazamiento: ${data.displacement}\nTracción: ${data.drive}\nTipo de Combustible: ${data.fuel_type}\nTransmisión: ${data.transmission}`);
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
}
