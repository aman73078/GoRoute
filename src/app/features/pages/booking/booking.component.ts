import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

interface Seat {
  id: string;
  type: 'Seater' | 'Sleeper';
  booked: boolean;
  price: number;
}

interface Bus {
  operator: string;
  departure: string;
  arrival: string;
  duration: string;
  rating: number;
  type: 'AC' | 'Non-AC';
  seater: 'Sleeper' | 'Seater';
}


@Component({
  selector: 'app-booking',
  imports: [CommonModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent {
 // Trip Info
  source = signal('Bangalore');
  destination = signal('Chennai');
  date = signal('2025-10-25');
  showModifySearch = signal(false);

  // Bus Info (mock)
  bus: Bus = {
    operator: 'KPN Travels',
    departure: '06:00',
    arrival: '14:30',
    duration: '08h 30m',
    rating: 4.5,
    type: 'AC',
    seater: 'Sleeper'
  };

  // Seats (Left seater + Right sleeper)
  seats: Seat[][] = [
    [{ id: 'A1', type: 'Seater', booked: false, price: 500 }, { id: 'A2', type: 'Seater', booked: false, price: 500 }],
    [{ id: 'B1', type: 'Seater', booked: true, price: 500 }, { id: 'B2', type: 'Seater', booked: false, price: 500 }],
    [{ id: 'C1', type: 'Seater', booked: false, price: 500 }, { id: 'C2', type: 'Seater', booked: true, price: 500 }],
    [{ id: 'R1', type: 'Sleeper', booked: false, price: 700 }, { id: 'R2', type: 'Sleeper', booked: false, price: 700 }],
    [{ id: 'R3', type: 'Sleeper', booked: false, price: 700 }, { id: 'R4', type: 'Sleeper', booked: true, price: 700 }]
  ];

  selectedSeats = signal<Seat[]>([]);

  toggleSeat(seat: Seat) {
    if (seat.booked) return;
    const selected = this.selectedSeats();
    if (selected.includes(seat)) {
      this.selectedSeats.set(selected.filter(s => s !== seat));
    } else {
      this.selectedSeats.set([...selected, seat]);
    }
  }

  getTotalPrice(): number {
    return this.selectedSeats().reduce((sum, s) => sum + s.price, 0);
  }

  bookSeats() {
    if (this.selectedSeats().length === 0) {
      alert('Please select at least one seat!');
      return;
    }
    const seatIds = this.selectedSeats().map(s => s.id).join(', ');
    alert(`Booking successful for seats: ${seatIds}\nTotal: ₹${this.getTotalPrice()}`);
    this.seats.forEach(row => row.forEach(seat => {
      if (this.selectedSeats().includes(seat)) seat.booked = true;
    }));
    this.selectedSeats.set([]);
  }

  toggleModifySearch() {
    this.showModifySearch.set(!this.showModifySearch());
  }

  updateSearch(sourceInput: string, destinationInput: string, dateInput: string) {
    this.source.set(sourceInput);
    this.destination.set(destinationInput);
    this.date.set(dateInput);
    this.showModifySearch.set(false);
  }

  getSelectedSeat(){
    return this.selectedSeats().map(s => s.id).join(', ') || 'None';
  }
}
