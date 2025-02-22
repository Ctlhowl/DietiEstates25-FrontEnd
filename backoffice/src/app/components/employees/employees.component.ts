import { User } from './../../interfaces/user';
import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../../services/employees/employees.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employees',
  imports: [CommonModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private employeeService: EmployeesService) {}

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        this.users = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Errore nel caricamento dei dati';
        console.error(error);
        this.isLoading = false;
      }
    });
  }
}
