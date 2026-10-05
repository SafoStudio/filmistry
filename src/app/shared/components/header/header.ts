import { Component, signal, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { Icon } from '../icon/icon';
import { SearchBar } from '@shared/components/search-bar/search-bar';

type MenuSection = 'movies' | 'tv' | 'anime' | 'cartoons' | null;

interface MegaMenuLink {
  label: string;
  link: string[];
  queryParams?: Record<string, string | number>;
}

interface MegaMenuSection {
  title: string;
  hideTitle?: boolean;
  links: MegaMenuLink[];
}

interface MegaMenu {
  title: string;
  sections: MegaMenuSection[];
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, ThemeToggle, Icon, SearchBar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  menuOpen = signal(false);
  hidden = signal(false);
  activeMegaMenu = signal<MenuSection>(null);

  private closeTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly movieMenu: MegaMenu = {
    title: 'Movies',
    sections: [
      {
        title: 'All movies',
        hideTitle: true,
        links: [{ label: 'All movies', link: ['/movies'] }],
      },
      {
        title: 'By year',
        links: [
          { label: '2026', link: ['/movies'], queryParams: { year: 2026 } },
          { label: '2025', link: ['/movies'], queryParams: { year: 2025 } },
          { label: '2024', link: ['/movies'], queryParams: { year: 2024 } },
          { label: '2023', link: ['/movies'], queryParams: { year: 2023 } },
        ],
      },
      {
        title: 'By country',
        links: [
          { label: 'Foreign', link: ['/movies'], queryParams: { country: 'foreign' } },
          { label: 'Indian', link: ['/movies'], queryParams: { country: 'IN' } },
          { label: 'Turkish', link: ['/movies'], queryParams: { country: 'TR' } },
          { label: 'French', link: ['/movies'], queryParams: { country: 'FR' } },
        ],
      },
      {
        title: 'By genre',
        links: [
          { label: 'Biography', link: ['/movies'], queryParams: { genres: '99' } },
          { label: 'Action', link: ['/movies'], queryParams: { genres: '28' } },
          { label: 'Western', link: ['/movies'], queryParams: { genres: '37' } },
          { label: 'War', link: ['/movies'], queryParams: { genres: '10752' } },
          { label: 'Detective', link: ['/movies'], queryParams: { genres: '9648' } },
          { label: 'Kids', link: ['/movies'], queryParams: { genres: '10751' } },
          { label: 'Documentary', link: ['/movies'], queryParams: { genres: '99' } },
          { label: 'Drama', link: ['/movies'], queryParams: { genres: '18' } },
          { label: 'History', link: ['/movies'], queryParams: { genres: '36' } },
          { label: 'Comedy', link: ['/movies'], queryParams: { genres: '35' } },
          { label: 'Crime', link: ['/movies'], queryParams: { genres: '80' } },
          { label: 'Melodrama', link: ['/movies'], queryParams: { genres: '10749' } },
          { label: 'Music', link: ['/movies'], queryParams: { genres: '10402' } },
          { label: 'Musical', link: ['/movies'], queryParams: { genres: '10402' } },
          { label: 'Adventure', link: ['/movies'], queryParams: { genres: '12' } },
          { label: 'Family', link: ['/movies'], queryParams: { genres: '10751' } },
          { label: 'Sport', link: ['/movies'], queryParams: { genres: '99' } },
          { label: 'Thriller', link: ['/movies'], queryParams: { genres: '53' } },
          { label: 'Horror', link: ['/movies'], queryParams: { genres: '27' } },
          { label: 'Sci-Fi', link: ['/movies'], queryParams: { genres: '878' } },
          { label: 'Fantasy', link: ['/movies'], queryParams: { genres: '14' } },
        ],
      },
    ],
  };

  readonly tvMenu: MegaMenu = {
    title: 'TV Shows',
    sections: [
      {
        title: 'All TV shows',
        hideTitle: true,
        links: [{ label: 'All TV shows', link: ['/tv'] }],
      },
      {
        title: 'By year',
        links: [
          { label: '2026', link: ['/tv'], queryParams: { year: 2026 } },
          { label: '2025', link: ['/tv'], queryParams: { year: 2025 } },
          { label: '2024', link: ['/tv'], queryParams: { year: 2024 } },
          { label: '2023', link: ['/tv'], queryParams: { year: 2023 } },
        ],
      },
      {
        title: 'By country',
        links: [
          { label: 'Foreign', link: ['/tv'], queryParams: { country: 'foreign' } },
          { label: 'Indian', link: ['/tv'], queryParams: { country: 'IN' } },
          { label: 'Turkish', link: ['/tv'], queryParams: { country: 'TR' } },
          { label: 'French', link: ['/tv'], queryParams: { country: 'FR' } },
        ],
      },
      {
        title: 'By genre',
        links: [
          { label: 'Action & Adventure', link: ['/tv'], queryParams: { genres: '10759' } },
          { label: 'Animation', link: ['/tv'], queryParams: { genres: '16' } },
          { label: 'Comedy', link: ['/tv'], queryParams: { genres: '35' } },
          { label: 'Crime', link: ['/tv'], queryParams: { genres: '80' } },
          { label: 'Documentary', link: ['/tv'], queryParams: { genres: '99' } },
          { label: 'Drama', link: ['/tv'], queryParams: { genres: '18' } },
          { label: 'Family', link: ['/tv'], queryParams: { genres: '10751' } },
          { label: 'Kids', link: ['/tv'], queryParams: { genres: '10762' } },
          { label: 'Mystery', link: ['/tv'], queryParams: { genres: '9648' } },
          { label: 'News', link: ['/tv'], queryParams: { genres: '10763' } },
          { label: 'Reality', link: ['/tv'], queryParams: { genres: '10764' } },
          { label: 'Sci-Fi & Fantasy', link: ['/tv'], queryParams: { genres: '10765' } },
          { label: 'Soap', link: ['/tv'], queryParams: { genres: '10766' } },
          { label: 'Talk', link: ['/tv'], queryParams: { genres: '10767' } },
          { label: 'War & Politics', link: ['/tv'], queryParams: { genres: '10768' } },
          { label: 'Western', link: ['/tv'], queryParams: { genres: '37' } },
        ],
      },
    ],
  };

  readonly animeMenu: MegaMenu = {
    title: 'Anime',
    sections: [
      {
        title: 'All anime',
        hideTitle: true,
        links: [
          { label: 'All anime', link: ['/anime'] },
          { label: 'Anime movies', link: ['/anime'], queryParams: { type: 'movie' } },
          { label: 'Anime TV', link: ['/anime'], queryParams: { type: 'tv' } },
        ],
      },
      {
        title: 'By year',
        links: [
          { label: '2026', link: ['/anime'], queryParams: { year: 2026 } },
          { label: '2025', link: ['/anime'], queryParams: { year: 2025 } },
          { label: '2024', link: ['/anime'], queryParams: { year: 2024 } },
          { label: '2023', link: ['/anime'], queryParams: { year: 2023 } },
        ],
      },
    ],
  };

  readonly cartoonsMenu: MegaMenu = {
    title: 'Cartoons',
    sections: [
      {
        title: 'All cartoons',
        hideTitle: true,
        links: [
          { label: 'All cartoons', link: ['/cartoons'] },
          { label: 'Cartoon movies', link: ['/cartoons'], queryParams: { type: 'movie' } },
          { label: 'Cartoon TV', link: ['/cartoons'], queryParams: { type: 'tv' } },
        ],
      },
      {
        title: 'By year',
        links: [
          { label: '2026', link: ['/cartoons'], queryParams: { year: 2026 } },
          { label: '2025', link: ['/cartoons'], queryParams: { year: 2025 } },
          { label: '2024', link: ['/cartoons'], queryParams: { year: 2024 } },
          { label: '2023', link: ['/cartoons'], queryParams: { year: 2023 } },
        ],
      },
    ],
  };

  @HostListener('window:scroll')
  onScroll(): void {
    this.hidden.set(window.scrollY > 260);
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.cancelClose();
    this.menuOpen.set(false);
    this.activeMegaMenu.set(null);
  }

  onMenuEnter(section: MenuSection): void {
    this.cancelClose();
    this.activeMegaMenu.set(section);
  }

  onMenuLeave(): void {
    this.cancelClose();
    this.closeTimeout = setTimeout(() => {
      this.activeMegaMenu.set(null);
      this.closeTimeout = null;
    }, 150);
  }

  private cancelClose(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }
}
