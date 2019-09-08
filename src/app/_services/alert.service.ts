import { Injectable } from '@angular/core';
import { Alert } from '../_models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alert: Alert;

  constructor() { }
}
