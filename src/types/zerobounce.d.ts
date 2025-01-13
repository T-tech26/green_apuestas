// types/zerobounce.d.ts
declare module '@zerobounce/zero-bounce-sdk' {
    interface ZeroBounceResponse {
        address: string; 
        status: string;
        sub_status: string;
        free_email: boolean;
        did_you_mean: string | null;
        account: string;
        domain: string;
        domain_age_days: string;
        active_in_days: string;
        smtp_provider: string;
        mx_record: string;
        mx_found: string;
        firstname: string; 
        lastname: string;
        gender: string;
        country: string;
        region: string;
        city: string; 
        zipcode: string;
        processed_at: string;
      }
  
    class ZeroBounceSDK {
      constructor();

      init(apiKey: string);
  
      validateEmail(email: string): Promise<ZeroBounceResponse>;
    }
  
    export = ZeroBounceSDK;
  }
  