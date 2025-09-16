export const environment = {
  production: true,
  apiUrl: 'https://itunes.apple.com',
  googleClientId: '564261484570-udah6b0975a5hcgira1dbgn9koal7i43.apps.googleusercontent.com',
  cosmosDb: {
    endpoint: 'https://your-cosmosdb-account.documents.azure.com:443/',
    key: 'your-cosmos-db-primary-key',
    databaseId: 'your-database-id',
    containerId: 'your-container-id'
  },
  azureFunctions: {
    baseUrl: 'https://your-function-app.azurewebsites.net/api',
    apiKey: 'your-function-api-key'
  }
};