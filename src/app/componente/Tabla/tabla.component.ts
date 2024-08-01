import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ServicioService } from 'src/app/servicio/servicio.service';
import { FormBuilder, FormGroup } from '@angular/forms';

declare var $: any;

interface TranslationMap {
  [key: string]: string;
}

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})

export class TablaComponent implements OnInit, OnDestroy {

  public searchQuery = new BehaviorSubject<string>(''); // Consulta por defecto vacía
  dataTable: any;
  selectedData: any; // Para almacenar los datos del vehículo seleccionado
  radioForm: FormGroup;
  selectedValue: string | null = null;
  filter = 'model'; // Valor por defecto para el filtro
  isLoading = false; // Variable para gestionar el estado de carga
  
  cars = ["make", "model", "year", "transmission"];
  
  public translationMap: TranslationMap = {
    'make': 'Marca',
    'model': 'Modelo',
    'year': 'Año',
    'transmission': 'Transmisión'
  };

  

  constructor(private ServicioService: ServicioService, private fb: FormBuilder) {
    this.radioForm = this.fb.group({
      cars: ['']  // Valor por defecto si es necesario
    });
  }

  ngOnInit(): void {
    this.initializeDataTable();
    
    this.searchQuery.pipe(
      debounceTime(200) // Esperar 200ms después de que el usuario deje de escribir
    ).subscribe(query => {
      this.isLoading = false;
      this.loadTableData(query);
    });
  }

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
        { title: 'Tracción', data: 'drive' }, // Asegúrate de que esta propiedad esté en los datos
        { title: 'Tipo de Combustible', data: 'fuel_type' },
        { title: 'Transmisión', data: 'transmission' },
        {
          title: 'Mapa',
          data: null,
          defaultContent: '<button type="button" class="btn btn-secondary">Ubicar</button>',
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
  
    $('#example tbody').on('click', 'button', (event: any) => {
      const data = this.dataTable.row($(event.target).parents('tr')).data();
      this.selectedData = data;
      this.showModal();
    });
  }
  
  
  isNumberString(str: any): boolean {
    return typeof str === 'string' && !isNaN(Number(str)) && isFinite(Number(str));
  }

  loadTableData(query: string): void {
    if (this.filter === 'year' && this.isNumberString(query)) {
      if (query) {
        this.ServicioService.getCars(query, this.filter).subscribe((data: any[]) => {
          // Proporcionar un valor predeterminado si 'drive' no está presente
          const validData = data.map(item => ({
            ...item,
            drive: item.drive || 'Desconocido' // Valor predeterminado
          }));
          this.dataTable.clear().rows.add(validData).draw();
        });
      }
    } else {
      if (query) {
        this.ServicioService.getCars(query, this.filter).subscribe((data: any[]) => {
          // Proporcionar un valor predeterminado si 'drive' no está presente
          const validData = data.map(item => ({
            ...item,
            drive: item.drive || 'Desconocido' // Valor predeterminado
          }));
          this.dataTable.clear().rows.add(validData).draw();
        });
      }
    }
    this.isLoading = false;
  }
  

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

  onSearch(event: Event): void {
    this.isLoading = true;
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery.next(inputElement.value); // Actualizar el BehaviorSubject con la nueva consulta
  }

  onSubmit(): void {  
    this.isLoading = true;
    this.selectedValue = this.radioForm.value.cars;
    this.filter = `${this.selectedValue}`;
    this.loadTableData(this.searchQuery.value); // Volver a cargar datos con el nuevo filtro
  }

  translateOption(option: string): string {
    return this.translationMap[option as keyof TranslationMap] || option;
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
}
