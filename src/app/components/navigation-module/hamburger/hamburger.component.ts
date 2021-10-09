import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'opdex-hamburger',
  templateUrl: './hamburger.component.html',
  styleUrls: ['./hamburger.component.scss']
})
export class HamburgerComponent {
  @Input() isOpen: boolean;
  @Output() onToggle = new EventEmitter<boolean>();

  toggleMenu() {
    this.isOpen = !this.isOpen;

    this.onToggle.emit(this.isOpen);
  }
}
