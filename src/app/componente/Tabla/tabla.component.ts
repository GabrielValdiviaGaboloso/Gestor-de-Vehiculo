import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ServicioService } from 'src/app/servicio/servicio.service';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit, OnDestroy {
  dataTable: any;
  private searchQuery = new BehaviorSubject<string>(''); // Consulta por defecto vacía
  selectedData: any; // Para almacenar los datos del vehículo seleccionado
  carForm: FormGroup;
  car = ["make", "model", "year", "transmission"]
   

  constructor(private ServicioService: ServicioService,private fb: FormBuilder) {
    this.carForm = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      transmission: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.carForm.valid) {
      console.log('Form Value:', this.carForm.value);
    } else {
      console.log('Form is invalid');
    }
  }


  ngOnInit(): void {
    this.initializeDataTable();

    // Configurar debounce para la entrada de búsqueda
    this.searchQuery.pipe(
      debounceTime(200) // Esperar 200ms después de que el usuario deje de escribir
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
        { title: 'Carretera MPG', data: 'highway_mpg' },
        { title: 'Ambos MPG', data: 'combination_mpg' },
        { title: 'Cilindrada', data: 'cylinders' },
        { title: 'Desplazamiento', data: 'displacement' },
        { title: 'Tracción', data: 'drive' },
        { title: 'Tipo de Combustible', data: 'fuel_type' },
        { title: 'Transmisión', data: 'transmission' },
        {
          title: 'Mapa',
          data: null,
          defaultContent: '<button type="button" class="btn btn-secondary " >Ubicar</button>',
          orderable: false
        }
      ],
      dom: 'Bfrtip',
      buttons: [],
      searching: false,
      paging: true,
      pageLength: 20,
      info: true,
      processing: true,
      language: {
        sEmptyTable: "No hay datos disponibles en la tabla",
        sInfo: "Mostrando _START_ a _END_",
        sInfoEmpty: "Mostrando 0 a 0 ",
        sInfoFiltered: "(filtrado de _MAX_ entradas en total)",
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
        }
      }
    });

    // Manejar el evento de clic para los botones
    $('#example tbody').on('click', 'button', (event: any) => {
      const data = this.dataTable.row($(event.target).parents('tr')).data();
      this.selectedData = data;
      this.showModal();
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

  // Mostrar el modal y actualizar el contenido
  showModal(): void {
    const content = `
    <div class="row">
          <div class="col-4"><p><strong>Marca:</strong> ${this.selectedData.make}</p></div>
          <div class="col-4"><p><strong>Modelo:</strong> ${this.selectedData.model}</p></div>
          <div class="col-4"><p><strong>Año:</strong> ${this.selectedData.year}</p></div>
        </div>
    `;
    $('#modalContent').html(content);
    $('#exampleModal').modal('show'); // Mostrar el modal
  }

  // Manejar eventos de entrada del campo de búsqueda
  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery.next(inputElement.value); // Actualizar el BehaviorSubject con la nueva consulta
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
}
