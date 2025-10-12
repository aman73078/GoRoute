import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  // New signal to manage the active search tab
  activeTab = signal<'bus' | 'cab'>('bus');
  popularCities = signal([
    // Updated image URLs to be more visually appealing and representative
    {
      name: 'Bengaluru',
      description: 'IT Hub & Gardens',
      imgUrl:
        'http://fabhotels.com/blog/wp-content/uploads/2018/06/Monuments_1000x650_SubHeadImages_210618.jpg',
    },
    {
      name: 'Mumbai',
      description: 'Gateway of India',
      imgUrl:
        'https://miro.medium.com/v2/resize:fit:1400/1*DTXfmmagnoAxRcUEWdajMw.jpeg',
    },
    {
      name: 'New Delhi',
      description: 'Capital & History',
      imgUrl:
        'https://media.istockphoto.com/id/184085544/photo/indian-parliament-in-new-delhi-the-politic-government-of-india.jpg?s=612x612&w=0&k=20&c=jgnuN5ofwNGMaoVoMoXOLF-2OzRVj3QhD0IZD3HIUSg=',
    },
    {
      name: 'Chennai',
      description: 'Culture & Beaches',
      imgUrl:
        'https://a.storyblok.com/f/159922/1140x360/4c884e6ae2/chennai.png',
    },
    {
      name: 'Pune',
      description: 'Cultural Capital',
      imgUrl:
        'https://www.adotrip.com/public/images/city/master_images/5e4d07bdd37f0-Pune_Travel.jpg',
    },
    {
      name: 'Hyderabad',
      description: 'City of Pearls',
      imgUrl:
        'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/46/bc/ed/hyderabad.jpg?w=1400&h=1400&s=1',
    },
    {
      name: 'Kolkata',
      description: 'City of Joy',
      imgUrl: 'https://s3.india.com/wp-content/uploads/2025/07/kolkata-DIY.jpg',
    },
    {
      name: 'Jaipur',
      description: 'The Pink City',
      imgUrl:
        'https://s7ap1.scene7.com/is/image/incredibleindia/hawa-mahal-jaipur-rajasthan-city-1-hero?qlt=82&ts=1742200253577',
    },
  ]);

  // --- City Suggestion State and Data ---
  allCities = signal([
    'Bangalore',
    'Chennai',
    'Mumbai',
    'New Delhi',
    'Pune',
    'Hyderabad',
    'Kolkata',
    'Jaipur',
    'Ahmedabad',
    'Surat',
    'Nagpur',
    'Goa',
    'Kochi',
    'Madurai',
    'Coimbatore',
    'Vizag',
  ]);

  sourceCityInput = signal('Bangalore');
  destinationCityInput = signal('Chennai');
  sourceSuggestions = signal<string[]>([]);
  destinationSuggestions = signal<string[]>([]);
  // ----------------------------------------

  private generateCitySvg(color: string, emoji: string): string {
    const svgContent = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='${color}'/><text x='50' y='60' font-size='40' font-family='sans-serif' text-anchor='middle' fill='%23FFFFFF'>${emoji}</text></svg>`;
    // Return as data URI
    return 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svgContent);
  }
  /**
   * Updates the active search tab (Bus or Cab).
   * @param tab The tab to set as active.
   */
  setActiveTab(tab: 'bus' | 'cab') {
    this.activeTab.set(tab);
  }

  /**
   * Handles input changes for the Source city field and updates suggestions.
   */
  onSourceInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.sourceCityInput.set(value);
    this.updateSuggestions(value, 'source');
  }

  /**
   * Handles input changes for the Destination city field and updates suggestions.
   */
  onDestinationInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.destinationCityInput.set(value);
    this.updateSuggestions(value, 'destination');
  }

  /**
   * Filters the city list based on the input query.
   */
  updateSuggestions(query: string, field: 'source' | 'destination') {
    if (query.length < 2) {
      if (field === 'source') this.sourceSuggestions.set([]);
      else this.destinationSuggestions.set([]);
      return;
    }

    const filtered = this.allCities()
      .filter((city) => city.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5); // Limit to 5 suggestions

    if (field === 'source') this.sourceSuggestions.set(filtered);
    else this.destinationSuggestions.set(filtered);
  }

  /**
   * Selects a city from the suggestion list and updates the input field.
   * Uses mousedown event in template to prevent blur before click event fires.
   */
  selectCity(city: string, field: 'source' | 'destination') {
    if (field === 'source') {
      this.sourceCityInput.set(city);
      this.sourceSuggestions.set([]); // Clear suggestions
    } else {
      this.destinationCityInput.set(city);
      this.destinationSuggestions.set([]); // Clear suggestions
    }
  }

  /**
   * Swaps the Source and Destination city inputs.
   */
  swapCities() {
    const temp = this.sourceCityInput();
    this.sourceCityInput.set(this.destinationCityInput());
    this.destinationCityInput.set(temp);

    // Clear any open suggestions after swap
    this.sourceSuggestions.set([]);
    this.destinationSuggestions.set([]);
  }

  animate = false;

  triggerAnimation() {
    this.animate = false;
    setTimeout(() => this.animate = true, 10); // Restart animation
  }
}
