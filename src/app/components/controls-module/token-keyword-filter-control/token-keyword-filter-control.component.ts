import { ITokensResponse } from '@sharedModels/platform-api/responses/tokens/tokens-response.interface';
import { OnInit, OnDestroy } from '@angular/core';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { debounceTime, distinctUntilChanged, map, switchMap, take, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { TokensFilter, ITokensRequest, TokenOrderByTypes, TokenProvisionalTypes } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
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
  @Output() onTokenSelect = new EventEmitter<IToken>();

  control: FormControl;
  filter: TokensFilter;
  icons = Icons;
  IconSizes = IconSizes;
  tokenOrderByTypes = TokenOrderByTypes;
  tokenProvisionalTypes = TokenProvisionalTypes;
  subscription = new Subscription();
  tokens: IToken[];
  crs: IToken;

  constructor(private _tokensService: TokensService) {
    // init loader w/ fake tokens
    this.tokens = [null, null, null, null, null];
    this.control = new FormControl('');

    this.filter = new TokensFilter({
      orderBy: this.tokenOrderByTypes.DailyPriceChangePercent,
      direction: 'DESC',
      limit: 10,
      provisional: this.includeProvisional ? this.tokenProvisionalTypes.All : this.tokenProvisionalTypes.NonProvisional
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
    this._tokensService.getToken('CRS', true)
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
      .pipe(map((response: ITokensResponse) => {
        this.tokens = [...response.results];

        if (!keyword || 'crs'.includes(keyword.toLowerCase()) && this.crs) {
          this.tokens.unshift({...this.crs});
        }
      }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
