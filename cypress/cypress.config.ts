import {defineConfig} from 'cypress';
import {convert} from "./tasks/excel/convert";
const data=require('dotenv').config()
export default defineConfig({
  e2e: {
    defaultCommandTimeout:11000,
    baseUrl: process.env.CYPRESS_HOST,
    numTestsKeptInMemory: 0,
    chromeWebSecurity: false,
    specPattern: '**/*.cy.ts',
    setupNodeEvents(on, config) {
      on('task', {
        convert
      })
    },
  },
});
