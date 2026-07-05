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

  // Water parameter — series date labels
  readonly seriesDateToday: string;
  readonly seriesDateYesterday: string;

  // Water parameter — names
  readonly paramNamePh: string;
  readonly paramNameGh: string;
  readonly paramNameKh: string;
  readonly paramNameNitrate: string;
  readonly paramNameNitrite: string;
  readonly paramNameAmmonia: string;
  readonly paramNameTemperature: string;
  readonly paramNameTds: string;
  readonly paramNameCopper: string;
  readonly paramNamePhosphate: string;
  readonly paramNameIron: string;
  readonly paramNameCo2: string;
  readonly paramNameO2: string;
  readonly paramNameCalcium: string;
  readonly paramNameSilicates: string;
  readonly paramNameDensitySalinity: string;
  readonly paramNameMagnesium: string;
  readonly paramNameIodine: string;
  readonly paramNameMolybdenum: string;
  readonly paramNameStrontium: string;
  readonly paramNamePotassium: string;

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
  readonly homeAddAquarium: string;
  readonly homeWaterParameters: string;
  readonly homeVariation: string;
  readonly homeCurrentValue: string;
  readonly homeRecentMeasurements: string;
  readonly homeRecentMeasurementsSubtitle: string;
  readonly homeAddMeasurement: string;
  readonly homeRecentApplications: string;
  readonly homeRecentApplicationsSubtitle: string;
  readonly homeAddApplication: string;

  // Shared — list states
  readonly listEmptyDefault: string;
  readonly listLoadingDefault: string;

  // Home — states
  readonly homeNoAquariums: string;
  readonly homeLoadingAquariums: string;
  readonly homeErrorRetry: string;
  readonly homeMeasurementsEmptyTitle: string;
  readonly homeMeasurementsEmptyDesc: string;
  readonly homeApplicationsEmptyTitle: string;
  readonly homeApplicationsEmptyDesc: string;

  // Aquarium — create page (placeholder)
  readonly aquariumFormTitle: string;
  readonly aquariumFormComingSoon: string;
  readonly aquariumFormBackToDashboard: string;

  // Measurement — create page (placeholder)
  readonly measurementFormTitle: string;
  readonly measurementFormComingSoon: string;
  readonly measurementFormBackToDashboard: string;

  // Application — create page (placeholder)
  readonly applicationFormTitle: string;
  readonly applicationFormComingSoon: string;
  readonly applicationFormBackToDashboard: string;

  // Shared — actions
  readonly cancelLabel: string;

  // Profile — page
  readonly profilePageSubtitle: string;
  readonly profileLoading: string;

  // Profile — information card
  readonly profileInformationTitle: string;
  readonly profileInformationSubtitle: string;
  readonly profilePictureLabel: string;
  readonly profilePictureHint: string;
  readonly profileChangeAvatar: string;
  readonly profileAvatarInvalidType: string;
  readonly profileAvatarTooLarge: string;
  readonly profileAvatarUploadSuccess: string;
  readonly profileAvatarUploadError: string;
  readonly profileEmailAddressLabel: string;
  readonly profileContactPhoneLabel: string;
  readonly profileContactPhoneInvalid: string;
  readonly profileMemberSince: string;
  readonly profileSaveSuccessMessage: string;
  readonly profileSaveErrorMessage: string;
  readonly profileSaveChanges: string;
  readonly profileSavingLabel: string;

  // Profile — account security card
  readonly accountSecurityTitle: string;
  readonly accountSecuritySubtitle: string;
  readonly profilePasswordLastChanged: string;
  readonly changePasswordButton: string;
  readonly profilePasswordChangeUnavailable: string;
  readonly profileLastLogin: string;

  // Profile — preferences card
  readonly preferencesTitle: string;
  readonly preferencesSubtitle: string;
  readonly preferencesUnitsGroup: string;
  readonly preferencesTemperatureLabel: string;
  readonly preferencesTemperatureHint: string;
  readonly preferencesConcentrationLabel: string;
  readonly preferencesConcentrationHint: string;
  readonly preferencesDefaultSettingsGroup: string;
  readonly preferencesDefaultAquariumLabel: string;
  readonly preferencesDefaultAquariumHint: string;
  readonly preferencesSelectAquariumPlaceholder: string;
  readonly preferencesNotificationsGroup: string;
  readonly preferencesEmailAlertsLabel: string;
  readonly preferencesEmailAlertsHint: string;
  readonly profileSavePreferences: string;

  // Profile — danger zone card
  readonly dangerZoneTitle: string;
  readonly dangerZoneSubtitle: string;
  readonly deleteAccountLabel: string;
  readonly deleteAccountMessage: string;
  readonly deleteAccountWarning: string;
  readonly deleteAccountUnavailable: string;
  readonly deleteAccountConfirmWord: string;
  readonly deleteAccountConfirmWordLabel: string;
}
