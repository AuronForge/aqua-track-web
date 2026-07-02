import { LanguageCode } from '../types/language-code.type';
import { TranslationDictionary } from '../types/translation-dictionary.type';

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  pt: {
    // Shared
    languageSelectorLabel: 'Selecionar idioma',
    footer: 'Todos os direitos reservados.',
    listEmptyDefault: 'Nenhum item encontrado',
    listLoadingDefault: 'Carregando...',

    // Auth — login
    title: 'Bem-vindo ao AquaTrack',
    subtitle: 'Gerencie seus aquários com precisão',
    emailLabel: 'E-mail',
    emailPlaceholder: 'voce@exemplo.com',
    passwordLabel: 'Senha',
    passwordPlaceholder: 'Digite sua senha',
    forgotPassword: 'Esqueceu a senha?',
    submitLabel: 'Entrar',
    loadingLabel: 'Entrando...',
    createAccountPrompt: 'Ainda não tem uma conta?',
    createAccount: 'Criar conta',
    emailRequired: 'O e-mail é obrigatório.',
    emailInvalid: 'Informe um e-mail válido.',
    passwordRequired: 'A senha é obrigatória.',
    loginError: 'E-mail ou senha incorretos. Tente novamente.',

    // Auth — registration
    registrationTitle: 'Crie sua conta',
    registrationSubtitle: 'Comece a gerenciar seus aquários hoje',
    fullNameLabel: 'Nome completo',
    fullNamePlaceholder: 'João Silva',
    fullNameRequired: 'O nome completo é obrigatório.',
    registrationPasswordPlaceholder: 'Crie uma senha forte',
    confirmPasswordLabel: 'Confirmar senha',
    confirmPasswordPlaceholder: 'Confirme sua senha',
    confirmPasswordRequired: 'A confirmação de senha é obrigatória.',
    passwordMinLength: 'A senha deve ter pelo menos 8 caracteres.',
    passwordsMismatch: 'As senhas não coincidem.',
    registrationSubmitLabel: 'Criar conta',
    registrationLoadingLabel: 'Criando conta...',
    signInPrompt: 'Já tem uma conta?',
    signInInstead: 'Entrar em vez disso',
    registrationError: 'Não foi possível criar a conta. Tente novamente.',

    // Auth — forgot password
    forgotPasswordTitle: 'Esqueceu a senha?',
    forgotPasswordSubtitle: 'Informe os dados da sua conta abaixo para redefinir sua senha.',
    usernameLabel: 'Nome de usuário',
    usernamePlaceholder: 'seunomeusuario',
    birthdateLabel: 'Data de nascimento',
    forgotPasswordSubmitLabel: 'Enviar instruções de redefinição',
    forgotPasswordLoadingLabel: 'Enviando...',
    backToLogin: 'Voltar ao login',
    usernameRequired: 'O nome de usuário é obrigatório.',
    birthdateRequired: 'A data de nascimento é obrigatória.',
    forgotPasswordError:
      'Não foi possível enviar as instruções. Verifique os dados e tente novamente.',
    forgotPasswordSuccessTitle: 'Senha redefinida com sucesso!',
    forgotPasswordNewPasswordLabel: 'Sua nova senha é:',
    copyPassword: 'Copiar senha',
    passwordCopied: 'Copiado!',

    // Aquarium — water types
    waterTypeFreshwater: 'Água Doce',
    waterTypeSaltwater: 'Água Salgada',
    waterTypeBrackish: 'Salobra',

    // Aquarium — health status labels
    statusStable: 'Estável',
    statusAttention: 'Atenção',
    statusCritical: 'Crítico',
    statusUnknown: 'Desconhecido',

    // Aquarium — metric labels
    metricPhLevel: 'Nível de pH',
    metricTemperature: 'Temperatura',

    // Measurement — badge labels
    badgeNormal: 'Normal',
    badgeHigh: 'Alto',
    badgeCritical: 'Crítico',

    // Water parameter — period label
    periodLastNDays: 'Últimos {{n}} dias',

    // Water parameter — series date labels
    seriesDateToday: 'Hoje',
    seriesDateYesterday: 'Ontem',

    // Water parameter — names
    paramNamePh: 'pH',
    paramNameGh: 'Dureza Geral (gH)',
    paramNameKh: 'Dureza de Carbonato (kH)',
    paramNameNitrate: 'Nitrato',
    paramNameNitrite: 'Nitrito',
    paramNameAmmonia: 'Amônia',
    paramNameTemperature: 'Temperatura',
    paramNameTds: 'Sólidos Dissolvidos Totais (TDS)',
    paramNameCopper: 'Cobre',
    paramNamePhosphate: 'Fosfato',
    paramNameIron: 'Ferro',
    paramNameCo2: 'Dióxido de Carbono (CO2)',
    paramNameO2: 'Oxigênio Dissolvido (O2)',
    paramNameCalcium: 'Cálcio',
    paramNameSilicates: 'Silicatos',
    paramNameDensitySalinity: 'Densidade / Salinidade',
    paramNameMagnesium: 'Magnésio',
    paramNameIodine: 'Iodo',
    paramNameMolybdenum: 'Molibdênio',
    paramNameStrontium: 'Estrôncio',
    paramNamePotassium: 'Potássio',

    // User menu
    userMenuProfile: 'Meu Perfil',
    userMenuHelp: 'Ajuda e Suporte',
    userMenuLogout: 'Sair',

    // Navigation menu
    navDashboard: 'Dashboard',
    navAquariums: 'Aquários',
    navMeasurements: 'Medições',
    navAlerts: 'Alertas',
    navAquaticLife: 'Vida Aquática',
    navProducts: 'Produtos',
    navDosageCalculator: 'Calculadora de Dosagem',
    navSettings: 'Configurações',
    navCollapse: 'Recolher',
    navExpand: 'Expandir',
    navGoHome: 'Ir para a página inicial',

    // Home — page title
    homePageSubtitle: 'Bem-vindo de volta! Veja o resumo dos seus aquários',

    // Home — sections
    homeMyAquariums: 'Meus Aquários',
    homeMyAquariumsSubtitle: 'Monitore e gerencie todos os seus aquários em um só lugar',
    homeAddAquarium: 'Novo Aquário',
    homeWaterParameters: 'Parâmetros da Água',
    homeVariation: 'Variação',
    homeCurrentValue: 'Valor atual',
    homeRecentMeasurements: 'Medições Recentes',
    homeRecentMeasurementsSubtitle: 'Últimos testes de parâmetros da água',
    homeAddMeasurement: 'Nova Medição',
    homeRecentApplications: 'Aplicações Recentes',
    homeRecentApplicationsSubtitle: 'Últimas dosagens de produtos',
    homeAddApplication: 'Nova Aplicação',

    // Home — states
    homeNoAquariums: 'Nenhum aquário cadastrado.',
    homeLoadingAquariums: 'Carregando aquários',
    homeErrorRetry: 'Tentar novamente',
    homeMeasurementsEmptyTitle: 'Nenhuma medição recente',
    homeMeasurementsEmptyDesc: 'As medições aparecerão aqui após os primeiros testes.',
    homeApplicationsEmptyTitle: 'Nenhuma aplicação recente',
    homeApplicationsEmptyDesc: 'As aplicações de produtos aparecerão aqui.',

    // Aquarium — create page (placeholder)
    aquariumFormTitle: 'Cadastrar Aquário',
    aquariumFormComingSoon: 'O formulário de cadastro de aquário estará disponível em breve.',
    aquariumFormBackToDashboard: 'Voltar para o painel',

    // Measurement — create page (placeholder)
    measurementFormTitle: 'Nova Medição',
    measurementFormComingSoon: 'O formulário de cadastro de medição estará disponível em breve.',
    measurementFormBackToDashboard: 'Voltar para o painel',

    // Application — create page (placeholder)
    applicationFormTitle: 'Nova Aplicação',
    applicationFormComingSoon: 'O formulário de cadastro de aplicação estará disponível em breve.',
    applicationFormBackToDashboard: 'Voltar para o painel',
  },

  en: {
    // Shared
    languageSelectorLabel: 'Select language',
    listEmptyDefault: 'No items found',
    listLoadingDefault: 'Loading...',
    footer: 'All rights reserved.',

    // Auth — login
    title: 'Welcome to AquaTrack',
    subtitle: 'Manage your aquariums with precision',
    emailLabel: 'E-mail',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    forgotPassword: 'Forgot your password?',
    submitLabel: 'Sign in',
    loadingLabel: 'Signing in...',
    createAccountPrompt: "Don't have an account?",
    createAccount: 'Create account',
    emailRequired: 'Email is required.',
    emailInvalid: 'Please enter a valid email.',
    passwordRequired: 'Password is required.',
    loginError: 'Invalid email or password. Please try again.',

    // Auth — registration
    registrationTitle: 'Create your account',
    registrationSubtitle: 'Start managing your aquariums today',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'John Doe',
    fullNameRequired: 'Full name is required.',
    registrationPasswordPlaceholder: 'Create a strong password',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm your password',
    confirmPasswordRequired: 'Password confirmation is required.',
    passwordMinLength: 'Password must be at least 8 characters.',
    passwordsMismatch: 'Passwords do not match.',
    registrationSubmitLabel: 'Create account',
    registrationLoadingLabel: 'Creating account...',
    signInPrompt: 'Already have an account?',
    signInInstead: 'Sign in instead',
    registrationError: 'Could not create account. Please try again.',

    // Auth — forgot password
    forgotPasswordTitle: 'Forgot your password?',
    forgotPasswordSubtitle: 'Enter your account information below to reset your password.',
    usernameLabel: 'Username',
    usernamePlaceholder: 'yourusername',
    birthdateLabel: 'Birthdate',
    forgotPasswordSubmitLabel: 'Send reset instructions',
    forgotPasswordLoadingLabel: 'Sending...',
    backToLogin: 'Back to login',
    usernameRequired: 'Username is required.',
    birthdateRequired: 'Birthdate is required.',
    forgotPasswordError:
      'Could not send instructions. Please verify your information and try again.',
    forgotPasswordSuccessTitle: 'Password reset successfully!',
    forgotPasswordNewPasswordLabel: 'Your new password is:',
    copyPassword: 'Copy password',
    passwordCopied: 'Copied!',

    // Aquarium — water types
    waterTypeFreshwater: 'Freshwater',
    waterTypeSaltwater: 'Saltwater',
    waterTypeBrackish: 'Brackish',

    // Aquarium — health status labels
    statusStable: 'Stable',
    statusAttention: 'Attention',
    statusCritical: 'Critical',
    statusUnknown: 'Unknown',

    // Aquarium — metric labels
    metricPhLevel: 'pH Level',
    metricTemperature: 'Temperature',

    // Measurement — badge labels
    badgeNormal: 'Normal',
    badgeHigh: 'High',
    badgeCritical: 'Critical',

    // Water parameter — period label
    periodLastNDays: 'Last {{n}} days',

    // Water parameter — series date labels
    seriesDateToday: 'Today',
    seriesDateYesterday: 'Yesterday',

    // Water parameter — names
    paramNamePh: 'pH',
    paramNameGh: 'General Hardness (gH)',
    paramNameKh: 'Carbonate Hardness (kH)',
    paramNameNitrate: 'Nitrate',
    paramNameNitrite: 'Nitrite',
    paramNameAmmonia: 'Ammonia',
    paramNameTemperature: 'Temperature',
    paramNameTds: 'Total Dissolved Solids (TDS)',
    paramNameCopper: 'Copper',
    paramNamePhosphate: 'Phosphate',
    paramNameIron: 'Iron',
    paramNameCo2: 'Carbon Dioxide (CO2)',
    paramNameO2: 'Dissolved Oxygen (O2)',
    paramNameCalcium: 'Calcium',
    paramNameSilicates: 'Silicates',
    paramNameDensitySalinity: 'Density / Salinity',
    paramNameMagnesium: 'Magnesium',
    paramNameIodine: 'Iodine',
    paramNameMolybdenum: 'Molybdenum',
    paramNameStrontium: 'Strontium',
    paramNamePotassium: 'Potassium',

    // User menu
    userMenuProfile: 'My Profile',
    userMenuHelp: 'Help & Support',
    userMenuLogout: 'Logout',

    // Navigation menu
    navDashboard: 'Dashboard',
    navAquariums: 'Aquariums',
    navMeasurements: 'Measurements',
    navAlerts: 'Alerts',
    navAquaticLife: 'Aquatic Life',
    navProducts: 'Products',
    navDosageCalculator: 'Dosage Calculator',
    navSettings: 'Settings',
    navCollapse: 'Collapse',
    navExpand: 'Expand',
    navGoHome: 'Go to home page',

    // Home — page title
    homePageSubtitle: "Welcome back! Here's your aquarium overview",

    // Home — sections
    homeMyAquariums: 'My Aquariums',
    homeMyAquariumsSubtitle: 'Monitor and manage all your aquariums in one place',
    homeAddAquarium: 'New Aquarium',
    homeWaterParameters: 'Water Parameters',
    homeVariation: 'Variation',
    homeCurrentValue: 'Current value',
    homeRecentMeasurements: 'Recent Measurements',
    homeRecentMeasurementsSubtitle: 'Latest water parameter tests',
    homeAddMeasurement: 'New Measurement',
    homeRecentApplications: 'Recent Applications',
    homeRecentApplicationsSubtitle: 'Latest product dosages',
    homeAddApplication: 'New Application',

    // Home — states
    homeNoAquariums: 'No aquariums registered.',
    homeLoadingAquariums: 'Loading aquariums',
    homeErrorRetry: 'Try again',
    homeMeasurementsEmptyTitle: 'No recent measurements',
    homeMeasurementsEmptyDesc: 'Measurements will appear here after the first tests.',
    homeApplicationsEmptyTitle: 'No recent applications',
    homeApplicationsEmptyDesc: 'Product applications will appear here.',

    // Aquarium — create page (placeholder)
    aquariumFormTitle: 'Register Aquarium',
    aquariumFormComingSoon: 'The aquarium registration form will be available soon.',
    aquariumFormBackToDashboard: 'Back to dashboard',

    // Measurement — create page (placeholder)
    measurementFormTitle: 'New Measurement',
    measurementFormComingSoon: 'The measurement registration form will be available soon.',
    measurementFormBackToDashboard: 'Back to dashboard',

    // Application — create page (placeholder)
    applicationFormTitle: 'New Application',
    applicationFormComingSoon: 'The application registration form will be available soon.',
    applicationFormBackToDashboard: 'Back to dashboard',
  },

  es: {
    // Shared
    languageSelectorLabel: 'Seleccionar idioma',
    listEmptyDefault: 'No se encontraron elementos',
    listLoadingDefault: 'Cargando...',
    footer: 'Todos los derechos reservados.',

    // Auth — login
    title: 'Bienvenido a AquaTrack',
    subtitle: 'Gestiona tus acuarios con precisión',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'tu@ejemplo.com',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Ingresa tu contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    submitLabel: 'Ingresar',
    loadingLabel: 'Ingresando...',
    createAccountPrompt: '¿Aún no tienes una cuenta?',
    createAccount: 'Crear cuenta',
    emailRequired: 'El correo electrónico es obligatorio.',
    emailInvalid: 'Ingresa un correo electrónico válido.',
    passwordRequired: 'La contraseña es obligatoria.',
    loginError: 'Correo electrónico o contraseña incorrectos. Inténtalo de nuevo.',

    // Auth — registration
    registrationTitle: 'Crea tu cuenta',
    registrationSubtitle: 'Empieza a gestionar tus acuarios hoy',
    fullNameLabel: 'Nombre completo',
    fullNamePlaceholder: 'Juan García',
    fullNameRequired: 'El nombre completo es obligatorio.',
    registrationPasswordPlaceholder: 'Crea una contraseña segura',
    confirmPasswordLabel: 'Confirmar contraseña',
    confirmPasswordPlaceholder: 'Confirma tu contraseña',
    confirmPasswordRequired: 'La confirmación de contraseña es obligatoria.',
    passwordMinLength: 'La contraseña debe tener al menos 8 caracteres.',
    passwordsMismatch: 'Las contraseñas no coinciden.',
    registrationSubmitLabel: 'Crear cuenta',
    registrationLoadingLabel: 'Creando cuenta...',
    signInPrompt: '¿Ya tienes una cuenta?',
    signInInstead: 'Inicia sesión en su lugar',
    registrationError: 'No se pudo crear la cuenta. Inténtalo de nuevo.',

    // Auth — forgot password
    forgotPasswordTitle: '¿Olvidaste tu contraseña?',
    forgotPasswordSubtitle:
      'Ingresa los datos de tu cuenta a continuación para restablecer tu contraseña.',
    usernameLabel: 'Nombre de usuario',
    usernamePlaceholder: 'tunombredeusuario',
    birthdateLabel: 'Fecha de nacimiento',
    forgotPasswordSubmitLabel: 'Enviar instrucciones de restablecimiento',
    forgotPasswordLoadingLabel: 'Enviando...',
    backToLogin: 'Volver al inicio de sesión',
    usernameRequired: 'El nombre de usuario es obligatorio.',
    birthdateRequired: 'La fecha de nacimiento es obligatoria.',
    forgotPasswordError:
      'No se pudieron enviar las instrucciones. Verifica tus datos e inténtalo de nuevo.',
    forgotPasswordSuccessTitle: '¡Contraseña restablecida exitosamente!',
    forgotPasswordNewPasswordLabel: 'Tu nueva contraseña es:',
    copyPassword: 'Copiar contraseña',
    passwordCopied: '¡Copiado!',

    // Aquarium — water types
    waterTypeFreshwater: 'Agua Dulce',
    waterTypeSaltwater: 'Agua Salada',
    waterTypeBrackish: 'Salobre',

    // Aquarium — health status labels
    statusStable: 'Estable',
    statusAttention: 'Atención',
    statusCritical: 'Crítico',
    statusUnknown: 'Desconocido',

    // Aquarium — metric labels
    metricPhLevel: 'Nivel de pH',
    metricTemperature: 'Temperatura',

    // Measurement — badge labels
    badgeNormal: 'Normal',
    badgeHigh: 'Alto',
    badgeCritical: 'Crítico',

    // Water parameter — period label
    periodLastNDays: 'Últimos {{n}} días',

    // Water parameter — series date labels
    seriesDateToday: 'Hoy',
    seriesDateYesterday: 'Ayer',

    // Water parameter — names
    paramNamePh: 'pH',
    paramNameGh: 'Dureza General (gH)',
    paramNameKh: 'Dureza de Carbonatos (kH)',
    paramNameNitrate: 'Nitrato',
    paramNameNitrite: 'Nitrito',
    paramNameAmmonia: 'Amoníaco',
    paramNameTemperature: 'Temperatura',
    paramNameTds: 'Sólidos Disueltos Totales (TDS)',
    paramNameCopper: 'Cobre',
    paramNamePhosphate: 'Fosfato',
    paramNameIron: 'Hierro',
    paramNameCo2: 'Dióxido de Carbono (CO2)',
    paramNameO2: 'Oxígeno Disuelto (O2)',
    paramNameCalcium: 'Calcio',
    paramNameSilicates: 'Silicatos',
    paramNameDensitySalinity: 'Densidad / Salinidad',
    paramNameMagnesium: 'Magnesio',
    paramNameIodine: 'Yodo',
    paramNameMolybdenum: 'Molibdeno',
    paramNameStrontium: 'Estroncio',
    paramNamePotassium: 'Potasio',

    // User menu
    userMenuProfile: 'Mi Perfil',
    userMenuHelp: 'Ayuda y Soporte',
    userMenuLogout: 'Cerrar sesión',

    // Navigation menu
    navDashboard: 'Dashboard',
    navAquariums: 'Acuarios',
    navMeasurements: 'Mediciones',
    navAlerts: 'Alertas',
    navAquaticLife: 'Vida Acuática',
    navProducts: 'Productos',
    navDosageCalculator: 'Calculadora de Dosaje',
    navSettings: 'Configuraciones',
    navCollapse: 'Contraer',
    navExpand: 'Expandir',
    navGoHome: 'Ir a la página de inicio',

    // Home — page title
    homePageSubtitle: '¡Bienvenido de vuelta! Aquí tienes un resumen de tu acuario',

    // Home — sections
    homeMyAquariums: 'Mis Acuarios',
    homeMyAquariumsSubtitle: 'Monitorea y gestiona todos tus acuarios en un solo lugar',
    homeAddAquarium: 'Nuevo Acuario',
    homeWaterParameters: 'Parámetros del Agua',
    homeVariation: 'Variación',
    homeCurrentValue: 'Valor actual',
    homeRecentMeasurements: 'Mediciones Recientes',
    homeRecentMeasurementsSubtitle: 'Últimas pruebas de parámetros del agua',
    homeAddMeasurement: 'Nueva Medición',
    homeRecentApplications: 'Aplicaciones Recientes',
    homeRecentApplicationsSubtitle: 'Últimas dosis de productos',
    homeAddApplication: 'Nueva Aplicación',

    // Home — states
    homeNoAquariums: 'No hay acuarios registrados.',
    homeLoadingAquariums: 'Cargando acuarios',
    homeErrorRetry: 'Intentar de nuevo',
    homeMeasurementsEmptyTitle: 'Sin mediciones recientes',
    homeMeasurementsEmptyDesc: 'Las mediciones aparecerán aquí después de las primeras pruebas.',
    homeApplicationsEmptyTitle: 'Sin aplicaciones recientes',
    homeApplicationsEmptyDesc: 'Las aplicaciones de productos aparecerán aquí.',

    // Aquarium — create page (placeholder)
    aquariumFormTitle: 'Registrar Acuario',
    aquariumFormComingSoon: 'El formulario de registro de acuarios estará disponible pronto.',
    aquariumFormBackToDashboard: 'Volver al panel',

    // Measurement — create page (placeholder)
    measurementFormTitle: 'Nueva Medición',
    measurementFormComingSoon: 'El formulario de registro de mediciones estará disponible pronto.',
    measurementFormBackToDashboard: 'Volver al panel',

    // Application — create page (placeholder)
    applicationFormTitle: 'Nueva Aplicación',
    applicationFormComingSoon:
      'El formulario de registro de aplicaciones estará disponible pronto.',
    applicationFormBackToDashboard: 'Volver al panel',
  },
};
