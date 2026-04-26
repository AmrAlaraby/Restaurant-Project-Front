import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { LocalizationService } from './app/Core/Services/Localization-Service/localization-service';

bootstrapApplication(App, appConfig)
.then(appRef => {
    const injector = appRef.injector;
    const localization = injector.get(LocalizationService);

    localization.init(); // 🔥 أهم سطر
  })
  .catch((err) => console.error(err));
