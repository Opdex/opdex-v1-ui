import { Tokens } from '@sharedModels/ui/tokens/tokens';
import { Token } from '@sharedModels/ui/tokens/token';
import { OnInit, OnDestroy } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, switchMap, take, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Icons } from 'src/app/enums/icons';
import { TokensFilter, ITokensRequest, TokenOrderByTypes, TokenAttributes } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { Component, ElementRef, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'opdex-token-keyword-filter-control',
  templateUrl: './token-keyword-filter-control.component.html',
  styleUrls: ['./token-keyword-filter-control.component.scss']
})
export class TokenKeywordFilterControlComponent implements OnInit, OnDestroy {
  @ViewChild('filterInput') filterInput: ElementRef;

  @Input() includeProvisional = false;
  @Output() onTokenSelect = new EventEmitter<Token>();

  control: FormControl;
  filter: TokensFilter;
  icons = Icons;
  subscription = new Subscription();
  tokens: Token[];
  crs: Token;

  constructor(private _tokensService: TokensService) {
    // init loader w/ fake tokens
    this.tokens = [null, null, null, null, null];
    this.control = new FormControl('');

    this.filter = new TokensFilter({
      orderBy: TokenOrderByTypes.DailyPriceChangePercent,
      direction: 'DESC',
      limit: 10,
      tokenAttributes: this.includeProvisional ? [] : [TokenAttributes.NonProvisional],
      includeZeroLiquidity: false
    } as ITokensRequest);

    this.subscription.add(
      this.control.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(value => this.getTokens$(value)))
        .subscribe());
  }

  ngOnInit(): void {
    setTimeout(() => this.filterInput.nativeElement.focus());

    // Only taking 1, no need to refresh or unsub
    this._tokensService.getMarketToken('CRS')
      .pipe(
        tap(crs => this.crs = crs),
        switchMap(_ => this.getTokens$(null)),
        take(1))
      .subscribe();
  }

  selectToken(event$?: MatAutocompleteSelectedEvent): void {
    this.onTokenSelect.emit(event$?.option?.value);
  }

  getTokens$(keyword: string): Observable<void> {
    this.filter.keyword = keyword;

    return this._tokensService.getTokens(this.filter)
      .pipe(map((response: Tokens) => {
        this.tokens = [...response.results];

        if (!keyword || 'crs'.includes(keyword.toLowerCase()) && this.crs) {
          this.tokens.unshift(this.crs);
        }
      }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
