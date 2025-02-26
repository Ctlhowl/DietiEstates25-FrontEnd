import { User } from './../../interfaces/user';
import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../../services/employees/employees.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private employeeService: EmployeesService,private router: Router) {}

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

  deleteEmployee(id: number | undefined) {
    if (confirm('Sei sicuro di voler eliminare questo dipendente?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          // Rimuove il dipendente dalla lista dopo l'eliminazione
          this.users = this.users.filter(user => user.id !== id);
        },
        error: () => {
          alert('Errore durante l\'eliminazione del dipendente.');
        }
      });
    }
  }

  addEmployee(){
    this.router.navigate(['employees/new']);
  }
}
