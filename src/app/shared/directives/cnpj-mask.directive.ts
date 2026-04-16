import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCnpjMask]',
  standalone: true
})
export class CnpjMaskDirective {

  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não é número

    if (valor.length > 14) {
      valor = valor.substring(0, 14);
    }

    // Aplica a máscara: 00.000.000/0000-00
    valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
    valor = valor.replace(/(\d{4})(\d)/, '$1-$2');

    // Atualiza o valor no campo e no FormControll do Angular
    this.ngControl.control?.setValue(valor, { emitEvent: false });
  }
}
