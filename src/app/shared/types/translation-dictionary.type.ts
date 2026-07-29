export interface TranslationDictionary {
  // Shared
  readonly languageSelectorLabel: string;
  readonly footer: string;
  readonly searchFormfieldAriaLabel: string;
  readonly searchFormfieldClearLabel: string;
  readonly searchFormfieldLoadingLabel: string;

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
  readonly homeAquariumFiltersSearchLabel: string;
  readonly homeAquariumFiltersSearchPlaceholder: string;
  readonly homeAquariumFiltersTypeLabel: string;
  readonly homeAquariumFiltersTypePlaceholder: string;
  readonly homeAquariumFiltersDateFromLabel: string;
  readonly homeAquariumFiltersDateToLabel: string;
  readonly homeAquariumFiltersDatePlaceholder: string;
  readonly homeAquariumFiltersDateHint: string;
  readonly homeAquariumFiltersEmptyTitle: string;
  readonly homeAquariumFiltersEmptyDesc: string;
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

  // Aquarium — create page
  readonly aquariumFormTitle: string;
  readonly aquariumCreateSubtitle: string;
  readonly aquariumCreateBackToAquariums: string;
  readonly aquariumCreateBasicInfoTitle: string;
  readonly aquariumCreateNameLabel: string;
  readonly aquariumCreateNamePlaceholder: string;
  readonly aquariumCreateTypeLabel: string;
  readonly aquariumCreateTypeHint: string;
  readonly aquariumCreateTypeSelectWaterTypeHint: string;
  readonly aquariumCreateTypeLoadingHint: string;
  readonly aquariumCreateTypeLoadErrorHint: string;
  readonly aquariumCreateTypeBreeding: string;
  readonly aquariumCreateTypeCrabs: string;
  readonly aquariumCreateTypeCommunity: string;
  readonly aquariumCreateTypeCommunityTank: string;
  readonly aquariumCreateTypeHospital: string;
  readonly aquariumCreateTypeLake: string;
  readonly aquariumCreateTypeOther: string;
  readonly aquariumCreateTypePaludarium: string;
  readonly aquariumCreateTypeFreshwater: string;
  readonly aquariumCreateTypeFreshwaterDescription: string;
  readonly aquariumCreateTypePlanted: string;
  readonly aquariumCreateTypePlantedTank: string;
  readonly aquariumCreateTypePlantedDescription: string;
  readonly aquariumCreateTypeReef: string;
  readonly aquariumCreateTypeReefTank: string;
  readonly aquariumCreateTypeSaltwater: string;
  readonly aquariumCreateTypeSaltwaterDescription: string;
  readonly aquariumCreateTypeShrimp: string;
  readonly aquariumCreateTypeShrimpTank: string;
  readonly aquariumCreateTypeShrimpDescription: string;
  readonly aquariumCreateTypeSpeciesOnly: string;
  readonly aquariumCreateTypeTurtle: string;
  readonly aquariumCreateTypeTurtleTank: string;
  readonly aquariumCreateTypeTurtleDescription: string;
  readonly aquariumCreateWaterTypeLabel: string;
  readonly aquariumCreateWaterTypeHint: string;
  readonly aquariumCreateWaterTypeLoadingHint: string;
  readonly aquariumCreateWaterTypeLoadErrorHint: string;
  readonly aquariumCreateWaterTypeFreshwaterDescription: string;
  readonly aquariumCreateWaterTypeSaltwaterDescription: string;
  readonly aquariumCreateWaterTypeBrackishDescription: string;
  readonly aquariumCreateSetupDateLabel: string;
  readonly aquariumCreateSetupDatePlaceholder: string;
  readonly aquariumCreateDimensionsTitle: string;
  readonly aquariumCreateDimensionsSubtitle: string;
  readonly aquariumCreateDimensionModeLabel: string;
  readonly aquariumCreateDimensionModeHint: string;
  readonly aquariumCreateDimensionModeVolumeHint: string;
  readonly aquariumCreateLengthLabel: string;
  readonly aquariumCreateLengthPlaceholder: string;
  readonly aquariumCreateWidthLabel: string;
  readonly aquariumCreateWidthPlaceholder: string;
  readonly aquariumCreateHeightLabel: string;
  readonly aquariumCreateHeightPlaceholder: string;
  readonly aquariumCreateVolumeLabel: string;
  readonly aquariumCreateVolumePlaceholder: string;
  readonly aquariumCreateVolumeCalculatedLabel: string;
  readonly aquariumCreateVolumeProvidedLabel: string;
  readonly aquariumCreateVolumeUnitLiters: string;
  readonly aquariumCreateVolumeFormula: string;
  readonly aquariumCreateDisplayParametersTitle: string;
  readonly aquariumCreateDisplayParametersSubtitle: string;
  readonly aquariumCreateDisplayParametersHint: string;
  readonly aquariumCreateAlertConfigurationTitle: string;
  readonly aquariumCreateAlertConfigurationSubtitle: string;
  readonly aquariumCreateAlertConfigurationHint: string;
  readonly aquariumCreateAlertChannelsTitle: string;
  readonly aquariumCreateAlertChannelsSubtitle: string;
  readonly aquariumCreateAlertChannelDashboardLabel: string;
  readonly aquariumCreateAlertChannelEmailLabel: string;
  readonly aquariumCreateAlertParametersTitle: string;
  readonly aquariumCreateAlertMinimumLabel: string;
  readonly aquariumCreateAlertMinimumPlaceholder: string;
  readonly aquariumCreateAlertMaximumLabel: string;
  readonly aquariumCreateAlertMaximumPlaceholder: string;
  readonly aquariumCreateAlertTargetLabel: string;
  readonly aquariumCreateAlertTargetPlaceholder: string;
  readonly aquariumCreateDetailsTitle: string;
  readonly aquariumCreateDetailsSubtitle: string;
  readonly aquariumCreateDescriptionLabel: string;
  readonly aquariumCreateDescriptionPlaceholder: string;
  readonly aquariumCreatePhotoTitle: string;
  readonly aquariumCreatePhotoSubtitle: string;
  readonly aquariumCreatePhotoDropLabel: string;
  readonly aquariumCreatePhotoBrowseLabel: string;
  readonly aquariumCreatePhotoHint: string;
  readonly aquariumCreatePhotoInvalidType: string;
  readonly aquariumCreatePhotoTooLarge: string;
  readonly aquariumCreatePhotoLocalOnly: string;
  readonly aquariumCreateSubmittingLabel: string;
  readonly aquariumCreateSubmitLabel: string;
  readonly aquariumCreateRequiredError: string;
  readonly aquariumCreateNumberError: string;
  readonly aquariumCreatePositiveNumberError: string;
  readonly aquariumCreateAlertMaximumRangeError: string;
  readonly aquariumCreateAlertTargetRangeError: string;
  readonly aquariumCreateValidationSummary: string;
  readonly aquariumCreateSuccessMessage: string;
  readonly aquariumCreateErrorMessage: string;
  readonly aquariumCreateApiDisabledMessage: string;
  readonly aquariumListPageSubtitle: string;
  readonly aquariumListAddAction: string;
  readonly aquariumListVolumeLabel: string;
  readonly aquariumListInstalledLabel: string;
  readonly aquariumListInstalledMonthSingular: string;
  readonly aquariumListInstalledMonthPlural: string;
  readonly aquariumListInstalledYearSingular: string;
  readonly aquariumListInstalledYearPlural: string;
  readonly aquariumListRecentParametersTitle: string;
  readonly aquariumListParameterPh: string;
  readonly aquariumListParameterTemperature: string;
  readonly aquariumListParameterNitrate: string;
  readonly aquariumStatusActive: string;
  readonly aquariumStatusInactive: string;
  readonly aquariumStatusArchived: string;
  readonly aquariumListDetailsAction: string;
  readonly aquariumListDetailsActionAria: string;
  readonly aquariumListTypeLoadingHint: string;
  readonly aquariumListTypeLoadErrorHint: string;
  readonly aquariumListLoadErrorTitle: string;
  readonly aquariumListLoadErrorDescription: string;
  readonly aquariumListTotalLabel: string;
  readonly aquariumListCombinedVolumeLabel: string;
  readonly aquariumListAquariumSingular: string;
  readonly aquariumListAquariumPlural: string;
  readonly aquariumListEmptyTitle: string;
  readonly aquariumListEmptyDescription: string;

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
  readonly modalCloseLabel: string;

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
  readonly changePasswordModalTitle: string;
  readonly changePasswordModalSubtitle: string;
  readonly changePasswordCurrentPasswordLabel: string;
  readonly changePasswordCurrentPasswordPlaceholder: string;
  readonly changePasswordNewPasswordLabel: string;
  readonly changePasswordNewPasswordPlaceholder: string;
  readonly changePasswordConfirmNewPasswordLabel: string;
  readonly changePasswordConfirmNewPasswordPlaceholder: string;
  readonly changePasswordRequirementsTitle: string;
  readonly changePasswordRequirementMinLength: string;
  readonly changePasswordRequirementUppercase: string;
  readonly changePasswordRequirementNumber: string;
  readonly changePasswordRequirementSpecial: string;
  readonly changePasswordUpdateLabel: string;
  readonly changePasswordUpdatingLabel: string;
  readonly changePasswordSuccessMessage: string;
  readonly changePasswordErrorMessage: string;
  readonly changePasswordCurrentPasswordIncorrect: string;
  readonly changePasswordNewPasswordDifferent: string;
  readonly changePasswordRequirementsError: string;
  readonly changePasswordShowCurrentPassword: string;
  readonly changePasswordHideCurrentPassword: string;
  readonly changePasswordShowNewPassword: string;
  readonly changePasswordHideNewPassword: string;
  readonly changePasswordShowConfirmPassword: string;
  readonly changePasswordHideConfirmPassword: string;
  readonly preferencesTitle: string;
  readonly preferencesSubtitle: string;
  readonly preferencesLanguageLabel: string;
  readonly preferencesLanguageHint: string;
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
  readonly preferencesPhAlertsLabel: string;
  readonly preferencesPhAlertsHint: string;
  readonly preferencesTemperatureAlertsLabel: string;
  readonly preferencesTemperatureAlertsHint: string;
  readonly preferencesAmmoniaAlertsLabel: string;
  readonly preferencesAmmoniaAlertsHint: string;
  readonly preferencesNitriteAlertsLabel: string;
  readonly preferencesNitriteAlertsHint: string;
  readonly preferencesNitrateAlertsLabel: string;
  readonly preferencesNitrateAlertsHint: string;
  readonly profileSavePreferences: string;

  // Profile — danger zone card
  readonly dangerZoneTitle: string;
  readonly dangerZoneSubtitle: string;
  readonly deleteAccountLabel: string;
  readonly deleteAccountRequestLabel: string;
  readonly deleteAccountMessage: string;
  readonly deleteAccountWarning: string;
  readonly deleteAccountRequestPending: string;
  readonly deleteAccountConfirmWord: string;
  readonly deleteAccountConfirmWordLabel: string;
  readonly deleteAccountRequestModalTitle: string;
  readonly deleteAccountRequestModalSubtitle: string;
  readonly deleteAccountRequestReasonLabel: string;
  readonly deleteAccountRequestReasonPlaceholder: string;
  readonly deleteAccountRequestReasonHint: string;
  readonly deleteAccountRequestSubmitLabel: string;
  readonly deleteAccountRequestSubmittingLabel: string;
  readonly deleteAccountRequestSuccessMessage: string;
  readonly deleteAccountRequestErrorMessage: string;
}
