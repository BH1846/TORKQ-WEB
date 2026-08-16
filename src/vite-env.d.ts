/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Apps Script Web App /exec URL that appends contact-form submissions to the
   * TorkQ Responses spreadsheet. See google-apps-script/contact-endpoint.gs.
   */
  readonly VITE_SHEETS_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
