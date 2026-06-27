export interface TranslationDictionary {
  // Shared
  readonly languageSelectorLabel: string;
  readonly footer: string;

  // Auth — login
  readonly title: string;
  readonly subtitle: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly passwordLabel: string;
  readonly passwordPlaceholder: string;
  readonly forgotPassword: string;
  readonly submitLabel: string;
  readonly loadingLabel: string;
  readonly createAccountPrompt: string;
  readonly createAccount: string;
  readonly emailRequired: string;
  readonly emailInvalid: string;
  readonly passwordRequired: string;
  readonly loginError: string;

  // Auth — registration
  readonly registrationTitle: string;
  readonly registrationSubtitle: string;
  readonly fullNameLabel: string;
  readonly fullNamePlaceholder: string;
  readonly fullNameRequired: string;
  readonly registrationPasswordPlaceholder: string;
  readonly confirmPasswordLabel: string;
  readonly confirmPasswordPlaceholder: string;
  readonly confirmPasswordRequired: string;
  readonly passwordMinLength: string;
  readonly passwordsMismatch: string;
  readonly registrationSubmitLabel: string;
  readonly registrationLoadingLabel: string;
  readonly signInPrompt: string;
  readonly signInInstead: string;
  readonly registrationError: string;

  // Auth — forgot password
  readonly forgotPasswordTitle: string;
  readonly forgotPasswordSubtitle: string;
  readonly usernameLabel: string;
  readonly usernamePlaceholder: string;
  readonly birthdateLabel: string;
  readonly forgotPasswordSubmitLabel: string;
  readonly forgotPasswordLoadingLabel: string;
  readonly backToLogin: string;
  readonly usernameRequired: string;
  readonly birthdateRequired: string;
  readonly forgotPasswordError: string;
  readonly forgotPasswordSuccessTitle: string;
  readonly forgotPasswordNewPasswordLabel: string;
  readonly copyPassword: string;
  readonly passwordCopied: string;

  // Aquarium — water types
  readonly waterTypeFreshwater: string;
  readonly waterTypeSaltwater: string;
  readonly waterTypeBrackish: string;

  // Aquarium — health status labels
  readonly statusStable: string;
  readonly statusAttention: string;
  readonly statusCritical: string;
  readonly statusUnknown: string;

  // Aquarium — metric labels
  readonly metricPhLevel: string;
  readonly metricTemperature: string;

  // Measurement — badge labels
  readonly badgeNormal: string;
  readonly badgeHigh: string;
  readonly badgeCritical: string;

  // Water parameter — period label (use {{n}} as placeholder for number of days)
  readonly periodLastNDays: string;

  // User menu
  readonly userMenuProfile: string;
  readonly userMenuHelp: string;
  readonly userMenuLogout: string;

  // Navigation menu
  readonly navDashboard: string;
  readonly navAquariums: string;
  readonly navMeasurements: string;
  readonly navAlerts: string;
  readonly navAquaticLife: string;
  readonly navProducts: string;
  readonly navDosageCalculator: string;
  readonly navSettings: string;
  readonly navCollapse: string;
  readonly navExpand: string;
  readonly navGoHome: string;

  // Home — page title
  readonly homePageSubtitle: string;

  // Home — sections
  readonly homeMyAquariums: string;
  readonly homeMyAquariumsSubtitle: string;
  readonly homeWaterParameters: string;
  readonly homeVariation: string;
  readonly homeRecentMeasurements: string;
  readonly homeRecentMeasurementsSubtitle: string;
  readonly homeRecentApplications: string;
  readonly homeRecentApplicationsSubtitle: string;

  // Home — states
  readonly homeNoAquariums: string;
  readonly homeLoadingAquariums: string;
  readonly homeErrorRetry: string;
  readonly homeMeasurementsEmptyTitle: string;
  readonly homeMeasurementsEmptyDesc: string;
  readonly homeApplicationsEmptyTitle: string;
  readonly homeApplicationsEmptyDesc: string;
}
