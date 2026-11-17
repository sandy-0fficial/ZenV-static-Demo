import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './tests', outputDir: './test-results', workers: 1, fullyParallel: false, timeout: 60000, reporter: 'list', use: { viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure' } });
