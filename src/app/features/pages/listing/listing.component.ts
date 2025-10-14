import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, computed, signal, ViewChild, ElementRef } from '@angular/core';

// --- Interfaces for Data Structure ---

interface Operator {
  id: number;
  name: string;
}

interface Bus {
  id: number;
  operatorId: number;
  departureTime: string; // e.g., "09:30"
  arrivalTime: string;   // e.g., "17:45"
  duration: string;      // e.g., "08h 15m"
  price: number;
  type: 'AC' | 'Non-AC';
  seater: 'Sleeper' | 'Seater';
  rating: number; // 0.0 to 5.0
  availableSeats: number;
  discountPercentage?: number;
}

interface FilterState {
  type: string[]; // 'AC', 'Non-AC'
  seater: string[]; // 'Sleeper', 'Seater'
  operators: number[]; // Operator IDs
  minPrice: number;
  maxPrice: number;
}

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.scss'
})
export class ListingComponent {
  // --- Static/Initial Data ---
  source = signal('Bangalore'); // Mock from homepage input
  destination = signal('Chennai'); // Mock from homepage input
  date = signal('2025-10-25'); // Mock from homepage input
  showModifySearch = signal(false);

  // Mock Operators Data
  operators: Operator[] = [
    { id: 1, name: 'KPN Travels' },
    { id: 2, name: 'SRS Travels' },
    { id: 3, name: 'SVR Tours' },
    { id: 4, name: 'ZingBus' },
  ];

  // Mock Bus Data
  allBuses: Bus[] = [
    { id: 101, operatorId: 1, departureTime: '06:00', arrivalTime: '14:30', duration: '08h 30m', price: 950, type: 'AC', seater: 'Sleeper', rating: 4.5, availableSeats: 12, discountPercentage: 10 },
    { id: 102, operatorId: 2, departureTime: '09:30', arrivalTime: '17:45', duration: '08h 15m', price: 780, type: 'Non-AC', seater: 'Seater', rating: 3.9, availableSeats: 25 },
    { id: 103, operatorId: 3, departureTime: '12:00', arrivalTime: '20:00', duration: '08h 00m', price: 1100, type: 'AC', seater: 'Seater', rating: 4.8, availableSeats: 8, discountPercentage: 15 },
    { id: 104, operatorId: 1, departureTime: '15:15', arrivalTime: '23:45', duration: '08h 30m', price: 900, type: 'AC', seater: 'Seater', rating: 4.1, availableSeats: 15 },
    { id: 105, operatorId: 4, departureTime: '22:30', arrivalTime: '06:45', duration: '08h 15m', price: 1250, type: 'AC', seater: 'Sleeper', rating: 4.6, availableSeats: 5, discountPercentage: 20 },
    { id: 106, operatorId: 2, departureTime: '18:45', arrivalTime: '03:15', duration: '08h 30m', price: 650, type: 'Non-AC', seater: 'Seater', rating: 3.5, availableSeats: 30 },
    { id: 107, operatorId: 3, departureTime: '05:30', arrivalTime: '13:00', duration: '07h 30m', price: 890, type: 'AC', seater: 'Seater', rating: 4.4, availableSeats: 18 },
  ];

  // --- State for Filters and Sorting ---
  filterState = signal<FilterState>({
    type: [],
    seater: [],
    operators: [],
    minPrice: 0,
    maxPrice: 1300, // Initial max price based on mock data
  });

  sortBy = signal<'price' | 'departure' | 'rating'>('departure');
  sortOrder = signal<'asc' | 'desc'>('asc');
  firstTimeDiscountApplied = signal(false);

  // --- Computed Property for Filtered and Sorted Buses ---

  // 1. Filtered Buses (based on filterState)
  filteredBuses = computed(() => {
    const filters = this.filterState();
    let buses = this.allBuses;

    // Apply Type Filter
    if (filters.type.length > 0) {
      buses = buses.filter(bus => filters.type.includes(bus.type));
    }

    // Apply Seater Filter
    if (filters.seater.length > 0) {
      buses = buses.filter(bus => filters.seater.includes(bus.seater));
    }

    // Apply Operator Filter
    if (filters.operators.length > 0) {
      buses = buses.filter(bus => filters.operators.includes(bus.operatorId));
    }

    // Apply Price Filter
    buses = buses.filter(
      bus => bus.price >= filters.minPrice && bus.price <= filters.maxPrice
    );

    return buses;
  });

  // 2. Sorted Buses (based on filteredBuses, sortBy, and sortOrder)
  availableBuses = computed(() => {
    const buses = [...this.filteredBuses()]; // Copy for sorting
    const sortKey = this.sortBy();
    const order = this.sortOrder();

    if (this.firstTimeDiscountApplied()) {
        return buses.map(bus => ({
            ...bus,
            price: this.calculateDiscountedPrice(bus.price, 10), // Apply 10% discount for first-time users
            discountPercentage: (bus.discountPercentage || 0) + 10
        }));
    }

    buses.sort((a, b) => {
      let valA: any, valB: any;

      if (sortKey === 'price') {
        valA = a.price;
        valB = b.price;
      } else if (sortKey === 'departure') {
        // Simple string comparison works for HH:MM format
        valA = a.departureTime;
        valB = b.departureTime;
      } else if (sortKey === 'rating') {
        valA = a.rating;
        valB = b.rating;
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return buses;
  });

  specialOffers = computed(() => {
    return this.allBuses.filter(bus => bus.discountPercentage && bus.discountPercentage >= 15);
  });

  maxDiscount = computed(() => {
    return Math.max(...this.allBuses.map(b => b.discountPercentage || 0));
  });

  // --- Component Methods ---

  ngOnInit(): void {
    this.initializePriceRange();
  }

  // Set the initial max price based on the actual data
  initializePriceRange() {
    const maxPrice = Math.max(...this.allBuses.map(b => b.price), 0);
    this.filterState.update(state => ({ ...state, maxPrice: maxPrice + 50 })); // Add a small buffer
  }

  // Toggles the state of a checkbox filter (Type, Seater, Operator)
  toggleFilter(key: 'type' | 'seater', value: string): void;
  toggleFilter(key: 'operators', value: number): void;
  toggleFilter(key: 'type' | 'seater' | 'operators', value: string | number): void {
    this.filterState.update(state => {
      const currentValues = state[key] as (string | number)[];
      const index = currentValues.indexOf(value);

      if (index > -1) {
        // Remove the value
        return { ...state, [key]: currentValues.filter((_, i) => i !== index) };
      } else {
        // Add the value
        return { ...state, [key]: [...currentValues, value] };
      }
    });
  }

  // Handles price range input (simplified to just max price for this example)
  onMaxPriceChange(event: Event) {
    const maxPrice = Number((event.target as HTMLInputElement).value);
    this.filterState.update(state => ({ ...state, maxPrice }));
  }

  // Handles sorting changes
  setSort(key: 'price' | 'departure' | 'rating') {
    if (this.sortBy() === key) {
      // Toggle order if the same key is clicked
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new key and reset to ascending
      this.sortBy.set(key);
      this.sortOrder.set('asc');
    }
  }

  toggleFirstTimeDiscount() {
    this.firstTimeDiscountApplied.set(!this.firstTimeDiscountApplied());
  }

  clearFilters() {
    this.filterState.set({
      type: [],
      seater: [],
      operators: [],
      minPrice: 0,
      maxPrice: Math.max(...this.allBuses.map(b => b.price), 0) + 50,
    });
  }

  // Utility to get the operator name from its ID
  getOperatorName(id: number): string {
    return this.operators.find(op => op.id === id)?.name || 'Unknown Operator';
  }

  calculateDiscountedPrice(price: number, discount?: number): number {
    if (discount) {
      return price - (price * discount) / 100;
    }
    return price;
  }

      @ViewChild('source') sourceInput: ElementRef | undefined;

      @ViewChild('destination') destinationInput: ElementRef | undefined;

      @ViewChild('date') dateInput: ElementRef | undefined;

    

      bookNow(bus: Bus) {

        alert(`Booking successful for ${this.getOperatorName(bus.operatorId)}!`);

      }

    

      toggleModifySearch() {

        this.showModifySearch.set(!this.showModifySearch());

      }

    

      updateSearch() {

        if (this.sourceInput) {

          this.source.set(this.sourceInput.nativeElement.value);

        }

        if (this.destinationInput) {

          this.destination.set(this.destinationInput.nativeElement.value);

        }

        if (this.dateInput) {

          this.date.set(this.dateInput.nativeElement.value);

        }

        this.showModifySearch.set(false);

      }

    

    }

    

  