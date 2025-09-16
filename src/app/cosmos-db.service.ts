import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CosmosClient, Database, Container, ItemResponse, FeedResponse } from '@azure/cosmos';
import { environment } from '../environments/environment';

export interface CosmosDbConfig {
  endpoint: string;
  key: string;
  databaseId: string;
  containerId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CosmosDbService {
  private client!: CosmosClient;
  private database!: Database;
  private container!: Container;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    try {
      if (!environment.cosmosDb) {
        console.error('Cosmos DB configuration not found in environment');
        return;
      }

      this.client = new CosmosClient({
        endpoint: environment.cosmosDb.endpoint,
        key: environment.cosmosDb.key
      });

      this.database = this.client.database(environment.cosmosDb.databaseId);
      this.container = this.database.container(environment.cosmosDb.containerId);
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing Cosmos DB client:', error);
    }
  }

  private checkInitialization(): void {
    if (!this.isInitialized) {
      throw new Error('Cosmos DB service not properly initialized');
    }
  }

  createItem(item: any): Observable<ItemResponse<any>> {
    this.checkInitialization();
    return from(this.container.items.create(item)).pipe(
      catchError(this.handleError)
    );
  }

  getItem(id: string, partitionKey?: string): Observable<ItemResponse<any>> {
    this.checkInitialization();
    return from(this.container.item(id, partitionKey).read()).pipe(
      catchError(this.handleError)
    );
  }

  updateItem(id: string, item: any, partitionKey?: string): Observable<ItemResponse<any>> {
    this.checkInitialization();
    return from(this.container.item(id, partitionKey).replace(item)).pipe(
      catchError(this.handleError)
    );
  }

  deleteItem(id: string, partitionKey?: string): Observable<ItemResponse<any>> {
    this.checkInitialization();
    return from(this.container.item(id, partitionKey).delete()).pipe(
      catchError(this.handleError)
    );
  }

  queryItems<T>(query: string, parameters?: any[]): Observable<FeedResponse<T>> {
    this.checkInitialization();
    const querySpec = {
      query: query,
      parameters: parameters || []
    };
    return from(this.container.items.query(querySpec).fetchAll()).pipe(
      catchError(this.handleError)
    ) as Observable<FeedResponse<T>>;
  }

  getAllItems<T>(): Observable<FeedResponse<T>> {
    this.checkInitialization();
    return from(this.container.items.readAll().fetchAll()).pipe(
      catchError(this.handleError)
    ) as Observable<FeedResponse<T>>;
  }

  private handleError(error: any): Observable<never> {
    console.error('Cosmos DB operation failed:', error);
    return throwError(() => new Error(`Cosmos DB Error: ${error.message || error}`));
  }
}